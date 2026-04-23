# Courtless

**Disputes Without Courts.** A structured AI mediation protocol for both sides of a dispute, before anyone spends £10K on lawyers.

*Think Judge Judy — but mediative, not judgmental. With game theory and AI.*

🌐 **Live:** [courtless.xyz](https://courtless.xyz)
📑 **See a demo brief:** [courtless.xyz/demo](https://courtless.xyz/demo)

---

## What it is

Courtless is a three-stage async mediation. Not a one-sided legal audit. Not a judge handing down verdicts. A neutral mediation protocol modelled on evidence-based couples therapy (Gottman-method dual intake), adapted for legal and commercial disputes.

**The protocol:**

1. **Dual Intake** — Both sides submit their version and evidence independently. Neither sees what the other submitted.
2. **Signal Extraction** — AI reads everything against a shared evidence base: agreed facts, contested facts, evidence weight, real UK case law comparables, game-theoretic BATNA/WATNA per party.
3. **Mediated Output** — Each side gets a private brief (their strongest/weakest points, honest and unshared), plus a joint brief that's identical to both parties — real case law, settlement band, recommended next step.

V1 (live) runs the protocol in single-party mode with a steelman of the absent side. V2 (next) completes the dual-party flow. V4 (the full vision) turns the joint brief into a multi-round async agentic mediation — structured exchange where the AI moderator probes, synthesises, and moves both sides toward agreement.

**Not legal advice.** A neutral third-voice read. For consumers and SMEs, not lawyers.

---

## Why this exists

Lawyers charge £300–500/hr. Real mediators charge £200–1000/hr and need both parties in the same room at the same time. Small claims court is under £10K but stressful, adversarial, and slow.

Most disputes never need any of those. They need a neutral third voice that reads both sides with the same cold eye and tells them: where they agree, where they don't, what the case law says, and what a reasonable settlement looks like.

Courtless is that neutral third voice. £0 to start. Async — no scheduling. Case-law-grounded. Game-theoretic.

**Positioning:** pre-legal mediation. Not a replacement for courts or enforcement. Not binding. A shared honest picture of what's reasonable so both sides can stop paying to learn it.

---

## Who it's for

Consumers and SMEs in disputes where:
- Amount at stake: **£500 – £100K**
- Both parties in the **UK** (England & Wales V1)
- Commercial, contractual, workplace, or consumer in nature
- Neither side has committed to litigation yet

Good fits: landlord/tenant deposit disputes · freelancer invoices · founder fall-outs · workplace disagreements · supplier / service disputes · consumer complaints.

Not for: family law · criminal matters · personal injury · anything above £100K in dispute.

---

## How the product works today

### Document-first intake (5 steps)

1. **Drop your evidence** — PDFs, emails, contracts, invoices, photos, message threads
2. **AI reads and drafts a narrative** — pre-filled summary from your docs, ready for you to edit rather than type from scratch
3. **Your desired outcome** — short
4. **Your honest self-assessment** — do you bear any responsibility? What might the other side say?
5. **Email + consent → brief arrives in ~60 seconds**

Fallback: skip the upload if you prefer to type it manually (legacy 7-step flow still available).

### Demo mode

Three hand-crafted example briefs at `/demo` for investors, funders, and curious visitors. Real caliber of output, fully shareable on mobile. Each demo uses a realistic UK case grounded in real statutes (Tenant Fees Act 2019, Late Payment of Commercial Debts Act 1998, Partnership Act 1890).

### Coming next — dual-party mediation (V2)

Party A submits → gets a private brief → invites Party B via magic link → Party B submits independently → both sides receive identical joint brief with case law + settlement band. 14-day timeout → one-sided audit with steelman.

### Coming later — Phase 4 mediated dialogue

Today's joint brief is round zero. Phase 4 turns it into a live async structured exchange. Party A makes a proposal. The AI frames it for Party B, probes the response, surfaces convergence and remaining gaps. Multiple rounds toward agreement at the pace that works for both parties.

---

## Why dual intake works (the couples therapy heritage)

The structure is borrowed from evidence-based couples therapy. Gottman-method intake separates the partners: each answers the same structured questions independently, and the exchange history (messages, emails, voicemails) is read as behavioural data. A neutral synthesis is produced grounded in what *both* people said.

Legal disputes have the same architecture. Two parties. Contested facts. A documentary trail (contracts, emails, WhatsApps) showing what was actually agreed and when things went wrong. What's missing is the neutral analyst who reads both sides with the same cold eye.

Courtless is that neutral analyst. By default.

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
│       ├── SplashPage.jsx       Marketing page (mediation-first)
│       ├── IntakeFlow.jsx       5-step document-first + legacy 7-step
│       ├── BriefPage.jsx        Brief display (private, joint, demo)
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
└── IMPLEMENTATION_PLAN.md       Full mediation protocol + phased delivery
```

---

## Roadmap

### Phase 1 — Solo MVP ✓ (live at courtless.xyz)
Mediation-first splash, document-first intake, one-sided brief, demo mode

### Phase 2 — Dual-party mediation (next)
Invite-code + magic-link for Party B, Party B onboarding, Stage 2 signal extraction (fact mapper, case law lookup, game theory), joint brief agent, dual-party delivery, 14-day timeout fallback

### Phase 3 — Production launch
Stripe payment · Email delivery (Resend) · Legal / regulatory review with solicitor · Terms of service + privacy policy · SEO setup

### Phase 4 — Mediated dialogue (the full vision)
Multi-round async agentic exchange · AI moderator probes and synthesises · Mediated settlement memo · Outcome tracking · Scotland / NI jurisdiction packs · Partner programme for mediators

---

## Regulatory stance

**Courtless does not provide legal advice. Courtless does not provide binding mediation.** Every brief carries the disclaimer. Terms of service explicitly disclaim any solicitor-client relationship and any binding determination. SRA / LSA review scheduled before Phase 3.

England & Wales only for V1.

---

## Related

- [b1rdmania/counsel-mvp](https://github.com/b1rdmania/com/b1rdmania/counsel-mvp) — sister product **Bird Legal** (AI for law firms). Courtless ports the `BaseAgent` wrapper, case-law integration and game-theory prompt patterns from there.
- The dual-intake structure is conceptually lifted from the Gottman-method couples therapy protocol.

---

## Status

Phase 1 live at **[courtless.xyz](https://courtless.xyz)**. Document-first intake, demo mode, one-sided audit generation all working end-to-end. Backend stable on Render, frontend on Vercel.

Open to conversations with UK mediators, legal consultancies, consumer-rights organisations, and anyone thinking about the pre-legal mediation layer.
