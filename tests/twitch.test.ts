import test from 'node:test';
import assert from 'node:assert/strict';
import { createDatabase, setSetting } from '../src/backend/database.js';
import { createTwitchService } from '../src/backend/twitch.js';

test('twitch service persists settings and exposes state', () => {
  const db = createDatabase();
  const service = createTwitchService(db);
  service.updateSettings({ channel: 'demo', username: 'bot', token: 'oauth:test' });

  const settings = service.getSettings();
  assert.equal(settings.channel, 'demo');
  assert.equal(settings.username, 'bot');
  assert.equal(settings.token, '***');

  const stored = getSetting(db, 'twitch.channel');
  assert.equal(stored, 'demo');
});

function getSetting(db: any, key: string) {
  return (db as any).prepare('SELECT value FROM settings WHERE key = ?').get(key).value;
}
