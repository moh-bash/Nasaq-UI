import { generateThemeCSS } from './css/generateThemeCSS.js';
import { generateTailwindThemeCSS } from './tailwind/generateThemeCSS.js';

/*
  Generator facade.

  Registry entries expose two generator functions — `generators.css(config, theme)`
  and `generators.tailwind(config, theme)` — each returning:

      { files: [{ id, label, language, filename, code, optional? }], primary }

  The facade adds the active `mode` so the code panel is fully data-driven and
  never needs to know which component it is rendering.
*/

export const STYLING_MODES = ['css', 'tailwind'];

export const STYLING_MODE_LABELS = {
  css: 'Semantic CSS',
  tailwind: 'Tailwind v4',
};

export { generateThemeCSS, generateTailwindThemeCSS };

export function hasGenerators(component, mode) {
  return Boolean(component?.generators?.[mode]);
}

/** Build the mode-aware generator output for one component. */
export function buildOutput(component, config, theme, mode) {
  const generate = component?.generators?.[mode];
  if (!generate) {
    throw new Error(`No "${mode}" generator registered for component "${component?.id}".`);
  }
  const { files, primary } = generate(config, theme);
  return { mode, files, primary: primary || files[0]?.id, };
}
