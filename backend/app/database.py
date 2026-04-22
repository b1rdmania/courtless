"""SQLite database setup and helpers for Courtless."""

import aiosqlite
from .config import DB_PATH

SCHEMA = """
CREATE TABLE IF NOT EXISTS disputes (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    dispute_type TEXT DEFAULT 'general',
    amount_in_dispute REAL,
    status TEXT NOT NULL DEFAULT 'submitted',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS parties (
    id TEXT PRIMARY KEY,
    dispute_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'initiator',
    email TEXT,
    invite_code TEXT,
    submitted_at TEXT,
    declined_at TEXT,
    FOREIGN KEY (dispute_id) REFERENCES disputes(id)
);

CREATE TABLE IF NOT EXISTS intakes (
    id TEXT PRIMARY KEY,
    party_id TEXT NOT NULL,
    problem_started TEXT,
    other_party_name TEXT,
    dispute_description TEXT NOT NULL,
    desired_outcome TEXT,
    previous_attempts TEXT,
    own_responsibility TEXT,
    steelman_hint TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (party_id) REFERENCES parties(id)
);

CREATE TABLE IF NOT EXISTS evidence (
    id TEXT PRIMARY KEY,
    party_id TEXT NOT NULL,
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    upload_type TEXT DEFAULT 'other',
    label TEXT DEFAULT '',
    extracted_text TEXT,
    created_at TEXT NOT NULL,
    FOREIGN KEY (party_id) REFERENCES parties(id)
);

CREATE TABLE IF NOT EXISTS briefs (
    id TEXT PRIMARY KEY,
    dispute_id TEXT NOT NULL,
    party_id TEXT,
    brief_type TEXT NOT NULL,
    content_json TEXT NOT NULL,
    generated_at TEXT NOT NULL,
    FOREIGN KEY (dispute_id) REFERENCES disputes(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
    id TEXT PRIMARY KEY,
    dispute_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    model TEXT,
    tokens_in INTEGER DEFAULT 0,
    tokens_out INTEGER DEFAULT 0,
    duration_ms INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'success',
    error_msg TEXT,
    timestamp TEXT NOT NULL
);
"""


async def get_db() -> aiosqlite.Connection:
    db = await aiosqlite.connect(str(DB_PATH), timeout=30)
    db.row_factory = aiosqlite.Row
    await db.execute("PRAGMA journal_mode=WAL")
    await db.execute("PRAGMA foreign_keys=ON")
    await db.execute("PRAGMA busy_timeout=10000")
    return db


async def init_db():
    db = await get_db()
    await db.executescript(SCHEMA)
    await db.commit()
    await db.close()
