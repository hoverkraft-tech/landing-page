import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../..', import.meta.url));
const logosDir = path.join(projectRoot, 'src', 'assets', 'images', 'brand', 'logo');
const publicDownloadsDir = path.join(projectRoot, 'public', 'brand', 'downloads');
const distDir = path.join(projectRoot, 'dist');
const distDownloadsDir = path.join(distDir, 'brand', 'downloads');
const configPath = path.join(projectRoot, 'src', 'config.yaml');
const routesDefinitionPath = path.join(projectRoot, 'src', 'i18n', 'ui.ts');

export { configPath, distDir, distDownloadsDir, logosDir, projectRoot, publicDownloadsDir, routesDefinitionPath };
