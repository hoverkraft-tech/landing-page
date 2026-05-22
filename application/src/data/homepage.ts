import { useTranslatedPath } from '~/i18n/utils';
import type { SupportedLanguage } from '~/i18n/ui';
import type { HomePageContent } from '~/components/home/types';

const externalLinks = {
  docs: 'https://docs.hoverkraft.cloud',
  github: 'https://github.com/hoverkraft-tech',
  gitlab: 'https://gitlab.com/hoverkraft-tech',
};

export function getHomepageContent(lang: SupportedLanguage): HomePageContent {
  const path = useTranslatedPath(lang);

  const commonHrefs = {
    home: path('/'),
    contact: `${path('/contact')}#form`,
    methodology: path('/methodology'),
    offers: path('/offers'),
    trainings: path('/trainings'),
    openKraft: path('/open-kraft'),
    blog: path('/blog'),
    maturityAssessment: path('/maturity-assessment'),
    docs: externalLinks.docs,
    github: externalLinks.github,
    gitlab: externalLinks.gitlab,
  };

  if (lang === 'en') {
    return {
      metadata: {
        title: 'Hoverkraft - Sovereign and reversible Platform Engineering',
        description:
          'Industrialize Platform Engineering with the HoverKraft method, open-source connectors, and senior guidance to accelerate delivery without lock-in.',
      },
      announcement: {
        text: 'New: take the Platform Engineering maturity assessment in 5 minutes',
        href: commonHrefs.maturityAssessment,
      },
      hero: {
        tagline: 'Sovereign Platform Engineering',
        title: 'Industrialize Platform Engineering without losing control',
        subtitle:
          'Hoverkraft combines a proven method, open-source connectors, and senior guidance to turn your existing tools into a measurable, reversible, developer-first delivery chain.',
        primaryAction: { variant: 'primary', text: 'Book an audit', href: commonHrefs.contact },
        secondaryAction: { variant: 'secondary', text: 'Take the assessment', href: commonHrefs.maturityAssessment },
        proof: [
          { text: 'Open-source connectors for Git, CI/CD, observability, and cloud.', icon: 'tabler:git-branch' },
          { text: 'DORA, SPACE, and Lean steering from the first weeks.', icon: 'tabler:chart-dots' },
          {
            text: 'Documentation, transfer, and reversibility built into the engagement.',
            icon: 'tabler:shield-check',
          },
        ],
        visual: {
          title: 'Delivery chain map',
          subtitle: 'Method, connectors, and metrics aligned around developer flow.',
          nodes: ['Source', 'CI/CD', 'Runtime', 'Observability', 'Roadmap'],
          metrics: ['DORA', 'SPACE', 'Lean'],
        },
      },
      proofStrip: [
        {
          label: 'Open-source first',
          description: 'Reusable connectors and templates stay inspectable, portable, and owned by your teams.',
        },
        {
          label: 'Senior practitioners',
          description: 'Platform Engineers audit, build, coach, and transfer ownership with your teams.',
        },
        {
          label: 'Measured delivery',
          description: 'DORA, SPACE, and Lean metrics guide priorities from the first working sessions.',
        },
        {
          label: 'No lock-in',
          description: 'Documentation, reversible choices, and open-source posture are part of the operating model.',
        },
      ],
      useCases: {
        header: {
          tagline: 'Choose your path',
          title: 'One platform challenge, four different vantage points',
          subtitle:
            'Pick your role to see the friction we hear most often and the next step that actually moves the needle.',
        },
        items: [
          {
            id: 'cto',
            title: 'CTOs & CIOs',
            role: 'Strategy & risk',
            problem:
              'Your teams ship, yet every release still hinges on tribal scripts and manual judgement calls you cannot defend in a steerco.',
            response:
              'We translate platform work into a measurable trajectory: visible decisions, fewer surprises, and a roadmap your COMEX can challenge.',
            outcomes: [
              'DORA & SPACE baseline within weeks.',
              'Investment plan tied to business outcomes.',
              'Risk and reversibility made explicit.',
            ],
            action: { text: 'View offers', href: commonHrefs.offers },
            icon: 'tabler:briefcase',
          },
          {
            id: 'platform',
            title: 'Platform & DevOps teams',
            role: 'Build & operate',
            problem:
              'You maintain the internal glue, fight backlog after backlog, and never get enough time to industrialize what already works.',
            response:
              'OpenKraft hands you reusable connectors, paved-road templates, and standards your team owns end-to-end - no proprietary cage.',
            outcomes: [
              'Reusable connectors across Git, CI/CD, cloud.',
              'Paved-road templates with sensible defaults.',
              'Golden paths versioned like product code.',
            ],
            action: { text: 'Explore OpenKraft', href: commonHrefs.openKraft },
            icon: 'tabler:terminal-2',
          },
          {
            id: 'product',
            title: 'Product engineering',
            role: 'Developer flow',
            problem:
              'Developers burn hours on environments, pipelines, secrets, and incident handovers instead of shipping product value.',
            response:
              'The HoverKraft method removes friction from laptop to production with rituals and tooling that respect developer time.',
            outcomes: [
              'Onboarding measured in hours, not weeks.',
              'Self-service envs and reproducible builds.',
              'Clear on-call paths and incident rituals.',
            ],
            action: { text: 'Discover the method', href: commonHrefs.methodology },
            icon: 'tabler:layout-kanban',
          },
          {
            id: 'sovereign',
            title: 'Sovereignty-driven orgs',
            role: 'Control & reversibility',
            problem:
              'You need delivery efficiency without handing the keys of your platform - or your data - to a single vendor.',
            response:
              'Documentation, knowledge transfer, and reversibility are part of every engagement: you stay in the driver seat.',
            outcomes: [
              'Open-source stack, auditable end-to-end.',
              'Knowledge transfer baked into the mission.',
              'Exit plan and licenses kept on your side.',
            ],
            action: { text: 'Contact us', href: commonHrefs.contact },
            icon: 'tabler:shield-lock',
          },
        ],
      },
      platformModel: {
        header: {
          tagline: 'Operating model',
          title: 'A method, connectors, and experts to move from intent to execution',
          subtitle: 'Hoverkraft connects strategy, tooling, and enablement into one practical delivery system.',
        },
        pillars: [
          {
            id: 'method',
            title: 'HoverKraft Method',
            description: 'Diagnosis, roadmap, standards, rituals, and metrics tied to execution.',
            action: { text: 'Read the method', href: commonHrefs.methodology },
            icon: 'tabler:manual-gearbox',
          },
          {
            id: 'openkraft',
            title: 'OpenKraft',
            description:
              'Open-source connectors and templates that integrate existing tools instead of replacing them.',
            action: { text: 'Explore connectors', href: commonHrefs.openKraft },
            icon: 'tabler:puzzle',
          },
          {
            id: 'builders',
            title: 'Kraft Builders',
            description: 'Senior Platform Engineers who audit, build, train, and transfer ownership.',
            action: { text: 'Book an audit', href: commonHrefs.contact },
            icon: 'tabler:users-group',
          },
        ],
      },
      comparison: {
        header: {
          tagline: 'Differentiation',
          title: 'Your tools are not the problem. Fragmentation is.',
          subtitle: 'The refactor replaces a list of capabilities with a clear before-and-after story.',
        },
        columns: [
          {
            title: 'Standard approach',
            tone: 'negative',
            items: [
              'Local scripts and per-team exceptions.',
              'Pipelines that are hard to compare.',
              'Secrets, rights, and environments handled inconsistently.',
              'Decisions driven by incidents and urgency.',
              'Documentation after the fact.',
            ],
          },
          {
            title: 'With Hoverkraft',
            tone: 'positive',
            items: [
              'Reusable connectors across Git, CI/CD, cloud, and observability.',
              'Visible, adaptable standards.',
              'Shared DORA, SPACE, and Lean measurements.',
              'Governance and reversibility baked in.',
              'Knowledge transfer during the build.',
            ],
          },
        ],
      },
      operatingModel: {
        header: {
          tagline: 'Engagement model',
          title: 'From audit to autonomy, a clear path',
          subtitle: 'Each step creates a useful deliverable, not a slide deck that stops at diagnosis.',
        },
        steps: [
          {
            index: 1,
            title: 'Diagnose',
            deliverables: ['DORA/SPACE baseline', 'Toolchain map', 'Pain points'],
            icon: 'tabler:search',
          },
          {
            index: 2,
            title: 'Prioritize',
            deliverables: ['Six-month roadmap', 'Quick wins', 'Risk/impact matrix'],
            icon: 'tabler:timeline',
          },
          { index: 3, title: 'Build', deliverables: ['Connectors', 'Templates', 'Dashboards'], icon: 'tabler:tools' },
          {
            index: 4,
            title: 'Transfer',
            deliverables: ['Coaching', 'Documentation', 'Ownership handover'],
            icon: 'tabler:school',
          },
          {
            index: 5,
            title: 'Improve',
            deliverables: ['Continuous measurement', 'Backlog', 'Maturity increments'],
            icon: 'tabler:trending-up',
          },
        ],
        primaryAction: { variant: 'primary', text: 'View offers', href: commonHrefs.offers },
        secondaryAction: { variant: 'secondary', text: 'Book an audit', href: commonHrefs.contact },
      },
      credibility: {
        header: {
          tagline: 'Credibility',
          title: 'This is not a side project. It is your delivery system.',
          subtitle: 'The trust layer stays grounded in practices Hoverkraft can support publicly.',
        },
        cards: [
          {
            title: 'Platform Engineering practice',
            description: 'A dedicated practice, not an agency side project.',
            icon: 'tabler:stack-3',
          },
          {
            title: 'Open-source culture',
            description: 'Code, templates, and learnings shared with the community.',
            icon: 'tabler:brand-open-source',
          },
          {
            title: 'Security & CI/CD',
            description: 'Pipelines, secrets, observability, and IAM treated as products.',
            icon: 'tabler:lock-cog',
          },
          {
            title: 'DORA/SPACE measurement',
            description: 'Decisions guided by shared metrics, not opinions.',
            icon: 'tabler:chart-histogram',
          },
          {
            title: 'Training & transfer',
            description: 'A successful engagement is one where you take ownership.',
            icon: 'tabler:certificate',
          },
          {
            title: 'Reversibility',
            description: 'Code, documentation, and licenses remain yours.',
            icon: 'tabler:rotate-clockwise-2',
          },
        ],
      },
      resources: {
        header: {
          tagline: 'Evidence',
          title: 'Resources for technical and strategic validation',
          subtitle: 'Give skeptical visitors useful material before they contact sales.',
        },
        items: [
          {
            type: 'Method',
            title: 'HoverKraft methodology',
            description: 'How we diagnose, prioritize, build, transfer, and improve platform capabilities.',
            href: commonHrefs.methodology,
            actionText: 'Read the method',
          },
          {
            type: 'Open source',
            title: 'OpenKraft ecosystem',
            description: 'Connectors, templates, and public repositories that make the approach concrete.',
            href: commonHrefs.openKraft,
            actionText: 'Explore OpenKraft',
          },
          {
            type: 'Training',
            title: 'Platform Engineering trainings',
            description: 'Programs designed by practitioners to help teams operate the platform themselves.',
            href: commonHrefs.trainings,
            actionText: 'View trainings',
          },
          {
            type: 'Insights',
            title: 'Latest articles',
            description: 'Technical notes and market analysis on Platform Engineering and cloud-native delivery.',
            href: commonHrefs.blog,
            actionText: 'Read the blog',
          },
        ],
      },
      activation: {
        header: {
          tagline: 'Start here',
          title: 'Start with an objective read of your platform',
          subtitle: 'Choose a human audit or a self-guided maturity assessment depending on your timing.',
        },
        audit: {
          title: 'Hoverkraft audit',
          description: 'Two days to map, measure, and prioritize.',
          bullets: [
            'Interviews and DORA/SPACE metrics.',
            'Delivery chain mapping.',
            'Six-month prioritized action plan.',
          ],
          action: { variant: 'primary', text: 'Book an audit', href: commonHrefs.contact },
        },
        assessment: {
          title: 'Maturity assessment',
          description: 'A guided self-assessment to gauge your maturity in minutes.',
          bullets: ['6 Platform Engineering axes.', 'Readable, shareable result.', 'Context-aware recommendations.'],
          action: { variant: 'secondary', text: 'Take the assessment', href: commonHrefs.maturityAssessment },
        },
      },
      integrations: {
        header: {
          tagline: 'Ecosystem',
          title: 'Connect the tools your teams already use',
          subtitle: 'Use text labels unless logo usage rights are explicit.',
        },
        items: [
          { label: 'GitHub', icon: 'tabler:brand-github', href: externalLinks.github },
          { label: 'GitLab', icon: 'tabler:brand-gitlab', href: externalLinks.gitlab },
          { label: 'Kubernetes', icon: 'tabler:hexagons' },
          { label: 'Docker', icon: 'tabler:brand-docker' },
          { label: 'Backstage', icon: 'tabler:layout-dashboard' },
          { label: 'Dagger', icon: 'tabler:triangle-square-circle' },
          { label: 'OpenTofu', icon: 'tabler:cloud-cog' },
          { label: 'Argo CD', icon: 'tabler:git-pull-request' },
          { label: 'Prometheus', icon: 'tabler:activity' },
          { label: 'Grafana', icon: 'tabler:chart-donut' },
          { label: 'AWS', icon: 'tabler:brand-aws' },
          { label: 'Azure', icon: 'tabler:brand-azure' },
          { label: 'OVHcloud', icon: 'tabler:cloud' },
          { label: 'Scaleway', icon: 'tabler:server' },
          { label: 'OpenShift', icon: 'tabler:hexagon' },
          { label: 'Proxmox', icon: 'tabler:database' },
        ],
      },
      finalCta: {
        title: 'Build a delivery chain your teams can truly operate',
        subtitle:
          'Share your friction points. We help you make the situation measurable and define a practical Platform Engineering path.',
        primaryAction: { variant: 'primary', text: 'Book an audit', href: commonHrefs.contact },
        secondaryAction: { variant: 'secondary', text: 'View offers', href: commonHrefs.offers },
      },
    };
  }

  return {
    metadata: {
      title: 'Hoverkraft - Platform Engineering souverain et réversible',
      description:
        'Industrialisez votre Platform Engineering avec la méthode HoverKraft, des connecteurs open source et un accompagnement senior pour accélérer le delivery sans lock-in.',
    },
    announcement: {
      text: 'Nouveau : faites le radar de maturité Platform Engineering en 5 minutes',
      href: commonHrefs.maturityAssessment,
    },
    hero: {
      tagline: 'Platform Engineering souverain',
      title: 'Industrialisez votre Platform Engineering sans perdre votre souveraineté',
      subtitle:
        'Hoverkraft combine méthode, connecteurs open source et accompagnement senior pour transformer vos outils existants en chaîne de delivery mesurable, réversible et orientée développeurs.',
      primaryAction: { variant: 'primary', text: 'Planifier un audit', href: commonHrefs.contact },
      secondaryAction: { variant: 'secondary', text: 'Faire le radar', href: commonHrefs.maturityAssessment },
      proof: [
        { text: 'Connecteurs open source pour Git, CI/CD, observabilité et cloud.', icon: 'tabler:git-branch' },
        { text: 'Pilotage DORA, SPACE et Lean dès les premières semaines.', icon: 'tabler:chart-dots' },
        { text: 'Documentation, transfert et réversibilité intégrés à la mission.', icon: 'tabler:shield-check' },
      ],
      visual: {
        title: 'Carte de chaîne de delivery',
        subtitle: 'Méthode, connecteurs et métriques alignés autour du flow développeur.',
        nodes: ['Source', 'CI/CD', 'Runtime', 'Observabilité', 'Roadmap'],
        metrics: ['DORA', 'SPACE', 'Lean'],
      },
    },
    proofStrip: [
      {
        label: 'Open source first',
        description:
          'Connecteurs et templates réutilisables restent inspectables, portables et opérés par vos équipes.',
      },
      {
        label: 'Praticiens seniors',
        description: 'Des Platform Engineers auditent, construisent, coachent et transfèrent la responsabilité.',
      },
      {
        label: 'Delivery mesuré',
        description: 'Les métriques DORA, SPACE et Lean guident les priorités dès les premières sessions.',
      },
      {
        label: 'Sans lock-in',
        description: 'Documentation, choix réversibles et posture open source font partie du modèle opératoire.',
      },
    ],
    useCases: {
      header: {
        tagline: 'Choisir son chemin',
        title: 'Un même défi de plateforme, quatre points de vue différents',
        subtitle:
          'Choisissez votre rôle pour voir les irritants les plus fréquents et la prochaine étape qui change vraiment la donne.',
      },
      items: [
        {
          id: 'cto',
          title: 'CTO & DSI',
          role: 'Stratégie & risque',
          problem:
            'Vos équipes livrent, mais chaque mise en production repose encore sur des scripts maison et des arbitrages difficiles à défendre en COMEX.',
          response:
            'Nous traduisons la plateforme en trajectoire mesurable : décisions visibles, surprises réduites et feuille de route que votre direction peut challenger.',
          outcomes: [
            'Baseline DORA & SPACE en quelques semaines.',
            'Plan d’investissement lié aux résultats métier.',
            'Risque et réversibilité rendus explicites.',
          ],
          action: { text: 'Voir les offres', href: commonHrefs.offers },
          icon: 'tabler:briefcase',
        },
        {
          id: 'platform',
          title: 'Équipes Platform & DevOps',
          role: 'Construire & opérer',
          problem:
            'Vous maintenez la glue interne, enchaînez les backlogs et n’avez jamais le temps d’industrialiser ce qui fonctionne déjà.',
          response:
            'OpenKraft vous fournit des connecteurs réutilisables, des templates paved-road et des standards que votre équipe pilote sans verrou propriétaire.',
          outcomes: [
            'Connecteurs réutilisables Git, CI/CD, cloud.',
            'Templates paved-road avec defaults sains.',
            'Golden paths versionnés comme du produit.',
          ],
          action: { text: 'Explorer OpenKraft', href: commonHrefs.openKraft },
          icon: 'tabler:terminal-2',
        },
        {
          id: 'product',
          title: 'Équipes produit & dev',
          role: 'Flow développeur',
          problem:
            'Les développeurs perdent du temps sur les environnements, pipelines, secrets et incidents au lieu de livrer de la valeur produit.',
          response:
            'La méthode HoverKraft réduit la friction du laptop à la production avec des rituels et un outillage qui respectent le temps des devs.',
          outcomes: [
            'Onboarding en heures plutôt qu’en semaines.',
            'Environnements self-service et builds reproductibles.',
            'Chemins d’astreinte et rituels d’incident clairs.',
          ],
          action: { text: 'Découvrir la méthode', href: commonHrefs.methodology },
          icon: 'tabler:layout-kanban',
        },
        {
          id: 'sovereign',
          title: 'Organisations souveraines',
          role: 'Maîtrise & réversibilité',
          problem:
            'Vous voulez gagner en efficacité sans confier les clés de votre plateforme - ni de vos données - à un éditeur unique.',
          response:
            'Documentation, transfert de compétences et réversibilité sont intégrés à chaque mission : vous restez aux commandes.',
          outcomes: [
            'Stack open source auditable de bout en bout.',
            'Transfert de compétences intégré à la mission.',
            'Plan de sortie et licences gardés chez vous.',
          ],
          action: { text: 'Nous contacter', href: commonHrefs.contact },
          icon: 'tabler:shield-lock',
        },
      ],
    },
    platformModel: {
      header: {
        tagline: 'Modèle opératoire',
        title: 'Une méthode, des connecteurs, des experts pour passer de l’intention à l’exécution',
        subtitle: 'Hoverkraft connecte stratégie, outillage et enablement dans un système de delivery concret.',
      },
      pillars: [
        {
          id: 'method',
          title: 'Méthode HoverKraft',
          description: 'Diagnostic, feuille de route, standards, rituels et métriques connectés à l’exécution.',
          action: { text: 'Lire la méthode', href: commonHrefs.methodology },
          icon: 'tabler:manual-gearbox',
        },
        {
          id: 'openkraft',
          title: 'OpenKraft',
          description: 'Connecteurs et templates open source qui intègrent vos outils sans les remplacer.',
          action: { text: 'Explorer les connecteurs', href: commonHrefs.openKraft },
          icon: 'tabler:puzzle',
        },
        {
          id: 'builders',
          title: 'Kraft Builders',
          description: 'Platform Engineers seniors qui auditent, construisent, forment et transfèrent.',
          action: { text: 'Planifier un audit', href: commonHrefs.contact },
          icon: 'tabler:users-group',
        },
      ],
    },
    comparison: {
      header: {
        tagline: 'Différenciation',
        title: 'Vos outils ne sont pas le problème. Leur fragmentation l’est.',
        subtitle: 'Le refactor remplace une liste de capacités par une histoire avant/après lisible.',
      },
      columns: [
        {
          title: 'Approche standard',
          tone: 'negative',
          items: [
            'Scripts locaux et exceptions par équipe.',
            'Pipelines difficiles à comparer.',
            'Secrets, droits et environnements gérés différemment.',
            'Décisions basées sur incidents ou urgence.',
            'Documentation après coup.',
          ],
        },
        {
          title: 'Avec Hoverkraft',
          tone: 'positive',
          items: [
            'Connecteurs réutilisables entre Git, CI/CD, cloud et observabilité.',
            'Standards visibles et adaptables.',
            'Mesures DORA, SPACE et Lean partagées.',
            'Gouvernance et réversibilité intégrées.',
            'Transfert de compétence pendant la construction.',
          ],
        },
      ],
    },
    operatingModel: {
      header: {
        tagline: 'Modèle d’engagement',
        title: 'De l’audit à l’autonomie, un parcours clair',
        subtitle: 'Chaque étape produit un livrable utile, pas un support qui s’arrête au diagnostic.',
      },
      steps: [
        {
          index: 1,
          title: 'Diagnostiquer',
          deliverables: ['Baseline DORA/SPACE', 'Cartographie outils', 'Irritants'],
          icon: 'tabler:search',
        },
        {
          index: 2,
          title: 'Prioriser',
          deliverables: ['Feuille de route 6 mois', 'Quick wins', 'Matrice risque/impact'],
          icon: 'tabler:timeline',
        },
        {
          index: 3,
          title: 'Construire',
          deliverables: ['Connecteurs', 'Templates', 'Dashboards'],
          icon: 'tabler:tools',
        },
        {
          index: 4,
          title: 'Transférer',
          deliverables: ['Coaching', 'Documentation', 'Passage de relais'],
          icon: 'tabler:school',
        },
        {
          index: 5,
          title: 'Améliorer',
          deliverables: ['Mesure continue', 'Backlog', 'Paliers de maturité'],
          icon: 'tabler:trending-up',
        },
      ],
      primaryAction: { variant: 'primary', text: 'Voir les offres', href: commonHrefs.offers },
      secondaryAction: { variant: 'secondary', text: 'Planifier un audit', href: commonHrefs.contact },
    },
    credibility: {
      header: {
        tagline: 'Crédibilité',
        title: 'Ce n’est pas un chantier annexe. C’est votre système de delivery.',
        subtitle: 'La couche de confiance reste ancrée dans des pratiques que Hoverkraft peut soutenir publiquement.',
      },
      cards: [
        {
          title: 'Pratique Platform Engineering',
          description: 'Une practice dédiée, pas un side project d’agence.',
          icon: 'tabler:stack-3',
        },
        {
          title: 'Culture open source',
          description: 'Code, templates et retours partagés avec la communauté.',
          icon: 'tabler:brand-open-source',
        },
        {
          title: 'Sécurité et CI/CD',
          description: 'Pipelines, secrets, observabilité et IAM traités comme des produits.',
          icon: 'tabler:lock-cog',
        },
        {
          title: 'Mesure DORA/SPACE',
          description: 'Décisions guidées par des métriques partagées, pas des opinions.',
          icon: 'tabler:chart-histogram',
        },
        {
          title: 'Formation et transfert',
          description: 'Une mission réussie est une mission où vous reprenez la main.',
          icon: 'tabler:certificate',
        },
        {
          title: 'Réversibilité',
          description: 'Code, documentation et licences restent les vôtres.',
          icon: 'tabler:rotate-clockwise-2',
        },
      ],
    },
    resources: {
      header: {
        tagline: 'Preuves',
        title: 'Ressources pour valider côté stratégie et côté technique',
        subtitle: 'Donner aux visiteurs sceptiques de la matière utile avant le contact commercial.',
      },
      items: [
        {
          type: 'Méthode',
          title: 'Méthodologie HoverKraft',
          description: 'Comment diagnostiquer, prioriser, construire, transférer et améliorer la plateforme.',
          href: commonHrefs.methodology,
          actionText: 'Lire la méthode',
        },
        {
          type: 'Open source',
          title: 'Écosystème OpenKraft',
          description: 'Connecteurs, templates et dépôts publics pour rendre l’approche concrète.',
          href: commonHrefs.openKraft,
          actionText: 'Explorer OpenKraft',
        },
        {
          type: 'Formation',
          title: 'Formations Platform Engineering',
          description: 'Des programmes conçus par des praticiens pour aider les équipes à opérer elles-mêmes.',
          href: commonHrefs.trainings,
          actionText: 'Voir les formations',
        },
        {
          type: 'Articles',
          title: 'Dernières analyses',
          description:
            'Notes techniques et analyses de marché sur le Platform Engineering et le delivery cloud-native.',
          href: commonHrefs.blog,
          actionText: 'Lire le blog',
        },
      ],
    },
    activation: {
      header: {
        tagline: 'Démarrer',
        title: 'Démarrez par une lecture objective de votre plateforme',
        subtitle: 'Choisissez un audit humain ou une auto-évaluation selon votre calendrier.',
      },
      audit: {
        title: 'Audit Hoverkraft',
        description: '2 jours pour cartographier, mesurer et prioriser.',
        bullets: [
          'Interviews et métriques DORA/SPACE.',
          'Cartographie de la chaîne de delivery.',
          'Plan d’action priorisé sur 6 mois.',
        ],
        action: { variant: 'primary', text: 'Planifier un audit', href: commonHrefs.contact },
      },
      assessment: {
        title: 'Radar de maturité',
        description: 'Une auto-évaluation guidée pour situer votre maturité en quelques minutes.',
        bullets: [
          '6 axes Platform Engineering.',
          'Résultat lisible et partageable.',
          'Recommandations adaptées à votre contexte.',
        ],
        action: { variant: 'secondary', text: 'Faire le radar', href: commonHrefs.maturityAssessment },
      },
    },
    integrations: {
      header: {
        tagline: 'Écosystème',
        title: 'Connecter les outils que vos équipes utilisent déjà',
        subtitle: 'Utiliser des libellés texte tant que les droits d’usage logo ne sont pas explicites.',
      },
      items: [
        { label: 'GitHub', icon: 'tabler:brand-github', href: externalLinks.github },
        { label: 'GitLab', icon: 'tabler:brand-gitlab', href: externalLinks.gitlab },
        { label: 'Kubernetes', icon: 'tabler:hexagons' },
        { label: 'Docker', icon: 'tabler:brand-docker' },
        { label: 'Backstage', icon: 'tabler:layout-dashboard' },
        { label: 'Dagger', icon: 'tabler:triangle-square-circle' },
        { label: 'OpenTofu', icon: 'tabler:cloud-cog' },
        { label: 'Argo CD', icon: 'tabler:git-pull-request' },
        { label: 'Prometheus', icon: 'tabler:activity' },
        { label: 'Grafana', icon: 'tabler:chart-donut' },
        { label: 'AWS', icon: 'tabler:brand-aws' },
        { label: 'Azure', icon: 'tabler:brand-azure' },
        { label: 'OVHcloud', icon: 'tabler:cloud' },
        { label: 'Scaleway', icon: 'tabler:server' },
        { label: 'OpenShift', icon: 'tabler:hexagon' },
        { label: 'Proxmox', icon: 'tabler:database' },
      ],
    },
    finalCta: {
      title: 'Construisons une chaîne de delivery que vos équipes peuvent vraiment opérer',
      subtitle:
        'Partagez vos irritants. Nous vous aidons à objectiver la situation et à définir une trajectoire Platform Engineering mesurable.',
      primaryAction: { variant: 'primary', text: 'Planifier un audit', href: commonHrefs.contact },
      secondaryAction: { variant: 'secondary', text: 'Voir les offres', href: commonHrefs.offers },
    },
  };
}
