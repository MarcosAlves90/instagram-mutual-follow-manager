export class MemoryStorage {
  constructor(initial = {}) {
    this.data = new Map(Object.entries(initial));
  }
  get length() { return this.data.size; }
  clear() { this.data.clear(); }
  getItem(key) { return this.data.has(key) ? this.data.get(key) : null; }
  key(index) { return [...this.data.keys()][index] ?? null; }
  removeItem(key) { this.data.delete(key); }
  setItem(key, value) { this.data.set(String(key), String(value)); }
}
