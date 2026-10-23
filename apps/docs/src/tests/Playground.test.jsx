import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../providers/ThemeProvider.jsx';
import { StylingModeProvider } from '../providers/StylingModeProvider.jsx';
import { getReadyComponent } from '../registry/componentRegistry.js';
import Playground from '../playground/Playground.jsx';
import { ShellProvider } from '../layouts/ShellContext.jsx';

function renderStudio(componentId) {
  const component = getReadyComponent(componentId);
  const shellValue = {
    collapsed: false,
    toggleCollapsed: () => {},
    mobileOpen: false,
    openMobileDrawer: () => {},
    closeMobileDrawer: () => {},
    isNarrow: false,
    view: 'playground',
  };
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <StylingModeProvider>
          <ShellProvider value={shellValue}>
            <Playground component={component} />
          </ShellProvider>
        </StylingModeProvider>
      </ThemeProvider>
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
