import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../app/App.jsx';

describe('App shell', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

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

  it('redirects legacy /playground to first ready component playground', async () => {
    window.history.pushState({}, '', '/playground');
    render(<App />);
    expect(await screen.findByRole('tab', { name: 'Docs' })).toBeInTheDocument();
    expect(await screen.findByRole('tab', { name: 'Playground' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/docs/components/accordion/playground');
  });

  it('redirects legacy /playground/button to component playground', async () => {
    window.history.pushState({}, '', '/playground/button');
    render(<App />);
    expect(await screen.findByRole('tab', { name: 'Playground' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/docs/components/button/playground');
  });

  it('redirects legacy /components/tabs to component docs', async () => {
    window.history.pushState({}, '', '/components/tabs');
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1, name: 'Tabs' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/docs/components/tabs');
  });

  it('keeps sidebar mounted and search text across Docs/Playground switch', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/docs/components/accordion');
    render(<App />);
    const search = await screen.findByLabelText('Search components');
    await user.type(search, 'button');
    expect(search).toHaveValue('button');
    const playgroundTab = await screen.findByRole('tab', { name: 'Playground' });
    await user.click(playgroundTab);
    expect(await screen.findByRole('tab', { name: 'Playground' })).toBeInTheDocument();
    const searchAfter = screen.getByLabelText('Search components');
    expect(searchAfter).toHaveValue('button');
    expect(window.location.pathname).toBe('/docs/components/accordion/playground');
  });

  it('clicking component in Playground view stays in Playground view', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/docs/components/accordion/playground');
    render(<App />);
    const buttonLink = await screen.findByRole('link', { name: /Button/i });
    await user.click(buttonLink);
    expect(await screen.findByRole('tab', { name: 'Playground' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/docs/components/button/playground');
  });

  it('header Playground link follows nq.shell.lastComponent', async () => {
    window.localStorage.setItem('nq.shell.lastComponent', 'tabs');
    window.history.pushState({}, '', '/docs/components/tabs');
    render(<App />);
    const playgroundLink = await screen.findByRole('link', { name: 'Playground' });
    expect(playgroundLink).toHaveAttribute('href', '/docs/components/tabs/playground');
  });

  it('sidebar collapse state persists via localStorage', async () => {
    window.history.pushState({}, '', '/docs/components/accordion');
    render(<App />);
    const collapseBtn = await screen.findByRole('button', { name: /Collapse sidebar/i });
    await userEvent.click(collapseBtn);
    expect(window.localStorage.getItem('nq.shell.sidebar')).toBe('collapsed');
  });
});