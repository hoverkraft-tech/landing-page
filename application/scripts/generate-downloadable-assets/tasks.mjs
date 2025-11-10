import path from 'node:path';
import { copyIfExists, ensureDir, fileExists } from './fs-utils.mjs';
import { createLogoPack } from './logo-pack.mjs';
import { generatePdf } from './pdf.mjs';
import { getLocalizationConfig } from './config.mjs';
import { resolveBrandRoutes } from './routes.mjs';
import { distDownloadsDir, publicDownloadsDir } from './paths.mjs';

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

  const localization = await getLocalizationConfig();
  const routes = await resolveBrandRoutes(localization);

  for (const { fileName, lang, routePath } of routes) {
    const destination = path.join(distDownloadsDir, fileName);
    await generatePdf(routePath, destination);
    console.info(`✓ Generated brand guidelines PDF (${lang}) at ${destination}`);

    await copyIfExists(destination, path.join(publicDownloadsDir, fileName));
  }
}

export { finalize, prepare };
