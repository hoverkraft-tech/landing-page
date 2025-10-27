import { ui, defaultLang, showDefaultLang, routes } from './ui';

const trimSlashes = (value: string) => value.replace(/^\/+|\/+$/g, '');
const routesByLang = routes as Record<string, Record<string, string>>;

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
      const [firstSegment, ...rest] = segments;

      let defaultSegment = firstSegment;
      const currentRoutes = routesByLang[lang as string];

      if (lang !== defaultLang && currentRoutes) {
        const match = Object.entries(currentRoutes).find(([, value]) => value === firstSegment);
        if (match) {
          defaultSegment = match[0];
        }
      }

      if (lang === defaultLang) {
        defaultSegment = firstSegment;
      }

      let translatedFirstSegment = defaultSegment;
      const targetRoutes = routesByLang[targetLang as string];
      const hasTargetTranslation = Boolean(targetRoutes && targetRoutes[defaultSegment] !== undefined);

      if (targetLang !== defaultLang && targetRoutes) {
        translatedFirstSegment = targetRoutes[defaultSegment] ?? defaultSegment;
      }

      if (targetLang === defaultLang) {
        translatedFirstSegment = defaultSegment;
      }

      const translatedSegments = [translatedFirstSegment, ...rest];
      const translatedPath = `/${translatedSegments.join('/')}`;

      if (!showDefaultLang && targetLang === defaultLang) {
        return translatedPath;
      }

      if (targetLang === defaultLang) {
        return translatedPath;
      }

      if (hasTargetTranslation) {
        return translatedPath === '/' ? `/${targetLang}` : `/${targetLang}${translatedPath}`;
      }

      return translatedPath;
    }

    if (!showDefaultLang && targetLang === defaultLang) {
      return '/';
    }

    if (targetLang === defaultLang) {
      return '/';
    }

    return `/${targetLang}`;
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

  if (defaultLang === currentLang) {
    const route = Object.values(routes)[0];
    return route[path] !== undefined ? route[path] : undefined;
  }

  const getKeyByValue = (obj: Record<string, string>, value: string): string | undefined => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };

  const reversedKey = getKeyByValue(routes[currentLang], path);

  if (reversedKey !== undefined) {
    return reversedKey;
  }

  return undefined;
}
