import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function createDatabase(dbPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'vbot.db')) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify({}, null, 2));
  }

  const database = {
    path: dbPath,
    async load() {
      const data = await fs.readFile(dbPath, 'utf8');
      return JSON.parse(data);
    },
    async save(data) {
      await fs.writeFile(dbPath, JSON.stringify(data, null, 2));
    },
  };

  return database;
}

export async function getSetting(db, key, fallback = null) {
  const data = await db.load();
  return data[key] ?? fallback;
}

export async function setSetting(db, key, value) {
  const data = await db.load();
  data[key] = String(value);
  await db.save(data);
}
