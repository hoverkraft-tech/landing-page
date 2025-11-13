import type { RemarkPlugin } from '@astrojs/markdown-remark';
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import yaml from 'js-yaml';

/**
 * Remark plugin to inject common.yaml data into blog post frontmatter.
 * Reads common.yaml from the same directory as the MDX file.
 *
 * NOTE: This plugin modifies file.data which should work with Astro's content collections.
 */
export function injectCommonData(): ReturnType<RemarkPlugin> {
  return async function (_tree, file) {
    // Get the file path
    const filePath = file.history[0];
    if (!filePath || !filePath.endsWith('.mdx')) {
      return;
    }

    try {
      // Read common.yaml from the same directory
      const dir = dirname(filePath);
      const commonPath = join(dir, 'common.yaml');
      const commonContent = await readFile(commonPath, 'utf-8');
      const commonData = yaml.load(commonContent) as Record<string, unknown>;

      // Inject into both frontmatter AND file.data for Astro content collections
      if (!file.data.astro) {
        file.data.astro = {};
      }
      if (!file.data.astro.frontmatter) {
        file.data.astro.frontmatter = {};
      }

      // Merge common data (common.yaml takes lower priority than MDX frontmatter)
      file.data.astro.frontmatter = {
        ...commonData,
        ...file.data.astro.frontmatter,
      };

      // CRITICAL: Also set at the root level for Astro content collections
      Object.assign(file.data, {
        ...commonData,
        ...file.data,
      });

      console.log(`[inject-common-data] Injected for ${filePath.split('/').slice(-3).join('/')}`);
    } catch (error) {
      // If common.yaml doesn't exist or can't be read, silently continue
      console.warn(`Could not load common.yaml for ${filePath}:`, error);
    }
  };
}
