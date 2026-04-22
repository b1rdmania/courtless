"""Hard-coded demo disputes + pre-generated briefs.

These are sales material: they demonstrate what a Courtless brief looks like without
requiring a visitor to submit their own dispute. They live in memory, not the database —
they're fixtures, not user data.
"""

from datetime import datetime, timezone


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


# ---------------------------------------------------------------------------
# DEMO 1 — Landlord withholding deposit
# ---------------------------------------------------------------------------

DEMO_1 = {
    "id": "demo-deposit",
    "title": "Smith v Properties — Deposit withheld",
    "amount_in_dispute": 1200,
    "teaser": "Tenant's £1,200 deposit withheld after a two-year tenancy — cleaning and alleged scuff damage, no receipts provided.",
    "status": "brief_ready",
    "created_at": "2026-02-14T10:12:00+00:00",
    "updated_at": "2026-02-14T10:14:22+00:00",
    "generated_at": "2026-02-14T10:14:22+00:00",
    "brief_type": "private",
    "brief": {
        "summary": (
            "You rented a one-bed flat in Hackney from Properties Ltd for two years on an AST, paying a "
            "£1,200 deposit in April 2024. When the tenancy ended in February 2026, the landlord returned "
            "£0 of your deposit, citing 'professional cleaning', 'scuff marks on the hallway wall', and a "
            "'damaged oven seal'. They have not produced receipts, a check-out inventory signed by you, "
            "or photos matched to a check-in report.\n\n"
            "On the documents, this is a strong tenant position. The deposit appears to have been "
            "protected in the TDS scheme (your protection certificate is in the evidence), but the "
            "landlord has not raised a formal dispute through the scheme — they've simply kept the money. "
            "That procedural gap is your friend. The law requires deductions to be evidenced; unevidenced "
            "deductions are not lawful.\n\n"
            "Your realistic outcome is recovery of most or all of the £1,200, plus potentially a penalty "
            "if the protection certificate was served late or not at all. You don't need a solicitor for "
            "this — you need a firm letter, and if that doesn't land, the TDS adjudication route."
        ),
        "strongest_points": [
            {
                "point": "The check-in inventory doesn't match the alleged damage.",
                "reasoning": (
                    "Your check-in inventory (uploaded, dated 14 April 2024) records 'hallway walls — "
                    "minor scuffs near light switch'. The landlord's check-out claim is for 'scuff marks "
                    "on hallway wall' as new damage. The pre-existing scuffs are documented. A "
                    "TDS adjudicator will see this immediately."
                ),
            },
            {
                "point": "No receipts have been produced for any claimed deduction.",
                "reasoning": (
                    "You asked for receipts in your email of 3 February 2026 and received no response. "
                    "TDS adjudications require evidence of actual cost, not estimates. 'Professional "
                    "cleaning' without an invoice is almost always refused."
                ),
            },
            {
                "point": "The deposit was protected — you have the certificate.",
                "reasoning": (
                    "Your TDS protection certificate is dated 20 April 2024, within the 30-day window. "
                    "This means you can use the TDS adjudication service for free, and the landlord is "
                    "bound by the scheme's rules."
                ),
            },
        ],
        "weakest_points": [
            {
                "point": "You don't have dated photos of the flat at check-out.",
                "reasoning": (
                    "The check-in inventory helps with pre-existing state, but you don't have your own "
                    "photos from the day you moved out. If the landlord produces photos showing damage, "
                    "you'll have to rely on the inventory alone."
                ),
            },
            {
                "point": "The oven seal claim is harder to rebut.",
                "reasoning": (
                    "Your inventory doesn't mention the oven seal specifically. If the landlord can "
                    "show a recent receipt for its replacement, an adjudicator may allow a small "
                    "deduction (typically £40-80) even without other evidence."
                ),
            },
        ],
        "evidence_gaps": [
            {
                "claim": "The flat was left clean.",
                "gap": (
                    "No photos of the clean flat. If you have any — even casual ones from packing day — "
                    "upload them. Timestamped phone photos count."
                ),
            },
            {
                "claim": "The check-out meeting was brief and no issues were raised.",
                "gap": (
                    "No written record of what was said at check-out. A follow-up email saying 'as "
                    "discussed today, you confirmed no issues' sent same-day would have locked this in."
                ),
            },
        ],
        "opposing_argument": (
            "If I were defending Properties Ltd, I'd lead with: the tenancy agreement has a clause "
            "requiring 'professional cleaning on departure' (clause 14.2 in your uploaded AST). You "
            "cleaned it yourself. On a strict reading, that's a breach — regardless of whether the "
            "flat was actually clean. Landlords often use this as a backstop argument.\n\n"
            "They'd also argue the hallway scuffs are worse than at check-in — not the same scuffs, "
            "new ones. Without your own photos, it's their word against a two-year-old inventory.\n\n"
            "Finally, they'd point out that oven seals wear and the replacement is reasonable. £80-100 "
            "is plausible. They'd accept they can't justify the full £1,200 but would offer, say, £900 "
            "back to avoid adjudication."
        ),
        "case_law_note": (
            "Case law analysis will be included in the joint brief once the other party submits their side. "
            "As a pointer, professional cleaning clauses post-Tenant Fees Act 2019 are unenforceable for "
            "tenancies granted or renewed after 1 June 2019 — a relevant thread for your case."
        ),
        "recommended_next_step": (
            "Step 1 (this week): send a single, firm letter before action. Reference your deposit, the "
            "TDS protection, the lack of evidenced deductions, and give them 14 days to return the "
            "full £1,200. Attach the check-in inventory as PDF. Keep the tone neutral and factual. "
            "Templates are easy to find — don't pay a solicitor for this.\n\n"
            "Step 2 (if no response or unsatisfactory response): open a TDS adjudication. It's free, "
            "online, and the landlord cannot refuse. Upload the inventory, the tenancy agreement, the "
            "protection certificate, your letter, and the email thread. Adjudicators typically decide "
            "in 28 days.\n\n"
            "Realistic settlement range: £900-£1,200. I'd accept £1,100 if it comes without a fight. "
            "Anything below £900, push to adjudication — the evidence is on your side."
        ),
        "honest_take": (
            "Your paper trail is strong and the landlord's position is procedurally weak — write the "
            "letter, and go to TDS adjudication if they don't fold."
        ),
    },
}


# ---------------------------------------------------------------------------
# DEMO 2 — Unpaid freelance invoice
# ---------------------------------------------------------------------------

DEMO_2 = {
    "id": "demo-invoice",
    "title": "Freelance designer v TechCo Ltd — Unpaid invoice £4,800",
    "amount_in_dispute": 4800,
    "teaser": "Freelance brand identity project delivered, 50% paid upfront, final £4,800 unpaid for 90 days. Client now claims work 'wasn't to brief'.",
    "status": "brief_ready",
    "created_at": "2026-03-02T14:40:00+00:00",
    "updated_at": "2026-03-02T14:42:18+00:00",
    "generated_at": "2026-03-02T14:42:18+00:00",
    "brief_type": "private",
    "brief": {
        "summary": (
            "You were commissioned by TechCo Ltd in October 2025 to produce a full brand identity "
            "package — logo, colour system, typography spec, and a 24-page brand guidelines PDF — for "
            "a fixed fee of £9,600 plus VAT. The contract was signed, 50% (£4,800) was paid on "
            "commencement, and final delivery was made on 22 December 2025. The final invoice, due 30 "
            "days after delivery, has now been outstanding for 90+ days. On 14 February 2026, the "
            "client's marketing director replied to your third chaser saying the work 'wasn't what "
            "we briefed' and they 'may need to get it redone'.\n\n"
            "This is, on the facts, a strong position for you and a late, opportunistic claim from "
            "them. The contract defines the deliverables precisely. You delivered all of them. They "
            "accepted delivery in writing on 22 December ('thanks, these look great — we'll start "
            "rolling out in Jan'). No revisions or concerns were raised within the 14-day revision "
            "window defined in the contract. Their objection arrived after the invoice due date, which "
            "is a pattern adjudicators recognise instantly.\n\n"
            "Your realistic outcome is recovery of the £4,800 plus statutory late payment interest and "
            "compensation under the Late Payment of Commercial Debts (Interest) Act 1998. A "
            "money claim online (MCOL) would almost certainly succeed — but a well-drafted letter "
            "before action usually gets paid within 14 days."
        ),
        "strongest_points": [
            {
                "point": "Written acceptance of delivery, before any complaint.",
                "reasoning": (
                    "The 22 December email from the marketing director explicitly accepts delivery ('these "
                    "look great'). No objections raised within the 14-day review window the contract "
                    "defines. Their complaint arrived on 14 February — 54 days late."
                ),
            },
            {
                "point": "Signed contract with clear deliverables.",
                "reasoning": (
                    "The SOW lists each deliverable with acceptance criteria. You delivered all of them "
                    "in the specified formats (AI, PDF, PNG). There is no ambiguity about what was "
                    "commissioned and what was supplied."
                ),
            },
            {
                "point": "Payment history shows they can and do pay.",
                "reasoning": (
                    "The 50% upfront payment was made within 5 days of invoicing. They aren't a "
                    "financially distressed client — they are a well-resourced company choosing not to "
                    "pay. That tells an adjudicator the complaint is strategic, not substantive."
                ),
            },
            {
                "point": "Statutory late payment entitlements apply.",
                "reasoning": (
                    "Under the Late Payment of Commercial Debts (Interest) Act 1998, you're entitled to "
                    "8% over Bank of England base, plus a fixed compensation fee (£70 for a debt of this "
                    "size). That's roughly £130 in interest so far and rising."
                ),
            },
        ],
        "weakest_points": [
            {
                "point": "The 'brief' document is informal.",
                "reasoning": (
                    "The original brief was a Slack thread and a short Notion doc — not a formal "
                    "specification. If they try hard to argue 'not to brief', they'll point at the "
                    "looseness of the brief and claim reasonable expectations weren't met. It won't "
                    "win, but it muddies the water."
                ),
            },
            {
                "point": "No written sign-off on interim milestones.",
                "reasoning": (
                    "You moved through concept → refinement → final without getting formal sign-off "
                    "at each stage. Their lawyer could argue you should have caught their dissatisfaction "
                    "earlier. Again, weak, but not nothing."
                ),
            },
        ],
        "evidence_gaps": [
            {
                "claim": "They were happy with the work.",
                "gap": (
                    "The 22 December email is good. Even better would be any Slack messages, meeting "
                    "notes, or photos of them using the brand — anything showing continued use after "
                    "delivery. If the logo is on their website or LinkedIn, screenshot it."
                ),
            },
            {
                "claim": "The brief was met.",
                "gap": (
                    "A side-by-side of brief line items vs delivered artefacts, as a one-page PDF, "
                    "would be devastating in adjudication. Worth building now."
                ),
            },
        ],
        "opposing_argument": (
            "If I were TechCo's lawyer, I'd argue: the brief was never formally signed off. The work "
            "doesn't reflect our brand — we wanted something 'modern, bold, disruptive' (a line from "
            "the Notion doc) and what we got is too conservative. We didn't raise it sooner because "
            "our marketing director was on leave in January. We've now had to engage a replacement "
            "agency and would like to settle the unpaid invoice against that cost, or agree a reduced "
            "fee reflecting the unusability of the deliverables.\n\n"
            "They'd angle for a settlement of £2,000-2,500 — half the invoice — framing it as a "
            "pragmatic resolution. They don't actually want to go to court over £4,800; it would cost "
            "them legal fees and reputational friction, and they know their case is weak."
        ),
        "case_law_note": (
            "Case law analysis will be included in the joint brief once the other party submits their "
            "side. For context: the Late Payment of Commercial Debts (Interest) Act 1998 and the "
            "Supply of Goods and Services Act 1982 are both directly on point. Silence after delivery "
            "past the contractual review window is generally treated as acceptance."
        ),
        "recommended_next_step": (
            "Step 1 (today): send a formal letter before action. Reference the contract, the delivery "
            "acceptance email, the overdue invoice, and state your intention to issue proceedings via "
            "Money Claim Online if payment is not received in 14 days. Itemise interest and "
            "compensation under the 1998 Act. Keep it clinical.\n\n"
            "Step 2 (if unpaid on day 15): file a claim via Money Claim Online. For £4,800 the court "
            "fee is around £205 (recoverable). This is the small claims track — no need for a "
            "solicitor. TechCo will almost certainly settle before a hearing.\n\n"
            "Realistic settlement range: £4,500-£5,000 (full invoice, possibly minus a small discount "
            "for cash-today settlement). Do not accept less than £4,000 — your position is too strong "
            "to fold."
        ),
        "honest_take": (
            "This is a strong case with a documentary trail most freelancers would envy — send the "
            "letter before action today and expect to be paid within a fortnight."
        ),
    },
}


# ---------------------------------------------------------------------------
# DEMO 3 — Ex-business partner dispute
# ---------------------------------------------------------------------------

DEMO_3 = {
    "id": "demo-partners",
    "title": "Jones v Khan — Partnership dissolution",
    "amount_in_dispute": 25000,
    "teaser": "Two co-founders, no written agreement, dispute over £25,000 retained earnings after one was bought out.",
    "status": "brief_ready",
    "created_at": "2026-03-18T09:05:00+00:00",
    "updated_at": "2026-03-18T09:08:02+00:00",
    "generated_at": "2026-03-18T09:08:02+00:00",
    "brief_type": "private",
    "brief": {
        "summary": (
            "You and Mr Khan founded a small digital marketing consultancy in 2021, operating as a "
            "general partnership (not an LLP, not a limited company). There is no written partnership "
            "agreement. You worked together until November 2025 when you agreed to dissolve the "
            "partnership; Khan continued the business, you left. A verbal agreement at the time "
            "apparently valued your share at £45,000, paid in two instalments. You have received "
            "£45,000. The dispute is about a further £25,000 you believe you are owed as your share "
            "of retained earnings from the year leading up to dissolution — money that was in the "
            "business bank account but had not been drawn as salary or dividend.\n\n"
            "On a brutally honest assessment, your position is weaker than your feeling about it. "
            "In an English general partnership without a written agreement, the Partnership Act 1890 "
            "applies — which defaults to equal sharing. That would give you a good claim in principle. "
            "But the documentary trail of what was actually agreed at dissolution is thin. The £45,000 "
            "was paid. The WhatsApp thread you've uploaded mentions a 'clean break' but doesn't "
            "explicitly ring-fence retained earnings. Khan will argue the £45,000 was a final "
            "settlement that accounted for everything, including the retained earnings.\n\n"
            "This is recoverable, but messier than your other two cases might be. Your realistic "
            "range is £0-£25,000 depending on how hard you push and whether you're prepared to go to "
            "mediation or, ultimately, county court. It's not a small claim — £25K is above the "
            "small claims track threshold (£10K) and would go to the fast track, where costs "
            "exposure becomes real. Proceed carefully."
        ),
        "strongest_points": [
            {
                "point": "The Partnership Act 1890 default is equal sharing.",
                "reasoning": (
                    "Without a written agreement, s24 of the 1890 Act presumes equal shares in capital "
                    "and profits. Retained earnings are profits. If £50,000 was retained in the business "
                    "the year before dissolution, your default share is £25,000. The burden is on "
                    "Khan to prove you agreed otherwise."
                ),
            },
            {
                "point": "The bank statements show the retained cash existed.",
                "reasoning": (
                    "Your uploaded bank statements for the year to dissolution show the partnership "
                    "account balance growing by £47,800. That's documented — not disputed. The question "
                    "is only how it was divided, not whether it existed."
                ),
            },
            {
                "point": "The £45,000 payment was described as 'goodwill and share of business'.",
                "reasoning": (
                    "Your WhatsApp thread on 12 November 2025 has Khan writing 'we'll call it £45K "
                    "for your share of the business and goodwill'. That language is consistent with "
                    "valuing the ongoing entity, not cashing out accumulated retained earnings."
                ),
            },
        ],
        "weakest_points": [
            {
                "point": "No written partnership agreement.",
                "reasoning": (
                    "This cuts both ways. The 1890 Act default helps you, but without a written "
                    "agreement there is also no written definition of what 'retained earnings' meant "
                    "for this partnership, no profit-sharing mechanism, and no defined process for "
                    "dissolution. Every fact will be contested from first principles."
                ),
            },
            {
                "point": "You accepted the £45,000 without a written reservation.",
                "reasoning": (
                    "When you accepted the two instalments, you did not confirm in writing that this "
                    "was 'without prejudice to any further claim for retained earnings'. Khan will argue "
                    "acceptance of the payments was acceptance of the settlement. He'll call it "
                    "'accord and satisfaction'. It's an argument, not a slam-dunk for him — but it's "
                    "the argument you'd least like to face."
                ),
            },
            {
                "point": "No contemporaneous documents valuing retained earnings.",
                "reasoning": (
                    "You didn't have a financial advisor value the partnership at dissolution. There's "
                    "no 'this is what each partner is owed' workings paper. You're reconstructing "
                    "the claim from bank statements a year later."
                ),
            },
            {
                "point": "Above small claims track — costs exposure.",
                "reasoning": (
                    "A £25,000 claim is on the fast track, not small claims. If you lose, you could be "
                    "liable for the other side's costs. This changes the risk profile significantly."
                ),
            },
        ],
        "evidence_gaps": [
            {
                "claim": "The £45,000 was for goodwill, not retained earnings.",
                "gap": (
                    "The WhatsApp thread is helpful but ambiguous. Any emails, meeting notes, or voice "
                    "memos from the dissolution period where either of you distinguished between "
                    "'your share of the business' and 'your share of the bank balance' would be gold."
                ),
            },
            {
                "claim": "The retained earnings weren't drawn.",
                "gap": (
                    "You've uploaded partnership bank statements. Also needed: your personal bank "
                    "statements showing you didn't receive dividend payments, and Khan's drawings "
                    "history (which he has, you don't). If this goes formal, you'd request these "
                    "via disclosure."
                ),
            },
        ],
        "opposing_argument": (
            "If I were defending Khan, I'd argue: the £45,000 was a negotiated, all-in settlement that "
            "both parties knew to be a clean break. Jones walked away satisfied at the time; the "
            "retained-earnings claim has emerged months later, suggesting he has reconsidered a bargain "
            "he freely made. The WhatsApp language ('your share of the business and goodwill') is "
            "consistent with a global settlement. The Partnership Act defaults are not in play where "
            "there is evidence of an actual agreement between the partners, even an oral one.\n\n"
            "I'd also point out that retained earnings in a professional services partnership are not "
            "'cash sitting in a box' — they fund ongoing operations, client commitments, and staff "
            "salaries. On dissolution, those commitments continue with me, not with Jones. Any "
            "valuation of the partnership that gives Jones a share of retained earnings must net off "
            "those ongoing liabilities. Once you do that, the £45,000 is fair.\n\n"
            "Finally, I'd offer £5,000-£8,000 to go away. Not because the claim is strong — but "
            "because I'd rather not have this in my life for the next 18 months."
        ),
        "case_law_note": (
            "Case law analysis will be included in the joint brief once the other party submits their "
            "side. Key statutory backdrop: Partnership Act 1890, especially ss24 (default sharing) and "
            "s44 (dissolution accounting). The principle in Hurst v Bryk [2002] on partnership "
            "dissolution is also likely relevant — the accounts must be drawn up fairly between "
            "outgoing and continuing partners."
        ),
        "recommended_next_step": (
            "Do not issue proceedings yet. Your case is arguable but not strong enough to risk "
            "fast-track costs exposure without first attempting a structured resolution.\n\n"
            "Step 1 (this month): send a letter before action, but frame it as an invitation to "
            "mediate. Ask for a full accounting of the partnership's financial position at "
            "dissolution — that's your legal entitlement under s28 of the 1890 Act. Focus on the "
            "accounting, not the £25,000 figure. You want to force a number out of him before you "
            "commit to one.\n\n"
            "Step 2 (month 2): engage a mediator. Cost splits roughly 50/50. A good commercial "
            "mediator will resolve this in a day for £2-3K total. Realistic settlement range: "
            "£10,000-£18,000. I'd accept £12,000 cleanly, £15,000 happily, and reserve going to "
            "court only if offered below £8,000.\n\n"
            "Step 3 (only if mediation fails): take formal legal advice before issuing. At this "
            "claim value the risk of costs makes DIY risky."
        ),
        "honest_take": (
            "You have a moral case and a defensible legal one, but the paper trail is thin — aim for "
            "mediation and a settlement in the £10-15K band; don't bet the claim on a contested "
            "hearing."
        ),
    },
}


DEMOS = [DEMO_1, DEMO_2, DEMO_3]
DEMOS_BY_ID = {d["id"]: d for d in DEMOS}


def list_demos() -> list[dict]:
    """Return the list summary (id, title, amount, teaser)."""
    return [
        {
            "id": d["id"],
            "title": d["title"],
            "amount_in_dispute": d["amount_in_dispute"],
            "teaser": d["teaser"],
        }
        for d in DEMOS
    ]


def get_demo(demo_id: str) -> dict | None:
    """Return a full demo dispute (with brief) by id, or None."""
    demo = DEMOS_BY_ID.get(demo_id)
    if not demo:
        return None
    # Shape matches /api/disputes/:id response, with is_demo=true added
    return {
        "id": demo["id"],
        "title": demo["title"],
        "status": demo["status"],
        "amount_in_dispute": demo["amount_in_dispute"],
        "created_at": demo["created_at"],
        "updated_at": demo["updated_at"],
        "brief": demo["brief"],
        "brief_type": demo["brief_type"],
        "generated_at": demo["generated_at"],
        "is_demo": True,
    }
