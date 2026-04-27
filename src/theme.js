// Courtless design tokens.
// Editorial / legal-paper aesthetic: warm cream canvas, deep ink, oxblood accent.
// One source of truth — every page consumes these tokens; no inline hex codes.

export const color = {
  // Surfaces
  canvas: '#F4EFE6',
  canvasAlt: '#FBF7F0',
  surface: '#FFFFFF',
  surfaceSunken: '#EFE9DD',

  // Text
  ink: '#1B1815',
  inkMuted: '#5B544A',
  inkSubtle: '#8A8275',
  inkInverse: '#FBF7F0',

  // Lines
  hairline: '#DDD3C0',
  hairlineStrong: '#C9BEA7',

  // Brand accent — oxblood
  accent: '#6B1E1E',
  accentHover: '#4F1414',
  accentSoft: '#F1E0DD',
  accentBorder: '#D9B8B3',

  // Semantic
  positive: '#2C5F4A',
  positiveSoft: '#DEEBE4',
  positiveBorder: '#B5CFC2',

  caution: '#8E5A1C',
  cautionSoft: '#F3E7D2',
  cautionBorder: '#DCC598',

  danger: '#8A2118',
  dangerSoft: '#F1D9D5',
  dangerBorder: '#D9B6B1',

  info: '#1F3A5F',
  infoSoft: '#E0E7F0',
  infoBorder: '#B5C2D5',
};

export const font = {
  display: '"Newsreader", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
  body: '"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
};

// 4px-based spacing scale.
export const space = {
  0: '0',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  7: '32px',
  8: '40px',
  9: '48px',
  10: '64px',
  11: '80px',
  12: '96px',
  13: '128px',
};

export const radius = {
  sm: '4px',
  md: '6px',
  lg: '10px',
  xl: '14px',
  pill: '999px',
};

export const shadow = {
  sm: '0 1px 2px rgba(27, 24, 21, 0.04)',
  md: '0 4px 14px rgba(27, 24, 21, 0.06)',
  lg: '0 12px 40px rgba(27, 24, 21, 0.08)',
  focus: '0 0 0 3px rgba(107, 30, 30, 0.25)',
};

export const breakpoint = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
};

// Typography styles — composable. Use as `style={{ ...t.h1 }}` or similar.
export const t = {
  eyebrow: {
    fontFamily: font.body,
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '1.8px',
    color: color.inkSubtle,
    fontWeight: 600,
  },
  display: {
    fontFamily: font.display,
    fontSize: 'clamp(40px, 6.4vw, 72px)',
    fontWeight: 400,
    lineHeight: 1.05,
    letterSpacing: '-1.4px',
    color: color.ink,
  },
  h1: {
    fontFamily: font.display,
    fontSize: 'clamp(32px, 4.6vw, 48px)',
    fontWeight: 400,
    lineHeight: 1.1,
    letterSpacing: '-0.8px',
    color: color.ink,
  },
  h2: {
    fontFamily: font.display,
    fontSize: 'clamp(24px, 3.2vw, 34px)',
    fontWeight: 400,
    lineHeight: 1.2,
    letterSpacing: '-0.4px',
    color: color.ink,
  },
  h3: {
    fontFamily: font.display,
    fontSize: '22px',
    fontWeight: 500,
    lineHeight: 1.25,
    letterSpacing: '-0.2px',
    color: color.ink,
  },
  lede: {
    fontFamily: font.display,
    fontSize: 'clamp(18px, 1.6vw, 22px)',
    fontWeight: 400,
    lineHeight: 1.5,
    color: color.inkMuted,
    fontStyle: 'italic',
  },
  body: {
    fontFamily: font.body,
    fontSize: '16px',
    lineHeight: 1.65,
    color: color.ink,
  },
  bodyMuted: {
    fontFamily: font.body,
    fontSize: '15px',
    lineHeight: 1.65,
    color: color.inkMuted,
  },
  small: {
    fontFamily: font.body,
    fontSize: '13px',
    lineHeight: 1.5,
    color: color.inkMuted,
  },
  caption: {
    fontFamily: font.body,
    fontSize: '12px',
    lineHeight: 1.5,
    color: color.inkSubtle,
  },
  // Editorial body — for long-form reading on the brief page.
  prose: {
    fontFamily: font.display,
    fontSize: '17px',
    lineHeight: 1.7,
    color: color.ink,
    fontWeight: 400,
  },
};

// Generic focus-visible style for keyboard users.
export const focusRing = {
  outline: 'none',
  boxShadow: shadow.focus,
};
