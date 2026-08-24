import { spawnSync } from 'node:child_process';

const commands = [
  ['tsc', ['-p', 'tsconfig.json']],
  [process.execPath, ['--test']],
  [process.execPath, ['scripts/coverage.mjs']],
  [process.execPath, ['scripts/build.mjs']],
  [process.execPath, ['scripts/smoke.mjs', 'dist']],
];

for (const [command, args] of commands) {
  console.log(`\n$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { stdio: 'inherit', shell: false });
  if (result.status !== 0) process.exit(result.status ?? 1);
}
console.log('\nValidation PASS');
