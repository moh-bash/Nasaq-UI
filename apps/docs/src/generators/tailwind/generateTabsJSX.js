import { quote } from '../shared/formatCode.js';
import { tabsVariables } from '../shared/variables.js';

/*
  generateTabsTailwindJSX(config, theme) -> a self-contained Tailwind component.

  The root exposes the same --nq-tabs-* map as the semantic-CSS export; every
  utility reads those variables, so both styling modes stay in lockstep.
*/

export function generateTabsTailwindJSX(config, theme = {}) {
  const variables = tabsVariables(config, theme);
  const style = Object.entries(variables)
    .map(([name, value]) => `'${name}': ${quote(value)}`)
    .join(', ');
  const items = config.content.items
    .map(
      (item) =>
        `{ id: ${quote(item.id)}, label: ${quote(item.label)}, content: ${quote(item.content)}${item.disabled ? ', disabled: true' : ''} }`,
    )
    .join(', ');

  const isPill = config.variant === 'pill';
  const isBoxed = config.variant === 'boxed';
  const isUnderline = config.variant === 'underline';
  const list = [
    'flex gap-2 overflow-x-auto',
    'p-0',
    isPill ? '' : 'border-b border-[color:var(--nq-tabs-border)]',
    isBoxed
      ? 'rounded-[var(--nq-tabs-radius)] border border-[color:var(--nq-tabs-border)] bg-[color:var(--nq-tabs-panel)] p-1'
      : '',
  ]
    .filter(Boolean)
    .join(' ');
  const alignClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    stretch: 'justify-stretch [&>button]:flex-1',
  }[config.layout.align];
  const selected = [
    isPill ? 'aria-selected:bg-[color:var(--nq-tabs-active)]' : '',
    isPill ? 'aria-selected:text-[color:var(--color-on-primary)]' : '',
    isBoxed ? 'aria-selected:bg-[color:var(--nq-tabs-panel)] aria-selected:shadow-sm' : '',
    isBoxed ? 'rounded-[var(--nq-tabs-radius)]' : '',
    isPill ? 'rounded-[var(--nq-tabs-radius)]' : '',
    isUnderline ? 'aria-selected:text-[color:var(--nq-tabs-active)]' : '',
    isUnderline ? 'aria-selected:shadow-[inset_0_-2px_0_var(--nq-tabs-active)]' : '',
    isBoxed ? 'aria-selected:text-[color:var(--nq-tabs-active)]' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return [
    'import { useState } from "react";',
    '',
    `const tabs = [${items}];`,
    '',
    'export default function ProductTabs() {',
    `  const [active, setActive] = useState(${quote(config.content.defaultActiveId)});`,
    '  const selected = tabs.find((tab) => tab.id === active) || tabs[0];',
    '  return (',
    `    <div style={{ ${style} }} className="text-[color:var(--nq-tabs-text)]">`,
    `      <div role="tablist" className="${list} ${alignClass}">`,
    '        {tabs.map((tab) => (',
    `          <button type="button" role="tab" key={tab.id} aria-selected={tab.id === selected.id} disabled={tab.disabled} onClick={() => setActive(tab.id)} className="cursor-pointer border-0 bg-transparent px-[var(--nq-tabs-padding)] py-2 text-sm text-[color:var(--nq-tabs-muted)] transition-colors duration-[var(--nq-tabs-duration)] ease-[var(--nq-tabs-easing)] hover:text-[color:var(--nq-tabs-active)] disabled:cursor-not-allowed disabled:opacity-45 ${selected}">`,
    '            {tab.label}',
    '          </button>',
    '        ))}',
    '      </div>',
    '      <div role="tabpanel" className="mt-[var(--nq-tabs-gap)] rounded-[var(--nq-tabs-radius)] border border-[color:var(--nq-tabs-border)] bg-[color:var(--nq-tabs-panel)] p-5 leading-relaxed text-[color:var(--nq-tabs-text)]">',
    '        {selected.content}',
    '      </div>',
    '    </div>',
    '  );',
    '}',
    '',
  ].join('\n');
}
