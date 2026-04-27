"""Courtless backend configuration."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = Path(os.environ.get("UPLOAD_DIR", "/tmp/courtless-uploads"))
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)

DB_PATH = Path(os.environ.get("DB_PATH", "/tmp/courtless.db"))

# Claude API
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

AUDITOR_MODEL = os.environ.get("COURTLESS_AUDITOR_MODEL", "claude-sonnet-4-6")

AUDITOR_TIMEOUT = int(os.environ.get("COURTLESS_AUDITOR_TIMEOUT", "90"))

# CORS allowlist — comma-separated origins. The wildcard "*" is forbidden in
# production because we want owner-token isolation to actually mean something.
_default_origins = "http://localhost:5173,http://localhost:5175"
CORS_ORIGINS = [
    o.strip()
    for o in os.environ.get("COURTLESS_CORS_ORIGINS", _default_origins).split(",")
    if o.strip() and o.strip() != "*"
]

# Upload caps — must match the values surfaced in the frontend uploader.
MAX_FILE_SIZE = int(os.environ.get("COURTLESS_MAX_FILE_SIZE", str(10 * 1024 * 1024)))
MAX_FILES = int(os.environ.get("COURTLESS_MAX_FILES", "10"))
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".jpg", ".jpeg", ".png", ".txt"}

# Rate limit windows. Format follows slowapi syntax (e.g. "5/minute").
RATE_LIMIT_PREFILL = os.environ.get("COURTLESS_RATE_LIMIT_PREFILL", "5/minute")
RATE_LIMIT_SUBMIT = os.environ.get("COURTLESS_RATE_LIMIT_SUBMIT", "5/minute")
RATE_LIMIT_READ = os.environ.get("COURTLESS_RATE_LIMIT_READ", "60/minute")
