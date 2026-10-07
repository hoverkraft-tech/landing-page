import type { SupportedLanguage } from '~/i18n/ui';

export type AnnouncementContent = {
  text: string;
  href: string;
};

export function getAnnouncementContent(lang: SupportedLanguage): AnnouncementContent {
  if (lang === 'en') {
    return {
      text: 'Hoverkraft is a sponsor of Kubernetes Community Days Provence 2026',
      href: 'https://cloudnative-provence.fr/',
    };
  }

  return {
    text: 'Hoverkraft est sponsor des Kubernetes Community Days Provence 2026',
    href: 'https://cloudnative-provence.fr/',
  };
}
