/* global process */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { COMPONENT_VARIABLES, resolveTheme } from 'nasaq';
import { generateButtonCSS } from '../generators/css/generateButtonCSS.js';
import { generateAccordionCSS } from '../generators/css/generateAccordionCSS.js';
import { generateTabsCSS } from '../generators/css/generateTabsCSS.js';
import { defaultButtonConfig, validateButtonConfig } from '../config/buttonDefaults.js';
import { defaultAccordionConfig } from '../config/accordionDefaults.js';
import { defaultTabsConfig, validateTabsConfig } from '../config/tabsDefaults.js';
import { validateConfig } from '../utils/validateConfig.js';

const libraryCss = readFileSync(
  resolve(process.cwd(), '../../packages/react/src/styles/index.css'),
  'utf8',
);
const theme = resolveTheme({ mode: 'light', overrides: {} });
const rootVars = declarations(libraryCss, ':root');
const colorVars = Object.fromEntries(
  Object.entries(theme).map(([key, value]) => [`--color-${key}`, value]),
);

function resolveValue(value) {
  let result = value;
  for (let pass = 0; pass < 6; pass += 1) {
    const next = result.replace(/var\((--[\w-]+)(?:,\s*([^)]*))?\)/g, (_, name, fallback) => {
      const resolved = colorVars[name] ?? rootVars[name] ?? fallback;
      return resolved ?? fallback ?? '';
    });
    if (next === result) break;
    result = next;
  }
  return result.replace(/\s+/g, ' ').trim();
}

function declarations(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  if (!match) return {};
  const found = {};
  for (const line of match[1].split(';')) {
    const [name, ...rest] = line.split(':');
    if (!name.trim().startsWith('--')) continue;
    found[name.trim()] = rest.join(':').trim();
  }
  return found;
}

function expectEquivalent(generated, defaults, selectors) {
  for (const selector of selectors) {
    const generatedVars = declarations(generated, selector);
    const libraryVars = declarations(libraryCss, selector);
    expect(Object.keys(generatedVars).length, `${selector} should declare variables`).toBeGreaterThan(0);
    for (const [name, value] of Object.entries(generatedVars)) {
      expect(libraryVars[name], `${selector} ${name} must exist in the library`).toBeDefined();
      expect(resolveValue(value), `${selector} ${name}`).toBe(resolveValue(libraryVars[name]));
    }
    if (defaults) expect(libraryVars).toBeDefined();
  }
}

describe('default generator output equals the library stylesheet', () => {
  it('Button variables resolve to the library defaults', () => {
    const generated = generateButtonCSS(validateButtonConfig(defaultButtonConfig), theme);
    expectEquivalent(generated, true, [
      '.nq-btn',
      '.nq-btn--primary',
      '.nq-btn--secondary',
      '.nq-btn--outline',
      '.nq-btn--ghost',
      '.nq-btn--danger',
    ]);
  });

  it('Accordion variables resolve to the library defaults', () => {
    const generated = generateAccordionCSS(validateConfig(defaultAccordionConfig), theme);
    expectEquivalent(generated, true, ['.nq-acc']);
  });

  it('Tabs variables resolve to the library defaults', () => {
    const generated = generateTabsCSS(validateTabsConfig(defaultTabsConfig), theme);
    expectEquivalent(generated, true, ['.nq-tabs']);
  });

  it('documents every variable the library consumes', () => {
    for (const [component, variables] of Object.entries(COMPONENT_VARIABLES)) {
      for (const { variable } of variables) {
        expect(libraryCss, `${component} ${variable} missing from stylesheet`).toContain(variable);
      }
    }
  });
});
