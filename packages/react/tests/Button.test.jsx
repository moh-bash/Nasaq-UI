import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../src/index';

describe('Button', () => {
  it('renders the label with the default classes', () => {
    render(<Button>Save</Button>);
    const btn = screen.getByRole('button', { name: 'Save' });
    expect(btn).toHaveClass('nq-btn', 'nq-btn--primary', 'nq-btn--md', 'nq-btn--align-start');
    expect(btn.querySelector('.nq-btn__label')).not.toBeNull();
  });

  it('applies variant, size and full width', () => {
    render(
      <Button variant="outline" size="lg" fullWidth>
        Wide
      </Button>,
    );
    const btn = screen.getByRole('button', { name: 'Wide' });
    expect(btn).toHaveClass('nq-btn--outline', 'nq-btn--lg', 'nq-btn--full');
    expect(btn).not.toHaveClass('nq-btn--align-start');
  });

  it('enters a busy loading state', () => {
    const { container } = render(<Button loading>Saving</Button>);
    const btn = screen.getByRole('button', { name: 'Saving' });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute('aria-busy', 'true');
    expect(container.querySelector('.nq-btn__spinner')).not.toBeNull();
    expect(container.querySelector('.nq-btn__label')).not.toBeNull();
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
    expect(container.querySelectorAll('.nq-btn__icon')).toHaveLength(2);
  });
});
