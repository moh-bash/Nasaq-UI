import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Button, Accordion, Tabs, resolveTheme } from 'nasaq';
import { generateButtonCSS } from '../generators/css/generateButtonCSS.js';
import { generateAccordionCSS } from '../generators/css/generateAccordionCSS.js';
import { generateTabsCSS } from '../generators/css/generateTabsCSS.js';
import {
  NO_RULE_CLASSES,
  extractClassSelectors,
  isLayerWrapped,
  unprefixedClassSelectors,
} from '../generators/shared/classNames.js';
import {
  defaultButtonConfig,
  validateButtonConfig,
  BUTTON_VARIANTS,
  BUTTON_SIZES,
} from '../config/buttonDefaults.js';
import { defaultAccordionConfig } from '../config/accordionDefaults.js';
import { defaultTabsConfig, validateTabsConfig } from '../config/tabsDefaults.js';
import { validateConfig } from '../utils/validateConfig.js';

/*
  The regression these tests exist for: the library moved to the `nq-` class
  prefix but the generators kept emitting `.btn`, `.acc`, `.tabs`. Generated
  CSS looked plausible and no string assertion noticed that the Shadow-DOM
  preview had become unstyled. These tests render the REAL component and derive
  the selector list from its live DOM, so renaming a class in either place now
  fails loudly.
*/

const theme = resolveTheme({ mode: 'light', overrides: {} });

function classesIn(container) {
  const found = new Set();
  for (const el of [container, ...container.querySelectorAll('*')]) {
    for (const name of el.classList || []) found.add(name);
  }
  return found;
}

function missingSelectors(css, container) {
  const selectors = new Set(extractClassSelectors(css));
  return [...classesIn(container)].filter(
    (name) => !selectors.has(name) && !NO_RULE_CLASSES.includes(name),
  );
}

function expectCovered(css, container, label) {
  expect(isLayerWrapped(css), `${label}: generated CSS must be wrapped in @layer nasaq`).toBe(true);
  expect(unprefixedClassSelectors(css), `${label}: unprefixed selectors`).toEqual([]);
  const missing = missingSelectors(css, container);
  expect(missing, `${label}: no generated rule for ${missing.join(', ')}`).toEqual([]);
}

const ICONS = ['none', 'plus', 'arrow-right', 'check', 'download', 'chevron-down'];

describe('generated CSS covers every class the real components render', () => {
  it('Button: every variant, size, alignment and state', () => {
    for (const variant of BUTTON_VARIANTS) {
      for (const size of BUTTON_SIZES) {
        for (const align of ['start', 'center', 'end']) {
          const raw = {
            ...defaultButtonConfig,
            variant,
            size,
            layout: { ...defaultButtonConfig.layout, align },
            content: {
              ...defaultButtonConfig.content,
              leadingIcon: ICONS[(ICONS.indexOf('plus') + size.length) % ICONS.length],
              trailingIcon: 'arrow-right',
            },
          };
          const config = validateButtonConfig(raw);
          const { container, unmount } = render(
            <Button
              variant={config.variant}
              size={config.size}
              align={config.layout.align}
              fullWidth={config.layout.fullWidth}
              loading={config.content.loading}
              disabled={config.content.disabled}
              leadingIcon={<span>+</span>}
              trailingIcon={<span>&rarr;</span>}
            >
              {config.content.label}
            </Button>,
          );
          expectCovered(
            generateButtonCSS(config, theme),
            container,
            `button ${variant}/${size}/${align}`,
          );
          unmount();
        }
      }
    }

    const fullWidth = validateButtonConfig({
      layout: { fullWidth: true },
      content: { loading: true },
    });
    const { container, unmount } = render(
      <Button fullWidth loading>
        Saving
      </Button>,
    );
    expectCovered(generateButtonCSS(fullWidth, theme), container, 'button full/loading');
    unmount();

    const disabled = validateButtonConfig({ content: { disabled: true } });
    const disabledRender = render(<Button disabled>Disabled</Button>);
    expectCovered(generateButtonCSS(disabled, theme), disabledRender.container, 'button disabled');
    disabledRender.unmount();

    const link = validateButtonConfig({ content: { disabled: true } });
    const linkRender = render(
      <Button as="a" href="#somewhere" disabled>
        Link
      </Button>,
    );
    expectCovered(generateButtonCSS(link, theme), linkRender.container, 'button as link');
    linkRender.unmount();
  });

  it('Accordion: every indicator, numbering, position and open/disabled state', () => {
    const itemSets = [
      defaultAccordionConfig.content.items,
      [
        { ...defaultAccordionConfig.content.items[0], disabled: true },
        defaultAccordionConfig.content.items[1],
      ],
    ];

    for (const icon of ['chevron', 'arrow', 'plus', 'number', 'none']) {
      for (const position of ['start', 'end']) {
        for (const items of itemSets) {
          const config = validateConfig({
            icons: { style: icon, position },
            content: { items, numbering: true, initialOpenId: items[0]?.id || '' },
          });
          const { container, unmount } = render(
            <Accordion
              items={config.content.items}
              title={config.content.title}
              description={config.content.description}
              numbered={config.content.numbering}
              icon={config.icons.style}
              iconPosition={config.icons.position}
              allowMultiple={config.behavior.allowMultiple}
              allowCollapse={config.behavior.allowCollapse}
              defaultOpenId={config.content.initialOpenId}
            />,
          );
          expectCovered(
            generateAccordionCSS(config, theme),
            container,
            `accordion ${icon}/${position}`,
          );
          unmount();
        }
      }
    }

    const multi = validateConfig({ behavior: { allowMultiple: true } });
    const multiRender = render(
      <Accordion items={multi.content.items} allowMultiple defaultOpenId={multi.content.items[0].id} />,
    );
    expectCovered(generateAccordionCSS(multi, theme), multiRender.container, 'accordion multi');
    multiRender.unmount();

    const empty = validateConfig({ content: { items: [], title: '', description: '' } });
    const emptyRender = render(<Accordion items={[]} emptyState="Nothing here yet." />);
    expectCovered(generateAccordionCSS(empty, theme), emptyRender.container, 'accordion empty');
    emptyRender.unmount();
  });

  it('Tabs: every variant, alignment, disabled tab and empty state', () => {
    for (const variant of ['underline', 'pill', 'boxed']) {
      for (const align of ['start', 'center', 'end', 'stretch']) {
        for (const disabled of [false, true]) {
          const config = validateTabsConfig({
            variant,
            layout: { align },
            content: {
              items: defaultTabsConfig.content.items.map((item, index) => ({
                ...item,
                disabled: disabled && index === 1,
              })),
            },
          });
          const { container, unmount } = render(
            <Tabs
              items={config.content.items}
              defaultActiveId={config.content.defaultActiveId}
              variant={config.variant}
              align={config.layout.align}
            />,
          );
          expectCovered(
            generateTabsCSS(config, theme),
            container,
            `tabs ${variant}/${align}${disabled ? '/disabled' : ''}`,
          );
          unmount();
        }
      }
    }

    const empty = validateTabsConfig({ content: { items: [] } });
    const emptyRender = render(<Tabs items={[]} emptyState="Nothing yet." />);
    expectCovered(generateTabsCSS(empty, theme), emptyRender.container, 'tabs empty');
    emptyRender.unmount();
  });
});
