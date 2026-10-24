import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';
import { STYLING_MODES } from '../generators/index.js';
import { safeStorage } from './safeStorage.js';

/*
  Playground-only preferences: which exporter the code panel renders, the
  preview viewport and the board background. Kept out of the shell store so a
  code-panel toggle never re-renders the sidebar.
*/

const KEY = 'nq.playground.v1';
const LEGACY_KEY = 'cp.styling.v1';
const VIEWPORTS = ['desktop', 'tablet', 'mobile'];
const BACKGROUNDS = ['paper', 'white', 'ink', 'grid', 'checker'];
const MOBILE_VIEWS = ['preview', 'code'];
const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'];

export const initialPlaygroundData = {
  stylingMode: 'css',
  viewport: 'desktop',
  background: 'grid',
  mobileView: 'preview',
  packageManager: 'npm',
  splitLayout: { preview: 62, code: 38 },
};

function normaliseLayout(raw) {
  if (!raw || typeof raw !== 'object') return { preview: 62, code: 38 };
  const preview = Number(raw.preview);
  const code = Number(raw.code);
  if (!Number.isFinite(preview) || !Number.isFinite(code)) return { preview: 62, code: 38 };
  const clampedPreview = Math.min(85, Math.max(20, preview));
  return { preview: clampedPreview, code: 100 - clampedPreview };
}

function readLegacyStyling() {
  const raw = safeStorage.getItem(LEGACY_KEY);
  return STYLING_MODES.includes(raw) ? { stylingMode: raw } : {};
}

export const usePlaygroundStore = create(
  devtools(
    persist(
      (set, get) => ({
        ...initialPlaygroundData,
        ...readLegacyStyling(),

        setStylingMode(mode) {
          if (!STYLING_MODES.includes(mode) || get().stylingMode === mode) return;
          set({ stylingMode: mode }, false, 'playground/setStylingMode');
        },

        setViewport(viewport) {
          if (!VIEWPORTS.includes(viewport) || get().viewport === viewport) return;
          set({ viewport }, false, 'playground/setViewport');
        },

        setBackground(background) {
          if (!BACKGROUNDS.includes(background) || get().background === background) return;
          set({ background }, false, 'playground/setBackground');
        },

        setMobileView(view) {
          if (!MOBILE_VIEWS.includes(view) || get().mobileView === view) return;
          set({ mobileView: view }, false, 'playground/setMobileView');
        },

        setPackageManager(manager) {
          if (!PACKAGE_MANAGERS.includes(manager) || get().packageManager === manager) return;
          set({ packageManager: manager }, false, 'playground/setPackageManager');
        },

        setSplitLayout(layout) {
          const next = normaliseLayout(layout);
          const current = get().splitLayout;
          if (current.preview === next.preview && current.code === next.code) return;
          set({ splitLayout: next }, false, 'playground/setSplitLayout');
        },
      }),
      {
        name: KEY,
        version: 1,
        storage: createJSONStorage(() => safeStorage),
        partialize: (state) => ({
          stylingMode: state.stylingMode,
          viewport: state.viewport,
          background: state.background,
          mobileView: state.mobileView,
          packageManager: state.packageManager,
          splitLayout: state.splitLayout,
        }),
        migrate: (persisted) => {
          if (!persisted || typeof persisted !== 'object') return readLegacyStyling();
          return {
            stylingMode: STYLING_MODES.includes(persisted.stylingMode)
              ? persisted.stylingMode
              : 'css',
            viewport: VIEWPORTS.includes(persisted.viewport) ? persisted.viewport : 'desktop',
            background: BACKGROUNDS.includes(persisted.background) ? persisted.background : 'grid',
            mobileView: MOBILE_VIEWS.includes(persisted.mobileView)
              ? persisted.mobileView
              : 'preview',
            packageManager: PACKAGE_MANAGERS.includes(persisted.packageManager)
              ? persisted.packageManager
              : 'npm',
            splitLayout: normaliseLayout(persisted.splitLayout),
          };
        },
        onRehydrateStorage: () => (_state, error) => {
          if (error) return;
        },
      },
    ),
    { name: 'nq.playground', enabled: import.meta.env.DEV },
  ),
);

export function resetPlaygroundStore() {
  usePlaygroundStore.setState(initialPlaygroundData);
}
