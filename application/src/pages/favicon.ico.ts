import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const faviconPath = resolve(process.cwd(), 'src/assets/favicons/favicon.ico');

export const prerender = true;

export async function GET() {
  const icoFile = await readFile(faviconPath);
  const body = new Uint8Array(icoFile);

  return new Response(body, {
    headers: {
      'Content-Type': 'image/x-icon',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
