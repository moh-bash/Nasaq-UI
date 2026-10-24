import { BUTTON_VARIANTS } from '../../config/buttonDefaults.js';
import { btnVariant, NQ } from '../shared/classNames.js';
import { buttonVariables, renderVariableRule } from '../shared/variables.js';

/*
  generateButtonCSS(config, theme) -> Button.css source string.

  The default output is a short variable override block plus an import of the
  shared library stylesheet. Structural rules are never re-typed here, so the
  exported file and the live preview cannot drift.
*/

export function generateButtonCSS(config, theme = {}) {
  const { base, variants } = buttonVariables(config, theme);

  const lines = [
    '/* Button.css',
    '   Generated from the Component Playground configuration.',
    '   Pairs with Button.jsx. Import both:',
    "     import Button from './Button';",
    "     import './Button.css';",
    '',
    '   Structural rules come from nasaq/styles.css; this file only overrides',
    '   the documented --nq-btn-* variables.',
    '*/',
    '',
    "@import 'nasaq/styles.css';",
    '',
    '@layer nasaq {',
    renderVariableRule(`.${NQ.btn}`, base),
    '',
  ];

  for (const variant of BUTTON_VARIANTS) {
    lines.push(renderVariableRule(`.${btnVariant(variant)}`, variants[variant]), '');
  }

  lines.push('}');
  return lines.join('\n');
}
