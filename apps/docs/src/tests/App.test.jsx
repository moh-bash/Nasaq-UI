import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../app/App.jsx';
import { useShellStore } from '../stores/shellStore.js';
import { readJSON } from '../stores/safeStorage.js';

function sidebar() {
  return screen.getByRole('navigation', { name: 'Documentation' });
}

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
    expect(screen.getAllByText('Props').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Usage').length).toBeGreaterThan(0);
  });

  it('redirects legacy /theme to the theming docs', async () => {
    window.history.pushState({}, '', '/theme');
    render(<App />);
    expect(
      await screen.findByRole('heading', { level: 1, name: /theming/i }),
    ).toBeInTheDocument();
    expect(screen.getByText('Live editor')).toBeInTheDocument();
  });

  it('redirects legacy /playground to the first ready component playground', async () => {
    window.history.pushState({}, '', '/playground');
    render(<App />);
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Accordion' }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe('/docs/components/accordion/playground');
  });

  it('redirects legacy /playground/button to component playground', async () => {
    window.history.pushState({}, '', '/playground/button');
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1, name: 'Button' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/docs/components/button/playground');
  });

  it('redirects legacy /components/tabs to component docs', async () => {
    window.history.pushState({}, '', '/components/tabs');
    render(<App />);
    expect(await screen.findByRole('heading', { level: 1, name: 'Tabs' })).toBeInTheDocument();
    expect(window.location.pathname).toBe('/docs/components/tabs');
  });

  it('has exactly one navigation landmark and no Docs/Playground switch in the header', async () => {
    window.history.pushState({}, '', '/docs/components/accordion');
    render(<App />);
    await screen.findByRole('heading', { level: 1, name: 'Accordion' });

    const header = screen.getByRole('banner');
    expect(within(header).queryByRole('link', { name: 'Playground' })).not.toBeInTheDocument();
    expect(within(header).queryByRole('link', { name: 'Docs' })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Documentation' })).toBeInTheDocument();
    expect(screen.queryByRole('tab', { name: 'Playground' })).not.toBeInTheDocument();
  });

  it('expands a ready component into Docs and Playground links', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/docs');
    render(<App />);
    await screen.findByRole('heading', { level: 1, name: 'Build with Nasaq UI' });

    const nav = sidebar();
    const buttonNode = within(nav).getByRole('button', { name: 'Button' });
    await user.click(buttonNode);

    expect(window.location.pathname).toBe('/docs/components/button');
    const docsChild = nav.querySelector('a[href="/docs/components/button"]');
    const playgroundChild = nav.querySelector('a[href="/docs/components/button/playground"]');
    expect(docsChild).toHaveAttribute('aria-current', 'page');
    expect(playgroundChild).toBeInTheDocument();
  });

  it('switches views from the sidebar without remounting it', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/docs/components/accordion');
    render(<App />);
    const search = await screen.findByLabelText('Search components');
    await user.type(search, 'accordion');
    expect(search).toHaveValue('accordion');

    const nav = sidebar();
    nav.scrollTop = 140;
    const playgroundChild = nav.querySelector('a[href="/docs/components/accordion/playground"]');
    expect(playgroundChild).toBeInTheDocument();
    await user.click(playgroundChild);

    expect(window.location.pathname).toBe('/docs/components/accordion/playground');
    expect(sidebar()).toBe(nav);
    expect(sidebar()).toHaveProperty('scrollTop', 140);
    expect(screen.getByLabelText('Search components')).toHaveValue('accordion');
  });

  it('keeps the component view when moving between components', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/docs/components/accordion/playground');
    render(<App />);

    const buttonNode = within(sidebar()).getByRole('button', { name: 'Button' });
    await user.click(buttonNode);
    expect(window.location.pathname).toBe('/docs/components/button/playground');
  });

  it('lands on the last used view for a component from another section', async () => {
    const user = userEvent.setup();
    useShellStore.getState().setLastView('button', 'playground');
    window.history.pushState({}, '', '/docs/theming');
    render(<App />);

    const buttonNode = within(sidebar()).getByRole('button', { name: 'Button' });
    await user.click(buttonNode);
    expect(window.location.pathname).toBe('/docs/components/button/playground');
  });

  it('collapses to an icon rail that can always be expanded again', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/docs/components/accordion');
    render(<App />);
    const collapseBtn = await screen.findByRole('button', { name: /collapse sidebar/i });
    await user.click(collapseBtn);

    expect(useShellStore.getState().sidebarCollapsed).toBe(true);
    expect(readJSON('nq.shell.v1').state.sidebarCollapsed).toBe(true);
    const expandBtn = await screen.findByRole('button', { name: /expand sidebar/i });
    await user.click(expandBtn);
    expect(useShellStore.getState().sidebarCollapsed).toBe(false);
    expect(readJSON('nq.shell.v1').state.sidebarCollapsed).toBe(false);
  });

  it('filters the sidebar and keeps the matching component expanded', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/docs');
    render(<App />);
    const search = await screen.findByLabelText('Search components');
    await user.type(search, 'tabs');

    const nav = sidebar();
    expect(within(nav).queryByRole('button', { name: /accordion/i })).not.toBeInTheDocument();
    const tabsNode = within(nav).getByRole('button', { name: /tabs/i });
    expect(tabsNode).toHaveAttribute('aria-expanded', 'true');
    expect(nav.querySelector('mark')).toHaveTextContent(/tabs/i);
  });

  it('shows planned components as disabled, non-focusable rows', async () => {
    window.history.pushState({}, '', '/docs');
    render(<App />);
    const nav = sidebar();
    const planned = within(nav).getByText('Stack').closest('[aria-disabled="true"]');
    expect(planned).toBeInTheDocument();
    expect(planned).not.toHaveAttribute('tabindex');
    expect(within(planned).getByText('Soon')).toBeInTheDocument();
  });
});
