/* Coordinated default palettes for the Nasaq UI theme (light + dark).
   Consumers can either keep the defaults, override individual `--color-*`
   custom properties, or use these values to generate their own token block
   (the docs site does exactly this with `generateThemeCSS`). */

import { THEME_TOKENS } from './tokens';

export { THEME_TOKENS };

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeState {
  version: number;
  mode: ThemeMode | string;
  overrides: Record<string, string>;
}

export type ThemePalette = Record<string, string>;

export const THEME_VERSION = 3;

export const themeDefaults: { light: ThemePalette; dark: ThemePalette } = {
  light: {
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
  },
  dark: {
    primary: '#7d92ff',
    'on-primary': '#101211',
    secondary: '#7fc9b4',
    'on-secondary': '#101211',
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
    danger: '#ef6a62',
    'on-danger': '#101211',
    focus: '#7d92ff',
  },
};

export const defaultTheme = (): ThemeState => ({
  version: THEME_VERSION,
  mode: 'light',
  /* per-token user edits; null means "use the mode default" */
  overrides: {},
});

/** Effective value of every token for the given theme state. */
export function resolveTheme(theme?: Partial<ThemeState> | null): ThemePalette {
  const base = themeDefaults[theme?.mode as 'light' | 'dark'] || themeDefaults.light;
  const overrides = theme?.overrides || {};
  const resolved: ThemePalette = {};
  for (const { key } of THEME_TOKENS) {
    const value = overrides[key];
    resolved[key] = typeof value === 'string' ? value : base[key];
  }
  return resolved;
}
