import { safeStorage } from '../stores/safeStorage.js';
import { resetShellStore } from '../stores/shellStore.js';
import { resetThemeStore } from '../stores/themeStore.js';
import { resetPlaygroundStore } from '../stores/playgroundStore.js';
import { resetComponentConfigStore } from '../stores/componentConfigStore.js';

/*
  Store modules are singletons. Tests get a clean slate: drop every key this app
  owns, then reset the in-memory state (which also rewrites the defaults).
*/
export function resetStoresForTests() {
  for (const key of safeStorage.keys()) {
    if (key.startsWith('nq.') || key.startsWith('cp.')) safeStorage.removeItem(key);
  }
  resetShellStore();
  resetThemeStore();
  resetPlaygroundStore();
  resetComponentConfigStore();
}
