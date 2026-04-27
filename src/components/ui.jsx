import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { color, font, space, radius, shadow, t } from '../theme.js';

// useMediaQuery — small SSR-safe hook for responsive style decisions.
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
};

// ----- Container -----

export const Container = ({ children, max = '1080px', style }) => (
  <div style={{ maxWidth: max, margin: '0 auto', padding: `0 ${space[6]}`, ...style }}>
    {children}
  </div>
);

// ----- Section -----
// Vertical rhythm + optional alt background. No bordered "card" effect — uses hairlines.

export const Section = ({ children, alt = false, dense = false, style }) => (
  <section
    style={{
      padding: dense
        ? `${space[8]} 0`
        : `clamp(${space[10]}, 9vw, ${space[12]}) 0`,
      backgroundColor: alt ? color.canvasAlt : 'transparent',
      borderTop: `1px solid ${color.hairline}`,
      ...style,
    }}
  >
    {children}
  </section>
);

// ----- Eyebrow -----

export const Eyebrow = ({ children, accent, style }) => (
  <div
    style={{
      ...t.eyebrow,
      color: accent || color.inkSubtle,
      marginBottom: space[3],
      ...style,
    }}
  >
    {children}
  </div>
);

// ----- Button -----

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  iconRight,
  type = 'button',
  ariaLabel,
  fullWidth = false,
  disabled = false,
  style,
}) => {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  const sizes = {
    sm: { padding: '8px 14px', fontSize: '13px' },
    md: { padding: '12px 22px', fontSize: '14px' },
    lg: { padding: '15px 28px', fontSize: '15px' },
  };

  const variants = {
    primary: {
      backgroundColor: hover && !disabled ? color.accentHover : color.accent,
      color: color.inkInverse,
      border: `1px solid ${hover && !disabled ? color.accentHover : color.accent}`,
    },
    secondary: {
      backgroundColor: hover && !disabled ? color.surface : 'transparent',
      color: color.ink,
      border: `1px solid ${color.hairlineStrong}`,
    },
    ghost: {
      backgroundColor: hover && !disabled ? color.surfaceSunken : 'transparent',
      color: color.ink,
      border: '1px solid transparent',
    },
    link: {
      backgroundColor: 'transparent',
      color: color.accent,
      border: 'none',
      padding: 0,
      textDecoration: 'underline',
      textDecorationColor: color.accentBorder,
      textUnderlineOffset: '4px',
    },
  };

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: space[2],
        fontFamily: font.body,
        fontWeight: 600,
        letterSpacing: '0.1px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        borderRadius: radius.md,
        transition: 'background-color 120ms ease, transform 120ms ease, box-shadow 120ms ease',
        transform: hover && !disabled ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: focus ? shadow.focus : 'none',
        width: fullWidth ? '100%' : 'auto',
        ...sizes[size],
        ...variants[variant],
        ...style,
      }}
    >
      {children}
      {iconRight && (
        <ArrowRight size={variant === 'link' ? 12 : 14} />
      )}
    </button>
  );
};

// ----- Card -----
// Simple paper-like card. Subtle hairline border, no heavy shadow.

export const Card = ({
  children,
  accent,
  flush = false,
  interactive = false,
  onClick,
  ariaLabel,
  style,
}) => {
  const [hover, setHover] = useState(false);
  const Comp = interactive ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => setHover(false) : undefined}
      style={{
        backgroundColor: color.surface,
        border: `1px solid ${accent || color.hairline}`,
        borderTop: accent ? `3px solid ${accent}` : `1px solid ${color.hairline}`,
        borderRadius: radius.lg,
        padding: flush ? 0 : `${space[6]} ${space[6]}`,
        textAlign: 'left',
        font: 'inherit',
        color: 'inherit',
        cursor: interactive ? 'pointer' : 'default',
        transition: 'box-shadow 150ms ease, transform 150ms ease',
        boxShadow: interactive && hover ? shadow.md : shadow.sm,
        transform: interactive && hover ? 'translateY(-2px)' : 'translateY(0)',
        width: '100%',
        display: 'block',
        ...style,
      }}
    >
      {children}
    </Comp>
  );
};

// ----- Note (callout) -----

export const Note = ({ children, tone = 'info', title, style }) => {
  const tones = {
    info: { bg: color.infoSoft, border: color.infoBorder, ink: color.info },
    accent: { bg: color.accentSoft, border: color.accentBorder, ink: color.accent },
    positive: { bg: color.positiveSoft, border: color.positiveBorder, ink: color.positive },
    caution: { bg: color.cautionSoft, border: color.cautionBorder, ink: color.caution },
    danger: { bg: color.dangerSoft, border: color.dangerBorder, ink: color.danger },
  };
  const tt = tones[tone] || tones.info;
  return (
    <div
      style={{
        backgroundColor: tt.bg,
        border: `1px solid ${tt.border}`,
        borderLeft: `3px solid ${tt.ink}`,
        borderRadius: radius.md,
        padding: `${space[4]} ${space[5]}`,
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            ...t.eyebrow,
            color: tt.ink,
            marginBottom: space[2],
          }}
        >
          {title}
        </div>
      )}
      <div style={{ ...t.body, color: color.ink, fontSize: '14px', lineHeight: 1.6 }}>
        {children}
      </div>
    </div>
  );
};

// ----- TopBar -----

export const TopBar = ({ rightSlot, onWordmarkClick }) => (
  <header
    style={{
      position: 'sticky',
      top: 0,
      zIndex: 30,
      backgroundColor: 'rgba(244, 239, 230, 0.9)',
      backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${color.hairline}`,
    }}
  >
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${space[3]} ${space[6]}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: space[4],
      }}
    >
      <Wordmark onClick={onWordmarkClick} />
      <div style={{ display: 'flex', alignItems: 'center', gap: space[3] }}>
        {rightSlot}
      </div>
    </div>
  </header>
);

// ----- Wordmark -----

export const Wordmark = ({ onClick, size = 'md' }) => {
  const sizes = {
    sm: { primary: '13px', secondary: '11px' },
    md: { primary: '16px', secondary: '12px' },
    lg: { primary: '20px', secondary: '13px' },
  };
  const s = sizes[size];
  const Comp = onClick ? 'button' : 'div';
  const showTagline = useMediaQuery('(min-width: 720px)');
  return (
    <Comp
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: onClick ? 'pointer' : 'default',
        display: 'inline-flex',
        alignItems: 'baseline',
        gap: space[3],
        color: color.ink,
        fontFamily: font.body,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          fontFamily: font.display,
          fontWeight: 500,
          fontStyle: 'italic',
          letterSpacing: '-0.2px',
          fontSize: s.primary,
          color: color.ink,
        }}
      >
        Courtless
      </span>
      {showTagline && (
        <span
          style={{
            fontSize: s.secondary,
            color: color.inkSubtle,
            fontWeight: 500,
            letterSpacing: '0.4px',
            textTransform: 'uppercase',
          }}
        >
          Disputes Without Courts
        </span>
      )}
    </Comp>
  );
};

// ----- Footer -----

export const Footer = () => (
  <footer
    style={{
      borderTop: `1px solid ${color.hairline}`,
      backgroundColor: color.canvasAlt,
      padding: `${space[7]} ${space[6]}`,
    }}
  >
    <div
      style={{
        maxWidth: '1080px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: space[4],
      }}
    >
      <div style={t.caption}>
        © Courtless · UK only · Not legal advice
      </div>
      <div style={{ display: 'flex', gap: space[6] }}>
        <a href="#terms" style={{ ...t.caption, color: color.inkMuted, textDecoration: 'none' }}>Terms</a>
        <a href="#privacy" style={{ ...t.caption, color: color.inkMuted, textDecoration: 'none' }}>Privacy</a>
        <a href="#about" style={{ ...t.caption, color: color.inkMuted, textDecoration: 'none' }}>About</a>
      </div>
    </div>
  </footer>
);

// ----- Icon: arrow right -----

export const ArrowRight = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ----- Icon: check -----

export const Check = ({ size = 14, color: c = color.positive }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={c}
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ----- BackToTop helper used in long pages -----

export const HomeLink = () => {
  const navigate = useNavigate();
  return (
    <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
      ← Home
    </Button>
  );
};
