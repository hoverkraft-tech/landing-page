import http from 'node:http';
import { createReadStream, createWriteStream } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import archiver from 'archiver';
import yaml from 'js-yaml';
import puppeteer from 'puppeteer';

const projectRoot = fileURLToPath(new URL('..', import.meta.url));
const logosDir = path.join(projectRoot, 'src', 'assets', 'images', 'brand', 'logo');
const publicDownloadsDir = path.join(projectRoot, 'public', 'brand', 'downloads');
const distDir = path.join(projectRoot, 'dist');
const distDownloadsDir = path.join(distDir, 'brand', 'downloads');
const configPath = path.join(projectRoot, 'src', 'config.yaml');

let siteOriginCache = null;

async function getSiteOrigin() {
  if (siteOriginCache) {
    return siteOriginCache;
  }

  try {
    const rawConfig = await fs.readFile(configPath, 'utf8');
    const parsedConfig = yaml.load(rawConfig);
    const configuredOrigin = parsedConfig?.site?.site;

    if (typeof configuredOrigin === 'string' && configuredOrigin.trim().length > 0) {
      siteOriginCache = configuredOrigin.trim().replace(/\/+$/, '');
    }
  } catch {
    // ignore config parsing issues and fall back to default
  }

  if (!siteOriginCache) {
    siteOriginCache = 'https://hoverkraft.cloud';
  }

  return siteOriginCache;
}

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

    const stream = createReadStream(filePath);
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
    origin: `http://127.0.0.1:${address.port}`,
    close,
  };
}

async function generatePdf(routePath, outputFile) {
  const staticServer = await startStaticServer(distDir);
  const publicOrigin = await getSiteOrigin();

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
      await page.evaluateOnNewDocument(() => {
        try {
          localStorage.setItem('theme', 'light');
        } catch {
          /* ignore storage access issues */
        }
      });
      await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });

      const downloadUrl = new URL(routePath, staticServer.origin).toString();
      await page.goto(downloadUrl, { waitUntil: 'networkidle0', timeout: 60000 });
      await page.addStyleTag({
        content: `body.pdf-export #header,
body.pdf-export footer { display: none !important; }

body.pdf-export section > * {
  break-inside: avoid;
  page-break-inside: avoid;
}

body.pdf-export section > *:not(:last-child) {
  break-after: page;
  page-break-after: always;
}
`,
      });
      await page.evaluate((origin) => {
        try {
          localStorage.setItem('theme', 'light');
        } catch {
          /* ignore storage access issues */
        }
        document.documentElement.classList.remove('dark');
        document.body.classList.add('pdf-export');
        document.querySelectorAll('a[href]').forEach((anchor) => {
          const href = anchor.getAttribute('href');
          if (!href) {
            return;
          }

          if (
            href.startsWith('#') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('javascript:')
          ) {
            return;
          }

          try {
            const absoluteHref = new URL(href, origin).toString();
            anchor.setAttribute('href', absoluteHref);
          } catch {
            /* ignore invalid urls */
          }
        });
      }, publicOrigin);
      await page.waitForFunction(() => !document.documentElement.classList.contains('dark'), { timeout: 5000 });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await ensureDir(path.dirname(outputFile));
      await page.pdf({
        path: outputFile,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '15mm',
          right: '12mm',
          bottom: '15mm',
          left: '12mm',
        },
      });
    } finally {
      await browser.close();
    }
  } finally {
    await staticServer.close();
  }
}

async function copyIfExists(source, destination) {
  if (!(await fileExists(source))) {
    return;
  }

  await ensureDir(path.dirname(destination));
  await fs.copyFile(source, destination);
}

async function resolveBrandRoute() {
  const primary = path.join(distDir, 'charte-graphique', 'index.html');
  if (await fileExists(primary)) {
    return '/charte-graphique/';
  }

  const fallback = path.join(distDir, 'brand-guidelines', 'index.html');
  if (await fileExists(fallback)) {
    return '/brand-guidelines/';
  }

  return '/charte-graphique/';
}

async function prepare() {
  await ensureDir(publicDownloadsDir);
  const zipPath = path.join(publicDownloadsDir, 'hoverkraft-logos.zip');
  await createLogoPack(zipPath);
  console.info(`✓ Prepared logo pack at ${zipPath}`);
}

async function finalize() {
  await ensureDir(publicDownloadsDir);
  const zipPath = path.join(publicDownloadsDir, 'hoverkraft-logos.zip');
  if (!(await fileExists(zipPath))) {
    await createLogoPack(zipPath);
  }

  await ensureDir(distDownloadsDir);
  await copyIfExists(zipPath, path.join(distDownloadsDir, 'hoverkraft-logos.zip'));

  const routePath = await resolveBrandRoute();
  const pdfDestination = path.join(distDownloadsDir, 'hoverkraft-brand-guidelines.pdf');
  await generatePdf(routePath, pdfDestination);
  console.info(`✓ Generated brand guidelines PDF at ${pdfDestination}`);

  await copyIfExists(pdfDestination, path.join(publicDownloadsDir, 'hoverkraft-brand-guidelines.pdf'));
}

async function main() {
  const mode = process.argv[2];

  if (mode === 'prepare') {
    await prepare();
    return;
  }

  if (mode === 'finalize') {
    await finalize();
    return;
  }

  console.error('Usage: node ./scripts/download-assets.mjs <prepare|finalize>');
  process.exitCode = 1;
}

main().catch((error) => {
  console.error('✗ Failed to generate download assets');
  console.error(error);
  process.exit(1);
});
