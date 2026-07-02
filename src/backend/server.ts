import http, { IncomingMessage, ServerResponse } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createDatabase } from './database.js';
import { createTwitchService } from './twitch.js';

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const publicDir = path.join(rootDir, 'public');
const distDir = path.join(rootDir, 'dist');

export async function startServer(port = 3000) {
  const db = createDatabase();
  const twitch = createTwitchService(db);
  const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      if (req.url === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true, stack: ['TypeScript', 'React', 'Web Components', 'SQLite', 'Node.js'], twitch: twitch.getState() }));
        return;
      }

      if (req.url === '/api/twitch/settings') {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            const { channel, username, token } = JSON.parse(body || '{}');
            twitch.updateSettings({ channel, username, token });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(twitch.getSettings()));
          });
          return;
        }
      }

      if (req.url === '/api/twitch/connect') {
        if (req.method === 'POST') {
          await twitch.connect();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(twitch.getState()));
          return;
        }
      }

      if (req.url === '/api/twitch/events') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(twitch.getEvents()));
        return;
      }

      const targetPath = req.url === '/' ? '/index.html' : req.url ?? '/';
      const staticRoot = await exists(path.join(rootDir, 'dist')) ? distDir : publicDir;
      const resolvedPath = path.join(staticRoot, targetPath.replace(/^\/+/, ''));
      const content = await fs.readFile(resolvedPath).catch(() => null);
      if (content) {
        res.writeHead(200, { 'Content-Type': targetPath.endsWith('.html') ? 'text/html; charset=utf-8' : 'application/octet-stream' });
        res.end(content);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
      }
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'internal server error' }));
    }
  });

  return server.listen(port, () => {
    console.log(`VBot server listening on http://localhost:${port}`);
  });
}

async function exists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}
