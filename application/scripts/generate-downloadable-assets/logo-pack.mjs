import { createWriteStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import archiver from 'archiver';
import { collectFiles, ensureDir } from './fs-utils.mjs';
import { logosDir } from './paths.mjs';

async function createLogoPack(outputFile) {
  const files = await collectFiles(logosDir);

  if (files.length === 0) {
    throw new Error(`No logo files found in ${logosDir}`);
  }

  await ensureDir(path.dirname(outputFile));
  await fs.rm(outputFile, { force: true });

  const output = createWriteStream(outputFile);
  const archive = archiver('zip', { zlib: { level: 9 } });

  const finalizePromise = new Promise((resolve, reject) => {
    archive.on('error', reject);
    output.on('close', resolve);
  });

  archive.pipe(output);

  for (const file of files) {
    archive.file(file.absolutePath, { name: file.relativePath });
  }

  await archive.finalize();
  await finalizePromise;
}

export { createLogoPack };
