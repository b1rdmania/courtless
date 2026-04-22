"""EvidenceIntakeHelper — reads uploaded evidence and drafts a pre-filled intake."""

from .base import BaseAgent


class EvidenceIntakeHelper(BaseAgent):
    agent_id = "intake_helper"
    model = "claude-sonnet-4-20250514"
    timeout = 45
    max_tokens = 2048

    def build_system_prompt(self) -> str:
        return """You are reading evidence from one side of a dispute and producing a pre-filled intake draft for them to review.

Your job: extract the essential facts from the uploaded documents and produce a structured draft the user can edit, so they don't have to type their dispute from scratch.

Return ONLY valid JSON with this shape:
{
  "suggested_title": "Short, specific title — e.g. 'Landlord withholding deposit' or 'Unpaid freelance invoice — TechCo'",
  "suggested_other_party_name": "Who the other party appears to be, from the documents",
  "suggested_amount": <number or null>,
  "suggested_problem_started": "YYYY-MM-DD if determinable, else null",
  "suggested_description": "3-5 paragraphs summarising what happened, written in the user's voice ('I', 'my', 'us'). Be specific — dates, amounts, what was agreed, where it went wrong. Don't speculate beyond the documents.",
  "key_evidence_summary": [
    {"filename": "...", "summarises_as": "One-line description of what this document proves or shows"}
  ]
}

If the documents are unclear or insufficient, produce a minimal draft with empty strings and note 'Unclear from documents — please describe' in suggested_description."""

    def build_user_prompt(self, input_data: dict) -> str:
        docs = input_data.get("evidence", [])
        doc_text = "\n\n".join(
            f"=== {e['filename']} ({e.get('upload_type', 'other')}) ===\n"
            f"Label: {e.get('label', 'none')}\n"
            f"Extracted text:\n{(e.get('extracted_text') or '[no text — likely an image]')[:3000]}"
            for e in docs
        )
        return f"""Documents uploaded by the user:

{doc_text}

Produce the intake draft JSON now."""
