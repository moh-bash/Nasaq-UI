import { readyComponents } from '../registry/componentRegistry.js';

/* Sidebar navigation for the docs shell. Ready components are appended to the
   Components section automatically, in registry order. */

export const docsNav = [
  {
    label: 'Getting started',
    items: [
      { to: '/docs', label: 'Start', end: true },
      { to: '/docs/installation', label: 'Installation' },
    ],
  },
  {
    label: 'Components',
    items: [
      { to: '/docs/components', label: 'Overview', end: true },
      ...readyComponents.map((component) => ({
        to: `/docs/components/${component.id}`,
        label: component.name,
      })),
    ],
  },
  {
    label: 'Customization',
    items: [{ to: '/docs/theming', label: 'Theming & tokens' }],
  },
];