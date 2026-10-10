import { iconSvgSource, hasIcon } from '../../config/buttonIcons.js';
import { quote } from '../shared/formatCode.js';

/*
  generateButtonJSX(config) -> usage file source (CSS mode).
  Content and behaviour only; appearance lives in the generated Button.css.
*/

export function generateButtonJSX(config) {
  const { content, layout } = config;
  const props = [`variant=${quote(config.variant)}`, `size=${quote(config.size)}`];

  if (hasIcon(content.leadingIcon)) {
    props.push(`leadingIcon={${iconSvgSource(content.leadingIcon)}}`);
  }
  if (hasIcon(content.trailingIcon)) {
    props.push(`trailingIcon={${iconSvgSource(content.trailingIcon)}}`);
  }
  if (layout.fullWidth) props.push('fullWidth');
  if (content.disabled) props.push('disabled');
  if (content.loading) props.push('loading');

  const propLines = props.map((line) => `      ${line}`);

  const open = content.label ? `      ${content.label}` : null;

  const out = [
    "import Button from './Button';",
    "import './Button.css';",
    '',
    'export default function ActionButton() {',
    '  return (',
    '    <Button',
    ...propLines,
    '    >',
    ...(open ? [open] : []),
    '    </Button>',
    '  );',
    '}',
    '',
  ];

  return out.join('\n');
}

export const COMPONENT_FILENAME = 'Button.jsx';
export const USAGE_FILENAME = 'ActionButton.jsx';
