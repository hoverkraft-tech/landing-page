import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createFileStream } from './fs-utils.mjs';

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.zip': 'application/zip',
};

function sanitizeRequestPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const normalized = path.posix.normalize(decoded);

  if (normalized.includes('\0') || normalized.includes('..')) {
    return null;
  }

  return normalized.replace(/^\/+/, '');
}

async function resolveFile(rootDir, requestPath) {
  const candidates = [];

  if (requestPath.length === 0) {
    candidates.push(path.join(rootDir, 'index.html'));
  } else {
    const exactPath = path.join(rootDir, requestPath);
    candidates.push(exactPath);

    if (!requestPath.includes('.')) {
      candidates.push(path.join(rootDir, requestPath, 'index.html'));
    }
  }

  for (const candidate of candidates) {
    const normalizedCandidate = path.normalize(candidate);
    if (!normalizedCandidate.startsWith(rootDir)) {
      continue;
    }

    try {
      const stats = await fs.stat(normalizedCandidate);
      if (stats.isDirectory()) {
        const indexFile = path.join(normalizedCandidate, 'index.html');
        await fs.access(indexFile);
        return indexFile;
      }

      if (stats.isFile()) {
        return normalizedCandidate;
      }
    } catch {
      continue;
    }
  }

  return null;
}

function resolveContentType(filePath) {
  const extension = path.extname(filePath);
  return MIME_TYPES[extension] ?? 'application/octet-stream';
}

async function startStaticServer(rootDir) {
  const server = http.createServer(async (req, res) => {
    if (!req.url) {
      res.statusCode = 400;
      res.end();
      return;
    }

    const safePath = sanitizeRequestPath(req.url);
    if (safePath === null) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }

    const filePath = await resolveFile(rootDir, safePath);
    if (!filePath) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', resolveContentType(filePath));

    const stream = createFileStream(filePath);
    stream.on('error', () => {
      res.statusCode = 500;
      res.end('Internal Server Error');
    });

    stream.pipe(res);
  });

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolve();
    });
  });

  const address = server.address();
  if (!address || typeof address === 'string') {
    await new Promise((resolve) => server.close(resolve));
    throw new Error('Failed to start static server');
  }

  const close = async () =>
    new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }

        resolve();
      });
    });

  return {
    close,
    origin: `http://127.0.0.1:${address.port}`,
  };
}

export { resolveContentType, startStaticServer };
