import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import Tabs from '../components/ui/Tabs/Tabs.jsx';

describe('Tabs', () => {
  const items = [
    { id: 'one', label: 'One', content: 'First panel' },
    { id: 'two', label: 'Two', content: 'Second panel' },
  ];

  it('renders the active panel and switches tabs', () => {
    render(<Tabs items={items} />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('First panel');
    fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Second panel');
  });

  it('supports keyboard navigation', () => {
    render(<Tabs items={items} />);
    const first = screen.getByRole('tab', { name: 'One' });
    first.focus();
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Second panel');
  });
});
