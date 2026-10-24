/*
  Component registry — the single index the whole site reads.

  Each ready entry carries everything the studio, the docs pages and the
  generators need: default config, inspector schema, presets, validator, the
  React preview, and the two generator functions. Adding a component means
  appending an entry here; no other file needs to change.

  Entries without a build are listed as "planned" so the explorer and the
  marketing pages can show the roadmap.
*/

import { COMPONENT_PROPS } from 'nasaq';
import accordionSource from '../../../../packages/react/src/components/Accordion/Accordion.tsx?raw';
import buttonSource from '../../../../packages/react/src/components/Button/Button.tsx?raw';
import tabsSource from '../../../../packages/react/src/components/Tabs/Tabs.tsx?raw';

import AccordionPreview from '../components/ui/Accordion/AccordionPreview.jsx';
import ButtonPreview from '../components/ui/Button/ButtonPreview.jsx';
import TabsPreview from '../components/ui/Tabs/TabsPreview.jsx';

import { defaultAccordionConfig } from '../config/accordionDefaults.js';
import { accordionSections, sectionById as accordionSectionById } from '../config/accordionSchema.js';
import {
  accordionPresets,
  applyPreset as applyAccordionPreset,
  presetById as accordionPresetById,
  presetIsModified as accordionPresetIsModified,
} from '../config/accordionPresets.js';
import { validateConfig as validateAccordionConfig } from '../utils/validateConfig.js';

import { defaultButtonConfig } from '../config/buttonDefaults.js';
import { buttonSections, buttonSectionById } from '../config/buttonSchema.js';
import {
  buttonPresets,
  applyButtonPreset,
  buttonPresetById,
  buttonPresetIsModified,
} from '../config/buttonPresets.js';
import { validateButtonConfig } from '../config/buttonDefaults.js';
import { defaultTabsConfig, validateTabsConfig } from '../config/tabsDefaults.js';
import { tabsSections, tabsSectionById } from '../config/tabsSchema.js';
import {
  tabsPresets,
  applyTabsPreset,
  tabsPresetById,
  tabsPresetIsModified,
} from '../config/tabsPresets.js';

import { generateAccordionJSX, USAGE_FILENAME as ACC_USAGE_FILENAME } from '../generators/css/generateAccordionJSX.js';
import { generateAccordionCSS } from '../generators/css/generateAccordionCSS.js';
import { generateAccordionTailwindJSX } from '../generators/tailwind/generateAccordionJSX.js';
import { generateButtonJSX, USAGE_FILENAME as BTN_USAGE_FILENAME } from '../generators/css/generateButtonJSX.js';
import { generateButtonCSS } from '../generators/css/generateButtonCSS.js';
import { generateButtonTailwindJSX } from '../generators/tailwind/generateButtonJSX.js';
import { generateTabsJSX, USAGE_FILENAME as TABS_USAGE_FILENAME } from '../generators/css/generateTabsJSX.js';
import { generateTabsCSS } from '../generators/css/generateTabsCSS.js';
import { generateTabsTailwindJSX } from '../generators/tailwind/generateTabsJSX.js';
import { generateThemeCSS } from '../generators/css/generateThemeCSS.js';
import { generateTailwindThemeCSS } from '../generators/tailwind/generateThemeCSS.js';
import { buildCssOutput, buildTailwindOutput } from '../generators/shared/assemble.js';

const accordion = {
  id: 'accordion',
  name: 'Accordion',
  category: 'navigation',
  categoryLabel: 'Navigation',
  status: 'ready',
  description: 'Disclosure list for FAQs, help centres and long forms.',
  tags: ['disclosure', 'faq', 'accessible', 'content'],
  defaultConfig: defaultAccordionConfig,
  sections: accordionSections,
  sectionById: accordionSectionById,
  presets: accordionPresets,
  presetById: accordionPresetById,
  applyPreset: applyAccordionPreset,
  presetIsModified: accordionPresetIsModified,
  validate: validateAccordionConfig,
  Preview: AccordionPreview,
  generators: {
    css(config, theme) {
      return buildCssOutput({
        usage: generateAccordionJSX(config),
        css: generateAccordionCSS(config, theme),
        componentSource: accordionSource,
        componentFileName: 'Accordion.tsx',
        usageFileName: ACC_USAGE_FILENAME,
        cssFileName: 'Accordion.css',
        themeCss: generateThemeCSS(theme),
      });
    },
    tailwind(config, theme) {
      return buildTailwindOutput({
        component: generateAccordionTailwindJSX(config, theme),
        themeCss: generateTailwindThemeCSS(theme),
        componentFileName: 'FaqAccordion.jsx',
      });
    },
  },
  docs: {
    overview:
      'A disclosure list built on native buttons and a grid-rows expansion. Every colour is either inherited from a global theme token or pinned with a hex override; the matching CSS file carries the whole appearance, so the component stays reusable.',
    notes: [
      'The live preview renders the real Accordion with the generated stylesheet injected into an isolated shadow root — what you see is what you export.',
      'In Tailwind mode the code panel shows a self-contained component that uses static utilities and CSS variables instead of the semantic stylesheet.',
      'Inherited colours emit var(--color-token, fallback) so the exported CSS keeps adapting to a host theme even before one loads.',
    ],
    props: COMPONENT_PROPS.accordion,
  },
};

const button = {
  id: 'button',
  name: 'Button',
  category: 'actions',
  categoryLabel: 'Actions',
  status: 'ready',
  description: 'Action control with variants, sizes, icons and loading state.',
  tags: ['action', 'cta', 'form', 'accessible'],
  defaultConfig: defaultButtonConfig,
  sections: buttonSections,
  sectionById: buttonSectionById,
  presets: buttonPresets,
  presetById: buttonPresetById,
  applyPreset: applyButtonPreset,
  presetIsModified: buttonPresetIsModified,
  validate: validateButtonConfig,
  Preview: ButtonPreview,
  generators: {
    css(config, theme) {
      return buildCssOutput({
        usage: generateButtonJSX(config),
        css: generateButtonCSS(config, theme),
        componentSource: buttonSource,
        componentFileName: 'Button.tsx',
        usageFileName: BTN_USAGE_FILENAME,
        cssFileName: 'Button.css',
        themeCss: generateThemeCSS(theme),
      });
    },
    tailwind(config, theme) {
      return buildTailwindOutput({
        component: generateButtonTailwindJSX(config),
        themeCss: generateTailwindThemeCSS(theme),
        componentFileName: 'ActionButton.jsx',
      });
    },
  },
  docs: {
    overview:
      'A single button that covers the common action set: five variants, three sizes, optional leading and trailing icons, and a loading state that also disables the control. Variant colours map to theme tokens unless overridden.',
    notes: [
      'A size bundle sets padding, font size and height together; corner radius and icon gap stay individually editable.',
      'The Tailwind export is a self-contained component: static utility classes plus inline CSS variables, no runtime class-name interpolation.',
      'Icons come from one shared geometry table, so the preview and both generators always agree.',
    ],
    props: COMPONENT_PROPS.button,
  },
};

const tabs = {
  id: 'tabs',
  name: 'Tabs',
  category: 'navigation',
  categoryLabel: 'Navigation',
  status: 'ready',
  description: 'Accessible tabbed panels with keyboard navigation and three visual treatments.',
  tags: ['navigation', 'panels', 'keyboard', 'accessible'],
  defaultConfig: defaultTabsConfig,
  sections: tabsSections,
  sectionById: tabsSectionById,
  presets: tabsPresets,
  presetById: tabsPresetById,
  applyPreset: applyTabsPreset,
  presetIsModified: tabsPresetIsModified,
  validate: validateTabsConfig,
  Preview: TabsPreview,
  generators: {
    css(config, theme) {
      return buildCssOutput({
        usage: generateTabsJSX(config),
        css: generateTabsCSS(config, theme),
        componentSource: tabsSource,
        componentFileName: 'Tabs.tsx',
        usageFileName: TABS_USAGE_FILENAME,
        cssFileName: 'Tabs.css',
        themeCss: generateThemeCSS(theme),
      });
    },
    tailwind(config, theme) {
      return buildTailwindOutput({
        component: generateTabsTailwindJSX(config),
        themeCss: generateTailwindThemeCSS(theme),
        componentFileName: 'ProductTabs.jsx',
      });
    },
  },
  docs: {
    overview:
      'A compact tab system built from native buttons and the WAI-ARIA tab pattern. It supports roving keyboard focus, disabled tabs, active panels, and CSS or Tailwind exports.',
    notes: [
      'Use Arrow Left and Arrow Right to move between tabs, or Home and End to jump to the first or last enabled tab.',
      'The preview and generated output share the same tab data, active state, and semantic roles.',
      'Choose underline, pill, or boxed styling without changing the component API.',
    ],
    props: COMPONENT_PROPS.tabs,
  },
};

const planned = [
  { id: 'stack', name: 'Stack', category: 'layout', categoryLabel: 'Layout', status: 'planned', description: 'Vertical rhythm primitive with gap and alignment controls.' },
  { id: 'split', name: 'Split pane', category: 'layout', categoryLabel: 'Layout', status: 'planned', description: 'Two-pane layout with a draggable divider.' },
  { id: 'breadcrumbs', name: 'Breadcrumbs', category: 'navigation', categoryLabel: 'Navigation', status: 'planned', description: 'Hierarchical trail with truncated middles.' },
  { id: 'table', name: 'Table', category: 'data-display', categoryLabel: 'Data display', status: 'planned', description: 'Dense data grid with sticky headers.' },
  { id: 'badge', name: 'Badge', category: 'data-display', categoryLabel: 'Data display', status: 'planned', description: 'Status pill built on the semantic colour tokens.' },
  { id: 'field', name: 'Field', category: 'forms', categoryLabel: 'Forms', status: 'planned', description: 'Label, hint, error and control in one row.' },
  { id: 'switch', name: 'Switch', category: 'forms', categoryLabel: 'Forms', status: 'planned', description: 'Accessible on/off control.' },
  { id: 'toast', name: 'Toast', category: 'feedback', categoryLabel: 'Feedback', status: 'planned', description: 'Transient confirmation stack.' },
  { id: 'dialog', name: 'Dialog', category: 'overlays', categoryLabel: 'Overlays', status: 'planned', description: 'Focus-trapped modal surface.' },
];

const CATEGORY_ORDER = ['actions', 'navigation', 'layout', 'data-display', 'forms', 'feedback', 'overlays'];

export const allComponents = [button, accordion, tabs, ...planned];

export const components = Object.fromEntries(allComponents.map((entry) => [entry.id, entry]));

export const readyComponents = allComponents.filter((entry) => entry.status === 'ready');

export function getComponent(id) {
  return components[id] || null;
}

export function getReadyComponent(id) {
  const entry = components[id];
  return entry && entry.status === 'ready' ? entry : null;
}

export const categories = CATEGORY_ORDER.map((id) => {
  const entries = allComponents.filter((entry) => entry.category === id);
  return entries.length
    ? { id, label: entries[0].categoryLabel, components: entries }
    : null;
}).filter(Boolean);

export function countReady() {
  return readyComponents.length;
}

export function countPlanned() {
  return allComponents.length - readyComponents.length;
}
