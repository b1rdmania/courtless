import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const fontFamily = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
const serif = 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif';

const TOTAL_STEPS = 7;

const ACCEPTED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.jpg', '.jpeg', '.png', '.txt'];
const ACCEPTED_MIME = 'application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,image/jpeg,image/png,text/plain';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 10;

const EVIDENCE_TYPES = [
  { value: 'contract', label: 'Contract' },
  { value: 'email', label: 'Email' },
  { value: 'invoice', label: 'Invoice' },
  { value: 'photo', label: 'Photo' },
  { value: 'message_thread', label: 'Message thread' },
  { value: 'bank_statement', label: 'Bank statement' },
  { value: 'other', label: 'Other' },
];

const initialForm = {
  title: '',
  problem_started: '',
  other_party_name: '',
  amount: '',
  email: '',
  dispute_description: '',
  desired_outcome: '',
  previous_attempts_radio: 'no',
  previous_attempts: '',
  own_responsibility: 'none',
  steelman_hint: '',
  consent: false,
};

const IntakeFlow = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [evidence, setEvidence] = useState([]); // {file, upload_type, label, id}
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const update = (patch) => setForm(f => ({ ...f, ...patch }));

  const canProceed = () => {
    if (step === 1) {
      return form.title.trim().length > 2
        && form.amount !== ''
        && form.email.trim().length > 3
        && form.email.includes('@');
    }
    if (step === 2) {
      const len = form.dispute_description.trim().length;
      return len >= 500 && len <= 5000;
    }
    if (step === 3) {
      const len = form.desired_outcome.trim().length;
      return len >= 100 && len <= 2000;
    }
    if (step === 4) {
      if (form.previous_attempts_radio === 'yes') {
        return form.previous_attempts.trim().length > 0;
      }
      return true;
    }
    if (step === 5) {
      return !!form.own_responsibility;
    }
    if (step === 6) {
      return true;
    }
    if (step === 7) {
      return form.consent;
    }
    return true;
  };

  const next = () => {
    if (!canProceed()) return;
    setStep(s => Math.min(TOTAL_STEPS, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setStep(s => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);

    try {
      const body = new FormData();
      body.append('title', form.title);
      body.append('amount', form.amount || '0');
      body.append('other_party_name', form.other_party_name || '');
      body.append('problem_started', form.problem_started || '');
      body.append('dispute_description', form.dispute_description);
      body.append('desired_outcome', form.desired_outcome || '');
      body.append(
        'previous_attempts',
        form.previous_attempts_radio === 'yes' ? form.previous_attempts : '',
      );
      body.append('own_responsibility', form.own_responsibility);
      body.append('steelman_hint', form.steelman_hint || '');
      body.append('email', form.email || '');

      evidence.forEach(ev => {
        body.append('files', ev.file);
        body.append('file_types', ev.upload_type);
        body.append('file_labels', ev.label);
      });

      const res = await fetch('/api/disputes', {
        method: 'POST',
        body,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Submission failed (${res.status}): ${errText || 'unknown error'}`);
      }
      const data = await res.json();
      navigate(`/brief/${data.dispute_id}`);
    } catch (e) {
      setError(e.message || String(e));
      setSubmitting(false);
    }
  };

  return (
    <div style={shellStyle}>
      <TopBar onExit={() => navigate('/')} />
      <div style={containerStyle}>
        <ProgressHeader step={step} total={TOTAL_STEPS} />

        {submitting ? (
          <LoadingCard />
        ) : (
          <>
            {step === 1 && <StepBasicFacts form={form} update={update} />}
            {step === 2 && <StepDescription form={form} update={update} />}
            {step === 3 && <StepOutcome form={form} update={update} />}
            {step === 4 && <StepPrevious form={form} update={update} />}
            {step === 5 && <StepResponsibility form={form} update={update} />}
            {step === 6 && (
              <StepEvidence
                evidence={evidence}
                setEvidence={setEvidence}
              />
            )}
            {step === 7 && (
              <StepReview form={form} evidence={evidence} update={update} />
            )}

            {error && (
              <div style={errorBoxStyle}>
                {error}
              </div>
            )}

            <NavButtons
              step={step}
              total={TOTAL_STEPS}
              canProceed={canProceed()}
              onBack={back}
              onNext={next}
              onSubmit={submit}
            />
          </>
        )}
      </div>
    </div>
  );
};

// ------------------- styles -------------------

const shellStyle = {
  backgroundColor: '#0F0F10',
  color: '#EBEBF5',
  fontFamily,
  WebkitFontSmoothing: 'antialiased',
  minHeight: '100vh',
  width: '100vw',
};

const containerStyle = {
  maxWidth: '720px',
  margin: '0 auto',
  padding: '32px 28px 80px',
};

const errorBoxStyle = {
  marginTop: '24px',
  padding: '14px 18px',
  backgroundColor: 'rgba(255, 69, 58, 0.06)',
  border: '1px solid rgba(255, 69, 58, 0.25)',
  color: '#FF6B5C',
  borderRadius: '8px',
  fontSize: '13px',
  lineHeight: 1.5,
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: 'rgba(235, 235, 245, 0.55)',
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '8px',
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  backgroundColor: '#1A1A1C',
  color: '#EBEBF5',
  border: '1px solid #38383A',
  borderRadius: '8px',
  fontSize: '15px',
  fontFamily,
  lineHeight: 1.5,
};

const textareaStyle = {
  ...inputStyle,
  minHeight: '180px',
  resize: 'vertical',
  lineHeight: 1.6,
};

const questionTitle = {
  fontFamily: serif,
  fontSize: 'clamp(24px, 3.2vw, 32px)',
  fontWeight: 500,
  letterSpacing: '-0.5px',
  color: '#EBEBF5',
  lineHeight: 1.2,
  marginBottom: '12px',
};

const questionHelper = {
  fontSize: '14px',
  color: 'rgba(235, 235, 245, 0.6)',
  lineHeight: 1.6,
  marginBottom: '28px',
};

// ------------------- components -------------------

const TopBar = ({ onExit }) => (
  <div style={{
    position: 'sticky', top: 0, zIndex: 20,
    backgroundColor: 'rgba(15, 15, 16, 0.9)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(235, 235, 245, 0.06)',
    padding: '14px 28px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  }}>
    <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.3px' }}>
      COURTLESS{' '}
      <span style={{ color: 'rgba(235, 235, 245, 0.5)', fontWeight: 400 }}>
        Disputes Without Courts
      </span>
    </div>
    <button
      onClick={onExit}
      style={{
        fontSize: '12px', color: 'rgba(235, 235, 245, 0.55)',
        background: 'none', border: 'none', cursor: 'pointer', fontFamily,
      }}
    >
      Exit
    </button>
  </div>
);

const ProgressHeader = ({ step, total }) => {
  const pct = (step / total) * 100;
  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase',
        color: 'rgba(235, 235, 245, 0.5)', fontWeight: 600, marginBottom: '10px',
      }}>
        <span>Step {step} of {total}</span>
        <span>Audit intake</span>
      </div>
      <div style={{
        height: '3px', backgroundColor: 'rgba(235, 235, 245, 0.08)', borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${pct}%`, height: '100%', backgroundColor: '#0A84FF',
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
};

const NavButtons = ({ step, total, canProceed, onBack, onNext, onSubmit }) => {
  const isLast = step === total;
  return (
    <div style={{ marginTop: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <button
        onClick={onBack}
        disabled={step === 1}
        style={{
          padding: '10px 18px', borderRadius: '8px',
          backgroundColor: 'transparent',
          border: '1px solid rgba(235, 235, 245, 0.12)',
          color: step === 1 ? 'rgba(235, 235, 245, 0.25)' : 'rgba(235, 235, 245, 0.75)',
          fontSize: '13px', fontWeight: 500, fontFamily,
          cursor: step === 1 ? 'default' : 'pointer',
        }}
      >
        ← Back
      </button>

      {isLast ? (
        <button
          onClick={onSubmit}
          disabled={!canProceed}
          style={{
            padding: '12px 24px', borderRadius: '8px',
            backgroundColor: canProceed ? '#0A84FF' : 'rgba(10, 132, 255, 0.3)',
            color: 'white', border: 'none',
            fontSize: '14px', fontWeight: 600, fontFamily,
            cursor: canProceed ? 'pointer' : 'not-allowed',
          }}
        >
          Run my audit →
        </button>
      ) : (
        <button
          onClick={onNext}
          disabled={!canProceed}
          style={{
            padding: '12px 24px', borderRadius: '8px',
            backgroundColor: canProceed ? '#0A84FF' : 'rgba(10, 132, 255, 0.3)',
            color: 'white', border: 'none',
            fontSize: '14px', fontWeight: 600, fontFamily,
            cursor: canProceed ? 'pointer' : 'not-allowed',
          }}
        >
          Continue →
        </button>
      )}
    </div>
  );
};

// ---- Step 1: basic facts ----
const StepBasicFacts = ({ form, update }) => (
  <div>
    <h2 style={questionTitle}>Let's start with the basics.</h2>
    <p style={questionHelper}>
      A few quick facts so we know what we're dealing with. You can be vague about names if you want.
    </p>

    <div style={{ marginBottom: '24px' }}>
      <label style={labelStyle}>What's this dispute about?</label>
      <input
        type="text"
        value={form.title}
        onChange={e => update({ title: e.target.value })}
        placeholder="e.g. Landlord withholding my deposit"
        style={inputStyle}
      />
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
      <div>
        <label style={labelStyle}>When did the problem start?</label>
        <input
          type="date"
          value={form.problem_started}
          onChange={e => update({ problem_started: e.target.value })}
          style={inputStyle}
        />
      </div>
      <div>
        <label style={labelStyle}>Rough amount in dispute (£)</label>
        <input
          type="number"
          min="0"
          step="1"
          value={form.amount}
          onChange={e => update({ amount: e.target.value })}
          placeholder="e.g. 1800"
          style={inputStyle}
        />
      </div>
    </div>

    <div style={{ marginBottom: '24px' }}>
      <label style={labelStyle}>Other party's name (optional)</label>
      <input
        type="text"
        value={form.other_party_name}
        onChange={e => update({ other_party_name: e.target.value })}
        placeholder='e.g. "My former landlord" or "Acme Ltd"'
        style={inputStyle}
      />
    </div>

    <div>
      <label style={labelStyle}>Your email</label>
      <input
        type="email"
        value={form.email}
        onChange={e => update({ email: e.target.value })}
        placeholder="you@example.com"
        style={inputStyle}
      />
      <div style={{ fontSize: '12px', color: 'rgba(235, 235, 245, 0.4)', marginTop: '6px' }}>
        We'll email the brief so you can come back to it.
      </div>
    </div>
  </div>
);

// ---- Step 2: description ----
const StepDescription = ({ form, update }) => {
  const len = form.dispute_description.trim().length;
  const inRange = len >= 500 && len <= 5000;
  return (
    <div>
      <h2 style={questionTitle}>In your own words, what happened?</h2>
      <p style={questionHelper}>
        Be specific. Dates, names, what was said, what was agreed. The more detail, the better the audit.
        Aim for 500–5,000 characters.
      </p>
      <textarea
        value={form.dispute_description}
        onChange={e => update({ dispute_description: e.target.value })}
        placeholder="Walk us through it from start to finish. Don't worry about being tidy — just get it all down."
        style={{ ...textareaStyle, minHeight: '280px' }}
      />
      <div style={{
        fontSize: '12px', color: inRange ? '#32D74B' : 'rgba(235, 235, 245, 0.45)',
        marginTop: '8px', textAlign: 'right',
      }}>
        {len} / 5,000 {len < 500 && `· ${500 - len} more to unlock`}
      </div>
    </div>
  );
};

// ---- Step 3: outcome ----
const StepOutcome = ({ form, update }) => {
  const len = form.desired_outcome.trim().length;
  const inRange = len >= 100 && len <= 2000;
  return (
    <div>
      <h2 style={questionTitle}>What does a good outcome look like for you?</h2>
      <p style={questionHelper}>
        Full amount back? A partial refund and an apology? A specific action they need to take?
        Knowing what you actually want sharpens the whole audit.
      </p>
      <textarea
        value={form.desired_outcome}
        onChange={e => update({ desired_outcome: e.target.value })}
        placeholder="e.g. Full £1,800 deposit returned, plus interest. Or: a written apology and £500 towards the damage."
        style={textareaStyle}
      />
      <div style={{
        fontSize: '12px', color: inRange ? '#32D74B' : 'rgba(235, 235, 245, 0.45)',
        marginTop: '8px', textAlign: 'right',
      }}>
        {len} / 2,000 {len < 100 && `· ${100 - len} more to unlock`}
      </div>
    </div>
  );
};

// ---- Step 4: previous attempts ----
const StepPrevious = ({ form, update }) => (
  <div>
    <h2 style={questionTitle}>Have you tried to resolve this already?</h2>
    <p style={questionHelper}>
      Emails, phone calls, letters, formal complaints — anything counts.
    </p>

    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
      {[
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No, not yet' },
      ].map(opt => (
        <RadioCard
          key={opt.value}
          selected={form.previous_attempts_radio === opt.value}
          onClick={() => update({ previous_attempts_radio: opt.value })}
          label={opt.label}
        />
      ))}
    </div>

    {form.previous_attempts_radio === 'yes' && (
      <div>
        <label style={labelStyle}>What did you try — and what happened?</label>
        <textarea
          value={form.previous_attempts}
          onChange={e => update({ previous_attempts: e.target.value })}
          placeholder="e.g. I sent a follow-up email on 14 Feb asking for the deposit back. They replied saying they were keeping it for 'cleaning costs' but never sent receipts."
          style={textareaStyle}
        />
      </div>
    )}
  </div>
);

// ---- Step 5: responsibility ----
const StepResponsibility = ({ form, update }) => (
  <div>
    <h2 style={questionTitle}>How honest can you be with yourself?</h2>
    <p style={questionHelper}>
      Disputes rarely have one clean villain. Thinking about your own role now makes the audit sharper —
      and your steelman for the other side better.
    </p>

    <div style={{ marginBottom: '28px' }}>
      <div style={labelStyle}>Do you think you bear any responsibility for how this ended up?</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[
          { value: 'none', label: 'Not at all' },
          { value: 'a_little', label: 'A little' },
          { value: 'partially', label: 'Partially' },
        ].map(opt => (
          <RadioRow
            key={opt.value}
            selected={form.own_responsibility === opt.value}
            onClick={() => update({ own_responsibility: opt.value })}
            label={opt.label}
          />
        ))}
      </div>
    </div>

    <div>
      <label style={labelStyle}>Anything the other side would say you got wrong? (optional)</label>
      <textarea
        value={form.steelman_hint}
        onChange={e => update({ steelman_hint: e.target.value })}
        placeholder="Whatever they'd throw at you if they had the chance to reply. It makes the audit more realistic."
        style={textareaStyle}
      />
    </div>
  </div>
);

// ---- Step 6: evidence ----
const StepEvidence = ({ evidence, setEvidence }) => {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const addFiles = (fileList) => {
    const files = Array.from(fileList || []);
    const toAdd = [];
    for (const f of files) {
      if (evidence.length + toAdd.length >= MAX_FILES) break;
      if (f.size > MAX_FILE_SIZE) continue;
      const ext = '.' + (f.name.split('.').pop() || '').toLowerCase();
      if (!ACCEPTED_EXTENSIONS.includes(ext)) continue;
      toAdd.push({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file: f,
        upload_type: 'other',
        label: '',
      });
    }
    if (toAdd.length) setEvidence([...evidence, ...toAdd]);
  };

  const removeAt = (id) => setEvidence(evidence.filter(e => e.id !== id));
  const updateAt = (id, patch) =>
    setEvidence(evidence.map(e => (e.id === id ? { ...e, ...patch } : e)));

  return (
    <div>
      <h2 style={questionTitle}>Upload your evidence.</h2>
      <p style={questionHelper}>
        Contracts, emails, invoices, photos, WhatsApp exports, bank statements — anything that supports your side.
        PDF, DOCX, JPG, PNG, TXT. Up to 10 files, 10 MB each.
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current && inputRef.current.click()}
        style={{
          border: `1.5px dashed ${dragOver ? '#0A84FF' : '#38383A'}`,
          borderRadius: '10px',
          padding: '36px 24px',
          textAlign: 'center',
          backgroundColor: dragOver ? 'rgba(10, 132, 255, 0.05)' : '#141416',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
      >
        <div style={{ fontSize: '14px', color: '#EBEBF5', fontWeight: 500, marginBottom: '6px' }}>
          Drag and drop, or click to choose
        </div>
        <div style={{ fontSize: '12px', color: 'rgba(235, 235, 245, 0.5)' }}>
          PDF · DOCX · JPG · PNG · TXT · max 10 MB each · max {MAX_FILES} files
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_MIME}
          onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }}
          style={{ display: 'none' }}
        />
      </div>

      {evidence.length > 0 && (
        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {evidence.map(ev => (
            <div
              key={ev.id}
              style={{
                padding: '14px 16px', backgroundColor: '#1A1A1C',
                border: '1px solid rgba(235, 235, 245, 0.06)',
                borderRadius: '10px',
                display: 'grid', gridTemplateColumns: '1fr 160px auto',
                gap: '12px', alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 500, marginBottom: '8px', wordBreak: 'break-word' }}>
                  {ev.file.name}
                  <span style={{ color: 'rgba(235, 235, 245, 0.4)', fontWeight: 400, marginLeft: '8px', fontSize: '11px' }}>
                    {(ev.file.size / 1024).toFixed(0)} KB
                  </span>
                </div>
                <input
                  type="text"
                  value={ev.label}
                  onChange={(e) => updateAt(ev.id, { label: e.target.value })}
                  placeholder="What does this prove?"
                  style={{
                    ...inputStyle, padding: '8px 10px', fontSize: '12px',
                    backgroundColor: '#141416',
                  }}
                />
              </div>
              <select
                value={ev.upload_type}
                onChange={(e) => updateAt(ev.id, { upload_type: e.target.value })}
                style={{
                  ...inputStyle, padding: '8px 10px', fontSize: '12px',
                  backgroundColor: '#141416',
                }}
              >
                {EVIDENCE_TYPES.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <button
                onClick={() => removeAt(ev.id)}
                style={{
                  fontSize: '12px', color: 'rgba(255, 107, 92, 0.9)',
                  background: 'none', border: '1px solid rgba(255, 107, 92, 0.3)',
                  padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', fontFamily,
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', fontSize: '12px', color: 'rgba(235, 235, 245, 0.5)' }}>
        Evidence is optional but it makes the audit a lot sharper. You can skip this step if you genuinely have nothing to upload.
      </div>
    </div>
  );
};

// ---- Step 7: review + consent ----
const StepReview = ({ form, evidence, update }) => (
  <div>
    <h2 style={questionTitle}>Ready to run your audit?</h2>
    <p style={questionHelper}>
      Here's what you're about to submit. This takes about 60–90 seconds to analyse.
    </p>

    <div style={{
      backgroundColor: '#1A1A1C',
      border: '1px solid rgba(235, 235, 245, 0.06)',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
    }}>
      <SummaryRow label="Dispute" value={form.title || '—'} />
      <SummaryRow label="Amount" value={form.amount ? `£${Number(form.amount).toLocaleString()}` : '—'} />
      <SummaryRow label="Other party" value={form.other_party_name || 'Not named'} />
      <SummaryRow label="When it started" value={form.problem_started || '—'} />
      <SummaryRow label="Your side" value={`${form.dispute_description.trim().length} characters`} />
      <SummaryRow label="Desired outcome" value={`${form.desired_outcome.trim().length} characters`} />
      <SummaryRow
        label="Previous attempts"
        value={form.previous_attempts_radio === 'yes' ? 'Yes — described' : 'No'}
      />
      <SummaryRow
        label="Own responsibility"
        value={
          form.own_responsibility === 'none' ? 'Not at all'
            : form.own_responsibility === 'a_little' ? 'A little'
              : 'Partially'
        }
      />
      <SummaryRow
        label="Evidence"
        value={evidence.length === 0 ? 'None uploaded' : `${evidence.length} file${evidence.length === 1 ? '' : 's'}`}
        last
      />
    </div>

    <label style={{
      display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
      padding: '16px 18px', backgroundColor: '#141416',
      border: '1px solid rgba(235, 235, 245, 0.08)', borderRadius: '10px',
    }}>
      <input
        type="checkbox"
        checked={form.consent}
        onChange={(e) => update({ consent: e.target.checked })}
        style={{ marginTop: '3px', accentColor: '#0A84FF', width: '16px', height: '16px' }}
      />
      <span style={{ fontSize: '13px', color: 'rgba(235, 235, 245, 0.75)', lineHeight: 1.6 }}>
        I understand this is an informational audit, not legal advice. I consent to Courtless
        analysing the evidence I've provided.
      </span>
    </label>
  </div>
);

const SummaryRow = ({ label, value, last }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '160px 1fr',
    padding: '10px 0',
    borderBottom: last ? 'none' : '1px solid rgba(235, 235, 245, 0.05)',
    fontSize: '13px',
    gap: '12px',
  }}>
    <div style={{
      color: 'rgba(235, 235, 245, 0.5)',
      textTransform: 'uppercase', letterSpacing: '0.8px',
      fontSize: '11px', fontWeight: 600, paddingTop: '2px',
    }}>
      {label}
    </div>
    <div style={{ color: '#EBEBF5', wordBreak: 'break-word' }}>{value}</div>
  </div>
);

const RadioCard = ({ selected, onClick, label }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      padding: '14px 18px',
      backgroundColor: selected ? 'rgba(10, 132, 255, 0.1)' : '#1A1A1C',
      border: `1px solid ${selected ? '#0A84FF' : '#38383A'}`,
      borderRadius: '8px', color: '#EBEBF5',
      fontSize: '14px', fontWeight: 500, fontFamily, textAlign: 'left',
      cursor: 'pointer',
    }}
  >
    {label}
  </button>
);

const RadioRow = ({ selected, onClick, label }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      padding: '12px 16px',
      display: 'flex', alignItems: 'center', gap: '12px',
      backgroundColor: selected ? 'rgba(10, 132, 255, 0.08)' : '#1A1A1C',
      border: `1px solid ${selected ? '#0A84FF' : '#38383A'}`,
      borderRadius: '8px', color: '#EBEBF5',
      fontSize: '14px', fontWeight: 500, fontFamily, textAlign: 'left',
      cursor: 'pointer',
    }}
  >
    <span style={{
      display: 'inline-block', width: '14px', height: '14px', borderRadius: '50%',
      border: `1.5px solid ${selected ? '#0A84FF' : '#555'}`,
      position: 'relative', flexShrink: 0,
    }}>
      {selected && (
        <span style={{
          position: 'absolute', top: '2px', left: '2px',
          width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0A84FF',
        }} />
      )}
    </span>
    {label}
  </button>
);

const LoadingCard = () => (
  <div style={{
    padding: '64px 32px', textAlign: 'center',
    backgroundColor: '#1A1A1C',
    border: '1px solid rgba(235, 235, 245, 0.06)',
    borderRadius: '14px', marginTop: '20px',
  }}>
    <div style={{
      width: '32px', height: '32px', margin: '0 auto 24px',
      border: '2px solid rgba(235, 235, 245, 0.1)',
      borderTopColor: '#0A84FF',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    }} />
    <div style={{
      fontFamily: serif, fontSize: '22px', fontWeight: 500,
      color: '#EBEBF5', marginBottom: '10px', letterSpacing: '-0.3px',
    }}>
      Analysing your dispute…
    </div>
    <div style={{ fontSize: '13px', color: 'rgba(235, 235, 245, 0.6)', lineHeight: 1.6 }}>
      This takes 60–90 seconds. Don't close the tab.<br />
      We're reading your evidence, weighing the arguments, and drafting your private brief.
    </div>
  </div>
);

export default IntakeFlow;
