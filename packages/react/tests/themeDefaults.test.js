import { describe, it, expect } from 'vitest';
import {
  THEME_TOKENS,
  themeDefaults,
  defaultTheme,
  resolveTheme,
} from '../src/index.js';

describe('theme model', () => {
  it('defines a default for every declared token', () => {
    THEME_TOKENS.forEach(({ key }) => {
      expect(themeDefaults.light[key]).toMatch(/^#[0-9a-f]{6}$/i);
      expect(themeDefaults.dark[key]).toMatch(/^#[0-9a-f]{6}$/i);
    });
  });

  it('creates a light theme with no overrides', () => {
    expect(defaultTheme()).toEqual({ version: 1, mode: 'light', overrides: {} });
  });

  it('resolves to the light palette by default', () => {
    const resolved = resolveTheme(defaultTheme());
    expect(resolved.primary).toBe(themeDefaults.light.primary);
    expect(resolved.background).toBe(themeDefaults.light.background);
  });

  it('resolves to the dark palette in dark mode', () => {
    const resolved = resolveTheme({ mode: 'dark', overrides: {} });
    expect(resolved.background).toBe(themeDefaults.dark.background);
  });

  it('applies string overrides on top of the mode palette', () => {
    const resolved = resolveTheme({ mode: 'light', overrides: { primary: '#ff7a00' } });
    expect(resolved.primary).toBe('#ff7a00');
    expect(resolved.background).toBe(themeDefaults.light.background);
  });

  it('ignores non-string overrides', () => {
    const resolved = resolveTheme({ mode: 'light', overrides: { primary: 42 } });
    expect(resolved.primary).toBe(themeDefaults.light.primary);
  });

  it('falls back to the light palette for an unknown mode', () => {
    const resolved = resolveTheme({ mode: 'neon', overrides: {} });
    expect(resolved.background).toBe(themeDefaults.light.background);
  });
});