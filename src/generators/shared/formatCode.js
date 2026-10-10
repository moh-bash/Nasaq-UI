/*
  Formatting helpers shared by every code generator. Keeping string/number
  rendering in one place guarantees the CSS and Tailwind outputs agree on how
  values, class names and quoted strings are formatted.
*/

/** Safe JS/JSX string literal (escapes quotes, newlines, backslashes). */
export function quote(value) {
  return JSON.stringify(value ?? '');
}

/** A JSX attribute: `name` (boolean) or `name="value"`. */
export function jsxAttr(name, value) {
  if (value === true) return name;
  if (value === false || value == null) return null;
  return `${name}={${quote(value)}}`;
}

/** Join a list of possibly-empty lines with '\n'. */
export function lines(...parts) {
  return parts.flat().filter((line) => line !== null && line !== undefined).join('\n');
}

/** Indent every line of `text` by `depth` * 2 spaces. */
export function indent(text, depth = 1) {
  const pad = '  '.repeat(depth);
  return String(text)
    .split('\n')
    .map((line) => (line ? pad + line : line))
    .join('\n');
}

/** Number without a trailing `.0`. */
export function num(value) {
  return String(Number(value));
}

/** A length in px. */
export function px(value) {
  return `${Number(value)}px`;
}

/** Collapse a class list, dropping empties. */
export function classNames(...names) {
  return names.flat().filter(Boolean).join(' ');
}

/** Turn a label into a PascalCase component-friendly name. */
export function pascalCase(value) {
  return String(value || '')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}
