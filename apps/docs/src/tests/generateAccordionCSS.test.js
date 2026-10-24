import { describe, it, expect } from 'vitest';
import { generateAccordionCSS } from '../generators/css/generateAccordionCSS.js';
import { generateButtonCSS } from '../generators/css/generateButtonCSS.js';
import { generateTabsCSS } from '../generators/css/generateTabsCSS.js';
import { accordionColorRef, inheritedAccordionTokens } from '../generators/shared/variables.js';
import { generateThemeCSS } from '../generators/css/generateThemeCSS.js';
import { defaultAccordionConfig } from '../config/accordionDefaults.js';
import { defaultButtonConfig, validateButtonConfig } from '../config/buttonDefaults.js';
import { defaultTabsConfig, validateTabsConfig } from '../config/tabsDefaults.js';
import { validateConfig } from '../utils/validateConfig.js';
import { resolveTheme } from 'nasaq';

const baseConfig = validateConfig(defaultAccordionConfig);
const lightTheme = resolveTheme({ mode: 'light', overrides: {} });

describe('accordionColorRef', () => {
  it('returns a literal hex for an override', () => {
    const config = validateConfig({ colors: { iconColor: '#ff0000' } });
    expect(accordionColorRef(config, 'iconColor', lightTheme)).toBe('#ff0000');
  });

  it('returns a theme var with fallback when inherited', () => {
    const ref = accordionColorRef(baseConfig, 'iconColor', lightTheme);
    expect(ref).toBe(`var(--color-primary, ${lightTheme.primary})`);
  });
});

describe('inheritedAccordionTokens', () => {
  it('lists token names for every inherited colour', () => {
    const tokens = inheritedAccordionTokens(baseConfig);
    expect(tokens).toContain('primary');
    expect(tokens).toContain('surface');
  });

  it('drops a token once it is overridden', () => {
    const config = validateConfig({ colors: { iconColor: '#123456' } });
    expect(inheritedAccordionTokens(config)).not.toContain('primary');
  });
});

describe('generateThemeCSS', () => {
  it('emits a :root block with every AA-contrast token', () => {
    const css = generateThemeCSS(lightTheme);
    expect(css.startsWith(':root {')).toBe(true);
    expect(css).toContain(`--color-primary: ${lightTheme.primary};`);
    expect(css).toContain('--color-on-primary:');
    expect(css).toContain('--color-on-secondary:');
    expect(css).toContain('--color-on-danger:');
    expect(css.trim().endsWith('}')).toBe(true);
  });
});

describe('generated CSS is a variable override layer', () => {
  it('imports the shared library stylesheet instead of re-typing structure', () => {
    for (const css of [
      generateButtonCSS(validateButtonConfig(defaultButtonConfig), lightTheme),
      generateAccordionCSS(baseConfig, lightTheme),
      generateTabsCSS(validateTabsConfig(defaultTabsConfig), lightTheme),
    ]) {
      expect(css).toContain("@import 'nasaq/styles.css';");
      expect(css).not.toContain('display: flex');
    }
  });

  it('wraps overrides in the nasaq cascade layer', () => {
    const css = generateAccordionCSS(baseConfig, lightTheme);
    expect(css).toContain('@layer nasaq {');
    expect(css.trimEnd().endsWith('}')).toBe(true);
  });

  it('uses the configured dimensions and duration as variables', () => {
    const config = validateConfig({
      layout: { maxWidth: 720 },
      animation: { duration: 500 },
    });
    const css = generateAccordionCSS(config, lightTheme);
    expect(css).toContain('--nq-acc-max-width: 720px;');
    expect(css).toContain('--nq-acc-duration: 500ms;');
  });

  it('zeroes the duration when motion is disabled', () => {
    const config = validateConfig({ animation: { enabled: false } });
    const css = generateAccordionCSS(config, lightTheme);
    expect(css).toContain('--nq-acc-duration: 0ms;');
  });

  it('maps dividers to a zero-width variable when disabled', () => {
    const off = validateConfig({ layout: { dividers: false } });
    expect(generateAccordionCSS(off, lightTheme)).toContain('--nq-acc-divider-width: 0px;');
  });

  it('keeps conditional structural rules out of the default output', () => {
    const css = generateAccordionCSS(baseConfig, lightTheme);
    expect(css).not.toContain('.nq-acc-trigger {');
  });

  it('emits padding rules only when the whole row is not clickable', () => {
    const config = validateConfig({ behavior: { wholeRow: false } });
    const css = generateAccordionCSS(config, lightTheme);
    expect(css).toContain('.nq-acc-trigger {');
    expect(css).toContain('.nq-acc-item__header {');
  });
});
