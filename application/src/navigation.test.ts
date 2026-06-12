import { describe, expect, it, vi } from 'vitest';

vi.mock('./i18n/utils', async () => {
  const { defaultLang, routes, ui } = await import('./i18n/ui');

  const translatePathFor = (lang: keyof typeof ui, path: string): string => {
    const cleanedPath = path.replace(/^\/+|\/+$/g, '');

    if (!cleanedPath) {
      return lang === defaultLang ? '/' : `/${lang}`;
    }

    const [firstSegment, ...rest] = cleanedPath.split('/');
    const translatedFirstSegment = routes[lang][firstSegment as keyof (typeof routes)[typeof lang]] ?? firstSegment;
    const translatedPath = `/${[translatedFirstSegment, ...rest].join('/')}`;

    return lang === defaultLang ? translatedPath : `/${lang}${translatedPath}`;
  };

  return {
    getLangFromUrl: (url: URL): keyof typeof ui => {
      const [, lang] = url.pathname.split('/');
      return lang in ui ? (lang as keyof typeof ui) : defaultLang;
    },
    useTranslatedPath: (lang: keyof typeof ui) => (path: string) => translatePathFor(lang, path),
    useTranslations: (lang: keyof typeof ui) => (key: keyof (typeof ui)[typeof defaultLang]) =>
      ui[lang][key] ?? ui[defaultLang][key],
  };
});

vi.mock('./utils/permalinks', () => ({
  getAsset: (path: string) => path,
}));

const { getLocalizedHeaderData } = await import('./navigation');

describe('localized header navigation', () => {
  it.each([
    {
      locale: 'fr',
      url: 'https://hoverkraft.cloud/fr/',
      groups: ['Offres', 'Methode', 'OpenKraft', 'Ressources', 'Entreprise'],
      offersLinks: [
        'Audit Platform Engineering',
        'Autonomie / Kraft Builders',
        'Restart',
        'Platform Engineering as a Service',
        'Formations et certification',
      ],
      offersTrainingsHrefFragment: 'formations',
      methodLinks: [
        'Méthodologie',
        'Radar de maturité',
        'DORA / SPACE / Lean',
        'Principes de Platform Engineering',
        "Modele d'execution",
      ],
      openKraftLinks: ['OpenKraft', 'Connecteurs', 'Templates', 'Dashboards DORA / SPACE', 'GitHub', 'GitLab'],
      resourceLinks: ['Documentation', 'Demo', 'Temoignages', 'Blog', 'Flux RSS'],
      resourcePageHrefFragments: ['demo', 'testimonials'],
      companyLinks: ['À propos & vision', 'Contact', 'Charte graphique', 'Equipe', 'Manifeste', 'Valeurs'],
    },
    {
      locale: 'en',
      url: 'https://hoverkraft.cloud/en/',
      groups: ['Offers', 'Method', 'OpenKraft', 'Resources', 'Company'],
      offersLinks: [
        'Platform Engineering audit',
        'Autonomy / Kraft Builders',
        'Restart',
        'Platform Engineering as a Service',
        'Training and certification',
      ],
      offersTrainingsHrefFragment: 'trainings',
      methodLinks: [
        'Methodology',
        'Maturity assessment',
        'DORA / SPACE / Lean',
        'Platform Engineering principles',
        'Execution model',
      ],
      openKraftLinks: ['OpenKraft', 'Connectors', 'Templates', 'DORA / SPACE dashboards', 'GitHub', 'GitLab'],
      resourceLinks: ['Documentation', 'Demo', 'Testimonials', 'Blog', 'RSS feed'],
      resourcePageHrefFragments: ['demo', 'testimonials'],
      companyLinks: ['About & vision', 'Contact', 'Brand Guidelines', 'Team', 'Manifesto', 'Values'],
    },
  ])('matches the Phase 1 funnel groups for $locale', ({
    url,
    groups,
    offersLinks,
    offersTrainingsHrefFragment,
    methodLinks,
    openKraftLinks,
    resourceLinks,
    resourcePageHrefFragments,
    companyLinks,
  }) => {
    const navigation = getLocalizedHeaderData(new URL(url));

    expect(navigation.links.map((link) => link.text)).toEqual(groups);

    const offersGroup = navigation.links[0];
    expect(offersGroup.links?.map((link) => link.text)).toEqual(offersLinks);
    expect(offersGroup.links?.at(-1)?.text).toBe(offersLinks[4]);
    expect(offersGroup.links?.at(-1)?.href).toContain(offersTrainingsHrefFragment);

    const methodGroup = navigation.links[1];
    expect(methodGroup.links?.map((link) => link.text)).toEqual(methodLinks);

    const openKraftGroup = navigation.links[2];
    expect(openKraftGroup.links?.map((link) => link.text)).toEqual(openKraftLinks);

    const resourcesGroup = navigation.links[3];
    expect(resourcesGroup.links?.map((link) => link.text)).toEqual(resourceLinks);
    expect(resourcesGroup.links?.slice(1, 3).map((link) => link.href)).toEqual(
      expect.arrayContaining(resourcePageHrefFragments.map((fragment) => expect.stringContaining(fragment)))
    );
    resourcesGroup.links?.slice(1, 3).forEach((link) => expect(link.href).not.toContain('#'));

    const companyGroup = navigation.links[4];
    expect(companyGroup.links?.map((link) => link.text)).toEqual(companyLinks);
  });
});
