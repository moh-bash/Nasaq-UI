import { TOKEN_KEYS } from 'nasaq';

/*
  generateTailwindThemeCSS(theme) -> a Tailwind v4 theme stylesheet.

  Tailwind v4 reads design tokens from the `@theme` block and turns each
  `--color-*` entry into utilities (bg-primary, text-primary, border-primary, …).
  Emitting the palette here means the generated component can reference semantic
  utilities instead of hard-coded values.
*/
export function generateTailwindThemeCSS(theme = {}) {
  const lines = ['@import "tailwindcss";', '', '@theme {'];
  for (const token of TOKEN_KEYS) {
    lines.push(`  --color-${token}: ${theme[token]};`);
  }
  lines.push('}');
  return lines.join('\n');
}
