import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { color, space } from '../theme.js';
import { TopBar, Button } from '../components/ui.jsx';
import {
  ProgressHeader,
  NavButtons,
  LoadingCard,
  ErrorBox,
} from '../intake/Chrome.jsx';
import {
  StepUploadFirst,
  StepReviewPrefill,
  StepOutcome,
  StepHonestTake,
  StepSubmit,
  StepBasicFacts,
  StepDescription,
  StepPrevious,
  StepResponsibility,
  StepEvidence,
  StepReview,
} from '../intake/Steps.jsx';

const API_BASE = import.meta.env.VITE_API_URL || '';

// New flow: 5 visible steps (upload, review pre-fill, outcome, honest take, submit)
// Fallback (manual): 7 visible steps (original flow)
const NEW_TOTAL = 5;
const FALLBACK_TOTAL = 7;

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
  const [mode, setMode] = useState('new');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(initialForm);
  const [evidence, setEvidence] = useState([]);
  const [pendingId, setPendingId] = useState(null);
  const [keyEvidenceSummary, setKeyEvidenceSummary] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [prefilling, setPrefilling] = useState(false);
  const [error, setError] = useState(null);

  const total = mode === 'new' ? NEW_TOTAL : FALLBACK_TOTAL;
  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const switchToManual = () => {
    setMode('manual');
    setStep(1);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const canProceed = () => {
    if (mode === 'new') {
      if (step === 1) return evidence.length > 0;
      if (step === 2) {
        return (
          form.title.trim().length > 2 &&
          form.amount !== '' &&
          form.dispute_description.trim().length >= 200
        );
      }
      if (step === 3) return form.desired_outcome.trim().length >= 20;
      if (step === 4) return !!form.own_responsibility;
      if (step === 5) {
        return (
          form.consent &&
          form.email.trim().length > 3 &&
          form.email.includes('@')
        );
      }
      return true;
    }

    if (step === 1) {
      return (
        form.title.trim().length > 2 &&
        form.amount !== '' &&
        form.email.trim().length > 3 &&
        form.email.includes('@')
      );
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
    if (step === 5) return !!form.own_responsibility;
    if (step === 6) return true;
    if (step === 7) return form.consent;
    return true;
  };

  const runPrefill = async () => {
    setPrefilling(true);
    setError(null);
    try {
      const body = new FormData();
      evidence.forEach((ev) => {
        body.append('files', ev.file);
        body.append('file_types', ev.upload_type);
        body.append('file_labels', ev.label);
      });
      const res = await fetch(`${API_BASE}/api/disputes/prefill`, {
        method: 'POST',
        body,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Pre-fill failed (${res.status}): ${txt || 'unknown error'}`);
      }
      const data = await res.json();
      setPendingId(data.pending_id);
      setKeyEvidenceSummary(data.key_evidence_summary || []);
      update({
        title: data.suggested_title || form.title,
        other_party_name: data.suggested_other_party_name || form.other_party_name,
        amount:
          data.suggested_amount != null
            ? String(data.suggested_amount)
            : form.amount,
        problem_started: data.suggested_problem_started || form.problem_started,
        dispute_description: data.suggested_description || form.dispute_description,
      });
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setPrefilling(false);
    }
  };

  const next = () => {
    if (!canProceed()) return;
    if (mode === 'new' && step === 1) {
      runPrefill();
      return;
    }
    setStep((s) => Math.min(total, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
    setStep((s) => Math.max(1, s - 1));
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

      if (mode === 'new' && pendingId) {
        body.append('pending_id', pendingId);
      } else {
        evidence.forEach((ev) => {
          body.append('files', ev.file);
          body.append('file_types', ev.upload_type);
          body.append('file_labels', ev.label);
        });
      }

      const res = await fetch(`${API_BASE}/api/disputes`, { method: 'POST', body });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Submission failed (${res.status}): ${errText || 'unknown error'}`);
      }
      const data = await res.json();
      if (data.owner_token) {
        try {
          localStorage.setItem(`courtless_token_${data.dispute_id}`, data.owner_token);
        } catch {
          // localStorage may be disabled — the brief page will fall back to a 403.
        }
      }
      navigate(`/brief/${data.dispute_id}`);
    } catch (e) {
      setError(e.message || String(e));
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    if (mode === 'new') {
      switch (step) {
        case 1:
          return (
            <StepUploadFirst
              evidence={evidence}
              setEvidence={setEvidence}
              onSkip={switchToManual}
            />
          );
        case 2:
          return (
            <StepReviewPrefill
              form={form}
              update={update}
              keyEvidenceSummary={keyEvidenceSummary}
            />
          );
        case 3:
          return <StepOutcome form={form} update={update} />;
        case 4:
          return <StepHonestTake form={form} update={update} />;
        case 5:
          return <StepSubmit form={form} update={update} evidence={evidence} />;
        default:
          return null;
      }
    }
    switch (step) {
      case 1:
        return <StepBasicFacts form={form} update={update} />;
      case 2:
        return <StepDescription form={form} update={update} />;
      case 3:
        return <StepOutcome form={form} update={update} />;
      case 4:
        return <StepPrevious form={form} update={update} />;
      case 5:
        return <StepResponsibility form={form} update={update} />;
      case 6:
        return <StepEvidence evidence={evidence} setEvidence={setEvidence} />;
      case 7:
        return <StepReview form={form} update={update} evidence={evidence} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: color.canvas }}>
      <TopBar
        onWordmarkClick={() => navigate('/')}
        rightSlot={
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            Exit
          </Button>
        }
      />
      <main
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          padding: `${space[8]} ${space[6]} ${space[12]}`,
        }}
      >
        <ProgressHeader step={step} total={total} />

        {submitting ? (
          <LoadingCard
            title="Analysing your dispute…"
            body="This takes 60–90 seconds. Don't close the tab. We're reading your evidence, weighing the arguments, and drafting your private brief."
          />
        ) : prefilling ? (
          <LoadingCard
            title="Reading your documents…"
            body="This takes 15–20 seconds. We're extracting the key facts and drafting your intake so you don't have to type it all from scratch."
          />
        ) : (
          <>
            {renderStep()}
            {error && <ErrorBox message={error} />}
            <NavButtons
              step={step}
              total={total}
              canProceed={canProceed()}
              onBack={back}
              onNext={next}
              onSubmit={submit}
              nextLabel={mode === 'new' && step === 1 ? 'Read my documents' : 'Continue'}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default IntakeFlow;
