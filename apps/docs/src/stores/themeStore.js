import { create } from 'zustand';
import { createJSONStorage, devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { defaultTheme, resolveTheme } from 'nasaq';
import { safeStorage } from './safeStorage.js';

/*
  Theme state: a mode (light/dark/system) plus per-token hex overrides.

  Compatibility:
  - old `cp.theme.v1` blobs (light|dark only) are imported on first run
  - the legacy `cp.theme.v1` key is left untouched
  - the store owns the <html data-theme> attributes so the page paints the
    right palette before React mounts (see the boot script in index.html)
*/

const KEY = 'nq.theme.v1';
const LEGACY_KEY = 'cp.theme.v1';
const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;
const TOKEN_RE = /^[a-z][a-z0-9-]*$/i;
const MODES = ['light', 'dark', 'system'];

export const initialThemeData = {
  mode: 'system',
  overrides: {},
};

function systemMode() {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function sanitizeOverrides(raw) {
  const overrides = {};
  if (!raw || typeof raw !== 'object') return overrides;
  for (const [token, value] of Object.entries(raw)) {
    if (!TOKEN_RE.test(token)) continue;
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (HEX_RE.test(trimmed)) overrides[token] = trimmed.toLowerCase();
  }
  return overrides;
}

function readLegacyTheme() {
  const raw = safeStorage.getItem(LEGACY_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return {
      mode: parsed.mode === 'dark' ? 'dark' : 'light',
      overrides: sanitizeOverrides(parsed.overrides),
    };
  } catch {
    return {};
  }
}

function resolvedModeFor(mode) {
  return mode === 'system' ? systemMode() : mode === 'dark' ? 'dark' : 'light';
}

export function applyThemeToDocument(state) {
  if (typeof document === 'undefined') return;
  const resolvedMode = resolvedModeFor(state.mode);
  const root = document.documentElement;
  root.dataset.themePreference = state.mode;
  root.dataset.themeMode = resolvedMode;
  root.dataset.theme = resolvedMode;
  root.style.colorScheme = resolvedMode;
}

export function themeFor(state) {
  return { ...defaultTheme(), mode: resolvedModeFor(state.mode), overrides: state.overrides };
}

export function resolvedTokens(state) {
  return resolveTheme(themeFor(state));
}

export const useThemeStore = create(
  subscribeWithSelector(
    persist(
      devtools(
        (set, get) => ({
          ...initialThemeData,
          ...readLegacyTheme(),

          setMode(mode) {
            if (!MODES.includes(mode) || get().mode === mode) return;
            set({ mode }, false, 'theme/setMode');
          },

          setToken(token, value) {
            if (!TOKEN_RE.test(token)) return;
            const overrides = { ...get().overrides };
            if (value === null) {
              delete overrides[token];
            } else {
              if (typeof value !== 'string' || !HEX_RE.test(value.trim())) return;
              overrides[token] = value.trim().toLowerCase();
            }
            set({ overrides }, false, 'theme/setToken');
          },

          resetToken(token) {
            if (!(token in get().overrides)) return;
            const overrides = { ...get().overrides };
            delete overrides[token];
            set({ overrides }, false, 'theme/resetToken');
          },

          resetOverrides() {
            if (Object.keys(get().overrides).length === 0) return;
            set({ overrides: {} }, false, 'theme/resetOverrides');
          },

          resetTheme() {
            set({ ...initialThemeData }, false, 'theme/resetTheme');
          },
        }),
        { name: 'nq.theme', enabled: import.meta.env.DEV },
      ),
      {
        name: KEY,
        version: 2,
        storage: createJSONStorage(() => safeStorage),
        partialize: (state) => ({ mode: state.mode, overrides: state.overrides }),
        migrate: (persisted) => {
          if (!persisted || typeof persisted !== 'object') return readLegacyTheme();
          return {
            mode: MODES.includes(persisted.mode) ? persisted.mode : 'system',
            overrides: sanitizeOverrides(persisted.overrides),
          };
        },
        onRehydrateStorage: () => (_state, error) => {
          if (error) return;
        },
      },
    ),
  ),
);

applyThemeToDocument(useThemeStore.getState());
useThemeStore.subscribe((state) => applyThemeToDocument(state));

if (typeof window !== 'undefined' && window.matchMedia) {
  const query = window.matchMedia('(prefers-color-scheme: dark)');
  const onChange = () => applyThemeToDocument(useThemeStore.getState());
  if (typeof query.addEventListener === 'function') {
    query.addEventListener('change', onChange);
  } else if (typeof query.addListener === 'function') {
    query.addListener(onChange);
  }
}

export function resetThemeStore() {
  useThemeStore.setState(initialThemeData);
}
