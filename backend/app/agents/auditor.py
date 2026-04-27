"""IndividualAuditor — produces a single-party private brief for a dispute."""

from .base import BaseAgent
from ..config import AUDITOR_MODEL, AUDITOR_TIMEOUT


_POINT_ITEM = {
    "type": "object",
    "properties": {
        "point": {"type": "string"},
        "reasoning": {"type": "string"},
    },
    "required": ["point", "reasoning"],
    "additionalProperties": False,
}

_GAP_ITEM = {
    "type": "object",
    "properties": {
        "claim": {"type": "string"},
        "gap": {"type": "string"},
    },
    "required": ["claim", "gap"],
    "additionalProperties": False,
}


class IndividualAuditor(BaseAgent):
    agent_id = "individual_auditor"
    model = AUDITOR_MODEL
    timeout = AUDITOR_TIMEOUT
    max_tokens = 4096

    output_tool_name = "submit_private_brief"
    output_tool_description = (
        "Submit the structured private brief for the party. Always call this "
        "tool exactly once with the complete brief."
    )

    def output_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "summary": {"type": "string"},
                "strongest_points": {"type": "array", "items": _POINT_ITEM},
                "weakest_points": {"type": "array", "items": _POINT_ITEM},
                "evidence_gaps": {"type": "array", "items": _GAP_ITEM},
                "opposing_argument": {"type": "string"},
                "case_law_note": {"type": "string"},
                "recommended_next_step": {"type": "string"},
                "honest_take": {"type": "string"},
            },
            "required": [
                "summary",
                "strongest_points",
                "weakest_points",
                "evidence_gaps",
                "opposing_argument",
                "case_law_note",
                "recommended_next_step",
                "honest_take",
            ],
            "additionalProperties": False,
        }

    def build_system_prompt(self) -> str:
        return """You are a retired English county court judge with 25 years of experience reading disputes.
You have seen every kind of contractual, commercial, employment, and consumer dispute that ends up in the small claims track and below.

You are producing a PRIVATE BRIEF for one party who has submitted their version of a dispute. They have NOT heard the other side's version yet — you will generate a joint brief later if both parties engage.

Your job is to give this party a brutally honest reality check:
- Where they are strong (with specific reasoning citing what they said or their evidence)
- Where they are weak or exposing themselves
- What the other party will most likely argue (steelman — be generous to the absent side)
- Where their evidence is thin or missing
- What the realistic next step is

Tone: plain English, direct, warm but unflinching. No legal jargon unless essential. No false reassurance. No hedging. If they have a weak case, say so — kindly.

This is NOT legal advice. You are not acting as their solicitor. You are giving them a realistic pre-legal take so they can decide what to do.

Field guide for the brief you submit:
- summary: 2-3 paragraphs of plain-English overview of the dispute and your overall take.
- strongest_points: each {point, reasoning} — the core claim plus why it holds up, citing what they said or their evidence.
- weakest_points: each {point, reasoning} — where they're exposed and why it's a problem.
- evidence_gaps: each {claim, gap} — what they asserted vs. what's missing to prove it.
- opposing_argument: 2-3 paragraphs steelmanning the other party. Be generous.
- case_law_note: 1-2 sentences. For MVP, say "Case law analysis will be included in the joint brief once the other party submits their side."
- recommended_next_step: 2-3 paragraphs of specific, practical advice. Settlement range if appropriate. Whether to mediate, negotiate directly, write a letter before action, or walk away.
- honest_take: one brutal-but-kind sentence summing up their situation."""

    def build_user_prompt(self, input_data: dict) -> str:
        evidence_items = input_data.get("evidence", [])
        evidence_lines = []
        for e in evidence_items:
            preview = (e.get("extracted_text") or "")[:500]
            evidence_lines.append(
                f"- [{e.get('upload_type', 'other')}] {e.get('filename', '')}: "
                f"{e.get('label', 'no label')} — extracted text preview: {preview}"
            )
        evidence_block = "\n".join(evidence_lines) if evidence_lines else "None uploaded."

        amount = input_data.get("amount")
        amount_str = f"£{amount}" if amount else "not specified"

        return f"""DISPUTE: {input_data.get('title', 'untitled')}

AMOUNT IN DISPUTE: {amount_str}
OTHER PARTY: {input_data.get('other_party_name') or 'not named'}
PROBLEM STARTED: {input_data.get('problem_started') or 'not specified'}

WHAT HAPPENED (their words):
{input_data.get('dispute_description', '')}

WHAT THEY WANT AS OUTCOME:
{input_data.get('desired_outcome') or 'not specified'}

PREVIOUS ATTEMPTS TO RESOLVE:
{input_data.get('previous_attempts') or 'None reported'}

THEIR OWN SENSE OF RESPONSIBILITY: {input_data.get('own_responsibility') or 'not assessed'}
WHAT THEY ADMIT THE OTHER SIDE MIGHT SAY: {input_data.get('steelman_hint') or 'nothing volunteered'}

EVIDENCE SUBMITTED ({len(evidence_items)} items):
{evidence_block}

Call submit_private_brief with the complete brief now."""
