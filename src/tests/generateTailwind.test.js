import { describe, it, expect } from 'vitest';
import { generateAccordionTailwindJSX } from '../generators/tailwind/generateAccordionJSX.js';
import {
  generateButtonTailwindJSX,
  USAGE_FILENAME,
} from '../generators/tailwind/generateButtonJSX.js';
import { generateTailwindThemeCSS } from '../generators/tailwind/generateThemeCSS.js';
import { defaultAccordionConfig } from '../config/accordionDefaults.js';
import { defaultButtonConfig, validateButtonConfig } from '../config/buttonDefaults.js';
import { validateConfig } from '../utils/validateConfig.js';
import { resolveTheme } from '../theme/themeDefaults.js';

const lightTheme = resolveTheme({ mode: 'light', overrides: {} });
const accordion = validateConfig(defaultAccordionConfig);
const button = validateButtonConfig(defaultButtonConfig);

describe('generateTailwindThemeCSS', () => {
  it('emits an @theme block with the resolved palette', () => {
    const css = generateTailwindThemeCSS(lightTheme);
    expect(css).toContain('@theme {');
    expect(css).toContain(`--color-primary: ${lightTheme.primary};`);
    expect(css).toContain(`--color-surface: ${lightTheme.surface};`);
  });
});

describe('generateAccordionTailwindJSX', () => {
  it('produces a self-contained component', () => {
    const jsx = generateAccordionTailwindJSX(accordion, lightTheme);
    expect(jsx).toContain('export default function');
    expect(jsx).toContain("import { useState } from 'react';");
    expect(jsx).toContain('--acc-qsize');
  });

  it('never leaks an unresolved value placeholder', () => {
    expect(generateAccordionTailwindJSX(accordion, lightTheme)).not.toContain('${background}');
  });

  it('reflects configuration changes', () => {
    const numbered = generateAccordionTailwindJSX(
      validateConfig({ content: { numbering: true } }),
      lightTheme,
    );
    const plain = generateAccordionTailwindJSX(
      validateConfig({ content: { numbering: false } }),
      lightTheme,
    );
    expect(numbered).toContain('padStart');
    expect(plain).not.toContain('padStart');

    const divided = generateAccordionTailwindJSX(
      validateConfig({ layout: { dividers: true, itemGap: 0 } }),
      lightTheme,
    );
    expect(divided).toContain('divide-y');
  });
});

describe('generateButtonTailwindJSX', () => {
  it('produces a self-contained button with semantic utilities', () => {
    const jsx = generateButtonTailwindJSX(button);
    expect(jsx).toContain('export default function ActionButton()');
    expect(jsx).toContain('inline-flex');
    expect(jsx).toContain('hover:bg-primary/90');
    expect(jsx).not.toContain('${');
  });

  it('honours an explicit hover override with a colour mix', () => {
    const jsx = generateButtonTailwindJSX(
      validateButtonConfig({ colors: { hoverBackground: '#123456' } }),
    );
    expect(jsx).toContain('color-mix(in_srgb,#123456');
  });

  it('marks a loading button busy and disabled', () => {
    const jsx = generateButtonTailwindJSX(validateButtonConfig({ content: { loading: true } }));
    expect(jsx).toContain('animate-spin');
    expect(jsx).toContain('aria-busy="true"');
    expect(jsx).toContain('disabled');
  });

  it('exports the usage filename', () => {
    expect(USAGE_FILENAME).toBe('ActionButton.jsx');
  });
});
