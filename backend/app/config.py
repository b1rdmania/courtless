"""Courtless backend configuration."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = Path(os.environ.get("UPLOAD_DIR", "/tmp/courtless-uploads"))
UPLOAD_DIR.mkdir(exist_ok=True, parents=True)

DB_PATH = Path(os.environ.get("DB_PATH", "/tmp/courtless.db"))

# Claude API
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

# Model config — swappable via env vars
AUDITOR_MODEL = os.environ.get("COURTLESS_AUDITOR_MODEL", "claude-sonnet-4-6")

# Timeouts (seconds)
AUDITOR_TIMEOUT = int(os.environ.get("COURTLESS_AUDITOR_TIMEOUT", "90"))

# CORS
FRONTEND_URL = os.environ.get("COURTLESS_FRONTEND_URL", "http://localhost:5173")
