import { quote } from '../shared/formatCode.js';

export function generateTabsJSX(config) {
  const { content, layout, variant } = config;
  const items = content.items
    .map(
      (item) =>
        `    { id: ${quote(item.id)}, label: ${quote(item.label)}, content: ${quote(item.content)}${item.disabled ? ', disabled: true' : ''} },`,
    )
    .join('\n');

  return [
    "import Tabs from './Tabs';",
    "import './Tabs.css';",
    '',
    'const tabs = [',
    items,
    '];',
    '',
    'export default function ProductTabs() {',
    '  return (',
    '    <Tabs',
    '      items={tabs}',
    `      defaultActiveId={${quote(content.defaultActiveId)}}`,
    `      variant={${quote(variant)}}`,
    `      align={${quote(layout.align)}}`,
    '    />',
    '  );',
    '}',
    '',
  ].join('\n');
}

export const USAGE_FILENAME = 'ProductTabs.jsx';
