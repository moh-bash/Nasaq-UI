/* Coordinated default palettes for the Nasaq UI theme (light + dark).
   Consumers can either keep the defaults, override individual `--color-*`
   custom properties, or use these values to generate their own token block
   (the docs site does exactly this with `generateThemeCSS`). */

import { THEME_TOKENS } from './tokens.js';

export { THEME_TOKENS };

export const THEME_VERSION = 2;

export const themeDefaults = {
  light: {
    primary: '#1e3ae0',
    'on-solid': '#ffffff',
    secondary: '#0e4f45',
    accent: '#e8461e',
    background: '#edefec',
    surface: '#ffffff',
    text: '#14161a',
    'text-muted': '#5c635e',
    border: '#d6d9d4',
    hover: '#f1f3ef',
    active: '#ecf0ff',
    success: '#1b7f4c',
    warning: '#a66b00',
    danger: '#c42b1c',
    focus: '#1e3ae0',
  },
  dark: {
    primary: '#7d92ff',
    'on-solid': '#101211',
    secondary: '#7fc9b4',
    accent: '#ff7a4d',
    background: '#101211',
    surface: '#191c1a',
    text: '#edefec',
    'text-muted': '#9aa19b',
    border: '#2c312d',
    hover: '#222624',
    active: '#1a2140',
    success: '#4cb07a',
    warning: '#e0a33c',
    danger: '#e5534b',
    focus: '#7d92ff',
  },
};

export const defaultTheme = () => ({
  version: THEME_VERSION,
  mode: 'light',
  /* per-token user edits; null means "use the mode default" */
  overrides: {},
});

/** Effective value of every token for the given theme state. */
export function resolveTheme(theme) {
  const base = themeDefaults[theme?.mode] || themeDefaults.light;
  const overrides = theme?.overrides || {};
  const resolved = {};
  for (const { key } of THEME_TOKENS) {
    const value = overrides[key];
    resolved[key] = typeof value === 'string' ? value : base[key];
  }
  return resolved;
}