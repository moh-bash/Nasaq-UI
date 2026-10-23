/*
  A localStorage wrapper that never throws. Private browsing, disabled storage
  and quota errors are common; the docs app must keep working in memory when
  persistence is unavailable.

  Zustand's persist middleware only needs getItem/setItem/removeItem, so this
  object is intentionally small. `keys()` is used once to migrate the old
  `cp.<id>.*` keys.
*/

const memory = new Map();

function backingKeys(backing) {
  if (!backing) return [];
  try {
    if (typeof backing.keys === 'function') return [...backing.keys()];
    if (typeof backing.length === 'number' && typeof backing.key === 'function') {
      const keys = [];
      for (let index = 0; index < backing.length; index += 1) {
        const key = backing.key(index);
        if (key !== null) keys.push(key);
      }
      return keys;
    }
    return Object.keys(backing);
  } catch {
    return [];
  }
}

function supportsLocalStorage(candidate) {
  if (!candidate) return false;
  try {
    const probe = '__nq_storage_probe__';
    candidate.setItem(probe, '1');
    candidate.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

export function createSafeStorage(candidate) {
  const backing =
    candidate === undefined
      ? typeof window !== 'undefined'
        ? window.localStorage
        : null
      : candidate;
  let useBacking = supportsLocalStorage(backing);

  const readMemory = (key) => (memory.has(key) ? memory.get(key) : null);

  /* Keep values written before this point readable after a quota/disabled
     failure switches the session to memory. */
  const drainBacking = () => {
    try {
      for (const key of backingKeys(backing)) {
        const value = backing.getItem(key);
        if (value !== null) memory.set(key, value);
      }
    } catch {
      /* the backing storage is unreadable; nothing to drain */
    }
  };

  return {
    getItem(key) {
      if (useBacking) {
        try {
          return backing.getItem(key);
        } catch {
          useBacking = false;
        }
      }
      return readMemory(key);
    },
    setItem(key, value) {
      if (useBacking) {
        try {
          backing.setItem(key, value);
          return;
        } catch {
          /* quota or disabled mid-session — fall through to memory */
          drainBacking();
          useBacking = false;
        }
      }
      memory.set(key, String(value));
    },
    removeItem(key) {
      if (useBacking) {
        try {
          backing.removeItem(key);
        } catch {
          drainBacking();
          useBacking = false;
        }
      }
      memory.delete(key);
    },
    keys() {
      if (useBacking) {
        try {
          return backingKeys(backing);
        } catch {
          drainBacking();
          useBacking = false;
        }
      }
      return [...memory.keys()];
    },
    get usingBacking() {
      return useBacking;
    },
  };
}

export const safeStorage = createSafeStorage();

export function readJSON(key) {
  const raw = safeStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function writeJSON(key, value) {
  try {
    safeStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* the wrapper already falls back, this guards the stringify */
  }
}
