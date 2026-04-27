"""EvidenceIntakeHelper — reads uploaded evidence and drafts a pre-filled intake."""

from .base import BaseAgent


class EvidenceIntakeHelper(BaseAgent):
    agent_id = "intake_helper"
    model = "claude-sonnet-4-20250514"
    timeout = 45
    max_tokens = 2048

    output_tool_name = "submit_intake_draft"
    output_tool_description = (
        "Submit the pre-filled intake draft for the user to review. Always "
        "call this tool exactly once."
    )

    def output_schema(self) -> dict:
        return {
            "type": "object",
            "properties": {
                "suggested_title": {"type": "string"},
                "suggested_other_party_name": {"type": "string"},
                "suggested_amount": {"type": ["number", "null"]},
                "suggested_problem_started": {"type": ["string", "null"]},
                "suggested_description": {"type": "string"},
                "key_evidence_summary": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "filename": {"type": "string"},
                            "summarises_as": {"type": "string"},
                        },
                        "required": ["filename", "summarises_as"],
                        "additionalProperties": False,
                    },
                },
            },
            "required": [
                "suggested_title",
                "suggested_other_party_name",
                "suggested_amount",
                "suggested_problem_started",
                "suggested_description",
                "key_evidence_summary",
            ],
            "additionalProperties": False,
        }

    def build_system_prompt(self) -> str:
        return """You are reading evidence from one side of a dispute and producing a pre-filled intake draft for them to review.

Your job: extract the essential facts from the uploaded documents and produce a structured draft the user can edit, so they don't have to type their dispute from scratch.

Field guide:
- suggested_title: short, specific (e.g. "Landlord withholding deposit", "Unpaid freelance invoice — TechCo").
- suggested_other_party_name: who the other party appears to be, from the documents. Empty string if unclear.
- suggested_amount: number or null — best estimate of the amount in dispute, in the relevant currency.
- suggested_problem_started: YYYY-MM-DD if determinable, else null.
- suggested_description: 3-5 paragraphs in the user's voice ("I", "my", "us"). Be specific — dates, amounts, what was agreed, where it went wrong. Don't speculate beyond the documents.
- key_evidence_summary: one entry per file with a one-line description of what the document proves or shows.

If the documents are unclear or insufficient, produce a minimal draft with empty strings and note "Unclear from documents — please describe" in suggested_description."""

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

Call submit_intake_draft with the structured draft now."""
