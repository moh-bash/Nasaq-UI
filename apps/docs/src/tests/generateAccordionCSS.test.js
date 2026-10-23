import { describe, it, expect } from 'vitest';
import {
  colorRef,
  inheritedTokens,
  generateAccordionCSS,
} from '../generators/css/generateAccordionCSS.js';
import { generateThemeCSS } from '../generators/css/generateThemeCSS.js';
import { defaultAccordionConfig } from '../config/accordionDefaults.js';
import { validateConfig } from '../utils/validateConfig.js';
import { resolveTheme } from 'nasaq';

const baseConfig = validateConfig(defaultAccordionConfig);
const lightTheme = resolveTheme({ mode: 'light', overrides: {} });

describe('colorRef', () => {
  it('returns a literal hex for an override', () => {
    const config = validateConfig({ colors: { iconColor: '#ff0000' } });
    expect(colorRef(config, 'iconColor', lightTheme)).toBe('#ff0000');
  });

  it('returns a theme var with fallback when inherited', () => {
    const ref = colorRef(baseConfig, 'iconColor', lightTheme);
    expect(ref).toBe(`var(--color-primary, ${lightTheme.primary})`);
  });
});

describe('inheritedTokens', () => {
  it('lists token names for every inherited colour', () => {
    const tokens = inheritedTokens(baseConfig);
    expect(tokens).toContain('primary');
    expect(tokens).toContain('surface');
  });

  it('drops a token once it is overridden', () => {
    const config = validateConfig({ colors: { iconColor: '#123456' } });
    expect(inheritedTokens(config)).not.toContain('primary');
  });
});

describe('generateThemeCSS', () => {
  it('emits a :root block with every token', () => {
    const css = generateThemeCSS(lightTheme);
    expect(css.startsWith(':root {')).toBe(true);
    expect(css).toContain(`--color-primary: ${lightTheme.primary};`);
    expect(css.trim().endsWith('}')).toBe(true);
  });
});

describe('generateAccordionCSS', () => {
  it('emits the core structural rules', () => {
    const css = generateAccordionCSS(baseConfig, lightTheme);
    expect(css).toContain('.nq-acc {');
    expect(css).toContain('.nq-acc-trigger {');
    expect(css).toContain('.nq-acc-panel {');
    expect(css).toContain('grid-template-rows: 0fr;');
  });

  it('wraps the component styles in the nasaq cascade layer', () => {
    const css = generateAccordionCSS(baseConfig, lightTheme);
    expect(css.trimEnd().startsWith('@layer nasaq {')).toBe(true);
    expect(css.trimEnd().endsWith('}')).toBe(true);
  });

  it('uses the configured dimensions and duration', () => {
    const config = validateConfig({
      layout: { maxWidth: 720 },
      animation: { duration: 500 },
    });
    const css = generateAccordionCSS(config, lightTheme);
    expect(css).toContain('max-width: 720px;');
    expect(css).toContain('--acc-dur: 500ms;');
  });

  it('zeroes the duration when motion is disabled', () => {
    const config = validateConfig({ animation: { enabled: false } });
    const css = generateAccordionCSS(config, lightTheme);
    expect(css).toContain('--acc-dur: 0ms;');
  });

  it('emits the numbering rule only when numbering is on', () => {
    const off = validateConfig({ content: { numbering: false } });
    const on = validateConfig({ content: { numbering: true } });
    expect(generateAccordionCSS(off, lightTheme)).not.toContain('.nq-acc-index {');
    expect(generateAccordionCSS(on, lightTheme)).toContain('.nq-acc-index {');
  });

  it('emits plus-icon rules only for the plus indicator', () => {
    const plus = validateConfig({ icons: { style: 'plus' } });
    const chevron = validateConfig({ icons: { style: 'chevron' } });
    expect(generateAccordionCSS(plus, lightTheme)).toContain('.nq-acc-plus {');
    expect(generateAccordionCSS(chevron, lightTheme)).not.toContain('.nq-acc-plus {');
  });

  it('emits a divider rule only when dividers are enabled', () => {
    const on = validateConfig({ layout: { dividers: true } });
    const off = validateConfig({ layout: { dividers: false } });
    expect(generateAccordionCSS(on, lightTheme)).toContain('.nq-acc-item + .nq-acc-item {');
    expect(generateAccordionCSS(off, lightTheme)).not.toContain('.nq-acc-item + .nq-acc-item {');
  });

  it('always includes the reduced-motion block', () => {
    const css = generateAccordionCSS(baseConfig, lightTheme);
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
  });
});
