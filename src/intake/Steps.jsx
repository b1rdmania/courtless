import React from 'react';
import { color, font, radius, space, t } from '../theme.js';
import {
  Field,
  Input,
  Textarea,
  CharCount,
  RadioRow,
  RadioCard,
  CheckboxRow,
  QuestionTitle,
  QuestionHelper,
} from './fields.jsx';
import { EvidenceUploader } from './EvidenceUploader.jsx';
import { SummaryCard } from './SummaryCard.jsx';

// =====================================================================
// NEW FLOW — document-first
// =====================================================================

export const StepUploadFirst = ({ evidence, setEvidence, onSkip }) => (
  <section aria-labelledby="step-upload">
    <QuestionTitle id="step-upload">Drop your evidence in. We'll read it.</QuestionTitle>
    <QuestionHelper>
      Emails, contracts, invoices, messages, photos — drop them here and we'll pull the facts out,
      summarise it, and walk you through the rest. Beats typing a 3,000-word essay from memory.
    </QuestionHelper>

    <EvidenceUploader evidence={evidence} setEvidence={setEvidence} />

    <div style={{ marginTop: space[7], textAlign: 'center' }}>
      <button
        type="button"
        onClick={onSkip}
        style={{
          ...t.small,
          color: color.inkMuted,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: font.body,
          textDecoration: 'underline',
          textUnderlineOffset: '4px',
        }}
      >
        Skip upload — I'll describe it manually
      </button>
    </div>
  </section>
);

export const StepReviewPrefill = ({ form, update, keyEvidenceSummary }) => (
  <section aria-labelledby="step-review">
    <QuestionTitle id="step-review">We read your docs. Here's what we got.</QuestionTitle>
    <QuestionHelper>
      A starting point, not the final word. Edit anything that's wrong, fill in anything we missed.
      You know the story — we just scaffold it.
    </QuestionHelper>

    <Field label="What's this dispute about?" htmlFor="title" required>
      <Input
        id="title"
        type="text"
        value={form.title}
        onChange={(e) => update({ title: e.target.value })}
        placeholder="e.g. Landlord withholding my deposit"
      />
    </Field>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: space[4],
        marginBottom: space[6],
      }}
    >
      <Field label="When did the problem start?" htmlFor="problem_started" style={{ marginBottom: 0 }}>
        <Input
          id="problem_started"
          type="date"
          value={form.problem_started}
          onChange={(e) => update({ problem_started: e.target.value })}
        />
      </Field>
      <Field label="Rough amount in dispute (£)" htmlFor="amount" required style={{ marginBottom: 0 }}>
        <Input
          id="amount"
          type="number"
          min="0"
          step="1"
          value={form.amount}
          onChange={(e) => update({ amount: e.target.value })}
          placeholder="e.g. 1800"
        />
      </Field>
    </div>

    <Field label="Other party's name" htmlFor="other_party">
      <Input
        id="other_party"
        type="text"
        value={form.other_party_name}
        onChange={(e) => update({ other_party_name: e.target.value })}
        placeholder='e.g. "Acme Ltd" or "My former landlord"'
      />
    </Field>

    <Field label="What happened, in your words" htmlFor="description" required>
      <Textarea
        id="description"
        value={form.dispute_description}
        onChange={(e) => update({ dispute_description: e.target.value })}
        placeholder="We drafted this from your documents. Edit any details that are wrong or missing."
        style={{ minHeight: '240px' }}
      />
      <CharCount value={form.dispute_description} min={200} max={5000} />
    </Field>

    {Array.isArray(keyEvidenceSummary) && keyEvidenceSummary.length > 0 && (
      <div
        style={{
          padding: `${space[4]} ${space[5]}`,
          backgroundColor: color.canvasAlt,
          border: `1px solid ${color.hairline}`,
          borderRadius: radius.md,
        }}
      >
        <div style={{ ...t.eyebrow, marginBottom: space[3] }}>
          What we pulled out of your documents
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: space[2] }}>
          {keyEvidenceSummary.map((item, i) => (
            <li key={i} style={{ ...t.small, color: color.ink }}>
              <span style={{ color: color.accent, fontWeight: 600 }}>{item.filename}</span>
              <span style={{ color: color.inkSubtle }}> — </span>
              {item.summarises_as}
            </li>
          ))}
        </ul>
      </div>
    )}
  </section>
);

export const StepOutcome = ({ form, update }) => (
  <section aria-labelledby="step-outcome">
    <QuestionTitle id="step-outcome">What does a good outcome look like for you?</QuestionTitle>
    <QuestionHelper>
      Full amount back? A partial refund and an apology? A specific action they need to take?
      Knowing what you actually want sharpens the whole audit.
    </QuestionHelper>
    <Field htmlFor="outcome" required>
      <Textarea
        id="outcome"
        value={form.desired_outcome}
        onChange={(e) => update({ desired_outcome: e.target.value })}
        placeholder="e.g. Full £1,800 deposit returned, plus interest. Or: a written apology and £500 towards the damage."
      />
      <CharCount value={form.desired_outcome} min={20} max={2000} />
    </Field>
  </section>
);

export const StepHonestTake = ({ form, update }) => (
  <section aria-labelledby="step-honest">
    <QuestionTitle id="step-honest">Your honest take.</QuestionTitle>
    <QuestionHelper>
      Disputes rarely have one clean villain. Thinking about your own role now makes the audit
      sharper — and your steelman for the other side better.
    </QuestionHelper>

    <Field label="Do you think you bear any responsibility?">
      <div role="radiogroup" aria-label="Own responsibility" style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
        {[
          { value: 'none', label: 'Not at all' },
          { value: 'a_little', label: 'A little' },
          { value: 'partially', label: 'Partially' },
        ].map((opt) => (
          <RadioRow
            key={opt.value}
            selected={form.own_responsibility === opt.value}
            onClick={() => update({ own_responsibility: opt.value })}
            label={opt.label}
          />
        ))}
      </div>
    </Field>

    <Field label="Anything the other side would say you got wrong? (optional)" htmlFor="steelman">
      <Textarea
        id="steelman"
        value={form.steelman_hint}
        onChange={(e) => update({ steelman_hint: e.target.value })}
        placeholder="Whatever they'd throw at you if they had the chance to reply. It makes the audit more realistic."
      />
    </Field>
  </section>
);

export const StepSubmit = ({ form, update, evidence, includePrevious = false }) => (
  <section aria-labelledby="step-submit">
    <QuestionTitle id="step-submit">Ready to run your audit?</QuestionTitle>
    <QuestionHelper>
      Here's what we're about to analyse. This takes about 60–90 seconds.
    </QuestionHelper>

    <SummaryCard form={form} evidence={evidence} includePrevious={includePrevious} />

    <Field label="Your email" htmlFor="email" required helper="We'll email the brief so you can come back to it.">
      <Input
        id="email"
        type="email"
        value={form.email}
        onChange={(e) => update({ email: e.target.value })}
        placeholder="you@example.com"
      />
    </Field>

    <CheckboxRow
      id="consent"
      checked={form.consent}
      onChange={(checked) => update({ consent: checked })}
    >
      I understand this is an informational audit, not legal advice. I consent to Courtless
      analysing the evidence I've provided.
    </CheckboxRow>
  </section>
);

// =====================================================================
// FALLBACK — legacy 7-step flow
// =====================================================================

export const StepBasicFacts = ({ form, update }) => (
  <section aria-labelledby="step-basics">
    <QuestionTitle id="step-basics">Let's start with the basics.</QuestionTitle>
    <QuestionHelper>
      A few quick facts so we know what we're dealing with. You can be vague about names if you want.
    </QuestionHelper>

    <Field label="What's this dispute about?" htmlFor="title" required>
      <Input
        id="title"
        type="text"
        value={form.title}
        onChange={(e) => update({ title: e.target.value })}
        placeholder="e.g. Landlord withholding my deposit"
      />
    </Field>

    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: space[4],
        marginBottom: space[6],
      }}
    >
      <Field label="When did the problem start?" htmlFor="problem_started" style={{ marginBottom: 0 }}>
        <Input
          id="problem_started"
          type="date"
          value={form.problem_started}
          onChange={(e) => update({ problem_started: e.target.value })}
        />
      </Field>
      <Field label="Rough amount in dispute (£)" htmlFor="amount" required style={{ marginBottom: 0 }}>
        <Input
          id="amount"
          type="number"
          min="0"
          step="1"
          value={form.amount}
          onChange={(e) => update({ amount: e.target.value })}
          placeholder="e.g. 1800"
        />
      </Field>
    </div>

    <Field label="Other party's name (optional)" htmlFor="other_party">
      <Input
        id="other_party"
        type="text"
        value={form.other_party_name}
        onChange={(e) => update({ other_party_name: e.target.value })}
        placeholder='e.g. "My former landlord" or "Acme Ltd"'
      />
    </Field>

    <Field
      label="Your email"
      htmlFor="email"
      required
      helper="We'll email the brief so you can come back to it."
    >
      <Input
        id="email"
        type="email"
        value={form.email}
        onChange={(e) => update({ email: e.target.value })}
        placeholder="you@example.com"
      />
    </Field>
  </section>
);

export const StepDescription = ({ form, update }) => (
  <section aria-labelledby="step-desc">
    <QuestionTitle id="step-desc">In your own words, what happened?</QuestionTitle>
    <QuestionHelper>
      Be specific. Dates, names, what was said, what was agreed. The more detail, the better the
      audit. Aim for 500–5,000 characters.
    </QuestionHelper>
    <Field htmlFor="desc" required>
      <Textarea
        id="desc"
        value={form.dispute_description}
        onChange={(e) => update({ dispute_description: e.target.value })}
        placeholder="Walk us through it from start to finish. Don't worry about being tidy — just get it all down."
        style={{ minHeight: '280px' }}
      />
      <CharCount value={form.dispute_description} min={500} max={5000} />
    </Field>
  </section>
);

export const StepPrevious = ({ form, update }) => (
  <section aria-labelledby="step-prev">
    <QuestionTitle id="step-prev">Have you tried to resolve this already?</QuestionTitle>
    <QuestionHelper>Emails, phone calls, letters, formal complaints — anything counts.</QuestionHelper>

    <div
      role="radiogroup"
      aria-label="Previous attempts"
      style={{ display: 'flex', gap: space[3], marginBottom: space[6] }}
    >
      {[
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No, not yet' },
      ].map((opt) => (
        <RadioCard
          key={opt.value}
          selected={form.previous_attempts_radio === opt.value}
          onClick={() => update({ previous_attempts_radio: opt.value })}
          label={opt.label}
        />
      ))}
    </div>

    {form.previous_attempts_radio === 'yes' && (
      <Field label="What did you try — and what happened?" htmlFor="prev">
        <Textarea
          id="prev"
          value={form.previous_attempts}
          onChange={(e) => update({ previous_attempts: e.target.value })}
          placeholder="e.g. I sent a follow-up email on 14 Feb asking for the deposit back. They replied saying they were keeping it for 'cleaning costs' but never sent receipts."
        />
      </Field>
    )}
  </section>
);

export const StepResponsibility = ({ form, update }) => (
  <section aria-labelledby="step-resp">
    <QuestionTitle id="step-resp">How honest can you be with yourself?</QuestionTitle>
    <QuestionHelper>
      Disputes rarely have one clean villain. Thinking about your own role now makes the audit
      sharper — and your steelman for the other side better.
    </QuestionHelper>

    <Field label="Do you think you bear any responsibility for how this ended up?">
      <div role="radiogroup" aria-label="Own responsibility" style={{ display: 'flex', flexDirection: 'column', gap: space[2] }}>
        {[
          { value: 'none', label: 'Not at all' },
          { value: 'a_little', label: 'A little' },
          { value: 'partially', label: 'Partially' },
        ].map((opt) => (
          <RadioRow
            key={opt.value}
            selected={form.own_responsibility === opt.value}
            onClick={() => update({ own_responsibility: opt.value })}
            label={opt.label}
          />
        ))}
      </div>
    </Field>

    <Field label="Anything the other side would say you got wrong? (optional)" htmlFor="steelman">
      <Textarea
        id="steelman"
        value={form.steelman_hint}
        onChange={(e) => update({ steelman_hint: e.target.value })}
        placeholder="Whatever they'd throw at you if they had the chance to reply. It makes the audit more realistic."
      />
    </Field>
  </section>
);

export const StepEvidence = ({ evidence, setEvidence }) => (
  <section aria-labelledby="step-evidence">
    <QuestionTitle id="step-evidence">Upload your evidence.</QuestionTitle>
    <QuestionHelper>
      Contracts, emails, invoices, photos, WhatsApp exports, bank statements — anything that
      supports your side. PDF, DOCX, JPG, PNG, TXT. Up to 10 files, 10 MB each.
    </QuestionHelper>

    <EvidenceUploader
      evidence={evidence}
      setEvidence={setEvidence}
      compact
      labelPlaceholder="What does this prove?"
    />

    <p style={{ ...t.caption, marginTop: space[5] }}>
      Evidence is optional but it makes the audit a lot sharper. You can skip this step if you
      genuinely have nothing to upload.
    </p>
  </section>
);

export const StepReview = (props) => <StepSubmit {...props} includePrevious />;
