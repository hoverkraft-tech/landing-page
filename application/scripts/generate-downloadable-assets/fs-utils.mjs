import { createReadStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

async function ensureDir(directory) {
  await fs.mkdir(directory, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function collectFiles(rootDir, currentDir = rootDir) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      const nested = await collectFiles(rootDir, absolutePath);
      files.push(...nested);
      continue;
    }

    if (entry.isFile()) {
      const relativePath = path.relative(rootDir, absolutePath).split(path.sep).join('/');
      files.push({ absolutePath, relativePath });
    }
  }

  return files;
}

async function copyIfExists(source, destination) {
  if (!(await fileExists(source))) {
    return;
  }

  await ensureDir(path.dirname(destination));
  await fs.copyFile(source, destination);
}

function createFileStream(filePath) {
  return createReadStream(filePath);
}

export { collectFiles, copyIfExists, createFileStream, ensureDir, fileExists };
