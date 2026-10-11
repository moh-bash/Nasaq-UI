import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../app/App.jsx';

describe('App shell', () => {
  it('renders the landing page and points to the docs start page', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get started/i })).toHaveAttribute('href', '/docs');
  });

  it('renders the docs start page at /docs', async () => {
    window.history.pushState({}, '', '/docs');
    render(<App />);
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Build with Nasaq UI' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Quick install')).toBeInTheDocument();
  });

  it('redirects legacy /components to /docs/components', async () => {
    window.history.pushState({}, '', '/components');
    render(<App />);
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Components' }),
    ).toBeInTheDocument();
    expect(screen.getAllByText('Accordion').length).toBeGreaterThan(0);
  });

  it('redirects legacy /components/accordion to component docs', async () => {
    window.history.pushState({}, '', '/components/accordion');
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1, name: 'Accordion' })).toBeInTheDocument();
    expect(screen.getByText('Props')).toBeInTheDocument();
    expect(screen.getByText('Usage')).toBeInTheDocument();
  });

  it('redirects legacy /theme to the theming docs', async () => {
    window.history.pushState({}, '', '/theme');
    render(<App />);
    expect(
      await screen.findByRole('heading', { level: 1, name: /theming/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Live editor')).toBeInTheDocument();
  });
});