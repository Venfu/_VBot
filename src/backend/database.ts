import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const dbPath = path.join(rootDir, 'data', 'vbot.json');

type DatabaseStore = {
  settings: Record<string, string>;
  events: Array<{ id: number; type: string; payload: string; createdAt: string }>;
};

function readStore() {
  try {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8')) as DatabaseStore;
  } catch {
    return { settings: {}, events: [] } as DatabaseStore;
  }
}

function writeStore(store: DatabaseStore) {
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  fs.writeFileSync(dbPath, JSON.stringify(store, null, 2));
}

export function createDatabase() {
  const store = readStore();
  if (!store.settings) store.settings = {};
  if (!store.events) store.events = [];
  writeStore(store);
  return {
    store,
    save() {
      writeStore(store);
    },
  };
}

export function getSetting(db: any, key: string, fallback: string | null = null) {
  return db.store.settings[key] ?? fallback;
}

export function setSetting(db: any, key: string, value: string) {
  db.store.settings[key] = value;
  db.save();
}

export function logEvent(db: any, type: string, payload: unknown) {
  const entry = { id: Date.now(), type, payload: JSON.stringify(payload), createdAt: new Date().toISOString() };
  db.store.events.unshift(entry);
  db.store.events = db.store.events.slice(0, 50);
  db.save();
}

export function listEvents(db: any) {
  return db.store.events;
}
