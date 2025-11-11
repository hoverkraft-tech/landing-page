import path from 'node:path';
import puppeteer from 'puppeteer';
import { distDir } from './paths.mjs';
import { ensureDir } from './fs-utils.mjs';
import { getSiteOrigin } from './config.mjs';
import { startStaticServer } from './http-server.mjs';
import { getPdfTransformSource } from './pdf-transform.mjs';

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

body.pdf-export .pdf-break-avoid {
  break-inside: avoid;
  page-break-inside: avoid;
  -webkit-column-break-inside: avoid;
}

body.pdf-export .pdf-grid {
  display: block;
}

body.pdf-export section {
  margin-top: 1.5rem !important;
  margin-bottom: 1.5rem !important;
  padding-top: 1rem !important;
  padding-bottom: 1rem !important;
}

body.pdf-export h2 {
  margin-top: 1rem !important;
  margin-bottom: 0.75rem !important;
  font-size: 1.5rem !important;
}

body.pdf-export h3 {
  margin-top: 0.75rem !important;
  margin-bottom: 0.5rem !important;
  font-size: 1.25rem !important;
}

body.pdf-export p {
  margin-top: 0.5rem !important;
  margin-bottom: 0.5rem !important;
  line-height: 1.4 !important;
}

body.pdf-export ul, body.pdf-export ol {
  margin-top: 0.5rem !important;
  margin-bottom: 0.5rem !important;
}

body.pdf-export li {
  margin-top: 0.25rem !important;
  margin-bottom: 0.25rem !important;
}

body.pdf-export .grid {
  gap: 0.75rem !important;
}

body.pdf-export img {
  max-height: 200px !important;
  max-width: 200px !important;
  width: auto !important;
  height: auto !important;
  object-fit: contain !important;
}
`,
      });
      const pdfTransformSource = getPdfTransformSource();
      await page.evaluate(
        async (origin, transformationSource) => {
          try {
            const runTransform = new Function(`return ${transformationSource};`)();
            if (typeof runTransform === 'function') {
              await runTransform(origin);
            }
          } catch {
            /* ignore transformation issues */
          }
        },
        publicOrigin,
        pdfTransformSource
      );
      await page.waitForFunction(() => !document.documentElement.classList.contains('dark'), { timeout: 5000 });
      await new Promise((resolve) => setTimeout(resolve, 1500));

      await ensureDir(path.dirname(outputFile));
      await page.pdf({
        path: outputFile,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '10mm',
          right: '10mm',
          bottom: '10mm',
          left: '10mm',
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
