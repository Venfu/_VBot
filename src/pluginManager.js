import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export async function createPluginSkeleton(name, baseDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'plugins')) {
  const pluginDir = path.join(baseDir, name);
  await fs.mkdir(path.join(pluginDir, 'components'), { recursive: true });

  await fs.writeFile(
    path.join(pluginDir, 'index.js'),
    `export function init(bot) {
  bot.registerPlugin({ name: '${name}', status: 'loaded' });
}
`
  );

  await fs.writeFile(
    path.join(pluginDir, 'components', 'config.js'),
    `class ${toPascalCase(name)}Config extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<section><h3>${name}</h3><p>Plugin configuration goes here.</p></section>';
  }
}

customElements.define('${name}-config', ${toPascalCase(name)}Config);
`
  );

  await fs.writeFile(
    path.join(pluginDir, 'components', 'fragment.js'),
    `class ${toPascalCase(name)}Fragment extends HTMLElement {
  connectedCallback() {
    this.innerHTML = '<section><h3>${name}</h3><p>Fragment content.</p></section>';
  }
}

customElements.define('${name}-fragment', ${toPascalCase(name)}Fragment);
`
  );

  return pluginDir;
}

export async function loadPlugins(pluginsDir, bot) {
  try {
    const entries = await fs.readdir(pluginsDir, { withFileTypes: true });
    const pluginDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);

    const loaded = [];
    for (const name of pluginDirs) {
      const pluginPath = path.join(pluginsDir, name, 'index.js');
      try {
        const mod = await import(pathToFileURL(pluginPath).href);
        if (typeof mod.init === 'function') {
          await mod.init(bot);
          loaded.push({ name, status: 'loaded' });
        }
      } catch {
        loaded.push({ name, status: 'failed' });
      }
    }

    return loaded;
  } catch {
    return [];
  }
}

function toPascalCase(value) {
  return value
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
