import type { SupportedLanguage } from '~/i18n/ui';
import type { PartnersPageContent } from '~/types/partners';
import { getPartnersCatalog } from './partners/catalog';
import { enContent } from './partners/en';
import { frContent } from './partners/fr';

const pageContent = { fr: frContent, en: enContent } satisfies Record<
  SupportedLanguage,
  Omit<PartnersPageContent, 'lang' | 'catalog'>
>;

export const getPartnersContent = (lang: SupportedLanguage): PartnersPageContent => ({
  ...pageContent[lang],
  lang,
  catalog: getPartnersCatalog(lang),
});
