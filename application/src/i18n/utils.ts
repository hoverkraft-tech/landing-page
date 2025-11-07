import { BLOG_BASE } from '~/utils/permalinks';
import { BLOG_TRANSLATIONS_BY_KEY, BLOG_TRANSLATION_KEY_BY_PATH } from './path-translations';
import { ui, defaultLang, routes } from './ui';

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '');
const routesByLang = routes as Record<string, Record<string, string>>;

const buildLocalizedPath = (segments: string[], targetLang: keyof typeof ui) => {
  const translatedPath = segments.length > 0 ? `/${segments.join('/')}` : '/';

  if (targetLang === defaultLang) {
    return translatedPath;
  }

  if (translatedPath === '/') {
    return `/${targetLang}`;
  }

  return `/${targetLang}${translatedPath}`;
};

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useTranslatedPath(lang: keyof typeof ui) {
  return function translatePath(path: string, l: string = lang) {
    const targetLang = l as keyof typeof ui;
    const cleanedPath = trimSlashes(path);
    const segments = cleanedPath ? cleanedPath.split('/').filter(Boolean) : [];

    if (segments.length > 0) {
      const blogTranslationKey = BLOG_TRANSLATION_KEY_BY_PATH[cleanedPath];

      if (blogTranslationKey) {
        const translationsForKey = BLOG_TRANSLATIONS_BY_KEY[blogTranslationKey] ?? {};
        const normalizedPath =
          translationsForKey[targetLang] ?? translationsForKey[defaultLang] ?? (BLOG_BASE ? BLOG_BASE : '');

        if (typeof normalizedPath === 'string') {
          const translatedSegments = normalizedPath.split('/').filter(Boolean);
          return buildLocalizedPath(translatedSegments, targetLang);
        }
      }

      const [firstSegment, ...rest] = segments;
      const defaultRoutes = routesByLang[defaultLang as string] ?? {};
      const currentRoutes = routesByLang[lang as string] ?? {};

      const defaultKey =
        defaultRoutes[firstSegment] !== undefined
          ? firstSegment
          : (Object.entries(currentRoutes).find(([, value]) => value === firstSegment)?.[0] ?? firstSegment);

      const targetRoutes = routesByLang[targetLang as string] ?? {};
      const hasTargetTranslation = targetRoutes[defaultKey] !== undefined;
      const translatedFirstSegment = hasTargetTranslation ? targetRoutes[defaultKey] : defaultKey;

      const translatedSegments = [translatedFirstSegment, ...rest];
      return buildLocalizedPath(translatedSegments, targetLang);
    }

    return buildLocalizedPath([], targetLang);
  };
}

export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = new URL(url).pathname;
  const parts = pathname?.split('/');
  const path = parts.pop() || parts.pop();

  if (path === undefined) {
    return undefined;
  }

  const currentLang = getLangFromUrl(url);
  const getKeyByValue = (obj: Record<string, string>, value: string): string | undefined => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  if (defaultLang === currentLang) {
    const defaultRoutes = routes[currentLang] ?? Object.values(routes)[0];

    if (!defaultRoutes) {
      return undefined;
    }

    const key = getKeyByValue(defaultRoutes, path);
    if (key !== undefined) {
      return key;
    }

    return defaultRoutes[path] !== undefined ? path : undefined;
  }

  const currentRoutes = routes[currentLang];

  if (!currentRoutes) {
    return undefined;
  }

  const reversedKey = getKeyByValue(currentRoutes, path);

  if (reversedKey !== undefined) {
    return reversedKey;
  }

  return undefined;
}
