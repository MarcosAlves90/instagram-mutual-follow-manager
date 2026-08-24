import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.argv[2] ?? 'dist');
const required = [
  'index.html',
  'src/main.js',
  'src/styles/cupertino.css',
  'src/application/controller.js',
  'src/infrastructure/instagram-export.js',
];
for (const file of required) await access(resolve(root, file));

const html = await readFile(resolve(root, 'index.html'), 'utf8');
const css = await readFile(resolve(root, 'src/styles/cupertino.css'), 'utf8');
if (!html.includes('Content-Security-Policy')) throw new Error('CSP meta tag missing');
if (!html.includes('./src/main.js')) throw new Error('Application entry point missing');
if (!css.includes('--cu-blue') || !css.includes('cupertino-segmented-control')) {
  throw new Error('Cupertino design tokens or segmented control missing');
}
if (/https?:\/\/(?!localhost|127\.0\.0\.1)/i.test(html)) {
  throw new Error('Unexpected external URL in built HTML');
}
console.log('Smoke PASS: build inventory, CSP, local entry point, and Cupertino theme verified.');
