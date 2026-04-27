"""Base agent class — wraps Claude API calls with logging, timeouts, retries,
and structured output via tool_use.

Agents that want guaranteed JSON-shaped output set ``output_tool_name`` and
override ``output_schema()`` to return a JSON schema. The base class then
forces the model to call that tool, eliminating the parse-the-response-text
class of failures.

Agents that don't set ``output_tool_name`` keep the legacy code-fence JSON
parser; both modes log to ``audit_log`` and raise on failure.
"""

import asyncio
import json
import logging
import random
import time
import uuid
from datetime import datetime, timezone

import anthropic

from ..config import ANTHROPIC_API_KEY
from ..database import get_db


client = anthropic.AsyncAnthropic(api_key=ANTHROPIC_API_KEY)
log = logging.getLogger(__name__)


# Retryable Anthropic API exceptions. Anything else surfaces immediately.
_RETRYABLE = (
    anthropic.APIConnectionError,
    anthropic.APITimeoutError,
    anthropic.RateLimitError,
    anthropic.InternalServerError,
)


class AgentResult:
    def __init__(self, data: dict, tokens_in: int = 0, tokens_out: int = 0, duration_ms: int = 0):
        self.data = data
        self.tokens_in = tokens_in
        self.tokens_out = tokens_out
        self.duration_ms = duration_ms


class BaseAgent:
    agent_id: str = "base"
    model: str = "claude-sonnet-4-20250514"
    timeout: int = 60
    max_tokens: int = 8192

    # Tool-use mode. If set, the model is forced to call this tool and we
    # read structured args from response.content. Skip the JSON parser.
    output_tool_name: str = ""
    output_tool_description: str = ""

    # Retry budget for transient API errors.
    max_retries: int = 3
    initial_backoff: float = 1.0  # seconds

    def build_system_prompt(self) -> str:
        raise NotImplementedError

    def build_user_prompt(self, input_data: dict) -> str:
        raise NotImplementedError

    def output_schema(self) -> dict:
        """Override per-agent to opt into tool_use mode."""
        return {}

    def parse_response(self, text: str) -> dict:
        """Legacy fallback when tool_use isn't used."""
        if "```json" in text:
            start = text.index("```json") + 7
            end = text.index("```", start)
            text = text[start:end].strip()
        elif "```" in text:
            start = text.index("```") + 3
            end = text.index("```", start)
            text = text[start:end].strip()
        return json.loads(text)

    async def _call_with_retry(self, **create_kwargs):
        """Call client.messages.create with bounded exponential backoff on
        retryable errors. The total wall-clock budget is roughly
        timeout * (max_retries + 1)."""
        last_exc: Exception | None = None
        for attempt in range(self.max_retries + 1):
            try:
                return await client.messages.create(**create_kwargs)
            except _RETRYABLE as e:
                last_exc = e
                if attempt == self.max_retries:
                    break
                # Exponential backoff with jitter, capped at 8s. Helps the
                # provider recover without hammering, while keeping the
                # overall latency bounded.
                wait = min(8.0, self.initial_backoff * (2 ** attempt))
                wait += random.uniform(0, wait * 0.25)
                log.warning(
                    "agent %s retry %d/%d after %s: %s",
                    self.agent_id, attempt + 1, self.max_retries,
                    type(e).__name__, e,
                )
                await asyncio.sleep(wait)
        # Exhausted retries — re-raise the last exception
        assert last_exc is not None
        raise last_exc

    def _extract_result(self, response) -> dict:
        if self.output_tool_name:
            for block in response.content:
                if getattr(block, "type", None) == "tool_use" and block.name == self.output_tool_name:
                    # block.input is already a dict matching our schema
                    return dict(block.input)
            raise RuntimeError(
                f"Agent {self.agent_id} expected tool_use call to "
                f"{self.output_tool_name} but model returned no matching block."
            )
        # Text/JSON fallback
        for block in response.content:
            if getattr(block, "type", None) == "text":
                return self.parse_response(block.text)
        raise RuntimeError(f"Agent {self.agent_id} returned no text content.")

    async def execute(self, input_data: dict, dispute_id: str) -> AgentResult:
        system_prompt = self.build_system_prompt()
        user_prompt = self.build_user_prompt(input_data)

        create_kwargs = {
            "model": self.model,
            "max_tokens": self.max_tokens,
            "system": system_prompt,
            "messages": [{"role": "user", "content": user_prompt}],
            "timeout": self.timeout,
        }

        if self.output_tool_name:
            schema = self.output_schema()
            if not schema:
                raise RuntimeError(
                    f"Agent {self.agent_id} sets output_tool_name but "
                    f"output_schema() is empty."
                )
            create_kwargs["tools"] = [{
                "name": self.output_tool_name,
                "description": self.output_tool_description or f"Return the {self.output_tool_name} payload.",
                "input_schema": schema,
            }]
            create_kwargs["tool_choice"] = {
                "type": "tool",
                "name": self.output_tool_name,
            }

        start_time = time.time()
        error_msg = None
        status = "success"
        tokens_in = 0
        tokens_out = 0
        result_data: dict = {}

        try:
            response = await self._call_with_retry(**create_kwargs)
            tokens_in = response.usage.input_tokens
            tokens_out = response.usage.output_tokens
            result_data = self._extract_result(response)
        except json.JSONDecodeError as e:
            status = "failed"
            error_msg = f"Failed to parse JSON response: {e}"
            result_data = {"error": error_msg}
        except anthropic.APITimeoutError:
            status = "timeout"
            error_msg = f"Agent {self.agent_id} timed out after {self.timeout}s"
            result_data = {"error": error_msg}
        except Exception as e:
            status = "failed"
            error_msg = f"{type(e).__name__}: {e}"
            result_data = {"error": error_msg}

        duration_ms = int((time.time() - start_time) * 1000)

        # Audit log is best-effort: a logging failure must not fail the agent.
        await self._write_audit(
            dispute_id=dispute_id,
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            duration_ms=duration_ms,
            status=status,
            error_msg=error_msg,
        )

        if status != "success":
            raise RuntimeError(error_msg)

        return AgentResult(
            data=result_data,
            tokens_in=tokens_in,
            tokens_out=tokens_out,
            duration_ms=duration_ms,
        )

    async def _write_audit(
        self,
        *,
        dispute_id: str,
        tokens_in: int,
        tokens_out: int,
        duration_ms: int,
        status: str,
        error_msg: str | None,
    ) -> None:
        try:
            db = await get_db()
            try:
                await db.execute(
                    """INSERT INTO audit_log
                       (id, dispute_id, agent_id, model, tokens_in, tokens_out,
                        duration_ms, status, error_msg, timestamp)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (
                        str(uuid.uuid4()),
                        dispute_id,
                        self.agent_id,
                        self.model,
                        tokens_in,
                        tokens_out,
                        duration_ms,
                        status,
                        error_msg,
                        datetime.now(timezone.utc).isoformat(),
                    ),
                )
                await db.commit()
            finally:
                await db.close()
        except Exception as e:
            # Don't fail the agent run if logging hiccups.
            log.warning("audit_log write failed for %s: %s", self.agent_id, e)
