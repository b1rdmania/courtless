"""Server-side validation for uploaded files.

Mirrors the caps the frontend enforces but treats them as authoritative.
"""

from pathlib import Path

from fastapi import HTTPException, UploadFile

from ..config import ALLOWED_EXTENSIONS, MAX_FILE_SIZE, MAX_FILES


def _ext(name: str) -> str:
    return "." + (name.rsplit(".", 1)[-1].lower() if "." in name else "")


def validate_file_count(files: list[UploadFile]) -> list[UploadFile]:
    """Drop empty/None entries and enforce MAX_FILES."""
    real = [f for f in (files or []) if f is not None and f.filename]
    if len(real) > MAX_FILES:
        raise HTTPException(
            status_code=413,
            detail=f"Too many files (got {len(real)}, max {MAX_FILES}).",
        )
    return real


async def validate_and_read(upload: UploadFile) -> bytes:
    """Read the upload's bytes, enforcing the allowed extension + size cap.

    UploadFile streams from disk so we read in one shot here; the cap keeps
    that bounded. Anything that fails extension or size raises 4xx — the
    client must drop it from the batch.
    """
    name = Path(upload.filename or "").name
    if not name:
        raise HTTPException(status_code=400, detail="Upload missing filename.")

    if _ext(name) not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file type: {name}. "
                   f"Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}.",
        )

    data = await upload.read()
    if len(data) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"{name} is over the {MAX_FILE_SIZE // (1024*1024)}MB limit.",
        )
    if len(data) == 0:
        raise HTTPException(status_code=400, detail=f"{name} is empty.")
    return data
