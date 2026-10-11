import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../src/index.js';

describe('Button', () => {
  it('renders the label with the default classes', () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveClass('btn', 'btn--primary', 'btn--md', 'btn--align-start');
    expect(btn.querySelector('.btn__label')).not.toBeNull();
  });

  it('applies variant, size and full width', () => {
    render(
      <Button variant="outline" size="lg" fullWidth>
        Wide
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Wide' });
    expect(btn).toHaveClass('btn--outline', 'btn--lg', 'btn--full');
    expect(btn).not.toHaveClass('btn--align-start');
  });

  it('enters a busy loading state', () => {
    const { container } = render(<Button loading>Saving</Button>);
    const btn = screen.getByRole('button', { name: 'Saving' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelector('.btn__spinner')).not.toBeNull();
    expect(container.querySelector('.btn__label')).not.toBeNull();
  });

  it('is disabled when disabled is set', () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole('button', { name: 'Nope' })).toBeDisabled();
  });

  it('renders leading and trailing icons', () => {
    const { container } = render(
      <Button leadingIcon={<svg />} trailingIcon={<svg />}>
        Go
      </Button>,
    );
    expect(container.querySelectorAll('.btn__icon')).toHaveLength(2);
  });
});