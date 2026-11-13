import { useTranslatedPath } from '~/i18n/utils';
import type { PartnersPageContent } from '~/types/partners';
import { blackswiftDocs, blackswiftOffer, composeAction, dokumentorAction, type PartnersCatalogCopy } from './common';

const translatePath = useTranslatedPath('fr');
const contactHref = `${translatePath('/contact')}#booking`;

export const frContent = {
  metadata: {
    title: 'Partenaires & accréditations Hoverkraft',
    description:
      'Découvrez les partenaires, certifications et accréditations Hoverkraft : des expertises complémentaires, des rôles clairs et des preuves accessibles.',
  },
  hero: {
    tagline: 'Partenaires & accréditations',
    title: 'Bien entourés.',
    accentTitle: 'Toujours libres.',
    subtitle:
      'Des expertises complémentaires pour faire avancer votre plateforme. Découvrez nos partenaires et nos accréditations, avec un rôle clair et des preuves accessibles.',
    primaryAction: { text: 'Explorer notre écosystème', href: '#ecosystem-catalog', variant: 'primary' },
    secondaryAction: { text: 'Parlons de votre plateforme', href: contactHref, variant: 'link' },
    reassurance: 'Ouvert. Souverain. Réversible.',
    diagramLabel: 'Explorer les partenaires et les reconnaissances',
    diagramKicker: 'Des expertises. Des preuves. Votre liberté.',
    partnerAction: 'Explorer les expertises',
    credentialAction: 'Consulter les preuves',
    hoverkraftAction: 'Relier les expertises',
    ownership: 'Votre équipe garde la main',
    captionTitle: 'Les expertises se complètent. Vous gardez le choix.',
    caption: 'Explorez chaque relation et la portée de chaque reconnaissance.',
  },
  navigation: {
    label: 'Sur cette page',
    ecosystem: 'Notre écosystème',
    freedom: 'Votre liberté',
    collaborate: 'Collaborer',
    note: 'Des liens qui font avancer.',
  },
  catalogSection: {
    tagline: "L'écosystème Hoverkraft",
    title: 'Des expertises à découvrir.',
    accentTitle: 'Des engagements à vérifier.',
    subtitle: 'Explorez les partenaires qui nous accompagnent et les reconnaissances que vous pouvez vérifier.',
    principleTitle: 'Une reconnaissance, une portée précise.',
    principle:
      'Une certification, une accréditation et un partenariat ont chacun leur sens. Chaque fiche précise ce qui est reconnu, par qui et pour qui.',
  },
  freedom: {
    tagline: 'Votre plateforme. Votre liberté.',
    title: 'Un écosystème ouvert.',
    accentTitle: 'La maîtrise reste chez vous.',
    subtitle: 'Nos partenaires enrichissent vos possibilités. Votre contexte guide les décisions.',
    principles: [
      {
        title: 'Du code ouvert.',
        description:
          'Des actions et des connecteurs publics. Vous pouvez comprendre, adapter et faire évoluer vos briques.',
        icon: 'tabler:code',
      },
      {
        title: 'Des choix réversibles.',
        description:
          'Votre hébergeur, vos outils, vos contraintes. Nous construisons la trajectoire adaptée à votre plateforme.',
        icon: 'tabler:lock-open',
      },
      {
        title: 'Une équipe autonome.',
        description: 'Documentation, accompagnement et transfert de compétences font partie du chemin.',
        icon: 'tabler:users',
      },
    ],
    action: { text: 'Découvrir la méthode Hoverkraft', href: translatePath('/methodology'), variant: 'link' },
  },
  cta: {
    tagline: 'Construisons ensemble',
    title: 'La prochaine connexion,',
    accentTitle: "c'est peut-être vous.",
    subtitle: 'Un connecteur à imaginer, une expertise à partager, un projet à accompagner ensemble ? Parlons-en.',
    primaryAction: { text: 'Proposer un partenariat', href: contactHref, variant: 'primary' },
    note: 'Technique, commercial ou communautaire.',
    alternatePrompt: 'Vous avez plutôt un projet de plateforme ?',
    alternateAction: { text: 'Échanger avec un Kraft Builder', href: contactHref, variant: 'link' },
  },
  labels: {
    collections: { partners: 'Partenaires', credentials: 'Certifications & accréditations' },
    context: {
      partners: 'Des expertises complémentaires, selon les besoins de votre projet.',
      credentials: 'Un organisme émetteur, un titulaire et une preuve pour chaque reconnaissance.',
    },
    nouns: {
      partners: { one: 'partenaire', many: 'partenaires' },
      credentials: { one: 'reconnaissance', many: 'reconnaissances' },
    },
    kinds: { accreditation: 'Accréditation', certification: 'Certification', label: 'Label' },
    scopes: { organization: 'Organisation', individual: 'Personne' },
    navigation: "Explorer l'écosystème",
    all: 'Tout explorer',
    allCategories: 'Toutes les catégories',
    category: 'Catégorie',
    search: 'Rechercher',
    searchLabel: 'Rechercher un partenaire, une compétence ou une reconnaissance',
    searchPlaceholder: 'Un nom, une expertise, une certification...',
    clearSearch: 'Effacer la recherche',
    count: '{count} {label}',
    partialCount: '{shown} sur {total} {label}',
    showMore: 'Afficher plus ({count})',
    emptyTitle: 'Aucune fiche publiée pour le moment.',
    emptyDescription: 'Explorez les autres références de notre écosystème.',
    noResultsTitle: 'Aucun résultat pour ces critères.',
    noResultsDescription: 'Essayez un autre terme ou élargissez la catégorie.',
    reset: 'Effacer les filtres',
    viewDetails: 'Voir la fiche',
    viewDetailsFor: 'Voir la fiche de {name}',
    officialSite: 'Site officiel',
    verify: 'Vérifier',
    closeDetails: 'Fermer la fiche',
    proofLink: 'Consulter la preuve officielle',
    metadata: {
      kind: 'Reconnaissance',
      issuer: 'Organisme émetteur',
      holder: 'Titulaire',
      issuedAt: "Date d'obtention",
      expiresAt: 'Validité indiquée',
      status: 'Situation',
    },
    expired: 'Date de validité dépassée',
    upcoming: 'À venir',
    validUntil: "Jusqu'au {date}",
    sections: {
      partner: 'Ce que ce partenariat apporte',
      credential: 'Ce qui est reconnu',
      bullets: 'En pratique',
      responsibilities: 'Qui fait quoi ?',
      related: 'Reconnaissances associées',
      resources: 'Sources & ressources',
    },
  },
} satisfies Omit<PartnersPageContent, 'lang' | 'catalog'>;

export const frCatalogCopy = {
  categories: { hosting: 'Cloud & hébergement' },
  partners: {
    blackswift: {
      summary: 'Un socle Kubernetes managé en France, pour les projets qui en ont besoin.',
      tags: ['Kubernetes', 'France', 'Hébergement managé'],
      details: {
        paragraphs: [
          'Pour les projets qui le nécessitent, BlackSwift apporte un socle Kubernetes managé en France. Hoverkraft y intègre votre chaîne de delivery.',
          "Le choix de l'hébergement suit les besoins du projet. Le périmètre des services dépend de l'offre retenue.",
        ],
        bullets: [
          'Infrastructure et équipes en France',
          'Kubernetes opéré par BlackSwift',
          "Supervision et sauvegardes selon l'offre",
        ],
        responsibilities: [
          { name: 'Votre équipe', description: 'Le code applicatif et les décisions produit.' },
          {
            name: 'Hoverkraft',
            description: "L'architecture, l'automatisation et l'intégration de la chaîne de delivery.",
          },
          { name: 'BlackSwift', description: "L'exploitation du socle Kubernetes selon l'offre retenue." },
        ],
        resources: [
          { label: "Découvrir l'offre Kontainers", href: blackswiftOffer },
          { label: 'Documentation BlackSwift', href: blackswiftDocs },
        ],
      },
    },
  },
  credentials: {
    'github-verified-creator': {
      summary: 'Le badge Verified Creator identifie Hoverkraft comme créateur vérifié sur GitHub Marketplace.',
      details: {
        paragraphs: [
          'Le badge Verified Creator identifie Hoverkraft comme créateur vérifié sur GitHub Marketplace.',
          'Cette accréditation porte sur le créateur. Elle ne constitue pas une certification des actions elles-mêmes ni une qualification individuelle.',
        ],
        bullets: ['Périmètre : organisation Hoverkraft', 'Preuve consultable sur GitHub Marketplace'],
        resources: [
          { label: 'Voir le badge sur Docker Compose Action', href: composeAction },
          { label: 'Voir le badge sur CI Dokumentor', href: dokumentorAction },
        ],
      },
    },
  },
} satisfies PartnersCatalogCopy;
