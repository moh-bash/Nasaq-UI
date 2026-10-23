const KEY_LAST_COMPONENT = 'nq.shell.lastComponent';
const KEY_SIDEBAR = 'nq.shell.sidebar';

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
