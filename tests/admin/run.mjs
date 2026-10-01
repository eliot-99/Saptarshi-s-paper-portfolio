import { build } from 'esbuild';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const output = join(tmpdir(), `paper-editor-test-${randomUUID()}.mjs`);
try {
  await build({ entryPoints: [fileURLToPath(new URL('./editor-state.test.ts', import.meta.url))], outfile: output, bundle: true, format: 'esm', platform: 'node', target: 'node24', logLevel: 'warning' });
  process.exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ['--test', output], { stdio: 'inherit', windowsHide: true });
    child.once('error', reject);
    child.once('exit', (code) => resolve(code ?? 1));
  });
} finally {
  await unlink(output).catch(() => {});
}
