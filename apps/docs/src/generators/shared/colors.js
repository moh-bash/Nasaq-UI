/*
  Colour resolution shared by the CSS and Tailwind generators.

  A component colour is either an explicit `#hex` override or `null`, in which
  case it inherits a variant-derived theme token. Inherited colours are emitted
  as `var(--color-token, <resolved-fallback>)` so the exported file also works
  standalone, before any theme stylesheet loads.
*/

import { VARIANT_TOKENS } from '../../config/buttonDefaults.js';

export const THEME_TOKEN_DEFAULTS = {
  primary: '#1e3ae0',
  'on-primary': '#ffffff',
  secondary: '#0e4f45',
  'on-secondary': '#ffffff',
  accent: '#e8461e',
  background: '#edefec',
  surface: '#ffffff',
  text: '#14161a',
  'text-muted': '#5c635e',
  border: '#d6d9d4',
  hover: '#f1f3ef',
  active: '#ecf0ff',
  success: '#177243',
  warning: '#8a5900',
  danger: '#c42b1c',
  'on-danger': '#ffffff',
  focus: '#1e3ae0',
};

/** `var(--color-token, fallback)` for a theme token key. */
export function themeRef(token, theme = {}) {
  const fallback = theme[token] || THEME_TOKEN_DEFAULTS[token] || '#14161a';
  return `var(--color-${token}, ${fallback})`;
}

/** Mix a colour toward black (used for resting hover states). */
export function darken(color, percent = 88) {
  return `color-mix(in srgb, ${color} ${percent}%, #000)`;
}

function tokenValue(token, theme) {
  if (token === 'WHITE') return '#ffffff';
  if (token === 'TRANSPARENT' || token == null) return 'transparent';
  return themeRef(token, theme);
}

/** The bare theme-token key a variant maps to (or a literal marker). */
export function variantToken(variant, prop) {
  const tokens = VARIANT_TOKENS[variant] || VARIANT_TOKENS.primary;
  return tokens[prop];
}

/**
 * The four colours a given variant paints, respecting the configured overrides
 * for the active variant only (so the exported component stays reusable).
 * Returns CSS values (hex, `transparent`, or `var(--color-token, fallback)`).
 */
export function buttonVariantVars(config, variant, theme = {}) {
  const isActive = variant === config.variant;
  const pick = (prop) => {
    if (isActive) {
      const override = config.colors?.[prop];
      if (typeof override === 'string') return override;
    }
    return tokenValue(variantToken(variant, prop), theme);
  };

  const background = pick('background');
  const hoverOverride = isActive ? config.colors?.hoverBackground : null;
  const hoverBackground =
    typeof hoverOverride === 'string'
      ? hoverOverride
      : background === 'transparent'
        ? themeRef('hover', theme)
        : darken(background);

  return { background, text: pick('text'), border: pick('border'), hoverBackground };
}
