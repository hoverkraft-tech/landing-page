import type { ImageMetadata } from 'astro';
import type { SupportedLanguage } from '~/i18n/ui';
import type { CallToAction, MetaData } from '~/types';

export type CatalogCollection = 'partners' | 'credentials';
export type CredentialKind = 'accreditation' | 'certification' | 'label';
export type HolderScope = 'organization' | 'individual';

export interface CatalogResource {
  label: string;
  href: string;
}

export interface CatalogDetails {
  paragraphs: string[];
  bullets?: string[];
  responsibilities?: { name: string; description: string }[];
  resources?: CatalogResource[];
}

interface CatalogEntryBase {
  id: string;
  name: string;
  summary: string;
  icon: string;
  logo?: { src: ImageMetadata | string; alt: string };
  details: CatalogDetails;
}

export interface PartnerEntry extends CatalogEntryBase {
  type: 'partner';
  categoryIds: string[];
  website: string;
  tags?: string[];
}

export interface CredentialEntry extends CatalogEntryBase {
  type: 'credential';
  kind: CredentialKind;
  issuer: string;
  holder: { name: string; scope: HolderScope };
  proofUrl: string;
  issuedAt?: string;
  expiresAt?: string;
  partnerId?: string;
}

export type CatalogEntry = PartnerEntry | CredentialEntry;
export interface CatalogCategory {
  id: string;
  label: string;
}

export interface PartnersCatalog {
  categories: CatalogCategory[];
  partners: PartnerEntry[];
  credentials: CredentialEntry[];
}

export interface CatalogLabels {
  collections: Record<CatalogCollection, string>;
  context: Record<CatalogCollection, string>;
  nouns: Record<CatalogCollection, { one: string; many: string }>;
  kinds: Record<CredentialKind, string>;
  scopes: Record<HolderScope, string>;
  navigation: string;
  all: string;
  allCategories: string;
  category: string;
  search: string;
  searchLabel: string;
  searchPlaceholder: string;
  clearSearch: string;
  count: string;
  partialCount: string;
  showMore: string;
  emptyTitle: string;
  emptyDescription: string;
  noResultsTitle: string;
  noResultsDescription: string;
  reset: string;
  viewDetails: string;
  viewDetailsFor: string;
  officialSite: string;
  verify: string;
  closeDetails: string;
  proofLink: string;
  metadata: {
    kind: string;
    issuer: string;
    holder: string;
    issuedAt: string;
    expiresAt: string;
    status: string;
  };
  expired: string;
  upcoming: string;
  validUntil: string;
  sections: {
    partner: string;
    credential: string;
    bullets: string;
    responsibilities: string;
    related: string;
    resources: string;
  };
}

export interface CatalogClientContent {
  lang: SupportedLanguage;
  catalog: PartnersCatalog;
  labels: CatalogLabels;
}

export type PartnersAction = CallToAction & { text: string; href: string };

export interface PartnersPageContent extends CatalogClientContent {
  metadata: MetaData;
  hero: {
    tagline: string;
    title: string;
    accentTitle: string;
    subtitle: string;
    primaryAction: PartnersAction;
    secondaryAction: PartnersAction;
    reassurance: string;
    diagramLabel: string;
    diagramKicker: string;
    partnerAction: string;
    credentialAction: string;
    hoverkraftAction: string;
    ownership: string;
    captionTitle: string;
    caption: string;
  };
  navigation: { label: string; ecosystem: string; freedom: string; collaborate: string; note: string };
  catalogSection: {
    tagline: string;
    title: string;
    accentTitle: string;
    subtitle: string;
    principleTitle: string;
    principle: string;
  };
  freedom: {
    tagline: string;
    title: string;
    accentTitle: string;
    subtitle: string;
    principles: { title: string; description: string; icon: string }[];
    action: PartnersAction;
  };
  cta: {
    tagline: string;
    title: string;
    accentTitle: string;
    subtitle: string;
    primaryAction: PartnersAction;
    note: string;
    alternatePrompt: string;
    alternateAction: PartnersAction;
  };
}
