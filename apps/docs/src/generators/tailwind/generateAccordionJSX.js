import { FONT_STACKS } from '../../config/typography.js';
import { colorRef } from '../css/generateAccordionCSS.js';
import { accordionItemsLiteral } from '../shared/literals.js';
import { quote } from '../shared/formatCode.js';

/*
  generateAccordionTailwindJSX(config, theme) -> a self-contained Tailwind
  component.

  The container exposes every config value as a CSS custom property in an
  inline style; the children reference those variables through static arbitrary
  utilities (bg-[color:var(--acc-qbg)], text-[length:var(--acc-qsize)],
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
    `                  className="inline-flex h-[var(--acc-icon)] w-[var(--acc-icon)] flex-none items-center justify-center text-[color:var(--acc-icon-color)] transition-transform${icons.position === 'start' ? ' order-first' : ''}${rotateClass}"`,
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
  const { content, layout, borders, typography, icons, animation, behavior } = config;
  const c = (prop) => colorRef(config, prop, theme);
  const font = FONT_STACKS[typography.fontFamily] || FONT_STACKS.system;
  const duration = animation.enabled ? `${animation.duration}ms` : '0ms';

  const rootStyle = [
    `fontFamily: ${quote(font)}`,
    `width: ${quote(`${layout.widthPercent}%`)}`,
    `maxWidth: ${quote(`${layout.maxWidth}px`)}`,
    `marginInline: ${quote(layout.align === 'center' ? 'auto' : layout.align === 'end' ? 'auto 0' : '0')}`,
    `textAlign: ${quote(layout.textAlign)}`,
    `color: ${quote(c('questionText'))}`,
    `background: ${quote(c('background'))}`,
    `border: ${quote(borders.enabled && borders.width > 0 ? `${borders.width}px ${borders.style} ${c('borderColor')}` : '0')}`,
    `borderRadius: ${quote(`${borders.radius}px`)}`,
    `overflow: 'hidden'`,
    `'--acc-dur': ${quote(duration)}`,
    `'--acc-ease': ${quote(animation.easing)}`,
    `'--acc-icon': ${quote(`${icons.size}px`)}`,
    `'--acc-container-bg': ${quote(c('background'))}`,
    `'--acc-item-radius': ${quote(`${borders.itemRadius}px`)}`,
    `'--acc-qradius': ${quote(`${borders.questionRadius}px`)}`,
    `'--acc-item-gap': ${quote(`${layout.itemGap}px`)}`,
    `'--acc-section-gap': ${quote(`${layout.sectionGap}px`)}`,
    `'--acc-qpad': ${quote(`${layout.questionPaddingY}px ${layout.questionPaddingX}px`)}`,
    `'--acc-answer-pad': ${quote(`${layout.contentGap}px ${layout.questionPaddingX}px ${layout.answerPadding}px`)}`,
    `'--acc-heading-size': ${quote(`${typography.headingSize}px`)}`,
    `'--acc-qsize': ${quote(`${typography.questionSize}px`)}`,
    `'--acc-asize': ${quote(`${typography.answerSize}px`)}`,
    `'--acc-weight': ${quote(String(typography.fontWeight))}`,
    `'--acc-lh': ${quote(String(typography.lineHeight))}`,
    `'--acc-ls': ${quote(`${typography.letterSpacing}em`)}`,
    `'--acc-qfg': ${quote(c('questionText'))}`,
    `'--acc-afg': ${quote(c('answerText'))}`,
    `'--acc-heading': ${quote(c('headingText'))}`,
    `'--acc-qbg': ${quote(c('questionBackground'))}`,
    `'--acc-abg': ${quote(c('answerBackground'))}`,
    `'--acc-hover': ${quote(c('hoverBackground'))}`,
    `'--acc-open': ${quote(c('openBackground'))}`,
    `'--acc-icon-color': ${quote(c('iconColor'))}`,
    `'--acc-divider': ${quote(c('dividerColor'))}`,
    `'--acc-focus': ${quote(c('focusColor'))}`,
  ];

  const heading = [];
  if (content.title || (content.showDescription && content.description)) {
    heading.push('      <header className="mb-[var(--acc-section-gap)]">');
    if (content.title) {
      heading.push(
        `        <h3 className="m-0 leading-tight tracking-[var(--acc-ls)] text-[color:var(--acc-heading)] text-[length:var(--acc-heading-size)]">${content.title}</h3>`,
      );
    }
    if (content.showDescription && content.description) {
      heading.push(
        `        <p className="mt-2 leading-normal text-[color:var(--acc-afg)] text-[length:var(--acc-asize)]">${content.description}</p>`,
      );
    }
    heading.push('      </header>');
  }

  const listClasses = ['flex', 'flex-col', 'gap-[var(--acc-item-gap)]'];
  if (layout.dividers && layout.itemGap === 0) {
    listClasses.push('divide-y', 'divide-[color:var(--acc-divider)]');
  }

  const hoverClass = behavior.hoverEffect ? ' hover:bg-[color:var(--acc-hover)]' : '';
  const numbering = content.numbering && icons.style !== 'number';

  const rowBody = [];
  if (numbering) {
    rowBody.push(
      '                <span className="flex-none tabular-nums text-[color:var(--acc-afg)]" aria-hidden="true">{String(index + 1).padStart(2, \'0\')}</span>',
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
    '              className="overflow-hidden rounded-[var(--acc-item-radius)] bg-[color:var(--acc-container-bg)]"',
    '            >',
    '              <button',
    '                type="button"',
    `                className={\`group flex w-full cursor-pointer items-center gap-3 border-0 text-left leading-[var(--acc-lh)] tracking-[var(--acc-ls)] text-[color:var(--acc-qfg)] text-[length:var(--acc-qsize)] transition-colors rounded-[var(--acc-qradius)] disabled:cursor-not-allowed disabled:opacity-55\${isOpen ? ' bg-[color:var(--acc-open)]' : ' bg-[color:var(--acc-qbg)]'}${hoverClass}\`}`,
    "                style={{ padding: 'var(--acc-qpad)', fontWeight: 'var(--acc-weight)', transitionDuration: 'var(--acc-dur)', transitionTimingFunction: 'var(--acc-ease)' }}",
    '                aria-expanded={isOpen}',
    '                disabled={item.disabled}',
    '                onClick={() => toggle(item.id)}',
    '              >',
    ...rowBody,
    '              </button>',
    '              <div',
    '                role="region"',
    `                className={\`grid overflow-hidden transition-[grid-template-rows]\${isOpen ? ' grid-rows-[1fr]' : ' grid-rows-[0fr]'}\`}`,
    "                style={{ transitionDuration: 'var(--acc-dur)', transitionTimingFunction: 'var(--acc-ease)' }}",
    '              >',
    '                <div className="min-h-0 overflow-hidden bg-[color:var(--acc-abg)]" style={{ padding: \'var(--acc-answer-pad)\' }}>',
    '                  <div className="leading-[var(--acc-lh)] tracking-[var(--acc-ls)] text-[color:var(--acc-afg)] text-[length:var(--acc-asize)]">',
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
