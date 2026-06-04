import { useTranslatedPath } from '~/i18n/utils';
import type { SupportedLanguage } from '~/i18n/ui';
import type { HomePageContent } from '~/components/home/types';

export function getHomepageContent(lang: SupportedLanguage): HomePageContent {
  const path = useTranslatedPath(lang);

  const commonHrefs = {
    home: path('/'),
    contact: `${path('/contact')}#booking`,
    methodology: path('/methodology'),
    offers: path('/offers'),
    openKraft: path('/open-kraft'),
    maturityAssessment: path('/maturity-assessment'),
  };

  if (lang === 'en') {
    return {
      metadata: {
        title: 'Hoverkraft - Sovereign and reversible Platform Engineering',
        description:
          'Industrialize Platform Engineering with the HoverKraft method, open-source connectors, and senior guidance to accelerate delivery without vendor lock-in.',
      },
      announcement: {
        text: 'New: assess your Platform Engineering maturity in 5 minutes',
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
      useCases: {
        header: {
          tagline: 'Choose your path',
          title: 'Where is delivery complexity creating the most friction today?',
          subtitle:
            'Choose your role to see the friction patterns we hear most often, their impact on your teams, and the next move worth making.',
        },
        items: [
          {
            id: 'cto',
            title: 'CTOs & CIOs',
            role: 'Strategy & risk',
            problem:
              'Your teams ship, yet every release still depends on fragile scripts and manual decisions that are hard to defend in governance reviews.',
            response:
              'We turn platform work into a measurable trajectory: visible decisions, fewer surprises, and a roadmap leadership can challenge and support.',
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
              'OpenKraft gives you reusable connectors, paved-road templates, and standards your team owns end to end, without being trapped in a proprietary stack.',
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
              'The HoverKraft method removes friction from laptop to production with operating rituals and tooling designed to protect developer focus.',
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
              "Documentation, knowledge transfer, and reversibility are part of every engagement, so you stay in the driver's seat.",
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
          tagline: 'Solution',
          title: 'A practical system built on method, open components, and senior operators',
          subtitle:
            'Hoverkraft connects governance, tooling, and enablement into one delivery system your teams can operate with confidence.',
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
          subtitle: 'A clearer before-and-after narrative than a long list of disconnected capabilities.',
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
          subtitle: 'Each step produces an actionable deliverable, not a diagnostic that stops at slides.',
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
          tagline: 'Principles',
          title: 'Four principles that keep Platform Engineering practical, measurable, and reversible',
          subtitle: 'An approach that is easy to evaluate: open, senior-led, measurable, and free from vendor lock-in.',
        },
        cards: [
          {
            title: 'Open-source first',
            description: 'Connectors and templates remain inspectable, portable, and improvable by your teams.',
            icon: 'tabler:brand-open-source',
          },
          {
            title: 'Senior practitioners',
            description: 'The same senior engineers audit, build, coach, and transfer ownership with your teams.',
            icon: 'tabler:users-group',
          },
          {
            title: 'Measured delivery',
            description: 'DORA, SPACE, and Lean indicators help prioritize work from the first weeks.',
            icon: 'tabler:chart-histogram',
          },
          {
            title: 'No lock-in',
            description: 'Documentation, knowledge transfer, and reversible choices are part of the operating model.',
            icon: 'tabler:rotate-clockwise-2',
          },
        ],
      },
      faq: {
        header: {
          tagline: 'FAQ',
          title: 'Questions teams ask before they evolve their delivery model',
          subtitle: 'Short, concrete answers that help move the next decision forward.',
        },
        items: [
          {
            question: 'Do we need to replace our current tools to work with Hoverkraft?',
            answer:
              'No. Hoverkraft starts from your current Git, CI/CD, cloud, and observability stack. The goal is to reduce fragmentation, not force a full tool migration.',
          },
          {
            question: 'When should we start with an audit instead of the assessment?',
            answer:
              'Start with the assessment when you need a quick self-serve baseline. Start with the audit when you need an external diagnosis, a prioritized roadmap, and decisions your stakeholders can review together.',
          },
          {
            question: 'What stays with our teams at the end of the engagement?',
            answer:
              'The operating model, documentation, connectors, templates, dashboards, and transfer of ownership stay with you. Reversibility is part of the engagement, not an optional add-on.',
          },
          {
            question: 'How quickly can we see a measurable impact?',
            answer:
              'Most teams establish an initial baseline, a shared problem map, and prioritized quick wins within the first few weeks. The objective is to make progress visible early, then compound it over time.',
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
      finalCta: {
        title: 'Start with the next decision, not a transformation program',
        subtitle:
          'Book an audit or take the assessment to identify the next action that will concretely reduce delivery complexity.',
        primaryAction: { variant: 'primary', text: 'Book an audit', href: commonHrefs.contact },
        secondaryAction: { variant: 'secondary', text: 'Take the assessment', href: commonHrefs.maturityAssessment },
      },
    };
  }

  return {
    metadata: {
      title: 'Hoverkraft - Platform Engineering souverain et réversible',
      description:
        'Industrialisez votre Platform Engineering avec la méthode HoverKraft, des connecteurs open source et un accompagnement senior pour accélérer votre delivery sans verrou propriétaire.',
    },
    announcement: {
      text: 'Nouveau : évaluez votre maturité Platform Engineering en 5 minutes',
      href: commonHrefs.maturityAssessment,
    },
    hero: {
      tagline: 'Platform Engineering souverain',
      title: 'Industrialisez votre Platform Engineering sans renoncer à votre souveraineté',
      subtitle:
        'Hoverkraft combine méthode, connecteurs open source et accompagnement senior pour structurer vos outils existants en une chaîne de delivery mesurable, réversible et pensée pour les équipes produit et plateforme.',
      primaryAction: { variant: 'primary', text: 'Planifier un audit', href: commonHrefs.contact },
      secondaryAction: { variant: 'secondary', text: 'Faire le radar', href: commonHrefs.maturityAssessment },
      proof: [
        { text: 'Connecteurs open source pour Git, CI/CD, observabilité et cloud.', icon: 'tabler:git-branch' },
        { text: 'Pilotage DORA, SPACE et Lean dès les premières semaines.', icon: 'tabler:chart-dots' },
        { text: 'Documentation, transfert et réversibilité intégrés à la mission.', icon: 'tabler:shield-check' },
      ],
      visual: {
        title: 'Carte de chaîne de delivery',
        subtitle: 'Méthode, connecteurs et indicateurs alignés au service du flux de delivery.',
        nodes: ['Source', 'CI/CD', 'Runtime', 'Observabilité', 'Roadmap'],
        metrics: ['DORA', 'SPACE', 'Lean'],
      },
    },
    useCases: {
      header: {
        tagline: 'Choisir son chemin',
        title: 'Où la complexité de votre delivery freine-t-elle le plus vos équipes ?',
        subtitle:
          'Choisissez votre rôle pour identifier les irritants majeurs, leurs impacts opérationnels et la prochaine décision utile.',
      },
      items: [
        {
          id: 'cto',
          title: 'CTO & DSI',
          role: 'Stratégie & risque',
          problem:
            'Vos équipes livrent, mais chaque mise en production repose encore sur des scripts maison et des arbitrages difficiles à défendre en COMEX.',
          response:
            'Nous transformons le sujet plateforme en trajectoire pilotable : décisions explicites, arbitrages objectivés et feuille de route défendable en direction.',
          outcomes: [
            'Point de départ DORA & SPACE établi en quelques semaines.',
            'Plan d’investissement lié aux résultats métier.',
            'Risque et réversibilité rendus explicites.',
          ],
          action: { text: 'Voir les offres', href: commonHrefs.offers },
          icon: 'tabler:briefcase',
        },
        {
          id: 'platform',
          title: 'Équipes plateforme & DevOps',
          role: 'Construire & opérer',
          problem:
            'Vous maintenez les couches d’intégration internes, enchaînez les backlogs et ne trouvez jamais le temps d’industrialiser ce qui fonctionne déjà.',
          response:
            'OpenKraft vous apporte des connecteurs réutilisables, des modèles prêts à l’emploi et des standards que votre équipe maîtrise de bout en bout, sans dépendance propriétaire.',
          outcomes: [
            'Connecteurs réutilisables pour Git, CI/CD et cloud.',
            'Modèles prêts à l’emploi avec des paramètres fiables.',
            'Parcours de référence versionnés comme des produits.',
          ],
          action: { text: 'Explorer OpenKraft', href: commonHrefs.openKraft },
          icon: 'tabler:terminal-2',
        },
        {
          id: 'product',
          title: 'Équipes produit & dev',
          role: 'Expérience développeur',
          problem:
            'Les développeurs perdent du temps sur les environnements, pipelines, secrets et incidents au lieu de livrer de la valeur produit.',
          response:
            'La méthode HoverKraft fluidifie le passage du poste de travail à la production grâce à des rituels et à un outillage conçus pour préserver le temps des développeurs.',
          outcomes: [
            'Onboarding en quelques heures plutôt qu’en plusieurs semaines.',
            'Environnements self-service et builds reproductibles.',
            'Astreinte et gestion des incidents plus lisibles.',
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
            'Documentation, transfert de compétences et réversibilité sont intégrés à chaque mission : vous gardez la maîtrise de votre trajectoire.',
          outcomes: [
            'Socle open source auditable de bout en bout.',
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
        tagline: 'Solution',
        title: "Une méthode, des composants ouverts et des experts terrain pour passer de la décision à l'exécution",
        subtitle:
          'Hoverkraft articule gouvernance, outillage et montée en compétence dans un système de delivery réellement opérable.',
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
          description: 'Des Platform Engineers seniors qui auditent, construisent, forment et transmettent.',
          action: { text: 'Planifier un audit', href: commonHrefs.contact },
          icon: 'tabler:users-group',
        },
      ],
    },
    comparison: {
      header: {
        tagline: 'Différenciation',
        title: 'Vos outils ne sont pas le problème. Leur fragmentation l’est.',
        subtitle: 'Une lecture avant/après plus lisible qu’une simple accumulation de capacités.',
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
        subtitle: 'Chaque étape produit un livrable exploitable, pas un diagnostic sans suite.',
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
        tagline: 'Principes',
        title: 'Quatre principes pour un Platform Engineering utile, mesurable et réversible',
        subtitle:
          'Une approche simple à évaluer : ouverte, opérée par des seniors, pilotée par la mesure et sans verrou propriétaire.',
      },
      cards: [
        {
          title: "Open source d'abord",
          description: 'Connecteurs et templates restent inspectables, portables et améliorables par vos équipes.',
          icon: 'tabler:brand-open-source',
        },
        {
          title: 'Praticiens seniors',
          description:
            'Les mêmes ingénieurs seniors auditent, construisent, coachent et transfèrent la responsabilité.',
          icon: 'tabler:users-group',
        },
        {
          title: 'Pilotage par la mesure',
          description: 'Les indicateurs DORA, SPACE et Lean servent à prioriser dès les premières semaines.',
          icon: 'tabler:chart-histogram',
        },
        {
          title: 'Sans verrou propriétaire',
          description: 'Documentation, transfert de compétences et choix réversibles font partie du modèle opératoire.',
          icon: 'tabler:rotate-clockwise-2',
        },
      ],
    },
    faq: {
      header: {
        tagline: 'FAQ',
        title: 'Les questions qui reviennent avant de faire évoluer votre modèle de delivery',
        subtitle: 'Des réponses courtes, concrètes et directement utiles à la décision.',
      },
      items: [
        {
          question: 'Faut-il remplacer nos outils actuels pour travailler avec Hoverkraft ?',
          answer:
            "Non. Hoverkraft part de votre stack Git, CI/CD, cloud et observabilité existante. L'objectif est de réduire la fragmentation, pas de forcer une migration complète.",
        },
        {
          question: 'Quand faut-il commencer par un audit plutôt que par le radar ?',
          answer:
            "Le radar convient pour obtenir rapidement un premier état des lieux en autonomie. L'audit convient lorsque vous avez besoin d'un diagnostic externe, d'une feuille de route priorisée et de décisions partageables avec vos parties prenantes.",
        },
        {
          question: "Qu'est-ce qui reste chez nous à la fin de la mission ?",
          answer:
            "Le modèle opératoire, la documentation, les connecteurs, les templates, les dashboards et le transfert de responsabilité restent chez vous. La réversibilité fait partie de la mission, pas d'une option.",
        },
        {
          question: 'À quelle vitesse peut-on constater un impact mesurable ?',
          answer:
            "La plupart des équipes obtiennent un état des lieux initial, une cartographie partagée des problèmes et des actions prioritaires dans les premières semaines. L'objectif est de rendre le progrès visible rapidement, puis de l'amplifier dans la durée.",
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
    finalCta: {
      title: 'Commencez par la prochaine décision, pas par un programme de transformation',
      subtitle:
        "Planifiez un audit ou faites le radar pour identifier l'action suivante qui réduira concrètement la complexité de votre delivery.",
      primaryAction: { variant: 'primary', text: 'Planifier un audit', href: commonHrefs.contact },
      secondaryAction: { variant: 'secondary', text: 'Faire le radar', href: commonHrefs.maturityAssessment },
    },
  };
}
