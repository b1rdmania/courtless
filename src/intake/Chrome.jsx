import React from 'react';
import { color, font, radius, space, t } from '../theme.js';
import { Button } from '../components/ui.jsx';

// ----- ProgressHeader -----

export const ProgressHeader = ({ step, total, label = 'Audit intake' }) => {
  const pct = (step / total) * 100;
  return (
    <div style={{ marginBottom: space[8] }} aria-live="polite">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          ...t.eyebrow,
          marginBottom: space[3],
        }}
      >
        <span>
          Step {step} of {total}
        </span>
        <span>{label}</span>
      </div>
      <div
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={total}
        style={{
          height: '3px',
          backgroundColor: color.hairline,
          borderRadius: radius.sm,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            backgroundColor: color.accent,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};

// ----- NavButtons -----

export const NavButtons = ({ step, total, canProceed, onBack, onNext, onSubmit, nextLabel }) => {
  const isLast = step === total;
  return (
    <div
      style={{
        marginTop: space[8],
        paddingTop: space[6],
        borderTop: `1px solid ${color.hairline}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: space[3],
        flexWrap: 'wrap',
      }}
    >
      <Button variant="secondary" size="md" onClick={onBack} disabled={step === 1}>
        ← Back
      </Button>
      {isLast ? (
        <Button variant="primary" size="md" iconRight onClick={onSubmit} disabled={!canProceed}>
          Run my audit
        </Button>
      ) : (
        <Button variant="primary" size="md" iconRight onClick={onNext} disabled={!canProceed}>
          {nextLabel || 'Continue'}
        </Button>
      )}
    </div>
  );
};

// ----- LoadingCard -----

export const LoadingCard = ({ title, body }) => (
  <div
    role="status"
    aria-live="polite"
    style={{
      padding: `${space[10]} ${space[7]}`,
      textAlign: 'center',
      backgroundColor: color.surface,
      border: `1px solid ${color.hairline}`,
      borderRadius: radius.lg,
    }}
  >
    <div
      aria-hidden="true"
      style={{
        width: '36px',
        height: '36px',
        margin: `0 auto ${space[6]}`,
        border: `2px solid ${color.hairlineStrong}`,
        borderTopColor: color.accent,
        borderRadius: '50%',
        animation: 'spin 0.9s linear infinite',
      }}
    />
    <div
      style={{
        fontFamily: font.display,
        fontSize: '24px',
        fontWeight: 500,
        color: color.ink,
        marginBottom: space[3],
        letterSpacing: '-0.3px',
      }}
    >
      {title}
    </div>
    <div style={{ ...t.bodyMuted, maxWidth: '50ch', margin: '0 auto' }}>{body}</div>
  </div>
);

// ----- ErrorBox -----

export const ErrorBox = ({ message }) => (
  <div
    role="alert"
    style={{
      marginTop: space[6],
      padding: `${space[4]} ${space[5]}`,
      backgroundColor: color.dangerSoft,
      border: `1px solid ${color.dangerBorder}`,
      borderLeft: `3px solid ${color.danger}`,
      color: color.ink,
      borderRadius: radius.md,
      ...t.small,
    }}
  >
    <strong style={{ color: color.danger }}>Something went wrong.</strong> {message}
  </div>
);
