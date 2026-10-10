/*
  Design-token metadata for the library theme.

  The token list lives here (rather than in the theme module) so the generators,
  the registry, the docs pages and the theme editor can all describe the same
  palette without importing each other's runtime code. `theme/themeDefaults.js`
  re-exports THEME_TOKENS from this file for backwards compatibility.

  Every token maps to a CSS custom property `--color-<key>` on :root, which is
  what generated component CSS references (with the resolved value as fallback).
*/

export const THEME_TOKENS = [
  { key: 'primary', label: 'Primary', role: 'Brand actions, links, focus' },
  { key: 'secondary', label: 'Secondary', role: 'Alternate brand surface' },
  { key: 'accent', label: 'Accent', role: 'Highlights and markers' },
  { key: 'background', label: 'Background', role: 'Page canvas' },
  { key: 'surface', label: 'Surface', role: 'Cards and raised panels' },
  { key: 'text', label: 'Text', role: 'Primary copy' },
  { key: 'text-muted', label: 'Text muted', role: 'Secondary copy' },
  { key: 'border', label: 'Border', role: 'Rules and outlines' },
  { key: 'hover', label: 'Hover surface', role: 'Pointer-over surface' },
  { key: 'active', label: 'Active surface', role: 'Selected / pressed surface' },
  { key: 'success', label: 'Success', role: 'Positive status' },
  { key: 'warning', label: 'Warning', role: 'Caution status' },
  { key: 'danger', label: 'Danger', role: 'Destructive status' },
  { key: 'focus', label: 'Focus ring', role: 'Keyboard focus outline' },
];

export const TOKEN_KEYS = THEME_TOKENS.map((token) => token.key);

/** The CSS custom property a token key resolves to. */
export function tokenVar(key) {
  return `--color-${key}`;
}
