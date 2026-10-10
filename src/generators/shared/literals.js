import { quote } from './formatCode.js';

/** `const faqItems = [...]` literal shared by the CSS and Tailwind outputs. */
export function accordionItemsLiteral(items, name = 'faqItems') {
  if (!items.length) return `const ${name} = [];`;
  const lines = [`const ${name} = [`];
  items.forEach((item) => {
    lines.push('  {');
    lines.push(`    id: ${quote(item.id)},`);
    lines.push(`    question: ${quote(item.question)},`);
    lines.push(`    answer: ${quote(item.answer)},`);
    if (item.disabled) lines.push('    disabled: true,');
    lines.push('  },');
  });
  lines.push('];');
  return lines.join('\n');
}
