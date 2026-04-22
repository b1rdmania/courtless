# Courtless

**Disputes Without Courts.** A neutral AI audit of a dispute, before anyone spends £10K on lawyers.

🌐 **Live:** [courtless.xyz](https://courtless.xyz)
📑 **See a demo brief:** [courtless.xyz/demo](https://courtless.xyz/demo)

---

## What it is

Courtless takes one side of a dispute, reads your evidence, and produces a brutally honest AI-drafted brief covering:

- Your **strongest points** (with reasoning)
- Your **weakest points** (where you're exposed)
- **Evidence gaps** (what you claim but haven't proven)
- **Opposing steelman** (what the other side would argue)
- **Recommended next step** (settle, mediate, letter before action, or walk away)
- **An honest take** — one sentence, unflinching

The dual-party mode (both sides engage, case-law comparables, Nash-equilibrium settlement band, joint brief) is Phase 2. V1 is single-party only.

**Not legal advice.** Informational audit only. For consumers and SMEs, not lawyers.

---

## Why this exists

Lawyers cost £300–500/hr. Most disputes are worth too little to justify that. Small claims court is for under £10K but still stressful. Most disputes never need a judge — they need a neutral pressure test before anyone escalates.

Courtless is that pressure test. Judge Judy with case law. £0 to run the first audit.

**Positioning:** pre-legal. Not a replacement for courts. Not legally binding. Just a sanity check before you sink money into escalation.

---

## Who it's for

Consumers and SMEs in disputes where:
- The amount at stake is **£500 – £100K**
- Both parties are in the **UK** (England & Wales V1)
- The dispute is commercial, contractual, or workplace in nature
- Neither side has yet committed to litigation

Good fits: landlord/tenant deposit disputes · freelancer invoices · founder fall-outs · workplace disagreements · supplier / service disputes · consumer complaints.

Not for: family law · criminal matters · personal injury · anything above £100K in dispute.

---

## How the product works

### Document-first intake (5 steps)

1. **Drop your evidence** — PDFs, emails, contracts, invoices, photos, message threads. Drag-drop, multi-file.
2. **AI reads and drafts** — a summary of what happened, pre-filled from your documents, ready for you to edit rather than type from scratch.
3. **Your desired outcome** — short
4. **Your honest self-assessment** — do you bear any responsibility? What might the other side say?
5. **Email + consent → brief arrives in ~60 seconds**

Fallback: skip the upload if you prefer to type it all manually (7-step flow).

### Demo mode

Three hand-crafted example briefs at `/demo` for investors, funders and curious visitors. Real caliber of output, fully shareable on mobile. Each demo uses a realistic UK case grounded in real statutes (Tenant Fees Act 2019, Late Payment of Commercial Debts Act 1998, Partnership Act 1890).

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend: React 19 + Vite + React Router → Vercel           │
└──────────────────────────┬──────────────────────────────────┘
                           │ fetch /api/*
┌──────────────────────────▼──────────────────────────────────┐
│  Backend: FastAPI + async Anthropic SDK → Render             │
│                                                               │
│  Agents (model-agnostic via BaseAgent wrapper):              │
│    EvidenceIntakeHelper   reads uploads → pre-fills intake   │
│    IndividualAuditor      one-sided private brief generator  │
│                                                               │
│  Routers                                                     │
│    POST /api/disputes/prefill  — AI-drafted intake           │
│    POST /api/disputes          — finalise + run audit        │
│    GET  /api/disputes/:id      — fetch dispute + brief       │
│    GET  /api/demo              — list demo briefs            │
│    GET  /api/demo/:id          — single demo brief           │
│                                                               │
│  Services                                                    │
│    parser.py     PDF / DOCX / TXT text extraction            │
│    demos.py      Hand-crafted demo brief content             │
└─────────────────────────────────────────────────────────────┘
```

**Model-agnostic.** The `BaseAgent` wrapper can run on Claude (default), Bedrock, or self-hosted Gemma/Llama/Hermes via Ollama. Model strings are env-configurable per agent.

**Database.** SQLite dev, Postgres-ready. Demo briefs are hard-coded in `demos.py`.

**Deployment.** Frontend auto-deploys to Vercel from `main`. Backend auto-deploys to Render from `main`.

---

## Tech stack

- React 19, Vite 8, React Router 7
- FastAPI, uvicorn, async Anthropic SDK
- aiosqlite (Postgres-ready)
- PyMuPDF + python-docx for evidence extraction
- httpx
- Inline styles, no CSS modules
- Dark design system, ui-serif hero type

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

Vite proxies `/api/*` to `http://localhost:8000`.

---

## Project structure

```
courtless/
├── src/
│   ├── App.jsx                  Router + AppShell mobile gate
│   ├── index.css                Global resets + animations
│   └── pages/
│       ├── SplashPage.jsx       Marketing page with demo CTA
│       ├── IntakeFlow.jsx       5-step document-first + legacy 7-step
│       ├── BriefPage.jsx        Private brief display (also handles demo)
│       ├── DemoList.jsx         /demo — list of example briefs
│       └── MobileNotice.jsx     "Open on bigger screen" fallback
├── backend/
│   ├── app/
│   │   ├── main.py              FastAPI + lifespan
│   │   ├── config.py            Env vars + model config
│   │   ├── database.py          SQLite schema (6 tables)
│   │   ├── agents/
│   │   │   ├── base.py          BaseAgent wrapper (ported from counsel-mvp)
│   │   │   ├── intake_helper.py EvidenceIntakeHelper agent
│   │   │   └── auditor.py       IndividualAuditor (retired-judge persona)
│   │   ├── routers/
│   │   │   ├── disputes.py      Prefill + create + fetch
│   │   │   └── demo.py          List + fetch demo briefs
│   │   └── services/
│   │       ├── parser.py        PDF / DOCX / TXT extraction
│   │       ├── seed.py          Startup validation of demo fixtures
│   │       └── demos.py         Hand-crafted demo brief content
│   └── requirements.txt
├── render.yaml                  Render blueprint
├── vercel.json                  Vercel config
└── IMPLEMENTATION_PLAN.md       Full product + phased delivery plan
```

---

## Roadmap

### Phase 2 — Dual-party (next)
- Invite-code flow so Party A can bring Party B in
- Party B submits separately (never sees A's input)
- Full analysis pipeline: fact mapper → case law lookup → game theory → judge synthesis → per-party recommendations
- Dual briefs (private per party + joint brief)
- 14-day timeout → one-sided audit with steelman

### Phase 3 — Production launch
- Stripe payment (free first audit, £29-49 subsequent)
- Magic-link auth for saved disputes
- Email delivery of briefs
- SRA / regulatory review
- Async job queue (audits run in background, user gets email when ready)

### Phase 4 — Post-launch
- Async mediation mode (structured AI-moderated exchange)
- Outcome tracking
- SEO content for consumer acquisition
- Scotland / NI / Ireland jurisdiction packs
- Partner programme for mediators

---

## Regulatory stance

**Courtless does not provide legal advice.** Every brief carries a disclaimer. Terms of service explicitly disclaim any solicitor-client relationship. SRA review is scheduled before public launch (Phase 3).

England & Wales only for V1.

---

## Related

- [b1rdmania/counsel-mvp](https://github.com/b1rdmania/counsel-mvp) — sister product **Bird Legal** (AI for law firms). Courtless ports the `BaseAgent` wrapper from there.

---

## Status

Pre-alpha. Phase 1 (single-party audit with document-first intake + demo mode) is live at [courtless.xyz](https://courtless.xyz). Phase 2 (dual-party flow with case law and game theory) is next.

Open to conversations with UK mediators, legal consultancies, consumer-rights organisations and anyone thinking about the pre-legal layer.
