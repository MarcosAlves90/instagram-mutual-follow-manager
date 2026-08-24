import { readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';

async function listJavaScript(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await listJavaScript(path));
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(path);
  }
  return files;
}

const sourceFiles = await listJavaScript('src');
const includeArgs = sourceFiles.map((file) => `--test-coverage-include=${relative('.', file).split('\\').join('/')}`);
const result = spawnSync(process.execPath, [
  '--test',
  '--experimental-test-coverage',
  '--test-coverage-lines=80.01',
  ...includeArgs,
], { stdio: 'inherit', shell: false });
process.exit(result.status ?? 1);
