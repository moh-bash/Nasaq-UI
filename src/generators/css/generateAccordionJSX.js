import { quote } from '../shared/formatCode.js';
import { accordionItemsLiteral } from '../shared/literals.js';

/*
  generateAccordionJSX(config) -> usage file source (CSS mode).
  Content and behaviour only: every appearance value lives in the generated
  Accordion.css, so the JSX stays a clean reusable API.
*/

export function generateAccordionJSX(config) {
  const { content, icons, behavior } = config;
  const props = [];

  props.push('items={faqItems}');
  if (content.title) props.push(`title=${quote(content.title)}`);
  if (content.showDescription && content.description) {
    props.push(`description=${quote(content.description)}`);
  }
  if (content.numbering) props.push('numbered');
  props.push(`icon=${quote(icons.style)}`);
  if (icons.position !== 'end') props.push(`iconPosition=${quote(icons.position)}`);
  if (behavior.allowMultiple) props.push('allowMultiple');
  if (!behavior.allowCollapse) props.push('allowCollapse={false}');
  if (content.initialOpenId) props.push(`defaultOpenId=${quote(content.initialOpenId)}`);

  const propLines = props.map((line) => `      ${line}`);

  const out = [
    "import Accordion from './Accordion';",
    "import './Accordion.css';",
    '',
    accordionItemsLiteral(content.items),
    '',
    'export default function FaqAccordion() {',
    '  return (',
    '    <Accordion',
    ...propLines,
    '    />',
    '  );',
    '}',
    '',
  ];

  return out.join('\n');
}

/** The component file that must sit next to the generated CSS. */
export const COMPONENT_FILENAME = 'Accordion.jsx';
export const USAGE_FILENAME = 'FaqAccordion.jsx';
