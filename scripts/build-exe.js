import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(rootDir, 'dist');
const exePath = path.join(rootDir, 'dist', 'vbot.exe');

fs.mkdirSync(distDir, { recursive: true });

const entry = path.join(rootDir, 'dist', 'index.js');
if (!fs.existsSync(entry)) {
  console.error('Bundle not found. Run npm run build first.');
  process.exit(1);
}

try {
  execFileSync(process.execPath, [path.join(rootDir, 'node_modules', 'pkg', 'lib-es5', 'bin.js'), '--targets', 'node18-win-x64', '--output', exePath, entry], { cwd: rootDir, stdio: 'inherit' });
  console.log(`Windows executable generated at ${exePath}`);
} catch (error) {
  console.error('Executable build failed.');
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
