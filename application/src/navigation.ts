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
  links: Array<HeaderNavigationLink>;
  actions: Array<CallToAction>;
};

// Internationalized navigation data
export function getLocalizedHeaderData(url: URL): HeaderNavigationData {
  const lang = getLangFromUrl(url);
  const translatePath = useTranslatedPath(lang);
  const t = useTranslations(lang);

  return {
    links: [
      {
        text: t('nav.home'),
        href: translatePath('/'),
      },
      {
        text: t('nav.methodology'),
        href: translatePath('/methodologie'),
      },
      {
        text: t('nav.offers'),
        href: translatePath('/offres'),
      },
      {
        text: t('nav.resources'),
        href: translatePath('/ressources'),
      },
      {
        text: t('nav.blog'),
        href: translatePath('/blog'),
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

  return {
    links: [
      {
        title: t('footer.company'),
        links: [
          { text: t('nav.about'), href: translatePath('/about') },
          { text: t('nav.methodology'), href: translatePath('/methodologie') },
          { text: t('nav.offers'), href: translatePath('/offres') },
          { text: t('nav.contact'), href: translatePath('/contact') },
        ],
      },
      {
        title: t('footer.support'),
        links: [
          { text: t('nav.offers'), href: translatePath('/offres') },
          { text: t('nav.resources'), href: translatePath('/ressources') },
          { text: t('nav.blog'), href: translatePath('/blog') },
          { text: t('footer.docs'), href: 'https://docs.hoverkraft.cloud' },
        ],
      },
    ],
    secondaryLinks: [
      { text: t('footer.terms'), href: translatePath('/terms') },
      { text: t('footer.privacy'), href: translatePath('/privacy') },
    ],
    socialLinks: [
      { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
      { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
      { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
      { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/hoverkraft-tech' },
      { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    ],
    footNote: t('footer.copyright'),
  };
}
