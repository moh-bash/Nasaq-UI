/*
  Design-token metadata for the Nasaq UI theme.
*/

export const THEME_TOKENS = [
  { key: 'primary', label: 'Primary', role: 'Brand actions, links, focus', cssVar: '--color-primary' },
  { key: 'on-solid', label: 'On solid', role: 'Text and icons on primary/secondary/danger fills', cssVar: '--color-on-solid' },
  { key: 'secondary', label: 'Secondary', role: 'Alternate brand surface', cssVar: '--color-secondary' },
  { key: 'accent', label: 'Accent', role: 'Highlights and markers', cssVar: '--color-accent' },
  { key: 'background', label: 'Background', role: 'Page canvas', cssVar: '--color-background' },
  { key: 'surface', label: 'Surface', role: 'Cards and raised panels', cssVar: '--color-surface' },
  { key: 'text', label: 'Text', role: 'Primary copy', cssVar: '--color-text' },
  { key: 'text-muted', label: 'Text muted', role: 'Secondary copy', cssVar: '--color-text-muted' },
  { key: 'border', label: 'Border', role: 'Rules and outlines', cssVar: '--color-border' },
  { key: 'hover', label: 'Hover surface', role: 'Pointer-over surface', cssVar: '--color-hover' },
  { key: 'active', label: 'Active surface', role: 'Selected / pressed surface', cssVar: '--color-active' },
  { key: 'success', label: 'Success', role: 'Positive status', cssVar: '--color-success' },
  { key: 'warning', label: 'Warning', role: 'Caution status', cssVar: '--color-warning' },
  { key: 'danger', label: 'Danger', role: 'Destructive status', cssVar: '--color-danger' },
  { key: 'focus', label: 'Focus ring', role: 'Keyboard focus outline', cssVar: '--color-focus' },
];

export const TOKEN_KEYS = THEME_TOKENS.map((token) => token.key);

export const DESIGN_TOKENS = {
  radius: { cssVar: '--nq-radius', default: '10px' },
  'font-sans': { cssVar: '--nq-font-sans', default: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" },
  'font-mono': { cssVar: '--nq-font-mono', default: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace" },
  'shadow-sm': { cssVar: '--nq-shadow-sm', default: '0 1px 2px rgba(20, 22, 26, 0.08)' },
  'shadow-md': { cssVar: '--nq-shadow-md', default: '0 2px 6px rgba(20, 22, 26, 0.1), 0 12px 24px -12px rgba(20, 22, 26, 0.25)' },
  'shadow-lg': { cssVar: '--nq-shadow-lg', default: '0 8px 18px -8px rgba(20, 22, 26, 0.18), 0 26px 52px -22px rgba(20, 22, 26, 0.32)' },
  duration: { cssVar: '--nq-duration', default: '160ms' },
  easing: { cssVar: '--nq-easing', default: 'ease' },
  'space-1': { cssVar: '--nq-space-1', default: '4px' },
  'space-2': { cssVar: '--nq-space-2', default: '8px' },
  'space-3': { cssVar: '--nq-space-3', default: '12px' },
  'space-4': { cssVar: '--nq-space-4', default: '16px' },
  'space-6': { cssVar: '--nq-space-6', default: '24px' },
};

/** The CSS custom property a token key resolves to. */
export function tokenVar(key) {
  return `--color-${key}`;
}

export function designTokenVar(key) {
  return DESIGN_TOKENS[key]?.cssVar || `--nq-${key}`;
}