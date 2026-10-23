const KEY_LAST_COMPONENT = 'nq.shell.lastComponent';
const KEY_SIDEBAR = 'nq.shell.sidebar';
const KEY_EXPANDED = 'nq.shell.expanded';
const VIEW_PREFIX = 'nq.shell.view.';

function safeGet(key) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

export function getLastComponent() {
  return safeGet(KEY_LAST_COMPONENT);
}

export function setLastComponent(id) {
  if (!id) return;
  safeSet(KEY_LAST_COMPONENT, id);
}

export function getSidebarState() {
  const raw = safeGet(KEY_SIDEBAR);
  if (raw === 'collapsed') return 'collapsed';
  if (raw === 'expanded') return 'expanded';
  return null;
}

export function setSidebarState(state) {
  safeSet(KEY_SIDEBAR, state === 'collapsed' ? 'collapsed' : 'expanded');
}

/* The view a component was last visited in. Falls back to docs. */
export function getLastView(componentId) {
  const value = safeGet(`${VIEW_PREFIX}${componentId}`);
  return value === 'playground' ? 'playground' : value === 'docs' ? 'docs' : null;
}

export function setLastView(componentId, view) {
  if (!componentId) return;
  safeSet(`${VIEW_PREFIX}${componentId}`, view === 'playground' ? 'playground' : 'docs');
}

export function getExpandedComponents() {
  const raw = safeGet(KEY_EXPANDED);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function setExpandedComponents(ids) {
  try {
    safeSet(KEY_EXPANDED, JSON.stringify([...new Set(ids)]));
  } catch {
    /* ignore */
  }
}

export function getFirstReadyComponentId(registry) {
  if (!registry) return 'accordion';
  if (Array.isArray(registry.readyComponents) && registry.readyComponents.length > 0) {
    return registry.readyComponents[0].id;
  }
  if (Array.isArray(registry.categories)) {
    for (const category of registry.categories) {
      for (const component of category.components || []) {
        if (component.status === 'ready') return component.id;
      }
    }
  }
  return 'accordion';
}
