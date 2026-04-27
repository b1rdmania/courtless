"""Disputes router — create a dispute, run the audit, serve the brief.

Also exposes the document-first intake prefill endpoint:
  POST /api/disputes/prefill  — extract text from uploads + run EvidenceIntakeHelper,
                                return a pending_id the client passes back on final submit.
"""

import json
import secrets
import shutil
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, File, Form, Header, HTTPException, Request, UploadFile
from pydantic import ValidationError

from ..agents.auditor import IndividualAuditor
from ..agents.intake_helper import EvidenceIntakeHelper
from ..config import (
    RATE_LIMIT_PREFILL,
    RATE_LIMIT_READ,
    RATE_LIMIT_SUBMIT,
    UPLOAD_DIR,
)
from ..database import get_db
from ..limiter import limiter
from ..models import IntakeFields
from ..services.parser import extract_text
from ..services.validation import validate_and_read, validate_file_count


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
    """Write validated uploads + extracted text into the pending dir.

    Each file is run through validate_and_read first, which enforces the
    extension allowlist and per-file size cap. Caller is responsible for
    enforcing MAX_FILES via validate_file_count().
    """
    out_dir = _pending_dir(pending_id)
    out_dir.mkdir(parents=True, exist_ok=True)

    records: list[dict] = []
    for idx, upload in enumerate(files):
        safe_name = Path(upload.filename or "").name
        content_bytes = await validate_and_read(upload)

        dest = out_dir / safe_name
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
    """Rehydrate pending records. Validate the id is a UUID first to avoid
    path-traversal via crafted pending_id values."""
    try:
        uuid.UUID(pending_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid pending_id")

    sidecar = _pending_sidecar(pending_id)
    if not sidecar.exists():
        raise HTTPException(status_code=404, detail="pending_id not found or expired")
    try:
        meta = json.loads(sidecar.read_text())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"pending metadata unreadable: {e}")
    return meta.get("records", [])


def _cleanup_pending(pending_id: str) -> None:
    try:
        shutil.rmtree(_pending_dir(pending_id), ignore_errors=True)
    except Exception:
        pass


# ---------------------------------------------------------------------------
# Prefill endpoint — document-first intake, step 1 -> step 2
# ---------------------------------------------------------------------------

@router.post("/api/disputes/prefill")
@limiter.limit(RATE_LIMIT_PREFILL)
async def prefill_dispute(
    request: Request,
    files: list[UploadFile] = File(default=[]),
    file_types: list[str] = Form(default=[]),
    file_labels: list[str] = Form(default=[]),
):
    real_files = validate_file_count(files)
    if not real_files:
        raise HTTPException(status_code=400, detail="At least one file is required")

    pending_id = str(uuid.uuid4())
    try:
        records = await _save_pending_files_async(
            pending_id, real_files, file_types, file_labels
        )
    except HTTPException:
        _cleanup_pending(pending_id)
        raise
    if not records:
        _cleanup_pending(pending_id)
        raise HTTPException(status_code=400, detail="No readable files were uploaded")

    agent_input = {"evidence": records}
    agent = EvidenceIntakeHelper()
    try:
        result = await agent.execute(agent_input, dispute_id=pending_id)
        draft = result.data or {}
    except Exception as e:
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
@limiter.limit(RATE_LIMIT_SUBMIT)
async def create_dispute(
    request: Request,
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
    # Validate intake fields against the Pydantic schema. Done after Form
    # parsing because FastAPI can't combine Form() + a single Pydantic body.
    try:
        intake = IntakeFields(
            title=title,
            amount=amount,
            other_party_name=other_party_name,
            problem_started=problem_started,
            dispute_description=dispute_description,
            desired_outcome=desired_outcome,
            previous_attempts=previous_attempts,
            own_responsibility=own_responsibility,
            steelman_hint=steelman_hint,
            email=email or None,
        )
    except ValidationError as e:
        # Pydantic v2's e.errors() includes the underlying exception object,
        # which isn't JSON serialisable. Strip it down to (loc, msg) pairs.
        raise HTTPException(
            status_code=422,
            detail=[
                {"loc": list(err.get("loc", [])), "msg": err.get("msg", "")}
                for err in e.errors()
            ],
        )

    dispute_id = str(uuid.uuid4())
    party_id = str(uuid.uuid4())
    intake_id = str(uuid.uuid4())
    owner_token = secrets.token_urlsafe(32)
    now = _now()

    pending_records: list[dict] = []
    if pending_id:
        pending_records = _load_pending_records(pending_id)
    else:
        # If pending_id wasn't supplied, the client is sending fresh uploads —
        # enforce the file-count cap now (per-file caps applied below).
        files = validate_file_count(files)

    db = await get_db()
    try:
        await db.execute(
            """INSERT INTO disputes
               (id, title, dispute_type, amount_in_dispute, status,
                owner_token, created_at, updated_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
            (dispute_id, intake.title, "general", intake.amount or 0,
             "submitted", owner_token, now, now),
        )

        await db.execute(
            """INSERT INTO parties (id, dispute_id, role, email, submitted_at)
               VALUES (?, ?, ?, ?, ?)""",
            (party_id, dispute_id, "initiator",
             str(intake.email) if intake.email else None, now),
        )

        await db.execute(
            """INSERT INTO intakes
               (id, party_id, problem_started, other_party_name, dispute_description,
                desired_outcome, previous_attempts, own_responsibility, steelman_hint, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                intake_id, party_id, intake.problem_started or None,
                intake.other_party_name or None,
                intake.dispute_description, intake.desired_outcome or None,
                intake.previous_attempts or None,
                intake.own_responsibility, intake.steelman_hint or None, now,
            ),
        )

        dispute_upload_dir = UPLOAD_DIR / dispute_id
        dispute_upload_dir.mkdir(parents=True, exist_ok=True)

        evidence_records: list[dict] = []

        if pending_records:
            for rec in pending_records:
                safe_name = rec["filename"]
                src = Path(rec["stored_path"])
                dest = dispute_upload_dir / safe_name
                try:
                    if src.exists():
                        shutil.move(str(src), str(dest))
                    else:
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
            for idx, upload in enumerate(files):
                safe_name = Path(upload.filename or "").name
                content = await validate_and_read(upload)
                dest = dispute_upload_dir / safe_name
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

        await db.execute(
            "UPDATE disputes SET status = ?, updated_at = ? WHERE id = ?",
            ("analysing", _now(), dispute_id),
        )
        await db.commit()
    finally:
        await db.close()

    if pending_id:
        _cleanup_pending(pending_id)

    agent_input = {
        "title": intake.title,
        "amount": intake.amount,
        "other_party_name": intake.other_party_name,
        "problem_started": intake.problem_started,
        "dispute_description": intake.dispute_description,
        "desired_outcome": intake.desired_outcome,
        "previous_attempts": intake.previous_attempts,
        "own_responsibility": intake.own_responsibility,
        "steelman_hint": intake.steelman_hint,
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

    return {
        "dispute_id": dispute_id,
        "owner_token": owner_token,
        "status": "brief_ready",
    }


# ---------------------------------------------------------------------------
# Read endpoint — token-gated so a guessed UUID can't leak someone's brief
# ---------------------------------------------------------------------------

def _check_owner_token(stored: Optional[str], provided: Optional[str]) -> None:
    """Constant-time comparison; both must be present and equal.

    A pre-token row (stored is None) is treated as ungated for backward compat
    with anything seeded before the migration. New writes always set a token.
    """
    if stored is None:
        return
    if not provided or not secrets.compare_digest(stored, provided):
        raise HTTPException(status_code=403, detail="Missing or invalid owner token.")


@router.get("/api/disputes/{dispute_id}")
@limiter.limit(RATE_LIMIT_READ)
async def get_dispute(
    dispute_id: str,
    request: Request,
    x_owner_token: Optional[str] = Header(default=None, alias="X-Owner-Token"),
    token: Optional[str] = None,
):
    try:
        uuid.UUID(dispute_id)
    except (ValueError, TypeError):
        raise HTTPException(status_code=400, detail="Invalid dispute id")

    db = await get_db()
    try:
        cursor = await db.execute("SELECT * FROM disputes WHERE id = ?", (dispute_id,))
        dispute_row = await cursor.fetchone()
        if not dispute_row:
            raise HTTPException(status_code=404, detail="Dispute not found")

        _check_owner_token(dispute_row["owner_token"], x_owner_token or token)

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
