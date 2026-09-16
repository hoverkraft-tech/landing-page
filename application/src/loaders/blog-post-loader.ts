import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Loader } from 'astro/loaders';
import { glob } from 'astro/loaders';
import { load } from 'js-yaml';

interface CommonData {
  publishDate: string;
  updateDate?: string;
  image: string;
  tags: string[];
  category: string;
  translationKey: string;
  draft?: boolean;
}

/**
 * Custom loader for blog posts with folder structure:
 * post/{slug}/common.yaml - shared data across translations
 * post/{slug}/fr.mdx - French localized content
 * post/{slug}/en.mdx - English localized content
 *
 * This uses Astro's glob loader and enhances each entry with common.yaml data.
 */
export function blogPostLoader(): Loader {
  const baseGlobLoader = glob({ pattern: '**/{fr,en}.mdx', base: './src/data/post' });

  return {
    name: 'blog-post-loader-with-common',
    load: async (context) => {
      // First, let the glob loader do its thing
      await baseGlobLoader.load(context);

      // Build a map of folder -> common.yaml data.
      const baseDir = './src/data/post';
      const folders = await readdir(baseDir, { withFileTypes: true });
      const commonDataMap = new Map<string, CommonData>();

      for (const folder of folders.filter((f) => f.isDirectory())) {
        try {
          // Read common.yaml
          const commonPath = join(baseDir, folder.name, 'common.yaml');
          const commonContent = await readFile(commonPath, 'utf-8');
          const data = load(commonContent) as CommonData;
          commonDataMap.set(folder.name, data);
        } catch {
          // No common.yaml in this folder
        }
      }

      // Now, iterate through all loaded entries and inject common.yaml data
      const entries = Array.from(context.store.entries());

      for (const [id, entry] of entries) {
        const filePath = entry.filePath;
        const folderName = filePath?.replace(/^src\/data\/post\//, '').split('/')[0];

        if (folderName && commonDataMap.has(folderName)) {
          const commonData = commonDataMap.get(folderName)!;

          // Merge common data with existing entry data (entry data takes priority)
          const mergedData = {
            ...commonData,
            ...entry.data,
          };

          // Update the store with merged data, preserving all original fields
          const newDigest = context.generateDigest(JSON.stringify(mergedData) + (entry.body || ''));

          context.store.set({
            ...entry, // Preserve all original fields (deferredRender, filePath, etc.)
            id,
            data: mergedData,
            digest: newDigest,
          });
        }
      }

      context.logger.info(`Processed ${entries.length} blog posts with common.yaml data`);
    },
  };
}
