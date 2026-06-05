import type { CallToAction } from '~/types';
import { getLangFromUrl, useTranslatedPath, useTranslations } from './i18n/utils';
import { getAsset } from './utils/permalinks';

type HeaderNavigationLink = {
  text?: string;
  href?: string;
  ariaLabel?: string;
  icon?: string;
  description?: string;
  featured?: {
    label: string;
    title: string;
    description: string;
    href: string;
    cta: string;
    icon?: string;
  };
  links?: Array<HeaderNavigationLink>;
};

type HeaderNavigationData = {
  homeHref: string;
  links: Array<HeaderNavigationLink>;
  actions: Array<CallToAction>;
};

type FooterFollowLink = {
  text: string;
  href: string;
  icon?: string;
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
        text: t('nav.offers'),
        featured: {
          label: t('nav.featured.label'),
          title: t('nav.featured.solutions.title'),
          description: t('nav.featured.solutions.desc'),
          href: `${translatePath('/offers')}#peaas`,
          cta: t('nav.featured.solutions.cta'),
          icon: 'tabler:rocket',
        },
        links: [
          {
            text: t('nav.audit'),
            href: `${translatePath('/offers')}#audit`,
            description: t('nav.audit.desc'),
            icon: 'tabler:search',
          },
          {
            text: t('nav.guidance'),
            href: `${translatePath('/offers')}#guidance`,
            description: t('nav.guidance.desc'),
            icon: 'tabler:users-group',
          },
          {
            text: t('nav.restart'),
            href: `${translatePath('/offers')}#restart`,
            description: t('nav.restart.desc'),
            icon: 'tabler:refresh',
          },
          {
            text: t('nav.peaas'),
            href: `${translatePath('/offers')}#peaas`,
            description: t('nav.peaas.desc'),
            icon: 'tabler:server-cog',
          },
          {
            text: t('nav.trainings'),
            href: translatePath('/trainings'),
            description: t('nav.trainings.desc'),
            icon: 'tabler:school',
          },
        ],
      },
      {
        text: t('nav.method'),
        links: [
          {
            text: t('nav.methodology'),
            href: translatePath('/methodology'),
            description: t('nav.methodology.desc'),
            icon: 'tabler:manual-gearbox',
          },
          {
            text: t('nav.maturity-assessment'),
            href: translatePath('/maturity-assessment'),
            description: t('nav.maturity-assessment.desc'),
            icon: 'tabler:radar-2',
          },
          {
            text: t('nav.frameworks'),
            href: `${translatePath('/methodology')}#frameworks`,
            description: t('nav.frameworks.desc'),
            icon: 'tabler:chart-dots-3',
          },
          {
            text: t('nav.principles'),
            href: `${translatePath('/methodology')}#principles`,
            description: t('nav.principles.desc'),
            icon: 'tabler:stack-2',
          },
          {
            text: t('nav.execution-model'),
            href: `${translatePath('/methodology')}#execution-model`,
            description: t('nav.execution-model.desc'),
            icon: 'tabler:route-2',
          },
        ],
      },
      {
        text: t('nav.open-kraft'),
        featured: {
          label: t('nav.featured.label'),
          title: t('nav.featured.openkraft.title'),
          description: t('nav.featured.openkraft.desc'),
          href: translatePath('/open-kraft'),
          cta: t('nav.featured.openkraft.cta'),
          icon: 'tabler:brand-open-source',
        },
        links: [
          {
            text: t('nav.open-kraft'),
            href: translatePath('/open-kraft'),
            description: t('nav.open-kraft.desc'),
            icon: 'tabler:puzzle',
          },
          {
            text: t('nav.connectors'),
            href: `${translatePath('/open-kraft')}#connectors`,
            description: t('nav.connectors.desc'),
            icon: 'tabler:plug-connected',
          },
          {
            text: t('nav.templates'),
            href: `${translatePath('/open-kraft')}#templates`,
            description: t('nav.templates.desc'),
            icon: 'tabler:template',
          },
          {
            text: t('nav.dashboards'),
            href: `${translatePath('/open-kraft')}#dashboards`,
            description: t('nav.dashboards.desc'),
            icon: 'tabler:dashboard',
          },
          {
            text: t('nav.github'),
            href: 'https://github.com/hoverkraft-tech',
            description: t('nav.github.desc'),
            icon: 'tabler:brand-github',
          },
          {
            text: t('nav.gitlab'),
            href: 'https://gitlab.com/hoverkraft-tech',
            description: t('nav.gitlab.desc'),
            icon: 'tabler:brand-gitlab',
          },
        ],
      },
      {
        text: t('nav.resources'),
        links: [
          {
            text: t('nav.documentation'),
            href: 'https://docs.hoverkraft.cloud',
            description: t('nav.documentation.desc'),
            icon: 'tabler:book',
          },
          {
            text: t('nav.demo'),
            href: translatePath('/demo'),
            description: t('nav.demo.desc'),
            icon: 'tabler:device-desktop-analytics',
          },
          {
            text: t('nav.testimonials'),
            href: translatePath('/testimonials'),
            description: t('nav.testimonials.desc'),
            icon: 'tabler:message-2-heart',
          },
          {
            text: t('nav.blog'),
            href: blogHref,
            description: t('nav.blog.desc'),
            icon: 'tabler:article',
          },
          {
            text: t('nav.rss'),
            href: getAsset('/rss.xml'),
            description: t('nav.rss.desc'),
            icon: 'tabler:rss',
          },
        ],
      },
      {
        text: t('nav.company'),
        links: [
          {
            text: t('nav.about'),
            href: translatePath('/about'),
            description: t('nav.about.desc'),
            icon: 'tabler:building',
          },
          {
            text: t('nav.contact'),
            href: translatePath('/contact'),
            description: t('nav.contact.desc'),
            icon: 'tabler:mail',
          },
          {
            text: t('nav.brand'),
            href: translatePath('/brand-guidelines'),
            description: t('nav.brand.desc'),
            icon: 'tabler:palette',
          },
          {
            text: t('nav.team'),
            href: `${translatePath('/about')}#team`,
            description: t('nav.team.desc'),
            icon: 'tabler:users',
          },
          {
            text: t('nav.manifesto'),
            href: `${translatePath('/about')}#manifesto`,
            description: t('nav.manifesto.desc'),
            icon: 'tabler:book-2',
          },
          {
            text: t('nav.values'),
            href: `${translatePath('/about')}#values`,
            description: t('nav.values.desc'),
            icon: 'tabler:heart-handshake',
          },
        ],
      },
    ],
    actions: [
      {
        text: t('button.book-audit'),
        href: `${translatePath('/contact')}#booking`,
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
  const followLinks: FooterFollowLink[] = [
    { text: t('nav.blog'), href: blogHref, icon: 'tabler:article' },
    { text: t('nav.rss'), href: getAsset('/rss.xml'), icon: 'tabler:rss' },
  ];

  return {
    description: t('footer.description'),
    cta: {
      text: t('button.book-audit'),
      href: `${translatePath('/contact')}#booking`,
    },
    follow: {
      title: t('footer.follow-title'),
      subtitle: t('footer.follow-subtitle'),
      links: followLinks,
    },
    links: [
      {
        title: t('footer.product'),
        links: [
          { text: t('nav.methodology'), href: translatePath('/methodology') },
          { text: t('nav.maturity-assessment'), href: translatePath('/maturity-assessment') },
          { text: t('nav.open-kraft'), href: translatePath('/open-kraft') },
          { text: t('nav.documentation'), href: 'https://docs.hoverkraft.cloud' },
        ],
      },
      {
        title: t('footer.services'),
        links: [
          { text: t('nav.offers'), href: translatePath('/offers') },
          { text: t('nav.audit'), href: `${translatePath('/offers')}#audit` },
          { text: t('nav.guidance'), href: `${translatePath('/offers')}#guidance` },
          { text: t('nav.restart'), href: `${translatePath('/offers')}#restart` },
          { text: t('nav.trainings'), href: translatePath('/trainings') },
          { text: t('nav.contact'), href: translatePath('/contact') },
        ],
      },
      {
        title: t('footer.resources'),
        links: [
          { text: t('nav.documentation'), href: 'https://docs.hoverkraft.cloud' },
          { text: t('nav.demo'), href: translatePath('/demo') },
          { text: t('nav.testimonials'), href: translatePath('/testimonials') },
          { text: t('nav.blog'), href: blogHref },
          { text: t('nav.rss'), href: getAsset('/rss.xml') },
        ],
      },
      {
        title: t('footer.company'),
        links: [
          { text: t('nav.about'), href: translatePath('/about') },
          { text: t('nav.team'), href: `${translatePath('/about')}#team` },
          { text: t('nav.values'), href: `${translatePath('/about')}#values` },
          { text: t('nav.brand'), href: translatePath('/brand-guidelines') },
          { text: t('nav.linkedin'), href: 'https://www.linkedin.com/company/hoverkraft-tech' },
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
      { ariaLabel: 'GitHub', icon: 'tabler:brand-github', href: 'https://github.com/hoverkraft-tech' },
      { ariaLabel: 'GitLab', icon: 'tabler:brand-gitlab', href: 'https://gitlab.com/hoverkraft-tech' },
      { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    ],
    footNote: t('footer.copyright'),
  };
}
