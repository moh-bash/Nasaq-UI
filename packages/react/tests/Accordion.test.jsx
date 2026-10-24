import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Accordion } from '../src/index';

const items = [
  { id: 'a', question: 'First question?', answer: 'First answer.' },
  { id: 'b', question: 'Second question?', answer: 'Second answer.' },
  { id: 'c', question: 'Third question?', answer: 'Third answer.' },
];

function setup(props = {}) {
  return render(<Accordion items={items} title="FAQ" {...props} />);
}

describe('Accordion', () => {
  it('renders the heading and every question', () => {
    setup();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    items.forEach((item) => expect(screen.getByText(item.question)).toBeInTheDocument());
  });

  it('wires each trigger to its region with ARIA', () => {
    setup();
    const trigger = screen.getByRole('button', { name: items[0].question });
    const controls = trigger.getAttribute('aria-controls');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(document.getElementById(controls)).toHaveAttribute('role', 'region');
  });

  it('opens an item on click', async () => {
    const user = userEvent.setup();
    setup();
    const trigger = screen.getByRole('button', { name: items[0].question });
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the previous item in single-open mode', async () => {
    const user = userEvent.setup();
    setup();
    const first = screen.getByRole('button', { name: items[0].question });
    const second = screen.getByRole('button', { name: items[1].question });
    await user.click(first);
    await user.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(second).toHaveAttribute('aria-expanded', 'true');
  });

  it('keeps several items open when allowMultiple is set', async () => {
    const user = userEvent.setup();
    setup({ allowMultiple: true });
    const first = screen.getByRole('button', { name: items[0].question });
    const second = screen.getByRole('button', { name: items[1].question });
    await user.click(first);
    await user.click(second);
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(second).toHaveAttribute('aria-expanded', 'true');
  });

  it('refuses to close the last open item when allowCollapse is false', async () => {
    const user = userEvent.setup();
    setup({ allowCollapse: false, defaultOpenId: 'a' });
    const first = screen.getByRole('button', { name: items[0].question });
    expect(first).toHaveAttribute('aria-expanded', 'true');
    await user.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens the default item on mount', () => {
    setup({ defaultOpenId: 'b' });
    expect(screen.getByRole('button', { name: items[1].question })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('disables individual items and ignores clicks', async () => {
    const user = userEvent.setup();
    setup({ items: [{ ...items[0], disabled: true }, items[1]] });
    const disabled = screen.getByRole('button', { name: items[0].question });
    expect(disabled).toBeDisabled();
    await user.click(disabled);
    expect(disabled).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders two-digit indices when numbered', () => {
    const { container } = setup({ numbered: true });
    const indices = container.querySelectorAll('.nq-acc-index');
    expect(indices).toHaveLength(items.length);
    expect(indices[0].textContent).toBe('01');
  });

  it('renders no indicator when icon is "none"', () => {
    const { container } = setup({ icon: 'none' });
    expect(container.querySelector('.nq-acc-icon')).toBeNull();
  });

  it('moves the indicator before the question when iconPosition is start', () => {
    const { container } = setup({ iconPosition: 'start' });
    expect(container.querySelector('.nq-acc')).toHaveClass('nq-acc--icon-start');
  });

  it('renders no empty state by default when there are no items', () => {
    const { container } = setup({ items: [] });
    expect(container.querySelector('.nq-acc-empty')).toBeNull();
  });

  it('renders the optional empty state when there are no items', () => {
    setup({ items: [], emptyState: 'Nothing here yet.' });
    expect(screen.getByText('Nothing here yet.')).toBeInTheDocument();
  });
});
