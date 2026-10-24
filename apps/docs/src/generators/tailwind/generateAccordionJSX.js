import { accordionItemsLiteral } from '../shared/literals.js';
import { quote } from '../shared/formatCode.js';
import { accordionVariables } from '../shared/variables.js';

/*
  generateAccordionTailwindJSX(config, theme) -> a self-contained Tailwind
  component.

  The container exposes every config value as a CSS custom property in an
  inline style; the children reference those variables through static arbitrary
  utilities (bg-[color:var(--nq-acc-question-bg)], text-[length:var(--nq-acc-question-size)],
  grid-rows-[0fr]/[1fr], …). Open-state styling is driven by `group-aria-expanded`
  so no class name is constructed by interpolating values at runtime.
*/

function objLiteral(entries, indentLevel = 3) {
  const pad = '  '.repeat(indentLevel);
  const inner = '  '.repeat(indentLevel + 1);
  return ['{', ...entries.map((entry) => `${inner}${entry},`), `${pad}}`].join('\n');
}

function buildIndicator(icons) {
  if (icons.style === 'none') return [];
  const rotateClass =
    icons.rotateWhenOpen && (icons.style === 'chevron' || icons.style === 'arrow')
      ? icons.style === 'arrow'
        ? ' group-aria-expanded:rotate-90'
        : ' group-aria-expanded:rotate-180'
      : '';

  const open = (body) => [
    '                <span',
    `                  className="inline-flex h-[var(--nq-acc-icon-size)] w-[var(--nq-acc-icon-size)] flex-none items-center justify-center text-[color:var(--nq-acc-icon-color)] transition-transform${icons.position === 'start' ? ' order-first' : ''}${rotateClass}"`,
    '                  aria-hidden="true"',
    '                >',
    body,
    '                </span>',
  ];

  if (icons.style === 'plus') {
    return open(
      [
        '                  <span className="relative block h-full w-full">',
        '                    <span className="absolute left-0 right-0 top-[calc(50%-1px)] h-0.5 rounded-[2px] bg-current" />',
        '                    <span className="absolute bottom-0 left-[calc(50%-1px)] top-0 w-0.5 rounded-[2px] bg-current transition-transform group-aria-expanded:rotate-90 group-aria-expanded:opacity-0" />',
        '                  </span>',
      ].join('\n'),
    );
  }
  if (icons.style === 'number') {
    return open("                  {String(index + 1).padStart(2, '0')}");
  }
  const d = icons.style === 'arrow' ? 'M5 12h14M13 6l6 6-6 6' : 'M6 9l6 6 6-6';
  return open(
    `                  <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="${d}" /></svg>`,
  );
}

export function generateAccordionTailwindJSX(config, theme = {}) {
  const { content, layout, icons, behavior } = config;
  const variables = accordionVariables(config, theme);

  const rootStyle = [
    `...${JSON.stringify(variables)}`,
    "fontFamily: 'var(--nq-acc-font-family)'",
    "width: 'var(--nq-acc-width)'",
    "maxWidth: 'var(--nq-acc-max-width)'",
    "marginInline: 'var(--nq-acc-margin-inline)'",
    "textAlign: 'var(--nq-acc-text-align)'",
    "color: 'var(--nq-acc-question-fg)'",
    "background: 'var(--nq-acc-bg)'",
    "border: 'var(--nq-acc-border-width) var(--nq-acc-border-style) var(--nq-acc-border-color)'",
    "borderRadius: 'var(--nq-acc-radius)'",
    "overflow: 'hidden'",
  ];

  const heading = [];
  if (content.title || (content.showDescription && content.description)) {
    heading.push('      <header className="mb-[var(--nq-acc-section-gap)]">');
    if (content.title) {
      heading.push(
        `        <h3 className="m-0 leading-tight tracking-[var(--nq-acc-letter-spacing)] text-[color:var(--nq-acc-heading-fg)] text-[length:var(--nq-acc-heading-size)]">${content.title}</h3>`,
      );
    }
    if (content.showDescription && content.description) {
      heading.push(
        `        <p className="mt-2 leading-normal text-[color:var(--nq-acc-answer-fg)] text-[length:var(--nq-acc-answer-size)]">${content.description}</p>`,
      );
    }
    heading.push('      </header>');
  }

  const listClasses = ['flex', 'flex-col', 'gap-[var(--nq-acc-item-gap)]'];
  if (layout.dividers && layout.itemGap === 0) {
    listClasses.push('divide-y', 'divide-[color:var(--nq-acc-divider-color)]');
  }

  const hoverClass = behavior.hoverEffect ? ' hover:bg-[color:var(--nq-acc-hover-bg)]' : '';
  const numbering = content.numbering && icons.style !== 'number';

  const rowBody = [];
  if (numbering) {
    rowBody.push(
      '                <span className="flex-none tabular-nums text-[color:var(--nq-acc-answer-fg)]" aria-hidden="true">{String(index + 1).padStart(2, \'0\')}</span>',
    );
  }
  rowBody.push('                <span className="flex-1">{item.question}</span>');
  rowBody.push(...buildIndicator(icons));

  const out = [
    "import { useState } from 'react';",
    '',
    accordionItemsLiteral(content.items),
    '',
    'export default function FaqAccordion() {',
    `  const [openIds, setOpenIds] = useState(${content.initialOpenId ? `[${quote(content.initialOpenId)}]` : '[]'});`,
    '',
    '  const toggle = (id) => {',
    '    setOpenIds((current) => {',
    '      if (current.includes(id)) {',
    behavior.allowCollapse
      ? '        return current.filter((entry) => entry !== id);'
      : '        return current.length === 1 ? current : current.filter((entry) => entry !== id);',
    '      }',
    `      return ${behavior.allowMultiple ? '[...current, id]' : '[id]'};`,
    '    });',
    '  };',
    '',
    '  return (',
    `    <div className="box-border" style={${objLiteral(rootStyle, 2)}}>`,
    ...heading,
    `      <div className="${listClasses.join(' ')}">`,
    '        {faqItems.map((item, index) => {',
    '          const isOpen = openIds.includes(item.id);',
    '          return (',
    '            <div',
    '              key={item.id}',
    '              className="overflow-hidden rounded-[var(--nq-acc-item-radius)] bg-[color:var(--nq-acc-bg)]"',
    '            >',
    '              <button',
    '                type="button"',
    `                className={\`group flex w-full cursor-pointer items-center gap-3 border-0 text-left leading-[var(--nq-acc-line-height)] tracking-[var(--nq-acc-letter-spacing)] text-[color:var(--nq-acc-question-fg)] text-[length:var(--nq-acc-question-size)] transition-colors rounded-[var(--nq-acc-question-radius)] disabled:cursor-not-allowed disabled:opacity-55\${isOpen ? ' bg-[color:var(--nq-acc-open-bg)]' : ' bg-[color:var(--nq-acc-question-bg)]'}${hoverClass}\`}`,
    "                style={{ padding: 'var(--nq-acc-question-padding-y) var(--nq-acc-question-padding-x)', fontWeight: 'var(--nq-acc-question-weight)', transitionDuration: 'var(--nq-acc-duration)', transitionTimingFunction: 'var(--nq-acc-easing)' }}",
    '                aria-expanded={isOpen}',
    '                disabled={item.disabled}',
    '                onClick={() => toggle(item.id)}',
    '              >',
    ...rowBody,
    '              </button>',
    '              <div',
    '                role="region"',
    `                className={\`grid overflow-hidden transition-[grid-template-rows]\${isOpen ? ' grid-rows-[1fr]' : ' grid-rows-[0fr]'}\`}`,
    "                style={{ transitionDuration: 'var(--nq-acc-duration)', transitionTimingFunction: 'var(--nq-acc-easing)' }}",
    '              >',
    '                <div className="min-h-0 overflow-hidden bg-[color:var(--nq-acc-answer-bg)]" style={{ padding: \'var(--nq-acc-content-gap) var(--nq-acc-question-padding-x) var(--nq-acc-answer-padding)\' }}>',
    '                  <div className="leading-[var(--nq-acc-line-height)] tracking-[var(--nq-acc-letter-spacing)] text-[color:var(--nq-acc-answer-fg)] text-[length:var(--nq-acc-answer-size)]">',
    '                    {item.answer}',
    '                  </div>',
    '                </div>',
    '              </div>',
    '            </div>',
    '          );',
    '        })}',
    '      </div>',
    '    </div>',
    '  );',
    '}',
    '',
  ];

  return out.join('\n');
}
