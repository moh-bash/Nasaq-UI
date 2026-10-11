import { describe, it, expect } from 'vitest';
import { generateAccordionJSX } from '../generators/css/generateAccordionJSX.js';
import { validateConfig } from '../utils/validateConfig.js';
import { defaultAccordionConfig } from '../config/accordionDefaults.js';

const base = validateConfig(defaultAccordionConfig);

describe('generateAccordionJSX', () => {
  it('imports the component and stylesheet', () => {
    const jsx = generateAccordionJSX(base);
    expect(jsx).toContain("import Accordion from './Accordion';");
    expect(jsx).toContain("import './Accordion.css';");
  });

  it('serialises items as a literal', () => {
    const jsx = generateAccordionJSX(base);
    expect(jsx).toContain('const faqItems = [');
    expect(jsx).toContain('question: "How long does a letterpress job take?"');
  });

  it('adds the numbered flag when numbering is on', () => {
    const on = generateAccordionJSX(validateConfig({ content: { numbering: true } }));
    expect(on).toContain('numbered');
    const off = generateAccordionJSX(validateConfig({ content: { numbering: false } }));
    expect(off).not.toContain('numbered');
  });

  it('adds behaviour props only when they deviate from defaults', () => {
    const multi = generateAccordionJSX(
      validateConfig({ behavior: { allowMultiple: true, allowCollapse: false } }),
    );
    expect(multi).toContain('allowMultiple');
    expect(multi).toContain('allowCollapse={false}');

    const plain = generateAccordionJSX(base);
    expect(plain).not.toContain('allowMultiple');
    expect(plain).not.toContain('allowCollapse={false}');
  });

  it('omits the description when it is hidden', () => {
    const hidden = generateAccordionJSX(validateConfig({ content: { showDescription: false } }));
    expect(hidden).not.toContain('description=');
  });

  it('escapes quotes and newlines safely via JSON serialisation', () => {
    const config = validateConfig({
      content: { items: [{ id: 'q', question: 'He said "hi"\nthere', answer: '' }] },
    });
    const jsx = generateAccordionJSX(config);
    expect(jsx).toContain('"He said \\"hi\\"\\nthere"');
  });
});
