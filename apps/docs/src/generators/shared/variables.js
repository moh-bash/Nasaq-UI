/*
  Config -> CSS custom-property mapping shared by both generators.

  Each Playground control writes exactly one documented --nq-<component>-*
  variable. The generated stylesheet is therefore a short override block on top
  of `nasaq/styles.css`; the Tailwind export uses the same map in its inline
  style object. This module is the single source of the mapping described in
  the README and on the Theming page.
*/

import { COLOR_TOKEN_MAP } from '../../config/accordionDefaults.js';
import { BUTTON_SIZE_TOKENS, BUTTON_VARIANTS } from '../../config/buttonDefaults.js';
import { FONT_STACKS } from '../../config/typography.js';
import { buttonVariantVars, themeRef } from './colors.js';

export const SHADOWS = {
  sm: '0 1px 2px rgba(20, 22, 26, 0.08)',
  md: '0 2px 6px rgba(20, 22, 26, 0.1), 0 12px 24px -12px rgba(20, 22, 26, 0.25)',
  lg: '0 8px 18px -8px rgba(20, 22, 26, 0.18), 0 26px 52px -22px rgba(20, 22, 26, 0.32)',
};

const font = (key) => FONT_STACKS[key] || FONT_STACKS.system;

/** `var(--color-token, fallback)` for an accordion colour control. */
export function accordionColorRef(config, prop, theme = {}) {
  const value = config.colors?.[prop];
  if (typeof value === 'string' && value) return value;
  const token = (COLOR_TOKEN_MAP[prop] || '--color-text').replace('--color-', '');
  return themeRef(token, theme);
}

/** Theme tokens an accordion config inherits (for file-header comments). */
export function inheritedAccordionTokens(config) {
  return Object.keys(config.colors || {})
    .filter((prop) => config.colors[prop] === null)
    .map((prop) => (COLOR_TOKEN_MAP[prop] || '').replace('--color-', ''))
    .filter(Boolean);
}

/** Every Button variable for the current config. */
export function buttonVariables(config, theme = {}) {
  const { layout, typography, icons, borders, animation } = config;
  const size = BUTTON_SIZE_TOKENS[config.size] || BUTTON_SIZE_TOKENS.md;
  const base = {
    '--nq-btn-radius': `${layout.radius}px`,
    '--nq-btn-gap': `${layout.gap}px`,
    '--nq-btn-font-family': font(typography.fontFamily),
    '--nq-btn-font-weight': `${typography.fontWeight}`,
    '--nq-btn-letter-spacing': `${typography.letterSpacing}em`,
    '--nq-btn-icon-size': `${icons.size}px`,
    '--nq-btn-border-width': `${borders.width}px`,
    '--nq-btn-border-style': borders.style,
    '--nq-btn-shadow': borders.shadow === 'none' ? 'none' : SHADOWS[borders.shadow],
    '--nq-btn-duration': `${animation.duration}ms`,
    '--nq-btn-easing': animation.easing,
    '--nq-btn-padding-y': `${size.paddingY}px`,
    '--nq-btn-padding-x': `${size.paddingX}px`,
    '--nq-btn-font-size': `${size.fontSize}px`,
    '--nq-btn-min-height': `${size.height}px`,
  };

  const variants = Object.fromEntries(
    BUTTON_VARIANTS.map((variant) => {
      const colors = buttonVariantVars(config, variant, theme);
      return [
        variant,
        {
          '--nq-btn-bg': colors.background,
          '--nq-btn-fg': colors.text,
          '--nq-btn-border-color': colors.border,
          '--nq-btn-bg-hover': colors.hoverBackground,
        },
      ];
    }),
  );

  return { base, variants };
}

/** Every Accordion variable for the current config. */
export function accordionVariables(config, theme = {}) {
  const { layout, borders, typography, icons, animation, behavior } = config;
  const c = (prop) => accordionColorRef(config, prop, theme);
  const duration = animation.enabled ? `${animation.duration}ms` : '0ms';
  const shadow = borders.shadow === 'none' ? 'none' : SHADOWS[borders.shadow];
  const answerBorder =
    borders.answerBorder === 'top'
      ? { top: `${borders.dividerThickness}px`, block: '0px' }
      : borders.answerBorder === 'separate'
        ? { top: '0px', block: `${borders.dividerThickness}px` }
        : { top: '0px', block: '0px' };

  return {
    '--nq-acc-width': `${layout.widthPercent}%`,
    '--nq-acc-max-width': `${layout.maxWidth}px`,
    '--nq-acc-margin-inline':
      layout.align === 'center' ? 'auto' : layout.align === 'end' ? 'auto 0' : '0',
    '--nq-acc-text-align': layout.textAlign,
    '--nq-acc-font-family': font(typography.fontFamily),
    '--nq-acc-radius': `${borders.radius}px`,
    '--nq-acc-item-radius': `${borders.itemRadius}px`,
    '--nq-acc-question-radius': `${borders.questionRadius}px`,
    '--nq-acc-border-width': borders.enabled && borders.width > 0 ? `${borders.width}px` : '0px',
    '--nq-acc-border-style': borders.style,
    '--nq-acc-shadow': layout.itemGap === 0 ? shadow : 'none',
    '--nq-acc-item-shadow': layout.itemGap > 0 ? shadow : 'none',
    '--nq-acc-bg': c('background'),
    '--nq-acc-border-color': c('borderColor'),
    '--nq-acc-duration': duration,
    '--nq-acc-easing': animation.easing,
    '--nq-acc-icon-size': `${icons.size}px`,
    '--nq-acc-item-gap': `${layout.itemGap}px`,
    '--nq-acc-divider-width': layout.dividers ? `${borders.dividerThickness}px` : '0px',
    '--nq-acc-divider-color': c('dividerColor'),
    '--nq-acc-section-gap': `${layout.sectionGap}px`,
    '--nq-acc-question-padding-y': `${layout.questionPaddingY}px`,
    '--nq-acc-question-padding-x': `${layout.questionPaddingX}px`,
    '--nq-acc-content-gap': `${layout.contentGap}px`,
    '--nq-acc-answer-padding': `${layout.answerPadding}px`,
    '--nq-acc-heading-size': `${typography.headingSize}px`,
    '--nq-acc-heading-weight': `${Math.min(700, Math.max(400, typography.fontWeight + 100))}`,
    '--nq-acc-heading-fg': c('headingText'),
    '--nq-acc-question-fg': c('questionText'),
    '--nq-acc-question-size': `${typography.questionSize}px`,
    '--nq-acc-question-weight': `${typography.fontWeight}`,
    '--nq-acc-answer-fg': c('answerText'),
    '--nq-acc-answer-size': `${typography.answerSize}px`,
    '--nq-acc-line-height': `${typography.lineHeight}`,
    '--nq-acc-letter-spacing': `${typography.letterSpacing}em`,
    '--nq-acc-question-bg': c('questionBackground'),
    '--nq-acc-answer-bg': c('answerBackground'),
    '--nq-acc-hover-bg': behavior.hoverEffect ? c('hoverBackground') : c('questionBackground'),
    '--nq-acc-open-bg': c('openBackground'),
    '--nq-acc-icon-color': c('iconColor'),
    '--nq-acc-focus-color': c('focusColor'),
    '--nq-acc-answer-border-top-width': answerBorder.top,
    '--nq-acc-answer-border-block-width': answerBorder.block,
  };
}

/** Every Tabs variable for the current config. */
export function tabsVariables(config, theme = {}) {
  const pick = (key, token) => {
    const value = config.colors?.[key];
    return typeof value === 'string' && value ? value : themeRef(token, theme);
  };
  return {
    '--nq-tabs-active': pick('active', 'primary'),
    '--nq-tabs-text': pick('text', 'text'),
    '--nq-tabs-muted': pick('muted', 'text-muted'),
    '--nq-tabs-border': pick('border', 'border'),
    '--nq-tabs-panel': pick('panel', 'surface'),
    '--nq-tabs-gap': `${config.layout.gap}px`,
    '--nq-tabs-radius': `${config.layout.radius}px`,
    '--nq-tabs-duration': `${config.animation.duration}ms`,
    '--nq-tabs-easing': config.animation.easing,
  };
}

/** The per-component conditional rules that are not expressible as variables. */
export function accordionConditionalRules(config) {
  const rules = [];
  if (!config.behavior.wholeRow) {
    rules.push({
      selector: '.nq-acc-trigger',
      declarations: { padding: '0' },
    });
    rules.push({
      selector: '.nq-acc-item__header',
      declarations: {
        padding:
          'var(--nq-acc-question-padding-y) var(--nq-acc-question-padding-x)',
      },
    });
  }
  if (!config.icons.rotateWhenOpen) {
    rules.push({
      selector: '.nq-acc-item.nq-is-open .nq-acc-icon--chevron',
      declarations: { transform: 'none' },
    });
    rules.push({
      selector: '.nq-acc-item.nq-is-open .nq-acc-icon--arrow',
      declarations: { transform: 'none' },
    });
  }
  return rules;
}

/** Serialise a variable map as a CSS rule. */
export function renderVariableRule(selector, variables) {
  const lines = Object.entries(variables).map(([name, value]) => `  ${name}: ${value};`);
  return [`${selector} {`, ...lines, '}'].join('\n');
}

/** Serialise the conditional declaration rules. */
export function renderRules(rules) {
  return rules
    .map(({ selector, declarations }) => {
      const lines = Object.entries(declarations).map(([name, value]) => `  ${name}: ${value};`);
      return [`${selector} {`, ...lines, '}'].join('\n');
    })
    .join('\n\n');
}
