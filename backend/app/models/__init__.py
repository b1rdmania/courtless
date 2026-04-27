"""Pydantic schemas for request bodies + response envelopes.

We keep the create-dispute endpoint as multipart `Form` (FastAPI's `Form` and
`UploadFile` can't be unified into a single Pydantic model in OpenAPI 3.0
without losing the multipart upload UX). These models exist for two purposes:

1. `IntakeFields` — a validator we run server-side after pulling the form
   values, so length and shape rules are not just trusted from the client.
2. Response envelopes — typed shapes that downstream callers (and our own
   frontend types) can rely on.
"""

import re
from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator


# Loose email check — we do not want a hard dependency on email-validator,
# and the frontend already enforces a stricter check. This catches obvious
# garbage (no @, surrounding whitespace, multi-line) while staying permissive.
_EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


# --- Form-derived intake validation ---------------------------------------

class IntakeFields(BaseModel):
    """Validated mirror of the create-dispute form payload."""

    title: str = Field(min_length=3, max_length=200)
    amount: float = Field(ge=0, le=1_000_000_000)
    other_party_name: str = Field(default="", max_length=200)
    problem_started: str = Field(default="", max_length=40)
    dispute_description: str = Field(min_length=200, max_length=5000)
    desired_outcome: str = Field(default="", max_length=2000)
    previous_attempts: str = Field(default="", max_length=5000)
    own_responsibility: Literal["none", "a_little", "partially"] = "none"
    steelman_hint: str = Field(default="", max_length=5000)
    email: Optional[str] = Field(default=None, max_length=320)

    @field_validator("title", "dispute_description", "desired_outcome",
                     "other_party_name", "problem_started",
                     "previous_attempts", "steelman_hint")
    @classmethod
    def _strip(cls, v: str) -> str:
        return (v or "").strip()

    @field_validator("email")
    @classmethod
    def _email_shape(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "":
            return None
        v = v.strip()
        if not _EMAIL_RE.match(v):
            raise ValueError("invalid email address")
        return v


# --- Response envelopes ---------------------------------------------------

class CreateDisputeResponse(BaseModel):
    dispute_id: str
    owner_token: str
    status: str


class PrefillResponse(BaseModel):
    pending_id: str
    suggested_title: str = ""
    suggested_other_party_name: str = ""
    suggested_amount: Optional[float] = None
    suggested_problem_started: Optional[str] = None
    suggested_description: str = ""
    key_evidence_summary: list[dict] = Field(default_factory=list)
