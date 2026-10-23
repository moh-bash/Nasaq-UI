import { create } from 'zustand';
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';
import { safeStorage } from './safeStorage.js';

/*
  Navigation state shared by the shell: sidebar width, the disclosure tree and
  the "remember where I was" rules. Persisted JSON; the drawer itself is
  transient and never written.
*/

const KEY = 'nq.shell.v1';

const LEGACY = {
  sidebar: 'nq.shell.sidebar',
  lastComponent: 'nq.shell.lastComponent',
  expanded: 'nq.shell.expanded',
  viewPrefix: 'nq.shell.view.',
};

function readLegacy() {
  const lastViewByComponent = {};
  for (const key of safeStorage.keys()) {
    if (!key.startsWith(LEGACY.viewPrefix)) continue;
    const id = key.slice(LEGACY.viewPrefix.length);
    if (!id) continue;
    const value = safeStorage.getItem(key);
    if (value === 'docs' || value === 'playground') lastViewByComponent[id] = value;
  }

  let expandedComponentIds = [];
  const expandedRaw = safeStorage.getItem(LEGACY.expanded);
  if (expandedRaw) {
    try {
      const parsed = JSON.parse(expandedRaw);
      if (Array.isArray(parsed)) {
        expandedComponentIds = parsed.filter((id) => typeof id === 'string');
      }
    } catch {
      /* corrupt legacy value — start clean */
    }
  }

  return {
    sidebarCollapsed: safeStorage.getItem(LEGACY.sidebar) === 'collapsed',
    lastComponentId: safeStorage.getItem(LEGACY.lastComponent) || null,
    lastViewByComponent,
    expandedComponentIds,
  };
}

export const initialShellData = {
  sidebarCollapsed: false,
  lastComponentId: null,
  lastViewByComponent: {},
  expandedComponentIds: [],
  mobileDrawerOpen: false,
  mobileDrawerPath: null,
  /* null = follow the breakpoint (closed on narrow, open on desktop) */
  inspectorOpen: null,
};

function normalizeView(view) {
  return view === 'playground' ? 'playground' : 'docs';
}

export const useShellStore = create(
  subscribeWithSelector(
    persist(
      devtools(
        (set, get) => ({
          ...initialShellData,
          ...readLegacy(),

          toggleCollapsed() {
            set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }), false, 'shell/toggleCollapsed');
          },

          setCollapsed(collapsed) {
            set({ sidebarCollapsed: Boolean(collapsed) }, false, 'shell/setCollapsed');
          },

          setLastComponent(componentId) {
            if (!componentId || get().lastComponentId === componentId) return;
            set({ lastComponentId: componentId }, false, 'shell/setLastComponent');
          },

          setLastView(componentId, view) {
            if (!componentId) return;
            const nextView = normalizeView(view);
            const state = get();
            if (state.lastViewByComponent[componentId] === nextView) return;
            set(
              {
                lastComponentId: componentId,
                lastViewByComponent: { ...state.lastViewByComponent, [componentId]: nextView },
              },
              false,
              'shell/setLastView',
            );
          },

          getLastView(componentId) {
            return get().lastViewByComponent[componentId] || null;
          },

          toggleExpanded(componentId) {
            if (!componentId) return;
            const current = get().expandedComponentIds;
            const next = current.includes(componentId)
              ? current.filter((id) => id !== componentId)
              : [...current, componentId];
            set({ expandedComponentIds: next }, false, 'shell/toggleExpanded');
          },

          setExpanded(componentId, expanded) {
            if (!componentId) return;
            const current = get().expandedComponentIds;
            const open = current.includes(componentId);
            if (open === Boolean(expanded)) return;
            set(
              {
                expandedComponentIds: expanded
                  ? [...current, componentId]
                  : current.filter((id) => id !== componentId),
              },
              false,
              'shell/setExpanded',
            );
          },

          openMobileDrawer(pathname) {
            set(
              { mobileDrawerOpen: true, mobileDrawerPath: pathname || null },
              false,
              'shell/openMobileDrawer',
            );
          },

          closeMobileDrawer() {
            if (!get().mobileDrawerOpen && !get().mobileDrawerPath) return;
            set(
              { mobileDrawerOpen: false, mobileDrawerPath: null },
              false,
              'shell/closeMobileDrawer',
            );
          },

          setInspectorOpen(open) {
            const next = Boolean(open);
            if (get().inspectorOpen === next) return;
            set({ inspectorOpen: next }, false, 'shell/setInspectorOpen');
          },



          resetShell() {
            set({ ...initialShellData }, false, 'shell/reset');
          },
        }),
        { name: 'nq.shell', enabled: import.meta.env.DEV },
      ),
      {
        name: KEY,
        version: 1,
        storage: createJSONStorage(() => safeStorage),
        partialize: (state) => ({
          sidebarCollapsed: state.sidebarCollapsed,
          lastComponentId: state.lastComponentId,
          lastViewByComponent: state.lastViewByComponent,
          expandedComponentIds: state.expandedComponentIds,
        }),
        migrate: (persisted) => {
          /* v0 state lived in separate keys; the seed above already covers the
             migration, this keeps a hand-written v0 blob working too. */
          if (!persisted || typeof persisted !== 'object') return readLegacy();
          const legacy = readLegacy();
          return {
            ...legacy,
            ...persisted,
            lastViewByComponent: {
              ...legacy.lastViewByComponent,
              ...(persisted.lastViewByComponent || {}),
            },
            expandedComponentIds: Array.isArray(persisted.expandedComponentIds)
              ? persisted.expandedComponentIds
              : legacy.expandedComponentIds,
          };
        },
        onRehydrateStorage: () => (_state, error) => {
          /* Corrupt JSON or blocked storage: keep the in-memory defaults. */
          if (error) return;
        },
      },
    ),
  ),
);

/** Snapshot of the data fields only, for tests that need a clean store. */
export const shellStoreInitial = (() => {
  const { mobileDrawerOpen, mobileDrawerPath, ...data } = initialShellData;
  void mobileDrawerOpen;
  void mobileDrawerPath;
  return data;
})();

export function resetShellStore() {
  useShellStore.setState(initialShellData);
}
