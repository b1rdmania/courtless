# Courtless — Implementation Plan

> **Disputes Without Courts.** A structured AI mediation protocol for both sides of a dispute, before anyone spends £10K on lawyers. Think Judge Judy — but mediative, not judgmental. With game theory and AI.

Domain: **courtless.xyz** (live)
Status: Phase 1 live · Phase 2 scoping

---

## 1. The product

### What it is

**Courtless is a structured async AI mediation.** Not a one-sided legal audit. Not a judge handing down verdicts. A neutral mediation protocol borrowed from evidence-based couples therapy (Gottman-method dual intake), adapted for legal and commercial disputes.

Both parties submit their version of the dispute and their evidence independently. The AI reads everything — the intakes, the contracts, the correspondence between them — and produces three things:

1. **A private brief per party** — strongest/weakest points, evidence gaps, what the other side will likely argue, honest take on their position
2. **A joint brief** — identical text sent to both sides, grounded in real UK case law, with a game-theoretic settlement band both parties could rationally accept
3. **A specific recommended next step** — settle here, mediate further, formal letter, or walk away

The output is **not legal advice**. It's a neutral third-voice read. The value is saving both parties from spending £10K on solicitors to learn something a 90-second neutral read could have told them.

### Why this wins

**Market:** Every dispute below the commercial threshold where legal fees are disproportionate. Landlord/tenant deposits. Freelancer invoices. Founder fall-outs. Employment below tribunal. Supplier disagreements. SME contract rows.

**Moat:**
- **Genuine mediation structure** — dual-party by default, not a solo tool with an invite bolt-on. Same architecture that's been working in clinical couples therapy for three decades.
- **Neutral by construction** — identical joint brief to both parties, blind to who initiated
- **Case-law-grounded** — real UK judgments from the National Archives Find Case Law API, not hallucinations
- **Game-theoretic** — Nash equilibrium, BATNA/WATNA, realistic settlement bands you can act on
- **Consumer pricing** — £0 for the first mediation vs £200-1000/hr for a human mediator

**Why the "no enforcement" objection doesn't land:** Courtless deliberately sits *before* the enforcement layer. It's the mediation you do before either side digs in. Human mediators aren't enforceable either — and they charge £500/hr, need both parties in the same room at the same time, and don't cite case law.

### Who it's for (V1)

Consumers and SMEs in disputes where:
- Amount at stake: **£500 – £100K**
- Both parties in the **UK** (England & Wales V1)
- Commercial, contractual, workplace, or consumer in nature
- Neither side has committed to litigation yet

### Who it's NOT for (V1)

- Family law (custody, divorce, financial) — too sensitive, regulatory exposure
- Criminal matters
- Personal injury / clinical negligence
- High-value commercial (£100K+) — they should use real lawyers
- Anything requiring legally binding outcomes — use courts / arbitration

---

## 2. The mediation protocol

### Three stages

```
Stage 1 — Dual Intake
   Party A submits their version + evidence (independent)
   Party B submits their version + evidence (independent, never sees A's)
   Each party's documents are parsed, dates extracted, signals tagged

Stage 2 — Signal Extraction
   Shared analysis runs against the combined evidence base:
     • Agreed facts mapping
     • Contested facts mapping
     • Evidence weight per claim (what the paper trail supports)
     • Case law comparables via National Archives API
     • Game-theoretic BATNA/WATNA per party
     • Settlement band under Nash equilibrium

Stage 3 — Mediated Output
   Per-party PRIVATE briefs (different text per party, not shared)
   JOINT brief (identical text to both parties — this is the core output)
   Per-party recommended next step
```

### Why dual intake (not "one-sided with invite")

The couples therapy world figured out that a single person's narrative is never the whole dispute. Each partner has their own version. The therapist reads both, weighs them against the actual behavioural data (messages, emails, shared calendar), and produces a synthesis.

Legal disputes have the same architecture. Two parties. Contested facts. A documentary trail of their actual exchanges. What's missing between consumers and lawyers is the neutral analyst who reads both sides with the same cold eye.

Courtless builds that neutral analyst. By default.

### Trust / neutrality mechanisms

- Either party can initiate — the one who pays is blind to the analysis
- Analysis is symmetric — same joint brief text to both sides
- Evidence each side submits is private to them unless disclosed in the joint brief
- Either party can request a re-run for £X (different seed / model)
- Audit log preserves every agent call with input/output hashes

---

## 3. User flow

### Happy path — both parties engage

```
Party A lands on courtless.xyz
  ↓
Reads splash → clicks "Start a mediation"
  ↓
Submits their version + uploads evidence (AI pre-fills draft from docs)
  ↓
Gets magic link to share with Party B, plus a private brief ("your side" read)
  ↓
Party B receives link → reads what Courtless is →
  submits their version separately, never sees A's input
  ↓
Stage 2 pipeline runs (~2-3 minutes)
  ↓
Both parties receive by email:
  - Their private brief
  - The joint brief (identical text)
  - Their recommended next step
  ↓
Parties decide: settle, mediate further, escalate, or walk
```

### Fallback — Party B declines / stays silent (14-day timeout)

- Party A still gets a one-sided audit with a steelman of what B would argue
- Clearly labelled as incomplete — joint brief is the unlock but A isn't stuck waiting

### What each party submits

**Structured intake**
1. **Basic facts** — who, what, when, where, amount in dispute
2. **The dispute** — their version of what happened (AI-drafted from uploads, user edits)
3. **Desired outcome** — what resolution looks like for them
4. **Previous attempts** — what's been tried already
5. **Honest self-assessment** — do they bear any responsibility, what might the other side say
6. **Walking-away scenario** — what they'll do if this doesn't resolve

**Evidence upload**
- Contracts, invoices, emails, message threads (WhatsApp/SMS export), photos, bank statements
- AI extracts dates, parses content, flags signals
- Same pipeline as Bird Legal's Timeline Builder for date chronology

---

## 4. Phase 2 — Mediated Dialogue

Today's joint brief is round zero. Phase 2 extends it into a multi-round async exchange.

```
Joint brief lands → Party A makes a proposal ('I'll accept £2,500')
  ↓
AI moderator frames it for Party B with context + the settlement band
  ↓
Party B responds or counters
  ↓
AI synthesises: 'You're converging on X, still contested on Y'
  ↓
Next round — focused on the remaining gap
  ↓
Eventually: mediated settlement memo that either party can take forward
```

The AI stays neutral throughout. It challenges weak positions on both sides, suggests compromises grounded in the case law, and keeps the conversation moving. No human mediator hourly rate. No need to schedule both parties for the same hour.

This is the product's long-term shape. V1 is the foundation.

---

## 5. Output — what each party sees

### Per-party email + web

**Private brief** (only they see)
- Your strongest points with supporting reasoning
- Your weakest points — where you're exposed
- Evidence gaps — what you claimed but haven't proven
- What they'd likely argue (steelman of the other side)
- Honest take — one brutal-but-kind sentence

**Joint brief** (both parties see the same text, word for word)
- Agreed facts
- Contested facts with evidence weight
- Case law comparables with real UK neutral citations
- Likely court outcome if it escalated
- Settlement band with BATNA/WATNA reasoning
- Recommended next step

Every brief carries the disclaimer: *"This is not legal advice. Courtless provides informational mediation only. For binding advice, consult a qualified solicitor."*

---

## 6. Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite + React Router |
| Backend | FastAPI + async Anthropic SDK |
| Database | SQLite dev, Postgres prod |
| Auth (V3) | Magic-link email |
| Payment (V3) | Stripe |
| Document extraction | PyMuPDF + python-docx |
| Case law | National Archives Find Case Law API (ported from Bird Legal) |
| LLM | Claude Sonnet 4 (default), model-agnostic via BaseAgent |
| Frontend hosting | Vercel (courtless.xyz) |
| Backend hosting | Render (courtless-api.onrender.com) |

---

## 7. Data model

```
disputes
  id · status · title · dispute_type · amount_in_dispute
  created_at · updated_at

parties
  id · dispute_id · role (initiator|respondent)
  email · invite_code · submitted_at · declined_at

intakes
  id · party_id · dispute_description · desired_outcome
  previous_attempts · own_responsibility · steelman_hint

evidence
  id · party_id · filename · file_path · label · upload_type
  extracted_text · created_at

briefs
  id · dispute_id · party_id · brief_type (private|joint|one_sided)
  content_json · generated_at · delivered_at

audit_log
  (same pattern as Bird Legal — every agent call logged)
```

---

## 8. What we port / what's new

### Ported from `counsel-mvp`
- `BaseAgent` wrapper (model-agnostic Claude calls, audit logging)
- Case law router (National Archives integration) — used in joint brief generation
- Timeline/chronology extraction pipeline
- Game theory / Nash equilibrium prompt patterns
- Dark design system + typography (though re-tuned for consumer)
- Splash page structure (copy fully rewritten for consumer audience)
- FastAPI app skeleton + lifespan pattern
- Vercel + Render deploy pipeline

### Conceptually ported from `couples-therapy-bot`
- **Dual-intake async architecture** — this is the core product shape
- Brief generation pattern (LLM synthesis of structured intake + signal data)
- Safety policy / disclaimer structure
- Structured interview approach (guided questions per party)

### New build
- `EvidenceIntakeHelper` agent — reads uploads, pre-fills the user's draft (saves them typing)
- `IndividualAuditor` agent — private brief generator (V1 live)
- Invite-code flow for Party B (V2)
- Joint-brief agent combining case law + game theory (V2)
- Stripe payment (V3)
- Email delivery (V3)

---

## 9. Pricing (draft)

| Tier | Price | What you get |
|---|---|---|
| First mediation | **Free** | One full mediation, both briefs if both parties engage |
| Subsequent mediations | £29-49 | Per dispute |
| Second opinion | £19 | Re-run with different seed/model |
| Mediated dialogue | £99+ | Phase 2 async multi-round exchange |

Either party can initiate. Participation is free for the invited side — the value exchange is A pays for the neutral third voice, B gets to defend their position at no cost. Neither sees the other's private intake.

---

## 10. Regulatory stance

**Courtless does not provide legal advice. Courtless does not provide binding mediation.** Key safeguards:

- Disclaimer on every brief, form, and marketing page
- Terms of service: "Informational mediation only. No solicitor-client relationship. No binding determinations."
- No use of "legal advice", "lawyer" in product-voice (disclaimers only)
- SRA / LSA review scheduled before public launch (1 hour with a regulatory solicitor)
- Privacy policy covering dual-party evidence handling (GDPR-compliant, evidence private per party unless disclosed in joint brief)
- Data retention: delete evidence and intakes 90 days after delivery unless user requests extension

**Geographic scope V1:** England & Wales only. Case law and signposting is jurisdiction-specific.

---

## 11. Phased delivery

### Phase 0 — Planning ✓

### Phase 1 — Solo MVP (live)
- Splash page with mediation-first positioning
- Document-first 5-step intake
- `EvidenceIntakeHelper` agent
- `IndividualAuditor` agent — private brief generation
- One-sided audit output
- Demo mode (3 hand-crafted example briefs at `/demo`)
- Deployed to courtless.xyz + courtless-api.onrender.com

### Phase 2 — Dual-party (next)
- Invite-code + magic-link flow for Party B
- Party B onboarding UX
- Stage 2 signal extraction pipeline (fact mapper, case law, game theory)
- Joint brief agent + generation
- Per-party briefs delivered on completion
- 14-day timeout → one-sided audit fallback

### Phase 3 — Production launch
- Stripe payment
- Email delivery (Resend)
- Legal review with solicitor
- Terms of service + privacy policy
- Polished brand
- Public launch

### Phase 4 — Mediated dialogue (the full vision)
- Multi-round async agentic exchange
- AI moderator probes, synthesises, moves toward agreement
- Mediated settlement memo output
- Outcome tracking (30-day follow-up)
- SEO content for consumer acquisition
- Scotland / NI / Ireland jurisdiction packs
- Partner programme for mediators and small law firms

---

## 12. Risks & open questions

### Risks

1. **Trust** — why should either side believe the AI is neutral? Mitigation: symmetric joint brief, transparent pricing, either party can initiate, second-opinion option.
2. **Regulatory creep** — SRA could take interest if copy drifts toward "legal advice" or "regulated mediation". Mitigation: clear positioning, solicitor review, no regulated terms in product voice.
3. **Case law accuracy** — Claude hallucinating cases. Mitigation: every citation must resolve to a real National Archives entry.
4. **One-sided engagement** — Party B never participates. Mitigation: 14-day timeout → steelmanned one-sided audit, clearly labelled.
5. **Evidence forgery** — parties upload fabricated docs. Mitigation: disclaimed in TOC — not Courtless's job to authenticate.
6. **Emotional load** — disputes are stressful. Mitigation: positioning as a neutral pressure test, not therapy.

### Decisions locked

- [x] **Pricing** — free first mediation, paid from second onward (V3)
- [x] **Evidence retention** — 90 days, user can opt into longer
- [x] **Brief reveal timing** — A gets private brief immediately after submission. Joint brief only generates once Party B submits. Party B receives both (private + joint) simultaneously. 14-day timeout → one-sided audit with steelman.

### Still open

- [ ] Phase 4 scope — dedicated UI mode, or bolt onto existing brief?
- [ ] Brand mark — text-only `COURTLESS` or wordmark?
- [ ] Claude Sonnet 4 enough for joint brief synthesis, or Opus for the judge-synthesis stage?
- [ ] Email-only auth or add Google OAuth?

---

## 13. Status

Phase 1 live at **[courtless.xyz](https://courtless.xyz)**. Document-first intake, demo mode, one-sided audit generation all working end-to-end. Backend stable on Render, frontend on Vercel.

Next up: Phase 2 dual-party flow (invite-code, Party B onboarding, joint brief pipeline with case law + game theory).
