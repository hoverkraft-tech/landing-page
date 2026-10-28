import blackswiftLogo from '~/assets/images/partners/blackswift.svg?raw';
import type { PartnersPageContent } from '~/components/partners/types';
import type { SupportedLanguage } from '~/i18n/ui';
import { useTranslatedPath } from '~/i18n/utils';

const heroImage = {
  src: '~/assets/images/blog/github-official-partner/preview.png',
};

export function getPartnersContent(lang: SupportedLanguage): PartnersPageContent {
  const path = useTranslatedPath(lang);

  const hrefs = {
    contact: `${path('/contact')}#booking`,
    methodology: path('/methodology'),
    github: 'https://github.com/hoverkraft-tech',
    marketplace: 'https://github.com/marketplace?query=hoverkraft',
    partnerProgram: 'https://partner.github.com/',
    blackswift: 'https://www.blackswift.fr',
  };

  if (lang === 'en') {
    return {
      metadata: {
        title: 'HoverKraft accreditations & partners',
        description:
          'Hoverkraft is an official GitHub partner organization with the Verified Creator badge on its GitHub Actions, and relies on BlackSwift for sovereign Kubernetes hosting.',
      },
      hero: {
        tagline: 'Partnerships & accreditations',
        title: 'Our GitHub accreditations and partners',
        subtitle:
          'Hoverkraft is an official GitHub partner organization, with the Verified Creator badge on its GitHub Actions. For hosting, we rely on BlackSwift, a French and sovereign Kubernetes platform.',
        primaryAction: { variant: 'primary', text: 'Talk to a Kraft Builder', href: hrefs.contact },
        secondaryAction: {
          variant: 'secondary',
          text: 'Browse our repositories',
          href: hrefs.github,
          target: '_blank',
        },
        image: { ...heroImage, alt: 'HoverKraft accreditations and partners' },
        badge: { text: 'Official GitHub partner', icon: 'tabler:rosette-discount-check' },
        proof: [
          { text: 'GitHub Partner Program member', icon: 'tabler:brand-github' },
          { text: 'Verified Creator badge on our actions', icon: 'tabler:rosette-discount-check' },
          { text: 'Open-source actions and connectors', icon: 'tabler:brand-open-source' },
        ],
      },
      accreditations: {
        header: {
          tagline: 'GitHub accreditations',
          title: 'What GitHub recognizes',
          subtitle:
            'Admitted to the GitHub Partner Program after several months of certification, following three years industrializing GitHub Actions.',
        },
        items: [
          {
            id: 'github-partner',
            featured: true,
            title: 'Official GitHub partner',
            description:
              'HoverKraft is an official GitHub partner organization, admitted to the GitHub Partner Program after several months of certification.',
            icon: 'tabler:brand-github',
            badges: [{ text: 'GitHub Partner Program', href: hrefs.partnerProgram }],
            link: {
              variant: 'link',
              text: 'Read the announcement',
              href: '/en/blog/hoverkraft-official-github-partner',
            },
          },
          {
            id: 'verified-creator',
            title: 'Verified Creator badge',
            description:
              'On our GitHub Actions, the Verified Creator badge shows that GitHub has verified the Hoverkraft organization.',
            icon: 'tabler:rosette-discount-check',
            badges: [{ text: 'Verified Creator' }],
          },
          {
            id: 'marketplace',
            title: 'GitHub Marketplace',
            description: 'Our GitHub Actions for build, scan, and release are published on the GitHub Marketplace.',
            icon: 'tabler:building-store',
            badges: [{ text: 'Published actions', href: hrefs.marketplace }],
          },
          {
            id: 'open-source',
            title: 'Open-source actions and tools',
            description:
              'Actions, connectors, and tools published on github.com/hoverkraft-tech: auditable and reusable code.',
            icon: 'tabler:brand-open-source',
            badges: [{ text: 'github.com/hoverkraft-tech', href: hrefs.github }],
          },
        ],
      },
      alliances: {
        header: {
          tagline: 'Hosting partner',
          title: 'A sovereign Kubernetes foundation with BlackSwift',
          subtitle: 'When a project needs managed Kubernetes hosting in France, we rely on BlackSwift.',
        },
        items: [
          {
            id: 'blackswift',
            name: 'BlackSwift',
            tagline: 'Sovereign Kubernetes',
            description:
              'A turnkey, 100% French and sovereign Kubernetes platform that hosts your containerized applications.',
            icon: 'tabler:cloud-cog',
            logo: { svg: blackswiftLogo, alt: 'BlackSwift' },
            highlights: [
              { text: '100% French and sovereign', icon: 'tabler:flag' },
              { text: 'Security and monitoring included', icon: 'tabler:shield-lock' },
              { text: 'Backups included', icon: 'tabler:database' },
              { text: 'GDPR compliant', icon: 'tabler:gavel' },
            ],
            action: {
              variant: 'primary',
              text: 'Discover BlackSwift',
              href: hrefs.blackswift,
              target: '_blank',
            },
          },
        ],
        synergy: {
          title: 'Who does what',
          subtitle: 'Hoverkraft and BlackSwift cover two distinct roles.',
          hoverkraft: {
            label: 'HoverKraft',
            text: 'Method, GitHub Actions, and open-source connectors',
            icon: 'tabler:route',
          },
          partner: {
            label: 'BlackSwift',
            text: 'Managed Kubernetes hosting in France',
            icon: 'tabler:cloud-cog',
          },
          result: 'From commit to runtime, without proprietary lock-in.',
        },
      },
      cta: {
        title: 'A technical or commercial partnership in mind?',
        subtitle: 'Integrating our connectors, joint delivery, or a commercial partnership: tell us where you are.',
        primaryAction: { variant: 'primary', text: 'Become a partner', href: hrefs.contact },
        secondaryAction: { variant: 'secondary', text: 'Explore the methodology', href: hrefs.methodology },
      },
    };
  }

  return {
    metadata: {
      title: 'Accréditations & partenaires HoverKraft',
      description:
        "Hoverkraft est organisation partenaire officielle GitHub, avec le badge Verified Creator sur ses GitHub Actions, et s'appuie sur BlackSwift pour l'hébergement Kubernetes souverain.",
    },
    hero: {
      tagline: 'Partenariats & accréditations',
      title: 'Nos accréditations GitHub et nos partenaires',
      subtitle:
        "Hoverkraft est organisation partenaire officielle GitHub, avec le badge Verified Creator sur ses GitHub Actions. Pour l'hébergement, nous nous appuyons sur BlackSwift, plateforme Kubernetes française et souveraine.",
      primaryAction: { variant: 'primary', text: 'Parler à un Kraft Builder', href: hrefs.contact },
      secondaryAction: {
        variant: 'secondary',
        text: 'Voir nos dépôts',
        href: hrefs.github,
        target: '_blank',
      },
      image: { ...heroImage, alt: 'Accréditations et partenaires HoverKraft' },
      badge: { text: 'Partenaire officiel GitHub', icon: 'tabler:rosette-discount-check' },
      proof: [
        { text: 'Membre du GitHub Partner Program', icon: 'tabler:brand-github' },
        { text: 'Badge Verified Creator sur nos actions', icon: 'tabler:rosette-discount-check' },
        { text: 'Actions et connecteurs open source', icon: 'tabler:brand-open-source' },
      ],
    },
    accreditations: {
      header: {
        tagline: 'Accréditations GitHub',
        title: 'Ce que GitHub reconnaît',
        subtitle:
          'Admis au GitHub Partner Program après plusieurs mois de certification, au terme de trois ans à industrialiser GitHub Actions.',
      },
      items: [
        {
          id: 'github-partner',
          featured: true,
          title: 'Partenaire officiel GitHub',
          description:
            'Hoverkraft est une organisation partenaire officielle GitHub, admise au GitHub Partner Program après plusieurs mois de certification.',
          icon: 'tabler:brand-github',
          badges: [{ text: 'GitHub Partner Program', href: hrefs.partnerProgram }],
          link: {
            variant: 'link',
            text: "Lire l'annonce",
            href: '/blog/hoverkraft-partenaire-officiel-github',
          },
        },
        {
          id: 'verified-creator',
          title: 'Badge Verified Creator',
          description:
            "Présent sur nos GitHub Actions, le badge Verified Creator indique que GitHub a vérifié l'organisation Hoverkraft.",
          icon: 'tabler:rosette-discount-check',
          badges: [{ text: 'Verified Creator' }],
        },
        {
          id: 'marketplace',
          title: 'GitHub Marketplace',
          description: 'Nos GitHub Actions de build, scan et release sont publiées sur le GitHub Marketplace.',
          icon: 'tabler:building-store',
          badges: [{ text: 'Actions publiées', href: hrefs.marketplace }],
        },
        {
          id: 'open-source',
          title: 'Actions et outils open source',
          description:
            'Actions, connecteurs et outils publiés sur github.com/hoverkraft-tech : code auditable et réutilisable.',
          icon: 'tabler:brand-open-source',
          badges: [{ text: 'github.com/hoverkraft-tech', href: hrefs.github }],
        },
      ],
    },
    alliances: {
      header: {
        tagline: "Partenaire d'hébergement",
        title: 'Un socle Kubernetes souverain avec BlackSwift',
        subtitle:
          'Quand un projet demande un hébergement Kubernetes managé en France, nous nous appuyons sur BlackSwift.',
      },
      items: [
        {
          id: 'blackswift',
          name: 'BlackSwift',
          tagline: 'Kubernetes souverain',
          description:
            'Plateforme Kubernetes clé en main, 100% française et souveraine, qui héberge vos applications conteneurisées.',
          icon: 'tabler:cloud-cog',
          logo: { svg: blackswiftLogo, alt: 'BlackSwift' },
          highlights: [
            { text: '100% française et souveraine', icon: 'tabler:flag' },
            { text: 'Sécurité et supervision incluses', icon: 'tabler:shield-lock' },
            { text: 'Sauvegardes incluses', icon: 'tabler:database' },
            { text: 'Conformité RGPD', icon: 'tabler:gavel' },
          ],
          action: {
            variant: 'primary',
            text: 'Découvrir BlackSwift',
            href: hrefs.blackswift,
            target: '_blank',
          },
        },
      ],
      synergy: {
        title: 'Qui fait quoi',
        subtitle: 'Hoverkraft et BlackSwift couvrent deux rôles distincts.',
        hoverkraft: {
          label: 'Hoverkraft',
          text: 'Méthode, GitHub Actions et connecteurs open source',
          icon: 'tabler:route',
        },
        partner: {
          label: 'BlackSwift',
          text: 'Hébergement Kubernetes managé en France',
          icon: 'tabler:cloud-cog',
        },
        result: 'Du commit au run, sans verrou propriétaire.',
      },
    },
    cta: {
      title: 'Un partenariat technique ou commercial en tête ?',
      subtitle:
        'Intégration de nos connecteurs, accompagnement conjoint ou partenariat commercial : dites-nous où vous en êtes.',
      primaryAction: { variant: 'primary', text: 'Devenir partenaire', href: hrefs.contact },
      secondaryAction: { variant: 'secondary', text: 'Découvrir la méthode', href: hrefs.methodology },
    },
  };
}
