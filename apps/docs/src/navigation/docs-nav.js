import { categories } from '../registry/componentRegistry.js';
import { paths } from '../routes.js';

/* Sidebar navigation for the docs shell. */

export const docsNav = [
  {
    label: 'Getting started',
    items: [
      { to: paths.docs, label: 'Start', end: true },
      { to: paths.installation, label: 'Installation' },
    ],
  },
  {
    label: 'Components',
    items: [
      { to: paths.components, label: 'Overview', end: true },
    ],
  },
  {
    label: 'Customization',
    items: [{ to: paths.theming, label: 'Theming & tokens' }],
  },
];

export function buildSidebarSections() {
  const sections = [];

  sections.push({
    id: 'getting-started',
    label: 'Getting started',
    type: 'static',
    items: [
      { id: 'start', to: paths.docs, label: 'Start', end: true, kind: 'link' },
      { id: 'installation', to: paths.installation, label: 'Installation', kind: 'link' },
    ],
  });

  sections.push({
    id: 'components',
    label: 'Components',
    type: 'components',
    items: [
      { id: 'overview', to: paths.components, label: 'Overview', end: true, kind: 'link' },
    ],
    categories: categories.map((category) => ({
      id: category.id,
      label: category.label,
      components: category.components.map((component) => ({
        id: component.id,
        name: component.name,
        label: component.name,
        description: component.description || '',
        status: component.status,
        ready: component.status === 'ready',
      })),
    })),
  });

  sections.push({
    id: 'customization',
    label: 'Customization',
    type: 'static',
    items: [
      { id: 'theming', to: paths.theming, label: 'Theming & tokens', kind: 'link' },
    ],
  });

  return sections;
}

export { categories, readyComponents, countReady, countPlanned } from '../registry/componentRegistry.js';
