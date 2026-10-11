/*
  Design-token metadata for the Nasaq UI theme.

  Every token maps to a CSS custom property `--color-<key>` that the published
  stylesheet defines on :root (see src/styles/index.css). Components reference
  these variables, and the generator outputs use `var(--color-token, fallback)`
  so exported snippets also work before a theme stylesheet loads.
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