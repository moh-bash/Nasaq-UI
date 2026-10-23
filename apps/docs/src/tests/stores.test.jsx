import { describe, expect, it } from 'vitest';
import { Profiler } from 'react';
import { act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createSafeStorage, readJSON } from '../stores/safeStorage.js';
import { useShellStore } from '../stores/shellStore.js';
import { useThemeStore } from '../stores/themeStore.js';
import { usePlaygroundStore } from '../stores/playgroundStore.js';
import { useComponentConfigStore } from '../stores/componentConfigStore.js';
import AppSidebar from '../layouts/AppSidebar.jsx';
import { getReadyComponent } from '../registry/componentRegistry.js';

function failingStorage() {
  return {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('blocked');
    },
    removeItem() {
      throw new Error('blocked');
    },
  };
}

describe('safeStorage', () => {
  it('keeps working in memory when localStorage is blocked', () => {
    const storage = createSafeStorage(failingStorage());
    expect(() => storage.setItem('nq.test', 'value')).not.toThrow();
    expect(storage.getItem('nq.test')).toBe('value');
    expect(storage.keys()).toContain('nq.test');
    storage.removeItem('nq.test');
    expect(storage.getItem('nq.test')).toBeNull();
    expect(storage.usingBacking).toBe(false);
  });

  it('drains previously stored values when a quota error disables the backing store', () => {
    const data = new Map();
    let blocked = false;
    const backing = {
      getItem(key) {
        return data.has(key) ? data.get(key) : null;
      },
      setItem(key, value) {
        if (blocked) throw new Error('quota');
        data.set(key, value);
      },
      removeItem(key) {
        data.delete(key);
      },
      keys() {
        return [...data.keys()];
      },
    };

    const storage = createSafeStorage(backing);
    storage.setItem('nq.before', 'kept');
    blocked = true;
    storage.setItem('nq.after', 'also-kept');

    expect(storage.usingBacking).toBe(false);
    expect(storage.getItem('nq.before')).toBe('kept');
    expect(storage.getItem('nq.after')).toBe('also-kept');
  });

  it('exposes a JSON helper that tolerates corrupt values', () => {
    expect(readJSON('nq.missing')).toBeNull();
    window.localStorage.setItem('nq.corrupt', '{not json');
    expect(readJSON('nq.corrupt')).toBeNull();
  });
});

describe('shell store', () => {
  it('toggles the collapse state and persists it once', () => {
    const before = useShellStore.getState().sidebarCollapsed;
    useShellStore.getState().toggleCollapsed();
    expect(useShellStore.getState().sidebarCollapsed).toBe(!before);
    expect(readJSON('nq.shell.v1').state.sidebarCollapsed).toBe(!before);
  });

  it('normalises the remembered view to docs or playground', () => {
    useShellStore.getState().setLastView('button', 'playground');
    useShellStore.getState().setLastView('tabs', 'nonsense');
    expect(useShellStore.getState().lastViewByComponent.button).toBe('playground');
    expect(useShellStore.getState().lastViewByComponent.tabs).toBe('docs');
    expect(useShellStore.getState().getLastView('unknown')).toBeNull();
  });

  it('never persists the transient drawer', () => {
    useShellStore.getState().openMobileDrawer('/docs/components/button');
    expect(useShellStore.getState().mobileDrawerOpen).toBe(true);
    const persisted = readJSON('nq.shell.v1').state;
    expect(persisted.mobileDrawerOpen).toBeUndefined();
    expect(persisted.mobileDrawerPath).toBeUndefined();
  });
});

describe('theme store', () => {
  it('accepts light, dark and system modes', () => {
    useThemeStore.getState().setMode('dark');
    expect(useThemeStore.getState().mode).toBe('dark');
    useThemeStore.getState().setMode('system');
    expect(useThemeStore.getState().mode).toBe('system');
    useThemeStore.getState().setMode('sepia');
    expect(useThemeStore.getState().mode).toBe('system');
  });

  it('rejects invalid tokens and colours', () => {
    useThemeStore.getState().setToken('primary', '#123456');
    expect(useThemeStore.getState().overrides.primary).toBe('#123456');
    useThemeStore.getState().setToken('primary', 'red');
    expect(useThemeStore.getState().overrides.primary).toBe('#123456');
    useThemeStore.getState().setToken('bad token', '#ffffff');
    expect(useThemeStore.getState().overrides['bad token']).toBeUndefined();
    useThemeStore.getState().setToken('primary', null);
    expect(useThemeStore.getState().overrides.primary).toBeUndefined();
  });
});

describe('playground store', () => {
  it('persists the styling mode and viewport without touching the shell key', () => {
    const shellBefore = readJSON('nq.shell.v1').state;
    usePlaygroundStore.getState().setStylingMode('tailwind');
    usePlaygroundStore.getState().setViewport('mobile');
    expect(readJSON('nq.playground.v1').state).toMatchObject({
      stylingMode: 'tailwind',
      viewport: 'mobile',
    });
    expect(readJSON('nq.shell.v1').state).toEqual(shellBefore);
  });
});

describe('component config store', () => {
  it('clamps out-of-range values through the component validator', () => {
    const button = getReadyComponent('button');
    useComponentConfigStore.getState().updateConfig(button, 'layout.radius', 5000, 'Radius');
    useComponentConfigStore.getState().updateConfig(button, 'variant', 'nope', 'Variant');
    const config = useComponentConfigStore.getState().configs.button;
    expect(config.layout.radius).toBe(999);
    expect(config.variant).toBe('primary');
    expect(readJSON('nq.configs.v1').state.configs.button.layout.radius).toBe(999);
  });

  it('applies a preset and reports the change', () => {
    const button = getReadyComponent('button');
    const preset = button.presets[0];
    useComponentConfigStore.getState().applyPresetById(button, preset.id);
    const state = useComponentConfigStore.getState();
    expect(state.activePresetId.button).toBe(preset.id);
    expect(state.lastChange.label).toBe('Preset');
    expect(state.lastChange.value).toBe(preset.name);
  });
});

describe('render isolation', () => {
  it('does not re-render the sidebar when only a component config changes', () => {
    let renders = 0;
    const button = getReadyComponent('button');
    render(
      <MemoryRouter initialEntries={['/docs/components/button']}>
        <Profiler id="sidebar" onRender={() => { renders += 1; }}>
          <AppSidebar />
        </Profiler>
      </MemoryRouter>,
    );

    const afterMount = renders;
    act(() => {
      useComponentConfigStore.getState().updateConfig(button, 'variant', 'ghost', 'Variant');
    });
    expect(renders).toBe(afterMount);
  });
});
