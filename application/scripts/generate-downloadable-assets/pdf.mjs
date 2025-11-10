import path from 'node:path';
import puppeteer from 'puppeteer';
import { distDir } from './paths.mjs';
import { ensureDir } from './fs-utils.mjs';
import { getSiteOrigin } from './config.mjs';
import { startStaticServer } from './http-server.mjs';

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

export { generatePdf };
