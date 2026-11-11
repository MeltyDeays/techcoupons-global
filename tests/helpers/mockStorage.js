// Deterministic In-Memory localStorage Mock for Node.js Testing
export class MockStorage {
  constructor() {
    this._store = new Map();
    this.shouldThrowQuota = false;
  }

  getItem(key) {
    const k = String(key);
    return this._store.has(k) ? this._store.get(k) : null;
  }

  setItem(key, value) {
    if (this.shouldThrowQuota) {
      const err = new Error('QuotaExceededError: The quota has been exceeded.');
      err.name = 'QuotaExceededError';
      throw err;
    }
    this._store.set(String(key), String(value));
  }

  removeItem(key) {
    this._store.delete(String(key));
  }

  clear() {
    this._store.clear();
  }

  key(index) {
    const keys = Array.from(this._store.keys());
    return keys[index] || null;
  }

  get length() {
    return this._store.size;
  }

  // Test inspection utilities
  dump() {
    return Object.fromEntries(this._store);
  }

  loadRaw(key, rawString) {
    this._store.set(String(key), rawString);
  }
}

export function installMockStorage() {
  const storage = new MockStorage();
  globalThis.localStorage = storage;
  if (typeof globalThis.window === 'undefined') {
    globalThis.window = { localStorage: storage };
  } else {
    globalThis.window.localStorage = storage;
  }
  return storage;
}
