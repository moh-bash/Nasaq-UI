import { describe, it, expect } from 'vitest';
import { resolveTheme } from 'nasaq';
import { generateButtonCSS } from '../generators/css/generateButtonCSS.js';
import { generateAccordionCSS } from '../generators/css/generateAccordionCSS.js';
import { generateTabsCSS } from '../generators/css/generateTabsCSS.js';
import { validateButtonConfig, defaultButtonConfig } from '../config/buttonDefaults.js';
import { defaultAccordionConfig } from '../config/accordionDefaults.js';
import { defaultTabsConfig, validateTabsConfig } from '../config/tabsDefaults.js';
import { validateConfig } from '../utils/validateConfig.js';

const theme = resolveTheme({ mode: 'light', overrides: {} });

describe('defaultConfig generated CSS snapshots', () => {
  it('Button.css', () => {
    expect(generateButtonCSS(validateButtonConfig(defaultButtonConfig), theme)).toMatchSnapshot();
  });

  it('Accordion.css', () => {
    expect(generateAccordionCSS(validateConfig(defaultAccordionConfig), theme)).toMatchSnapshot();
  });

  it('Tabs.css', () => {
    expect(generateTabsCSS(validateTabsConfig(defaultTabsConfig), theme)).toMatchSnapshot();
  });
});
