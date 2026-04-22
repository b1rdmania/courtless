# Courtless — Implementation Plan

> **Disputes Without Courts.** A neutral AI audit of a dispute, for both sides, before anyone spends £10K on lawyers.

Domain: **courtless.xyz**
Status: Scoping (pre-scaffold)

---

## 1. The product

### What it is

Courtless takes a dispute between two parties, collects each side's version of events and evidence separately, and produces a neutral, case-law-grounded audit that tells both sides:

1. **What's agreed** — facts both parties accept
2. **What's contested** — facts in dispute, with evidence weight
3. **How similar disputes have landed** — real case law comparables
4. **Realistic settlement band** — Nash-equilibrium analysis with BATNA/WATNA for each party
5. **Likely judge take** — a "Judge Judy" verdict-style brief
6. **Recommendation** — settle / mediate / go legal

The output is **not legal advice**. It's an informational reality check. Its value is saving both parties from spending £10K on solicitors to learn they have a weak position.

### Why this wins

**Market:** Every dispute below the commercial threshold where legal fees are disproportionate to the amount in dispute. Landlord/tenant deposit disputes. Freelancer invoices. Founder fallings-out. Employment disputes below tribunal. Supplier disagreements. SME contract rows.

**Moat:**
- **Neutrality by design** — symmetric output, same brief to both parties
- **Case-law-grounded** — real precedent, not vibes (National Archives API, same as Bird Legal)
- **Game-theoretic** — Nash equilibrium, BATNA/WATNA, realistic settlement bands
- **Consumer pricing** — £X per audit vs £500/hr lawyer

**Why the "it can't enforce anything" objection doesn't matter:** Courtless deliberately sits **before** the enforcement layer. It's the sanity check you do before paying for escalation. Judge Judy isn't legally binding either — that's not the product.

### Who it's for (V1)

Consumers and SMEs in disputes where:
- The amount at stake is £500 – £100K
- Both parties are in the UK (England & Wales V1)
- The dispute is commercial, contractual, or workplace in nature
- Neither side has yet committed to litigation

### Who it's NOT for (V1)

- Family law (custody, divorce, financial) — too sensitive, regulatory exposure
- Criminal matters
- Personal injury / clinical negligence
- High-value commercial disputes (£100K+) — they should use real lawyers
- Anyone needing legally binding outcomes (use courts / arbitration)

---

## 2. User flow

### Happy path — both parties engage

```
Party A lands on courtless.xyz
  ↓
Reads splash: "Got a dispute? Get a reality check."
  ↓
Clicks "Start Audit" → pays £X
  ↓
Submits their side (guided form + evidence upload)
  ↓
Gets an invite code + magic link to share with Party B
  ↓
Party B receives link → reads what Courtless is →
  submits their side separately (never sees A's input)
  ↓
Pipeline runs (~2-3 minutes)
  ↓
Both parties receive by email:
  - Private brief (their own strongest/weakest points)
  - Joint brief (the realistic take)
  - Recommendation
  ↓
Parties decide what to do with it
```

### Fallback — Party B declines / doesn't engage

- Party A still gets a brief, but labelled **"One-sided audit"**
- Includes a "steelman" simulation of what Party B would likely argue
- Clearly flagged as incomplete — both parties' engagement produces better output

### Trust / neutrality mechanisms

- Either party can pay to generate the audit
- Analysis is blind to who paid
- Joint brief is identical — same text to both parties
- Evidence stays with the side that submitted it unless disclosed in the joint brief
- Either party can request a "second opinion" re-analysis for £X (uses different prompt / model seed)

---

## 3. What each party submits

### Structured intake (per party)

1. **Basic facts** — who, what, when, where
2. **The dispute** — what happened in their words
3. **Desired outcome** — what would resolve this for them
4. **Previous attempts** — have they tried to resolve it? What happened?
5. **Position on liability** — do they accept any fault? Where do they stand?
6. **Walking-away scenario** — what will they do if this doesn't get resolved?

### Evidence upload

- Contracts, invoices, emails, message threads (WhatsApp / SMS export accepted)
- Photos (condition reports, damage, etc.)
- Bank statements (payment proof)
- Prior correspondence with the other party
- Each piece tagged with what it's meant to prove

### Chronology

- System auto-extracts dates from submitted docs (same pipeline as Bird Legal's Timeline Builder)
- Party can add/edit events manually
- Combined chronology is built from both parties' inputs at analysis time

---

## 4. The analysis pipeline

Runs once both parties have submitted (or on timeout if B declines).

```
Stage 1 — Individual audit (per party, parallel)
  Input: their intake + their evidence
  Agent: IndividualAuditor
  Output: strengths, weaknesses, documentary support,
          claim-by-claim evidence grading

Stage 2 — Combined fact-mapping
  Input: both intakes
  Agent: FactMapper
  Output: agreed facts, contested facts, undocumented claims

Stage 3 — Case law comparables
  Input: dispute type + key issues
  Agent: CaseLawResearcher (ported from Bird Legal)
  Output: 3-5 relevant UK judgments, ratio decidendi,
          "similar disputes went X way" summary

Stage 4 — Game theory analysis
  Input: combined picture + case law
  Agent: SettlementStrategist (game-theory variant of
         Bird Legal's StrategyAnalyst)
  Output: BATNA/WATNA per party, Nash equilibrium settlement
          band, likely outcomes if it goes to court

Stage 5 — Judge synthesis
  Input: all of the above
  Agent: JudgeSynthesizer
  System prompt: "You are a retired county court judge.
                  Read both sides. Tell them straight."
  Output: Joint verdict-style brief. Plain English. No hedging.

Stage 6 — Recommendations (per party)
  Input: joint brief + their intake
  Agent: PartyAdvisor (runs twice, once per party)
  Output: "Your next step should be..." specific to each side
```

All agents use the `BaseAgent` wrapper (ported from Bird Legal) — full audit logging, model-agnostic, can run on Claude / Gemma / Llama.

---

## 5. Output — what the parties see

### Each party receives two documents (email + web)

**1. Private brief** (only they see this)
- Your strongest points
- Your weakest points
- What's contested against you
- Where you're vulnerable evidentially
- What Party X will likely argue (steelman)

**2. Joint brief** (both parties see the same text)
- Agreed facts
- Contested facts with evidence weight
- Case law comparables
- Likely outcome if this went to court (with citations)
- Realistic settlement band with reasoning
- Recommended next step

Every brief carries a **disclaimer**: "This is not legal advice. Courtless is an informational audit. For binding advice, consult a qualified solicitor."

---

## 6. Tech stack

Same as Bird Legal for consistency and code reuse:

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite + React Router |
| Backend | FastAPI + async Anthropic SDK |
| Database | SQLite dev, Postgres prod |
| Auth | Magic-link email (consumer-friendly, no passwords) |
| Payment | Stripe (Phase 3+) |
| Document extraction | PyMuPDF + python-docx |
| Case law | National Archives Find Case Law API (ported from Bird Legal) |
| LLM | Claude Sonnet 4 (default), model-agnostic via BaseAgent |
| Frontend hosting | Vercel |
| Backend hosting | Render / Railway |
| Domain | courtless.xyz |

---

## 7. Data model

```
disputes
  id · status · title · dispute_type · amount_in_dispute
  created_at · updated_at · paid_at

parties
  id · dispute_id · role (initiator|respondent)
  email · invite_code · submitted_at · declined_at

intakes
  id · party_id · facts · dispute_description · desired_outcome
  previous_attempts · liability_position · walking_away_position

evidence
  id · party_id · filename · file_path · label
  extracted_text · upload_type (contract|email|photo|etc)

chronology_events
  id · dispute_id · date · description · source
  significance · party_source

analyses
  id · dispute_id · stage · agent_id · content_json
  tokens_in · tokens_out · duration_ms · created_at

briefs
  id · dispute_id · type (private_a|private_b|joint)
  content_md · generated_at · delivered_at

audit_log
  (same pattern as Bird Legal)
```

---

## 8. What we port / what's new

### Port from `counsel-mvp`
- `BaseAgent` wrapper (model-agnostic Claude calls, audit logging)
- Case law router (National Archives integration)
- Timeline/chronology extraction pipeline
- Game theory / Nash equilibrium prompt patterns
- Dark design system + typography
- Splash page structure (re-written copy for consumer audience)
- FastAPI app skeleton + lifespan seed pattern
- Vercel + Render deploy pipeline

### Port from `couples-therapy-bot`
- Dual-input async architecture (Party A / Party B)
- Brief generation pattern (LLM synthesis of metrics + raw)
- Safety policy / disclaimer structure
- Interview structure approach (guided questions per party)

### New build
- Invite-code flow (shareable link, Party B onboarding)
- Consumer auth (magic link via email)
- Evidence upload UX (drag-drop, multi-file, type tagging)
- Stripe payment integration
- Judge-persona system prompts
- BATNA/WATNA analyser (new agent)
- Steelman simulator (for one-sided fallback)
- Email delivery of briefs (SendGrid or Resend)
- Consumer-grade brand / marketing site

---

## 9. Pricing model (draft)

| Tier | Price | What you get |
|---|---|---|
| Audit | £29 – £49 | Single audit, both briefs if both parties engage |
| Second opinion | £19 | Re-run analysis with different seed / model |
| Mediation mode | £99 | Async structured back-and-forth (Phase 4) |

Party A pays to initiate. Party B's participation is free — the value exchange is A pays for the neutral third voice, B gets to defend their position at no cost.

**Free tier consideration:** Maybe first audit free to seed case volume and testimonials, then move to paid. To be decided.

---

## 10. Regulatory / legal

**Critical:** Courtless must not hold itself out as providing legal advice. Key safeguards:

- Disclaimer on every brief, submission form, and marketing page
- Terms of service explicitly: "Courtless provides informational analysis only. It is not a substitute for legal advice. No solicitor-client relationship is created."
- Clear statement that Courtless does not produce binding determinations
- No use of "legal advice", "solicitor", "our lawyers" in marketing copy
- SRA / LSA review before launch (cheap — 1 hr with a regulatory solicitor)
- Privacy policy covering evidence storage and retention
- GDPR compliance for dual-party data handling (Party A's submissions not shared with B without explicit consent mechanism)
- Data retention: delete evidence and intakes 90 days after audit delivery unless party requests extension

**Geographic scope V1:** England & Wales only. Case law and signposting is jurisdiction-specific.

---

## 11. Phased delivery

### Phase 0 — Planning (you're reading it)

### Phase 1 — Solo MVP (target: 1 week)
- Scaffold monorepo
- Splash page with brand + core copy
- Single-party intake form
- Evidence upload
- `IndividualAuditor` agent + brief generation
- "One-sided audit" output
- Basic auth (magic link)

**Deliverable:** You can submit a dispute, upload evidence, and get a private brief back. No Party B flow yet.

### Phase 2 — Dual-party (target: 1 week)
- Invite code + link flow
- Party B onboarding UX (explanatory landing + submission)
- Full pipeline stages 2–6
- Joint brief generation
- Dual email delivery

**Deliverable:** Full end-to-end: A submits, invites B, B submits, both get briefs.

### Phase 3 — Production launch (target: 1-2 weeks)
- Stripe payment integration
- Email templates + transactional email (Resend)
- Legal / regulatory review with solicitor
- Terms of service + privacy policy
- Polished brand + copy
- Public launch on courtless.xyz

**Deliverable:** Live product taking real money from real users.

### Phase 4 — Post-launch (ongoing)
- Async mediation mode (structured back-and-forth with AI moderator)
- Outcome tracking (follow-up email 30 days later: did it settle? did you sue?)
- SEO content for consumer acquisition ("can I get my deposit back" / "freelancer not paid" / etc.)
- Partner programme for mediators and small law firms
- Expansion to Scotland / Northern Ireland / other jurisdictions

---

## 12. Risks & open questions

### Risks

1. **Trust** — why should either side believe the AI is neutral? Mitigation: symmetric output, transparent pricing, second-opinion option.
2. **Regulatory creep** — SRA could take interest if copy drifts toward "legal advice". Mitigation: clear positioning + regulatory review.
3. **Case law accuracy** — Claude hallucinating cases. Mitigation: every citation must resolve to a real National Archives entry. Reject hallucinations at pipeline level.
4. **One-sided engagement** — what if Party B never participates? Mitigation: "one-sided audit" with steelman, clearly labelled as incomplete.
5. **Evidence forgery** — either party could upload fabricated evidence. Mitigation: disclaim this explicitly in TOC. Not Courtless's job to authenticate — we analyse what's presented.
6. **Emotional stakes** — disputes are stressful. Mitigation: clear messaging that this is a pressure test, not a therapy session.

### Decisions locked

- [x] **Pricing** — free first audit, paid from second audit onward (V2)
- [x] **Evidence retention** — 90 days, user can opt into longer
- [x] **Brief reveal timing** — Party A gets private brief immediately after submission. Joint brief only generates once Party B submits. Party B then receives both (private + joint) simultaneously. 14-day timeout → A gets one-sided audit with steelman.

### Still open

- [ ] Do we build a "mediation mode" or save for Phase 4?
- [ ] Brand mark — text-only `COURTLESS` or commission a wordmark?
- [ ] Claude Sonnet 4 enough, or do we need Opus for the Judge synthesis stage?
- [ ] Email-only auth or add Google OAuth?

---

## 13. What I'm going to build next

Pending your sign-off on this plan, the next step is:

**Scaffold Phase 1 (Solo MVP)** — monorepo structure, FastAPI backend with BaseAgent ported from counsel-mvp, React frontend with splash + intake form, first pass at `IndividualAuditor` agent, one-sided brief generation.

Target: end-to-end solo flow working locally in 2–3 days. Deploy to `courtless.xyz` shortly after.

---

*Draft v1 · Awaiting sign-off before scaffolding begins*
