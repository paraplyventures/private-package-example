import { execFileSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));
const scratch = mkdtempSync(join(tmpdir(), 'private-package-quickstart-'));
const publisher = join(scratch, 'publisher');
const consumer = join(scratch, 'consumer');
try {
  mkdirSync(consumer);
  // Copy only the two publisher inputs: never a local credential or config file.
  mkdirSync(publisher);
  for (const name of ['package.json', 'index.js']) cpSync(join(root, 'publisher', name), join(publisher, name));
  for (const name of ['package.json', 'index.mjs']) cpSync(join(root, 'consumer', name), join(consumer, name));
  const archive = join(scratch, 'hello-private.tgz');
  const run = (args, cwd) => execFileSync('pnpm', args, { cwd, stdio: 'inherit' });
  run(['pack', '--out', archive], publisher);
  run(['add', archive, '--offline', '--ignore-scripts', '--store-dir', join(scratch, 'store')], consumer);
  run(['install', '--offline', '--frozen-lockfile', '--ignore-scripts', '--store-dir', join(scratch, 'store')], consumer);
  run(['start'], consumer);
  console.log('Verified the packed artifact in a fresh consumer. No registry publish or network authentication was tested.');
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
