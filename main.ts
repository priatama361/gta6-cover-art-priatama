// Sunset Strip Studio — entrypoint (make.fun gta6-cover-art-01).
// Hands the app in: copies app/ and screenshots/ from this repository into
// the output directory and writes dossier.json with buildDossier from the
// kit's vendor library. Runs as `node main.ts` from any working directory:
// every path is resolved against this file's own directory, and the output
// defaults to the absolute path /output (MAKEFUN_OUTPUT_DIR overrides it).
// Deterministic: the same repository always writes the same bytes.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-app.ts';

const repoDir = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

function main(): void {
  mkdirSync(outDir, { recursive: true });

  // Clear anything a previous run left behind so the dossier is built from
  // exactly this repository's files and nothing stale.
  for (const name of ['app', 'screenshots', 'dossier.json']) {
    const target = join(outDir, name);
    if (existsSync(target)) rmSync(target, { recursive: true, force: true });
  }

  cpSync(join(repoDir, 'app'), join(outDir, 'app'), { recursive: true });
  cpSync(join(repoDir, 'screenshots'), join(outDir, 'screenshots'), {
    recursive: true,
  });

  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  });
  writeFileSync(join(outDir, 'dossier.json'), dossier);
  console.log(`wrote ${join(outDir, 'dossier.json')} (${dossier.length} bytes)`);
}

main();
