import { TOKEN_KEYS } from '../../config/designTokens.js';

/* generateThemeCSS(theme) -> a :root block that defines every --color-* token
   with its resolved value. Drop this at the top of a global stylesheet, or let
   the generated component CSS fall back to the inline values it already carries. */
export function generateThemeCSS(theme = {}) {
  const lines = [':root {'];
  for (const token of TOKEN_KEYS) {
    lines.push(`  --color-${token}: ${theme[token]};`);
  }
  lines.push('}');
  return lines.join('\n');
}
