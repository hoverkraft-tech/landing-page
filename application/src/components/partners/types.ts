import type { CallToAction } from '~/types';

export type PartnersAction = Pick<CallToAction, 'variant' | 'icon' | 'target'> & {
  text: string;
  href: string;
};

export type PartnersBadge = {
  text: string;
  href?: string;
};

export type PartnersSectionHeader = {
  tagline?: string;
  title: string;
  subtitle?: string;
};

export type PartnersProofPoint = {
  text: string;
  icon?: string;
};

export type PartnersAccreditation = {
  id: string;
  title: string;
  description: string;
  icon?: string;
  badges: PartnersBadge[];
  link?: PartnersAction;
  featured?: boolean;
};

export type PartnersAllianceLogo = {
  svg: string;
  alt: string;
};

export type PartnersAlliance = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon?: string;
  logo?: PartnersAllianceLogo;
  highlights: PartnersProofPoint[];
  action?: PartnersAction;
};

export type PartnersSynergy = {
  title: string;
  subtitle?: string;
  hoverkraft: PartnersProofPoint & { label: string };
  partner: PartnersProofPoint & { label: string };
  result: string;
};

export type PartnersHeroContent = PartnersSectionHeader & {
  primaryAction: PartnersAction;
  secondaryAction: PartnersAction;
  image: { src: string; alt: string };
  badge: { text: string; icon?: string };
  proof: PartnersProofPoint[];
};

export type PartnersPageContent = {
  metadata: {
    title: string;
    description: string;
  };
  hero: PartnersHeroContent;
  accreditations: {
    header: PartnersSectionHeader;
    items: PartnersAccreditation[];
  };
  alliances: {
    header: PartnersSectionHeader;
    items: PartnersAlliance[];
    synergy: PartnersSynergy;
  };
  cta: {
    title: string;
    subtitle: string;
    primaryAction: PartnersAction;
    secondaryAction: PartnersAction;
  };
};
