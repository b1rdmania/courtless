import React from 'react';
import { color, font, radius, space, t } from '../theme.js';

// ----- Label -----

export const Label = ({ children, htmlFor, required }) => (
  <label
    htmlFor={htmlFor}
    style={{
      display: 'block',
      fontFamily: font.body,
      fontSize: '12px',
      color: color.inkMuted,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: space[2],
    }}
  >
    {children}
    {required && <span style={{ color: color.accent }} aria-hidden="true"> *</span>}
  </label>
);

// ----- Field wrapper -----

export const Field = ({ label, htmlFor, required, helper, error, children, style }) => (
  <div style={{ marginBottom: space[6], ...style }}>
    {label && <Label htmlFor={htmlFor} required={required}>{label}</Label>}
    {children}
    {error && (
      <div role="alert" style={{ ...t.caption, color: color.danger, marginTop: space[2] }}>
        {error}
      </div>
    )}
    {!error && helper && (
      <div style={{ ...t.caption, marginTop: space[2] }}>{helper}</div>
    )}
  </div>
);

// ----- Input -----

const baseInputStyle = {
  width: '100%',
  padding: '12px 14px',
  backgroundColor: color.surface,
  color: color.ink,
  border: `1px solid ${color.hairlineStrong}`,
  borderRadius: radius.md,
  fontSize: '15px',
  fontFamily: font.body,
  lineHeight: 1.5,
  transition: 'border-color 120ms ease, box-shadow 120ms ease',
};

export const Input = React.forwardRef(({ id, ariaInvalid, style, ...props }, ref) => (
  <input
    id={id}
    ref={ref}
    aria-invalid={ariaInvalid}
    style={{ ...baseInputStyle, ...style }}
    {...props}
  />
));

export const Textarea = React.forwardRef(({ id, ariaInvalid, style, ...props }, ref) => (
  <textarea
    id={id}
    ref={ref}
    aria-invalid={ariaInvalid}
    style={{
      ...baseInputStyle,
      minHeight: '180px',
      resize: 'vertical',
      lineHeight: 1.6,
      ...style,
    }}
    {...props}
  />
));

export const Select = ({ id, children, style, ...props }) => (
  <select id={id} style={{ ...baseInputStyle, paddingRight: space[7], ...style }} {...props}>
    {children}
  </select>
);

// ----- Char counter -----

export const CharCount = ({ value, min, max, align = 'right' }) => {
  const len = (value || '').trim().length;
  const inRange = (min == null || len >= min) && (max == null || len <= max);
  const tooShort = min != null && len < min;
  return (
    <div
      aria-live="polite"
      style={{
        ...t.caption,
        marginTop: space[2],
        textAlign: align,
        color: inRange ? color.positive : color.inkSubtle,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {len}{max ? ` / ${max.toLocaleString()}` : ''} characters
      {tooShort && ` · ${min - len} more to unlock`}
    </div>
  );
};

// ----- Radio (single line) -----

export const RadioRow = ({ selected, onClick, label, name, value }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onClick}
    style={{
      width: '100%',
      padding: `${space[3]} ${space[4]}`,
      display: 'flex',
      alignItems: 'center',
      gap: space[3],
      backgroundColor: selected ? color.accentSoft : color.surface,
      border: `1px solid ${selected ? color.accentBorder : color.hairline}`,
      borderRadius: radius.md,
      color: color.ink,
      fontSize: '14px',
      fontWeight: 500,
      fontFamily: font.body,
      textAlign: 'left',
      cursor: 'pointer',
      transition: 'background-color 120ms ease, border-color 120ms ease',
    }}
  >
    <span
      aria-hidden="true"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '16px',
        height: '16px',
        borderRadius: '50%',
        border: `1.5px solid ${selected ? color.accent : color.hairlineStrong}`,
        flexShrink: 0,
      }}
    >
      {selected && (
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: color.accent,
          }}
        />
      )}
    </span>
    {label}
  </button>
);

// ----- Radio Card (side-by-side) -----

export const RadioCard = ({ selected, onClick, label }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onClick}
    style={{
      flex: 1,
      padding: `${space[4]} ${space[5]}`,
      backgroundColor: selected ? color.accentSoft : color.surface,
      border: `1px solid ${selected ? color.accentBorder : color.hairline}`,
      borderRadius: radius.md,
      color: color.ink,
      fontSize: '14px',
      fontWeight: 500,
      fontFamily: font.body,
      textAlign: 'left',
      cursor: 'pointer',
    }}
  >
    {label}
  </button>
);

// ----- Checkbox row -----

export const CheckboxRow = ({ checked, onChange, children, id }) => (
  <label
    htmlFor={id}
    style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: space[3],
      cursor: 'pointer',
      padding: `${space[4]} ${space[5]}`,
      backgroundColor: color.surface,
      border: `1px solid ${color.hairline}`,
      borderRadius: radius.md,
    }}
  >
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      style={{
        marginTop: '3px',
        accentColor: color.accent,
        width: '16px',
        height: '16px',
        cursor: 'pointer',
      }}
    />
    <span style={{ ...t.small, color: color.ink, lineHeight: 1.6 }}>{children}</span>
  </label>
);

// ----- Question heading + helper -----

export const QuestionTitle = ({ children, id }) => (
  <h2
    id={id}
    style={{
      ...t.h2,
      fontSize: 'clamp(26px, 3.4vw, 34px)',
      marginBottom: space[3],
    }}
  >
    {children}
  </h2>
);

export const QuestionHelper = ({ children }) => (
  <p style={{ ...t.bodyMuted, marginBottom: space[7], maxWidth: '60ch' }}>{children}</p>
);
