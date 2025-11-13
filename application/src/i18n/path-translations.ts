import { defaultLang } from './ui';
import { cleanSlug, trimSlash, POST_PERMALINK_PATTERN } from '~/utils/permalinks';
import yaml from 'js-yaml';

interface Frontmatter {
  publishDate?: Date | string;
  category?: string;
  slug?: string;
  translationKey?: string;
  lang?: string;
  draft?: boolean;
}

interface PostModule {
  frontmatter?: Frontmatter & Record<string, unknown>;
}

interface CommonData {
  publishDate?: Date | string;
  category?: string;
  translationKey?: string;
  draft?: boolean;
}

const toDate = (value: Date | string | undefined): Date | undefined => {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return value;
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.valueOf()) ? undefined : parsed;
};

const buildNormalizedPermalink = ({
  id,
  slug,
  publishDate,
  category,
}: {
  id: string;
  slug: string;
  publishDate?: Date;
  category?: string;
}): string => {
  const safeDate = publishDate ?? new Date();
  const year = String(safeDate.getFullYear()).padStart(4, '0');
  const month = String(safeDate.getMonth() + 1).padStart(2, '0');
  const day = String(safeDate.getDate()).padStart(2, '0');
  const hour = String(safeDate.getHours()).padStart(2, '0');
  const minute = String(safeDate.getMinutes()).padStart(2, '0');
  const second = String(safeDate.getSeconds()).padStart(2, '0');

  const permalink = POST_PERMALINK_PATTERN.replace('%slug%', slug)
    .replace('%id%', id)
    .replace('%category%', category ?? '')
    .replace('%year%', year)
    .replace('%month%', month)
    .replace('%day%', day)
    .replace('%hour%', hour)
    .replace('%minute%', minute)
    .replace('%second%', second);

  const segments = permalink
    .split('/')
    .map((segment) => trimSlash(String(segment)))
    .filter(Boolean);

  return segments.join('/');
};

const postModules = import.meta.glob<PostModule>('../data/post/**/*.{md,mdx}', {
  eager: true,
});

const commonModules = import.meta.glob<string>('../data/post/**/common.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
});

// Build a map of folder -> common data
const commonDataByFolder: Record<string, CommonData> = {};
for (const [modulePath, yamlContent] of Object.entries(commonModules)) {
  const folderName = modulePath.replace(/^\.\.\/data\/post\//, '').replace(/\/common\.yaml$/, '');
  try {
    const commonData = yaml.load(yamlContent) as CommonData;
    commonDataByFolder[folderName] = commonData;
  } catch (error) {
    console.error(`Failed to parse common.yaml for ${folderName}:`, error);
  }
}

const blogTranslationsByKey: Record<string, Record<string, string>> = {};
const blogTranslationKeyByPath: Record<string, string> = {};

for (const [modulePath, module] of Object.entries(postModules)) {
  const frontmatter = module.frontmatter;

  if (!frontmatter || frontmatter.draft) {
    continue;
  }

  const relativePath = modulePath.replace(/^\.\.\/data\/post\//, '').replace(/\.(md|mdx)$/, '');
  const folderName = relativePath.includes('/') ? relativePath.split('/')[0] : relativePath;

  // Get common data for this folder
  const commonData = commonDataByFolder[folderName];

  // Check draft status from common data
  if (commonData?.draft) {
    continue;
  }

  const id = cleanSlug(relativePath);
  const slug = cleanSlug(String(frontmatter.slug ?? relativePath.split('/').pop() ?? relativePath));
  const categorySlug =
    (frontmatter.category ?? commonData?.category)
      ? cleanSlug(String(frontmatter.category ?? commonData?.category))
      : undefined;
  const publishDate = toDate(frontmatter.publishDate ?? commonData?.publishDate);
  const lang = typeof frontmatter.lang === 'string' && frontmatter.lang.length > 0 ? frontmatter.lang : defaultLang;

  // Use translationKey from common.yaml if available, otherwise fall back to frontmatter or id
  const translationKey =
    typeof commonData?.translationKey === 'string' && commonData.translationKey.length > 0
      ? commonData.translationKey
      : typeof frontmatter.translationKey === 'string' && frontmatter.translationKey.length > 0
        ? frontmatter.translationKey
        : id;

  const normalizedPath = buildNormalizedPermalink({ id, slug, publishDate, category: categorySlug });

  if (!blogTranslationsByKey[translationKey]) {
    blogTranslationsByKey[translationKey] = {};
  }

  blogTranslationsByKey[translationKey][lang] = normalizedPath;
  blogTranslationKeyByPath[normalizedPath] = translationKey;
}

export const BLOG_TRANSLATIONS_BY_KEY = blogTranslationsByKey;
export const BLOG_TRANSLATION_KEY_BY_PATH = blogTranslationKeyByPath;
