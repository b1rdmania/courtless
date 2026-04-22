"""Disputes router — create a dispute, run the audit, serve the brief.

Also exposes the document-first intake prefill endpoint:
  POST /api/disputes/prefill  — extract text from uploads + run EvidenceIntakeHelper,
                                return a pending_id the client passes back on final submit.
"""

import json
import shutil
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from ..agents.auditor import IndividualAuditor
from ..agents.intake_helper import EvidenceIntakeHelper
from ..config import UPLOAD_DIR
from ..database import get_db
from ..services.parser import extract_text


router = APIRouter()

PENDING_ROOT = UPLOAD_DIR / "pending"
PENDING_ROOT.mkdir(parents=True, exist_ok=True)


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------------------------------------------------------------------------
# Helpers for the pending-uploads flow
# ---------------------------------------------------------------------------

def _pending_dir(pending_id: str) -> Path:
    return PENDING_ROOT / pending_id


def _pending_sidecar(pending_id: str) -> Path:
    return _pending_dir(pending_id) / "_meta.json"


async def _save_pending_files_async(
    pending_id: str,
    files: list[UploadFile],
    file_types: list[str],
    file_labels: list[str],
) -> list[dict]:
    """Write uploaded files + extracted text into the pending dir.

    Returns a list of records with filename, upload_type, label, extracted_text.
    Also writes a sidecar JSON so the final-submit step can rehydrate without re-reading.
    """
    out_dir = _pending_dir(pending_id)
    out_dir.mkdir(parents=True, exist_ok=True)

    records: list[dict] = []
    for idx, upload in enumerate(files or []):
        if upload is None or not upload.filename:
            continue
        safe_name = Path(upload.filename).name
        dest = out_dir / safe_name
        content_bytes = await upload.read()
        dest.write_bytes(content_bytes)

        upload_type = (file_types[idx] if idx < len(file_types) else "other") or "other"
        label = (file_labels[idx] if idx < len(file_labels) else "") or ""

        try:
            extracted = extract_text(dest)
        except Exception:
            extracted = ""

        records.append({
            "filename": safe_name,
            "upload_type": upload_type,
            "label": label,
            "extracted_text": extracted,
            "stored_path": str(dest),
        })

    _pending_sidecar(pending_id).write_text(json.dumps({
        "created_at": _now(),
        "records": records,
    }))
    return records


def _load_pending_records(pending_id: str) -> list[dict]:
    """Rehydrate pending records from the sidecar JSON. Raises if not found."""
    sidecar = _pending_sidecar(pending_id)
    if not sidecar.exists():
        raise HTTPException(status_code=404, detail="pending_id not found or expired")
    try:
        meta = json.loads(sidecar.read_text())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"pending metadata unreadable: {e}")
    return meta.get("records", [])


def _cleanup_pending(pending_id: str) -> None:
    """Best-effort removal of the pending dir once it's been consumed."""
    try:
        shutil.rmtree(_pending_dir(pending_id), ignore_errors=True)
    except Exception:
        pass


# ---------------------------------------------------------------------------
# Prefill endpoint — document-first intake, step 1 -> step 2
# ---------------------------------------------------------------------------

@router.post("/api/disputes/prefill")
async def prefill_dispute(
    files: list[UploadFile] = File(default=[]),
    file_types: list[str] = Form(default=[]),
    file_labels: list[str] = Form(default=[]),
):
    """Stage uploads, extract text, run EvidenceIntakeHelper, return a pre-filled draft.

    Does NOT create a dispute record. The client passes `pending_id` back to
    POST /api/disputes when finalising. Pending uploads live under
    UPLOAD_DIR/pending/<pending_id>/ (TODO: 24h cleanup job).
    """
    if not files:
        raise HTTPException(status_code=400, detail="At least one file is required")

    pending_id = str(uuid.uuid4())
    records = await _save_pending_files_async(pending_id, files, file_types, file_labels)
    if not records:
        _cleanup_pending(pending_id)
        raise HTTPException(status_code=400, detail="No readable files were uploaded")

    # Run the intake helper agent
    agent_input = {"evidence": records}
    agent = EvidenceIntakeHelper()
    try:
        result = await agent.execute(agent_input, dispute_id=pending_id)
        draft = result.data or {}
    except Exception as e:
        # Keep the pending dir so the user can still submit manually, but return a minimal draft
        draft = {
            "suggested_title": "",
            "suggested_other_party_name": "",
            "suggested_amount": None,
            "suggested_problem_started": None,
            "suggested_description": f"(AI pre-fill failed: {e}. Please describe the dispute in your own words.)",
            "key_evidence_summary": [
                {"filename": r["filename"], "summarises_as": r.get("label") or r.get("upload_type", "other")}
                for r in records
            ],
        }

    return {
        "pending_id": pending_id,
        "suggested_title": draft.get("suggested_title", ""),
        "suggested_other_party_name": draft.get("suggested_other_party_name", ""),
        "suggested_amount": draft.get("suggested_amount"),
        "suggested_problem_started": draft.get("suggested_problem_started"),
        "suggested_description": draft.get("suggested_description", ""),
        "key_evidence_summary": draft.get("key_evidence_summary", []),
    }


# ---------------------------------------------------------------------------
# Main create-dispute endpoint
# ---------------------------------------------------------------------------

@router.post("/api/disputes")
async def create_dispute(
    title: str = Form(...),
    amount: float = Form(0),
    other_party_name: str = Form(""),
    problem_started: str = Form(""),
    dispute_description: str = Form(...),
    desired_outcome: str = Form(""),
    previous_attempts: str = Form(""),
    own_responsibility: str = Form("none"),
    steelman_hint: str = Form(""),
    email: str = Form(""),
    pending_id: str = Form(""),
    files: list[UploadFile] = File(default=[]),
    file_types: list[str] = Form(default=[]),
    file_labels: list[str] = Form(default=[]),
):
    dispute_id = str(uuid.uuid4())
    party_id = str(uuid.uuid4())
    intake_id = str(uuid.uuid4())
    now = _now()

    # Resolve evidence source: prefer pending_id if present (new flow), else fresh uploads.
    pending_records: list[dict] = []
    if pending_id:
        pending_records = _load_pending_records(pending_id)

    db = await get_db()
    try:
        # 1. Create dispute
        await db.execute(
            """INSERT INTO disputes (id, title, dispute_type, amount_in_dispute, status, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?)""",
            (dispute_id, title, "general", amount or 0, "submitted", now, now),
        )

        # 2. Create initiator party
        await db.execute(
            """INSERT INTO parties (id, dispute_id, role, email, submitted_at)
               VALUES (?, ?, ?, ?, ?)""",
            (party_id, dispute_id, "initiator", email or None, now),
        )

        # 3. Create intake
        await db.execute(
            """INSERT INTO intakes
               (id, party_id, problem_started, other_party_name, dispute_description,
                desired_outcome, previous_attempts, own_responsibility, steelman_hint, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                intake_id, party_id, problem_started or None, other_party_name or None,
                dispute_description, desired_outcome or None, previous_attempts or None,
                own_responsibility or "none", steelman_hint or None, now,
            ),
        )

        # 4. Attach evidence — either from pending dir or from fresh uploads
        dispute_upload_dir = UPLOAD_DIR / dispute_id
        dispute_upload_dir.mkdir(parents=True, exist_ok=True)

        evidence_records: list[dict] = []

        if pending_records:
            # Move files from pending dir into the real dispute dir
            for rec in pending_records:
                safe_name = rec["filename"]
                src = Path(rec["stored_path"])
                dest = dispute_upload_dir / safe_name
                try:
                    if src.exists():
                        shutil.move(str(src), str(dest))
                    else:
                        # Sidecar references a missing file — skip rather than fail
                        continue
                except Exception:
                    continue

                ev_id = str(uuid.uuid4())
                extracted = rec.get("extracted_text", "") or ""
                await db.execute(
                    """INSERT INTO evidence
                       (id, party_id, filename, file_path, upload_type, label, extracted_text, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                    (ev_id, party_id, safe_name, str(dest),
                     rec.get("upload_type", "other"), rec.get("label", ""),
                     extracted, now),
                )
                evidence_records.append({
                    "id": ev_id,
                    "filename": safe_name,
                    "upload_type": rec.get("upload_type", "other"),
                    "label": rec.get("label", ""),
                    "extracted_text": extracted,
                })
        else:
            for idx, upload in enumerate(files or []):
                if upload is None or not upload.filename:
                    continue
                safe_name = Path(upload.filename).name
                dest = dispute_upload_dir / safe_name
                content = await upload.read()
                dest.write_bytes(content)

                upload_type = (file_types[idx] if idx < len(file_types) else "other") or "other"
                label = (file_labels[idx] if idx < len(file_labels) else "") or ""

                try:
                    extracted = extract_text(dest)
                except Exception:
                    extracted = ""

                ev_id = str(uuid.uuid4())
                await db.execute(
                    """INSERT INTO evidence
                       (id, party_id, filename, file_path, upload_type, label, extracted_text, created_at)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                    (ev_id, party_id, safe_name, str(dest), upload_type, label, extracted, now),
                )
                evidence_records.append({
                    "id": ev_id,
                    "filename": safe_name,
                    "upload_type": upload_type,
                    "label": label,
                    "extracted_text": extracted,
                })

        # 5. Set status to analysing
        await db.execute(
            "UPDATE disputes SET status = ?, updated_at = ? WHERE id = ?",
            ("analysing", _now(), dispute_id),
        )
        await db.commit()
    finally:
        await db.close()

    # Clean up the pending dir once files have been moved
    if pending_id:
        _cleanup_pending(pending_id)

    # 6. Run the audit (synchronous for MVP)
    agent_input = {
        "title": title,
        "amount": amount,
        "other_party_name": other_party_name,
        "problem_started": problem_started,
        "dispute_description": dispute_description,
        "desired_outcome": desired_outcome,
        "previous_attempts": previous_attempts,
        "own_responsibility": own_responsibility,
        "steelman_hint": steelman_hint,
        "evidence": evidence_records,
    }

    agent = IndividualAuditor()
    try:
        result = await agent.execute(agent_input, dispute_id)
    except Exception as e:
        db = await get_db()
        try:
            await db.execute(
                "UPDATE disputes SET status = ?, updated_at = ? WHERE id = ?",
                ("failed", _now(), dispute_id),
            )
            await db.commit()
        finally:
            await db.close()
        raise HTTPException(status_code=500, detail=f"Audit failed: {e}")

    # 7. Store brief and flip status
    brief_id = str(uuid.uuid4())
    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO briefs (id, dispute_id, party_id, brief_type, content_json, generated_at)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (brief_id, dispute_id, party_id, "private", json.dumps(result.data), _now()),
        )
        await db.execute(
            "UPDATE disputes SET status = ?, updated_at = ? WHERE id = ?",
            ("brief_ready", _now(), dispute_id),
        )
        await db.commit()
    finally:
        await db.close()

    return {"dispute_id": dispute_id, "status": "brief_ready"}


@router.get("/api/disputes/{dispute_id}")
async def get_dispute(dispute_id: str):
    db = await get_db()
    try:
        cursor = await db.execute("SELECT * FROM disputes WHERE id = ?", (dispute_id,))
        dispute_row = await cursor.fetchone()
        if not dispute_row:
            raise HTTPException(status_code=404, detail="Dispute not found")

        cursor = await db.execute(
            """SELECT * FROM briefs
               WHERE dispute_id = ? AND brief_type = 'private'
               ORDER BY generated_at DESC LIMIT 1""",
            (dispute_id,),
        )
        brief_row = await cursor.fetchone()

        brief_content = None
        if brief_row:
            try:
                brief_content = json.loads(brief_row["content_json"])
            except Exception:
                brief_content = None

        return {
            "id": dispute_row["id"],
            "title": dispute_row["title"],
            "status": dispute_row["status"],
            "amount_in_dispute": dispute_row["amount_in_dispute"],
            "created_at": dispute_row["created_at"],
            "updated_at": dispute_row["updated_at"],
            "brief": brief_content,
            "brief_type": brief_row["brief_type"] if brief_row else None,
            "generated_at": brief_row["generated_at"] if brief_row else None,
        }
    finally:
        await db.close()
