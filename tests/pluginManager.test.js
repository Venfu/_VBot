import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createPluginSkeleton, loadPlugins } from '../src/pluginManager.js';

test('createPluginSkeleton writes plugin files', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vbot-plugin-'));
  const pluginName = 'sample-plugin';

  await createPluginSkeleton(pluginName, tempDir);

  const pluginDir = path.join(tempDir, pluginName);
  const files = await fs.readdir(pluginDir);
  assert.ok(files.includes('index.js'));
  assert.ok(files.includes('components'));
  const configComponent = await fs.readFile(path.join(pluginDir, 'components', 'config.js'), 'utf8');
  assert.match(configComponent, /customElements\.define/);
});

test('loadPlugins executes plugin init function', async () => {
  const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'vbot-loader-'));
  const pluginDir = path.join(tempDir, 'demo-plugin');
  await fs.mkdir(path.join(pluginDir, 'components'), { recursive: true });
  await fs.writeFile(
    path.join(pluginDir, 'index.js'),
    `export function init(bot) { bot.registerPlugin({ name: 'demo-plugin', status: 'loaded' }); }`
  );

  const bot = {
    registerPlugin: (plugin) => {
      bot.loadedPlugin = plugin;
    },
  };

  const loaded = await loadPlugins(tempDir, bot);
  assert.equal(loaded.length, 1);
  assert.equal(bot.loadedPlugin.name, 'demo-plugin');
});
