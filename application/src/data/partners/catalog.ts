import type { SupportedLanguage } from '~/i18n/ui';
import type { PartnersCatalog } from '~/types/partners';
import { categoryIds, credentials, type PartnersCatalogCopy, partners } from './common';
import { enCatalogCopy } from './en';
import { frCatalogCopy } from './fr';

const catalogCopy = { fr: frCatalogCopy, en: enCatalogCopy } satisfies Record<SupportedLanguage, PartnersCatalogCopy>;

export const getPartnersCatalog = (lang: SupportedLanguage): PartnersCatalog => {
  const copy = catalogCopy[lang];

  return {
    categories: categoryIds.map((id) => ({ id, label: copy.categories[id] })),
    partners: partners.map((entry) => ({ ...entry, ...copy.partners[entry.id] })),
    credentials: credentials.map((entry) => ({ ...entry, ...copy.credentials[entry.id] })),
  };
};
