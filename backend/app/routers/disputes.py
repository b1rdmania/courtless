"""Disputes router — create a dispute, run the audit, serve the brief."""

import json
import uuid
from datetime import datetime, timezone
from pathlib import Path

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from ..agents.auditor import IndividualAuditor
from ..config import UPLOAD_DIR
from ..database import get_db
from ..services.parser import extract_text


router = APIRouter()


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


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
    files: list[UploadFile] = File(default=[]),
    file_types: list[str] = Form(default=[]),
    file_labels: list[str] = Form(default=[]),
):
    dispute_id = str(uuid.uuid4())
    party_id = str(uuid.uuid4())
    intake_id = str(uuid.uuid4())
    now = _now()

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

        # 4. Save uploaded files + extract text
        dispute_upload_dir = UPLOAD_DIR / dispute_id
        dispute_upload_dir.mkdir(parents=True, exist_ok=True)

        evidence_records: list[dict] = []
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
