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

export const initialPlaygroundData = {
  stylingMode: 'css',
  viewport: 'desktop',
  background: 'grid',
  codePanelHeight: 268,
  codePanelCollapsed: false,
};

function clampHeight(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 268;
  return Math.min(560, Math.max(120, parsed));
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

        setCodePanelHeight(height) {
          const next = clampHeight(height);
          if (get().codePanelHeight === next) return;
          set({ codePanelHeight: next }, false, 'playground/setCodePanelHeight');
        },

        setCodePanelCollapsed(collapsed) {
          const next = Boolean(collapsed);
          if (get().codePanelCollapsed === next) return;
          set({ codePanelCollapsed: next }, false, 'playground/setCodePanelCollapsed');
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
          codePanelHeight: state.codePanelHeight,
          codePanelCollapsed: state.codePanelCollapsed,
        }),
        migrate: (persisted) => {
          if (!persisted || typeof persisted !== 'object') return readLegacyStyling();
          return {
            stylingMode: STYLING_MODES.includes(persisted.stylingMode)
              ? persisted.stylingMode
              : 'css',
            viewport: VIEWPORTS.includes(persisted.viewport) ? persisted.viewport : 'desktop',
            background: BACKGROUNDS.includes(persisted.background) ? persisted.background : 'grid',
            codePanelHeight: clampHeight(persisted.codePanelHeight),
            codePanelCollapsed: Boolean(persisted.codePanelCollapsed),
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
