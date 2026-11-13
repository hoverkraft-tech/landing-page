import { useTranslatedPath } from '~/i18n/utils';
import type { PartnersPageContent } from '~/types/partners';
import { blackswiftDocs, blackswiftOffer, composeAction, dokumentorAction, type PartnersCatalogCopy } from './common';

const translatePath = useTranslatedPath('en');
const contactHref = `${translatePath('/contact')}#booking`;

export const enContent = {
  metadata: {
    title: 'Hoverkraft partners & accreditations',
    description:
      'Explore Hoverkraft partners, certifications and accreditations: complementary expertise, clear responsibilities and accessible evidence.',
  },
  hero: {
    tagline: 'Partners & accreditations',
    title: 'In good company.',
    accentTitle: 'Free to choose.',
    subtitle:
      'Complementary expertise to move your platform forward. Meet our partners and explore our accreditations, with clear roles and accessible evidence.',
    primaryAction: { text: 'Explore our ecosystem', href: '#ecosystem-catalog', variant: 'primary' },
    secondaryAction: { text: "Let's talk about your platform", href: contactHref, variant: 'link' },
    reassurance: 'Open. Sovereign. Reversible.',
    diagramLabel: 'Explore partners and credentials',
    diagramKicker: 'Expertise. Evidence. Your freedom.',
    partnerAction: 'Explore expertise',
    credentialAction: 'View evidence',
    hoverkraftAction: 'Connect the expertise',
    ownership: 'Your team stays in control',
    captionTitle: 'Expertise comes together. The choice stays yours.',
    caption: 'Explore each relationship and the scope of each credential.',
  },
  navigation: {
    label: 'On this page',
    ecosystem: 'Our ecosystem',
    freedom: 'Your freedom',
    collaborate: 'Work together',
    note: 'Connections that move you forward.',
  },
  catalogSection: {
    tagline: 'The Hoverkraft ecosystem',
    title: 'Expertise to discover.',
    accentTitle: 'Commitments to verify.',
    subtitle: 'Explore the partners we work with and the credentials you can verify.',
    principleTitle: 'Every credential has a defined scope.',
    principle:
      'Certifications, accreditations and partnerships each have their own meaning. Every entry explains what is recognized, by whom and for whom.',
  },
  freedom: {
    tagline: 'Your platform. Your freedom.',
    title: 'An open ecosystem.',
    accentTitle: 'You stay in control.',
    subtitle: 'Our partners expand your options. Your context guides the decisions.',
    principles: [
      {
        title: 'Open code.',
        description: 'Public actions and connectors. You can understand, adapt and improve the components you use.',
        icon: 'tabler:code',
      },
      {
        title: 'Reversible choices.',
        description: 'Your hosting provider, tools and constraints. We build the path that fits your platform.',
        icon: 'tabler:lock-open',
      },
      {
        title: 'An independent team.',
        description: 'Documentation, support and knowledge transfer are part of the journey.',
        icon: 'tabler:users',
      },
    ],
    action: { text: 'Discover the Hoverkraft method', href: translatePath('/methodology'), variant: 'link' },
  },
  cta: {
    tagline: "Let's build together",
    title: 'The next connection',
    accentTitle: 'could be you.',
    subtitle: "A connector to imagine, expertise to share or a project to support together? Let's talk.",
    primaryAction: { text: 'Propose a partnership', href: contactHref, variant: 'primary' },
    note: 'Technical, commercial or community.',
    alternatePrompt: 'Have a platform project in mind?',
    alternateAction: { text: 'Talk to a Kraft Builder', href: contactHref, variant: 'link' },
  },
  labels: {
    collections: { partners: 'Partners', credentials: 'Certifications & accreditations' },
    context: {
      partners: "Complementary expertise for your project's needs.",
      credentials: 'An issuer, a holder and evidence for each credential.',
    },
    nouns: {
      partners: { one: 'partner', many: 'partners' },
      credentials: { one: 'credential', many: 'credentials' },
    },
    kinds: { accreditation: 'Accreditation', certification: 'Certification', label: 'Label' },
    scopes: { organization: 'Organization', individual: 'Individual' },
    navigation: 'Explore the ecosystem',
    all: 'Explore all',
    allCategories: 'All categories',
    category: 'Category',
    search: 'Search',
    searchLabel: 'Search for a partner, skill or credential',
    searchPlaceholder: 'A name, area of expertise, certification...',
    clearSearch: 'Clear search',
    count: '{count} {label}',
    partialCount: '{shown} of {total} {label}',
    showMore: 'Show more ({count})',
    emptyTitle: 'No entries published yet.',
    emptyDescription: 'Explore the other parts of our ecosystem.',
    noResultsTitle: 'No results match these filters.',
    noResultsDescription: 'Try another search term or choose a broader category.',
    reset: 'Clear filters',
    viewDetails: 'View details',
    viewDetailsFor: 'View details for {name}',
    officialSite: 'Official website',
    verify: 'Verify',
    closeDetails: 'Close details',
    proofLink: 'View official evidence',
    metadata: {
      kind: 'Credential type',
      issuer: 'Issuer',
      holder: 'Holder',
      issuedAt: 'Issue date',
      expiresAt: 'Stated validity',
      status: 'Status',
    },
    expired: 'Validity period has ended',
    upcoming: 'Upcoming',
    validUntil: 'Until {date}',
    sections: {
      partner: 'What this partnership brings',
      credential: 'What is recognized',
      bullets: 'In practice',
      responsibilities: 'Who does what?',
      related: 'Related credentials',
      resources: 'Sources & resources',
    },
  },
} satisfies Omit<PartnersPageContent, 'lang' | 'catalog'>;

export const enCatalogCopy = {
  categories: { hosting: 'Cloud & hosting' },
  partners: {
    blackswift: {
      summary: 'Managed Kubernetes in France, for projects that need it.',
      tags: ['Kubernetes', 'France', 'Managed hosting'],
      details: {
        paragraphs: [
          'For projects that need it, BlackSwift provides managed Kubernetes infrastructure in France. Hoverkraft integrates your delivery pipeline with it.',
          'Hosting choices follow the needs of the project. The scope of services depends on the selected offer.',
        ],
        bullets: [
          'Infrastructure and teams in France',
          'Kubernetes operated by BlackSwift',
          'Monitoring and backups depend on the selected offer',
        ],
        responsibilities: [
          { name: 'Your team', description: 'Application code and product decisions.' },
          { name: 'Hoverkraft', description: 'Architecture, automation and delivery pipeline integration.' },
          { name: 'BlackSwift', description: 'Operating the Kubernetes infrastructure under the selected offer.' },
        ],
        resources: [
          { label: 'Explore the Kontainers offer', href: blackswiftOffer },
          { label: 'BlackSwift documentation', href: blackswiftDocs },
        ],
      },
    },
  },
  credentials: {
    'github-verified-creator': {
      summary: 'The Verified Creator badge identifies Hoverkraft as a verified creator on GitHub Marketplace.',
      details: {
        paragraphs: [
          'The Verified Creator badge identifies Hoverkraft as a verified creator on GitHub Marketplace.',
          'This accreditation applies to the creator. It does not certify the actions themselves or represent an individual qualification.',
        ],
        bullets: ['Scope: the Hoverkraft organization', 'Evidence available on GitHub Marketplace'],
        resources: [
          { label: 'View the badge on Docker Compose Action', href: composeAction },
          { label: 'View the badge on CI Dokumentor', href: dokumentorAction },
        ],
      },
    },
  },
} satisfies PartnersCatalogCopy;
