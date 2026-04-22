# Courtless

**Disputes Without Courts.** A neutral AI audit of a dispute, for both sides, before anyone spends £10K on lawyers.

Domain: **courtless.xyz** (reserved)
Status: Phase 1 MVP (single-party audit)

---

## What it is

Courtless is the reality check you do before you escalate a dispute. Tell us your side, upload your evidence, and you get back a brutally honest brief from a "retired judge" AI covering:

- Your strongest points (with supporting reasoning)
- Your weakest points (where you're exposed)
- Evidence gaps
- What the other side would likely argue (steelman)
- A realistic recommended next step

The dual-party mode (both sides engage, case law lookup, game theory settlement band, joint brief) is Phase 2.

**Not legal advice.** Informational audit only. For consumers and SMEs, not lawyers.

---

## Why this exists

Lawyers cost £300–500/hr. Most disputes are worth too little to justify that. Small claims court is for under £10K but still stressful. Most disputes never need a judge — they need a neutral pressure test. Courtless is that pressure test.

**Positioning:** pre-legal. Not a replacement for courts. Not legally binding. Just a sanity check before you sink money into escalation.

---

## Tech stack

Same pattern as [b1rdmania/counsel-mvp](https://github.com/b1rdmania/counsel-mvp):

- React 19 + Vite + React Router
- FastAPI + async Anthropic SDK
- SQLite (Postgres-ready)
- PyMuPDF + python-docx for evidence extraction
- Inline styles, no CSS modules
- Dark design system, serif hero type

Model-agnostic `BaseAgent` wrapper — the auditor can run on Claude, Bedrock, or self-hosted Gemma/Llama/Hermes.

---

## What's in Phase 1

- Splash page (marketing / pitch)
- 7-step intake flow (basic facts → dispute description → desired outcome → previous attempts → honest self-assessment → evidence upload → review & consent)
- `IndividualAuditor` agent — produces a private brief from a single party's submission
- Brief display page with strongest/weakest points, evidence gaps, steelman, recommended next step
- SQLite storage for disputes, parties, intakes, evidence, and briefs
- FastAPI backend with two endpoints: `POST /api/disputes` (create + run audit) and `GET /api/disputes/:id` (fetch brief)

## What's in Phase 2

- Invite-code flow so Party A can bring Party B in
- Party B submits separately (never sees A's input)
- Full 6-stage analysis pipeline (Individual audits → Fact mapper → Case law lookup → Game theory → Judge synthesis → Per-party recommendations)
- Dual briefs (private per party + joint brief)
- 14-day timeout → one-sided audit with steelman

---

## Running locally

```bash
# Frontend
npm install
npm run dev            # http://localhost:5173

# Backend (separate terminal)
cd backend
pip install -r requirements.txt
ANTHROPIC_API_KEY=sk-ant-... uvicorn app.main:app --reload --port 8000
```

The Vite dev server proxies `/api/*` to `http://localhost:8000`.

---

## Project structure

```
courtless/
├── src/
│   ├── App.jsx                  Router + AppShell + mobile gate
│   ├── index.css                Global resets + animations
│   └── pages/
│       ├── SplashPage.jsx       Marketing / pitch
│       ├── IntakeFlow.jsx       7-step dispute submission
│       ├── BriefPage.jsx        Private brief display
│       └── MobileNotice.jsx     "Open on bigger screen" fallback
├── backend/
│   ├── app/
│   │   ├── main.py              FastAPI app + lifespan init_db
│   │   ├── config.py            Env vars
│   │   ├── database.py          SQLite schema (6 tables)
│   │   ├── agents/
│   │   │   ├── base.py          BaseAgent wrapper (ported from counsel-mvp)
│   │   │   └── auditor.py       IndividualAuditor (retired-judge persona)
│   │   ├── routers/
│   │   │   └── disputes.py      POST + GET /api/disputes
│   │   └── services/
│   │       └── parser.py        PDF / DOCX / TXT text extraction
│   └── requirements.txt
└── IMPLEMENTATION_PLAN.md       Full product + phased delivery plan
```

---

## Regulatory stance

**Courtless does not provide legal advice.** Every brief carries a disclaimer. Terms of service explicitly disclaim any solicitor-client relationship. SRA review is scheduled before public launch (Phase 3).

England & Wales only for V1.

---

## Related

- [b1rdmania/counsel-mvp](https://github.com/b1rdmania/counsel-mvp) — sister product "Bird Legal" (AI for law firms). Courtless ports the `BaseAgent` wrapper and case-law-integration pattern from there.

---

## Status

Pre-alpha. Phase 1 scaffold complete. Heading for Phase 2 (dual-party flow) next.
