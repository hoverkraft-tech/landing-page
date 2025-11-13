import type { Loader } from 'astro/loaders';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import yaml from 'js-yaml';
import { glob } from 'astro/loaders';

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

      // Build a map of slug -> folder name by reading each MDX file
      const baseDir = './src/data/post';
      const folders = await readdir(baseDir, { withFileTypes: true });
      const slugToFolder = new Map<string, string>(); // Maps "slug-lang" to folder name
      const commonDataMap = new Map<string, CommonData>();

      for (const folder of folders.filter((f) => f.isDirectory())) {
        try {
          // Read common.yaml
          const commonPath = join(baseDir, folder.name, 'common.yaml');
          const commonContent = await readFile(commonPath, 'utf-8');
          const data = yaml.load(commonContent) as CommonData;
          commonDataMap.set(folder.name, data);

          // Read both language MDX files to get their slugs
          for (const lang of ['fr', 'en']) {
            const mdxPath = join(baseDir, folder.name, `${lang}.mdx`);
            try {
              const mdxContent = await readFile(mdxPath, 'utf-8');
              const frontmatterMatch = mdxContent.match(/^---\n([\s\S]*?)\n---/);
              if (frontmatterMatch) {
                const frontmatter = yaml.load(frontmatterMatch[1]) as { slug?: string };
                const slug = frontmatter.slug || data.translationKey;
                slugToFolder.set(slug, folder.name);
              }
            } catch {
              // MDX file doesn't exist for this language
            }
          }
        } catch {
          // No common.yaml in this folder
        }
      }

      // Now, iterate through all loaded entries and inject common.yaml data
      const entries = Array.from(context.store.entries());

      for (const [id, entry] of entries) {
        // The entry ID is the slug from the MDX frontmatter
        const folderName = slugToFolder.get(id);

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
