import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { getReadyComponent } from '../registry/componentRegistry.js';
import Playground from '../playground/Playground.jsx';

function renderStudio(componentId) {
  const component = getReadyComponent(componentId);
  return render(
    <MemoryRouter>
      <Playground component={component} />
    </MemoryRouter>,
  );
}

describe('Playground', () => {
  it('mounts the accordion studio with its generated files', () => {
    renderStudio('accordion');
    expect(screen.getByRole('tablist', { name: /code files/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'CSS' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Usage' })).toBeInTheDocument();
  });

  it('mounts the button studio', () => {
    renderStudio('button');
    expect(screen.getByRole('tablist', { name: /code files/i })).toBeInTheDocument();
    expect(screen.getAllByText('Button').length).toBeGreaterThan(0);
  });
});
