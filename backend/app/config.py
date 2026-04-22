"""Courtless backend configuration."""

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(exist_ok=True)

DB_PATH = BASE_DIR / "courtless.db"

# Claude API
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")

# Model config — swappable via env vars
AUDITOR_MODEL = os.environ.get("COURTLESS_AUDITOR_MODEL", "claude-sonnet-4-20250514")

# Timeouts (seconds)
AUDITOR_TIMEOUT = int(os.environ.get("COURTLESS_AUDITOR_TIMEOUT", "90"))

# CORS
FRONTEND_URL = os.environ.get("COURTLESS_FRONTEND_URL", "http://localhost:5173")
