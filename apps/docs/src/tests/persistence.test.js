import { beforeEach, describe, expect, it, vi } from 'vitest';

/*
  Persistence/migration tests need a fresh module graph: the stores seed from
  legacy keys at import time. Each case writes storage first, then imports.
*/
describe('legacy state import', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.resetModules();
  });

  it('imports the old split shell keys', async () => {
    window.localStorage.setItem('nq.shell.sidebar', 'collapsed');
    window.localStorage.setItem('nq.shell.lastComponent', 'button');
    window.localStorage.setItem('nq.shell.view.button', 'playground');
    window.localStorage.setItem('nq.shell.expanded', JSON.stringify(['button', 'tabs', 42]));

    const { useShellStore } = await import('../stores/shellStore.js');
    const state = useShellStore.getState();
    expect(state.sidebarCollapsed).toBe(true);
    expect(state.lastComponentId).toBe('button');
    expect(state.lastViewByComponent.button).toBe('playground');
    expect(state.expandedComponentIds).toEqual(['button', 'tabs']);
  });

  it('prefers the new shell key over the legacy keys', async () => {
    window.localStorage.setItem('nq.shell.sidebar', 'collapsed');
    window.localStorage.setItem(
      'nq.shell.v1',
      JSON.stringify({
        state: {
          sidebarCollapsed: false,
          lastComponentId: 'tabs',
          lastViewByComponent: { tabs: 'docs' },
          expandedComponentIds: [],
        },
        version: 1,
      }),
    );

    const { useShellStore } = await import('../stores/shellStore.js');
    const state = useShellStore.getState();
    expect(state.sidebarCollapsed).toBe(false);
    expect(state.lastComponentId).toBe('tabs');
  });

  it('ignores corrupt persisted JSON', async () => {
    window.localStorage.setItem('nq.shell.v1', '{not json');
    const { useShellStore } = await import('../stores/shellStore.js');
    const state = useShellStore.getState();
    expect(state.sidebarCollapsed).toBe(false);
    expect(state.expandedComponentIds).toEqual([]);
  });

  it('imports the legacy theme and filters bad overrides', async () => {
    window.localStorage.setItem(
      'cp.theme.v1',
      JSON.stringify({ mode: 'dark', overrides: { primary: '#123456', broken: 'red' } }),
    );
    const { useThemeStore } = await import('../stores/themeStore.js');
    const state = useThemeStore.getState();
    expect(state.mode).toBe('dark');
    expect(state.overrides).toEqual({ primary: '#123456' });
  });

  it('imports per-component config and preset keys', async () => {
    window.localStorage.setItem('cp.button.config.v2', JSON.stringify({ variant: 'ghost' }));
    window.localStorage.setItem('cp.button.preset.v2', JSON.stringify('editorial'));

    const { useComponentConfigStore } = await import('../stores/componentConfigStore.js');
    const state = useComponentConfigStore.getState();
    expect(state.configs.button).toEqual({ variant: 'ghost' });
    expect(state.activePresetId.button).toBe('editorial');
  });

  it('imports the legacy styling mode', async () => {
    window.localStorage.setItem('cp.styling.v1', 'tailwind');
    const { usePlaygroundStore } = await import('../stores/playgroundStore.js');
    expect(usePlaygroundStore.getState().stylingMode).toBe('tailwind');
  });
});
