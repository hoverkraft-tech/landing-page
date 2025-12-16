import { getAsset } from './utils/permalinks';
import { getLangFromUrl, useTranslatedPath, useTranslations } from './i18n/utils';
import type { CallToAction } from '~/types';

type HeaderNavigationLink = {
  text?: string;
  href?: string;
  ariaLabel?: string;
  icon?: string;
  links?: Array<HeaderNavigationLink>;
};

type HeaderNavigationData = {
  homeHref: string;
  links: Array<HeaderNavigationLink>;
  actions: Array<CallToAction>;
};

// Internationalized navigation data
export function getLocalizedHeaderData(url: URL): HeaderNavigationData {
  const lang = getLangFromUrl(url);
  const translatePath = useTranslatedPath(lang);
  const t = useTranslations(lang);

  const blogHref = translatePath('/blog');

  return {
    homeHref: translatePath('/'),
    links: [
      {
        text: t('nav.home'),
        href: translatePath('/'),
      },
      {
        text: t('nav.methodology'),
        href: translatePath('/methodology'),
      },
      {
        text: t('nav.offers'),
        href: translatePath('/offers'),
      },
      {
        text: t('nav.trainings'),
        href: translatePath('/trainings'),
      },
      {
        text: t('nav.resources'),
        href: translatePath('/resources'),
      },
      {
        text: t('nav.blog'),
        href: blogHref,
      },
    ],
    actions: [
      {
        text: t('button.contact-sales'),
        href: translatePath('/contact'),
        variant: 'primary',
      },
    ],
  };
}

export function getLocalizedFooterData(url: URL) {
  const lang = getLangFromUrl(url);
  const translatePath = useTranslatedPath(lang);
  const t = useTranslations(lang);
  const blogHref = translatePath('/blog');

  return {
    links: [
      {
        title: t('footer.company'),
        links: [
          { text: t('nav.about'), href: translatePath('/about') },
          { text: t('nav.methodology'), href: translatePath('/methodology') },
          { text: t('nav.offers'), href: translatePath('/offers') },
          { text: t('nav.trainings'), href: translatePath('/trainings') },
          { text: t('nav.contact'), href: translatePath('/contact') },
        ],
      },
      {
        title: t('footer.support'),
        links: [
          { text: t('nav.resources'), href: translatePath('/resources') },
          { text: t('nav.blog'), href: blogHref },
          { text: t('footer.docs'), href: 'https://docs.hoverkraft.cloud' },
        ],
      },
      {
        title: t('footer.legal'),
        links: [
          { text: t('footer.terms'), href: translatePath('/terms') },
          { text: t('footer.privacy'), href: translatePath('/privacy') },
          { text: t('nav.brand'), href: translatePath('/brand-guidelines') },
        ],
      },
    ],
    secondaryLinks: [],
    socialLinks: [
      {
        ariaLabel: 'LinkedIn',
        icon: 'tabler:brand-linkedin',
        href: 'https://www.linkedin.com/company/hoverkraft-tech',
      },
      { ariaLabel: 'Bluesky', icon: 'tabler:brand-bluesky', href: 'https://bsky.app/hoverkraft' },
      { ariaLabel: 'DEV', icon: 'tabler:device-imac-code', href: 'https://dev.to/hoverkraft' },
      { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/hoverkraft-tech' },
      { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    ],
    footNote: t('footer.copyright'),
  };
}
