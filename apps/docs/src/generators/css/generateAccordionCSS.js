import { NQ } from '../shared/classNames.js';
import {
  accordionConditionalRules,
  accordionVariables,
  inheritedAccordionTokens,
  renderRules,
  renderVariableRule,
} from '../shared/variables.js';

/*
  generateAccordionCSS(config, theme) -> Accordion.css source string.

  Structural rules are imported from nasaq/styles.css; this file emits only the
  documented --nq-acc-* overrides (plus the few conditional rules that cannot be
  expressed as variables, such as padding ownership and icon rotation).
*/

export function generateAccordionCSS(config, theme = {}) {
  const inherited = inheritedAccordionTokens(config);
  const lines = [
    '/* Accordion.css',
    '   Generated from the Component Playground configuration.',
    '   Pairs with Accordion.jsx. Import both:',
    "     import Accordion from './Accordion';",
    "     import './Accordion.css';",
  ];

  if (inherited.length && inherited.length < Object.keys(config.colors).length) {
    lines.push('   Colours marked as inherited reference these theme variables:');
    lines.push(`     ${[...new Set(inherited)].map((t) => `--color-${t}`).join(', ')}`);
  } else if (inherited.length) {
    lines.push('   Colours reference the --color-* theme variables, with fallbacks.');
  }
  lines.push('*/', '', "@import 'nasaq/styles.css';", '', '@layer nasaq {');
  lines.push(renderVariableRule(`.${NQ.acc}`, accordionVariables(config, theme)));

  const conditional = renderRules(accordionConditionalRules(config));
  if (conditional) lines.push('', conditional);

  lines.push('}');
  return lines.join('\n');
}
