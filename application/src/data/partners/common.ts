import type { ImageMetadata } from 'astro';
import blackswiftLogo from '~/assets/images/partners/blackswift.svg';
import type { CredentialEntry, PartnerEntry } from '~/types/partners';

type PartnerCopy = Pick<PartnerEntry, 'summary' | 'tags' | 'details'>;
type CredentialCopy = Pick<CredentialEntry, 'summary' | 'details'>;

export const categoryIds = ['hosting'] as const;

export const blackswiftOffer = 'https://www.blackswift.fr/kontainers/';
export const blackswiftDocs = 'https://docs.blackswift.cloud/';
export const composeAction = 'https://github.com/marketplace/actions/docker-compose-action';
export const dokumentorAction = 'https://github.com/marketplace/actions/ci-dokumentor';

// SVG imports are callable components; retain their image metadata in the JSON catalogue.
const blackswiftImage: ImageMetadata = {
  src: blackswiftLogo.src,
  width: blackswiftLogo.width,
  height: blackswiftLogo.height,
  format: blackswiftLogo.format,
};

export const partners = [
  {
    id: 'blackswift' as const,
    type: 'partner',
    name: 'BlackSwift',
    categoryIds: ['hosting'],
    website: blackswiftOffer,
    icon: 'tabler:cloud-cog',
    logo: { src: blackswiftImage, alt: 'BlackSwift' },
  },
] satisfies Omit<PartnerEntry, keyof PartnerCopy>[];

export const credentials = [
  {
    id: 'github-verified-creator' as const,
    type: 'credential',
    name: 'GitHub Verified Creator',
    kind: 'accreditation',
    issuer: 'GitHub',
    holder: { scope: 'organization', name: 'Hoverkraft' },
    proofUrl: composeAction,
    icon: 'tabler:rosette-discount-check',
  },
] satisfies Omit<CredentialEntry, keyof CredentialCopy>[];

export interface PartnersCatalogCopy {
  categories: Record<(typeof categoryIds)[number], string>;
  partners: Record<(typeof partners)[number]['id'], PartnerCopy>;
  credentials: Record<(typeof credentials)[number]['id'], CredentialCopy>;
}
