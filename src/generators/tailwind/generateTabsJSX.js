import { quote } from '../shared/formatCode.js';

export function generateTabsTailwindJSX(config) {
  const items = config.content.items
    .map((item) => `{ id: ${quote(item.id)}, label: ${quote(item.label)}, content: ${quote(item.content)}${item.disabled ? ', disabled: true' : ''} }`)
    .join(', ');
  return [
    'import { useState } from "react";',
    '',
    `const tabs = [${items}];`,
    '',
    'export default function ProductTabs() {',
    `  const [active, setActive] = useState(${quote(config.content.defaultActiveId)});`,
    '  const selected = tabs.find((tab) => tab.id === active) || tabs[0];',
    '  return (',
    '    <div className="text-slate-900">',
    '      <div role="tablist" className="flex gap-2 overflow-x-auto border-b border-border">',
    '        {tabs.map((tab) => (',
    '          <button type="button" role="tab" key={tab.id} aria-selected={tab.id === selected.id} disabled={tab.disabled} onClick={() => setActive(tab.id)} className="px-4 py-2 text-sm text-muted hover:text-primary aria-selected:text-primary">',
    '            {tab.label}',
    '          </button>',
    '        ))}',
    '      </div>',
    '      <div role="tabpanel" className="mt-6 rounded-[10px] border border-border bg-surface p-5 leading-relaxed">',
    '        {selected.content}',
    '      </div>',
    '    </div>',
    '  );',
    '}',
    '',
  ].join('\n');
}
