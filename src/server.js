import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDatabase, getSetting, setSetting } from './database.js';
import { createPluginSkeleton, loadPlugins } from './pluginManager.js';

export async function createApp() {
  const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
  const db = await createDatabase(path.join(rootDir, 'data', 'vbot.db'));
  const pluginsDir = path.join(rootDir, 'plugins');
  const publicDir = path.join(rootDir, 'public');

  const state = {
    plugins: [],
    settings: {},
  };

  const botApi = {
    registerPlugin(plugin) {
      state.plugins.push(plugin);
    },
    sendMessage(message) {
      return { ok: true, message };
    },
    db,
  };

  async function loadSettings() {
    const entries = await fs.readdir(path.join(rootDir, 'data'), { withFileTypes: true }).catch(() => []);
    if (!entries.some((entry) => entry.isFile() && entry.name === 'vbot.db')) {
      return;
    }
    const keys = Object.keys(JSON.parse(await fs.readFile(path.join(rootDir, 'data', 'vbot.db'), 'utf8').catch(() => '{}')));
    for (const key of keys) {
      state.settings[key] = await getSetting(db, key);
    }
  }

  await loadSettings();

  const server = http.createServer(async (req, res) => {
    try {
      if (req.url === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, plugins: state.plugins, settings: state.settings }));
        return;
      }

      if (req.url === '/api/settings') {
        if (req.method === 'GET') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(state.settings));
          return;
        }

        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { key, value } = JSON.parse(body || '{}');
              if (!key) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'key is required' }));
                return;
              }
              await setSetting(db, key, String(value));
              state.settings[key] = String(value);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: true, key, value: state.settings[key] }));
            } catch {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'invalid json' }));
            }
          });
          return;
        }
      }

      if (req.url === '/api/plugins/skeleton') {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const { name } = JSON.parse(body || '{}');
              if (!name) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'name is required' }));
                return;
              }
              await createPluginSkeleton(name, pluginsDir);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ ok: true, created: name }));
            } catch {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'invalid json' }));
            }
          });
          return;
        }
      }

      if (req.url === '/api/plugins') {
        const loaded = await loadPlugins(pluginsDir, botApi);
        state.plugins = loaded;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(loaded));
        return;
      }

      let filePath = req.url === '/' ? '/index.html' : req.url;
      filePath = path.normalize(filePath).replace(/^\/+/, '');
      const resolvedPath = path.join(publicDir, filePath);
      const fileContent = await fs.readFile(resolvedPath).catch(() => null);
      if (fileContent) {
        const extension = path.extname(resolvedPath);
        const contentType = extension === '.html' ? 'text/html; charset=utf-8' : 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(fileContent);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
      }
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'internal server error' }));
    }
  });

  return server;
}

export async function startServer(port = 3000) {
  const app = await createApp();
  return app.listen(port, () => {
    console.log(`VBot running on http://localhost:${port}`);
  });
}
