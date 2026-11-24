import { execFile } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';

import { config } from 'dotenv';

config();

// `execFile` (not `exec`) passes arguments without a shell, so the temp path and
// API URL aren't re-interpreted by the shell.
const execFileAsync = promisify(execFile);

const PATH_TO_OUTPUT_DIR = path.resolve(process.cwd(), './src/data-contracts');

const main = async () => {
  const backendDir = path.join(PATH_TO_OUTPUT_DIR, 'backend');

  if (!fs.existsSync(backendDir)) {
    fs.mkdirSync(backendDir, { recursive: true });
  }

  // Download into an isolated temp dir so the spec never lingers in the repo.
  const specPath = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'web-app-not-contract-')), 'backend-swagger.json');

  await execFileAsync('curl', [
    '--fail',
    '--silent',
    '--show-error',
    '-o',
    specPath,
    `${process.env.NEXT_PUBLIC_API_URL}/swagger.json`,
  ]);

  // Run the generator's JS entrypoint directly with the current Node binary
  // instead of going through `npx`. On Windows `npx` is a `.cmd` shim that
  // `execFile` can't spawn without a shell, and recent Node refuses to spawn
  // `.cmd`/`.bat` without `shell: true` for security. Invoking the CLI via
  // `process.execPath` is fully cross-platform and keeps `shell: false`.
  const generatorCli = path.resolve(process.cwd(), 'node_modules/swagger-typescript-api/dist/cli.mjs');

  const { stdout, stderr } = await execFileAsync(process.execPath, [
    generatorCli,
    'generate',
    '--path',
    specPath,
    '-o',
    backendDir,
    '--modular',
    '--no-client',
    '--extract-enums',
  ]);

  if (stdout) console.warn(`Data-contract-generator: ${stdout}`);
  if (stderr) console.error(`stderr: ${stderr}`);
};

main().catch((error: unknown) => {
  console.error(`error: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
