import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { Button, Accordion, Tabs } from '../src/index';

expect.extend({
  toHaveNoViolations(results) {
    const violations = results.violations || [];
    if (violations.length === 0) {
      return {
        pass: true,
        message: () => 'Expected axe violations',
      };
    }
    return {
      pass: false,
      message: () => `Expected no axe violations but found:\n${violations
        .map((v) => `${v.id}: ${v.help}`)
        .join('\n')}`,
    };
  },
});

describe('axe accessibility', () => {
  it('Button has no axe violations', async () => {
    const { container } = render(<Button>Save</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Accordion has no axe violations', async () => {
    const items = [
      { id: 'a', question: 'First question?', answer: 'First answer.' },
      { id: 'b', question: 'Second question?', answer: 'Second answer.' },
    ];
    const { container } = render(<Accordion items={items} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Tabs has no axe violations', async () => {
    const items = [
      { id: 'one', label: 'One', content: 'First panel' },
      { id: 'two', label: 'Two', content: 'Second panel' },
    ];
    const { container } = render(<Tabs items={items} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
