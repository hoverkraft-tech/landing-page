export type MaturityAssessmentQuestion = {
  id: string;
  shareId: number;
  text: string;
  levels: Record<1 | 2 | 3 | 4 | 5, string>;
};

export type MaturityAssessmentAxis = {
  id: string;
  label: string;
  weight: number;
  questions: MaturityAssessmentQuestion[];
};

export type MaturityAssessmentLanguage = 'fr' | 'en';

export function getMaturityAssessmentAxes(lang: MaturityAssessmentLanguage): MaturityAssessmentAxis[] {
  if (lang === 'en') {
    return [
      {
        id: 'devx',
        label: 'DevX (SPACE)',
        weight: 1,
        questions: [
          {
            id: 'q1',
            text: 'Time to provision a development environment',
            levels: {
              1: 'More than 5 days. Fully manual process requiring multiple tickets.',
              2: 'A few days. Partly manual process; some scripts exist.',
              3: 'Less than 1 day. Scripted process, but manually triggered.',
              4: 'Less than 1 hour. Automated via pipeline, but requires approval.',
              5: 'Less than 10 minutes. Fully automated and self-service (e.g., DevContainers, ephemeral env).',
            },
            shareId: 1,
          },
          {
            id: 'q2',
            text: 'Developer autonomy (self-service)',
            levels: {
              1: 'No autonomy. Ops tickets required for any infrastructure action.',
              2: 'Low autonomy. Documentation exists, but Ops executes the changes.',
              3: 'Partial autonomy. Scripts provided for common day-to-day tasks.',
              4: 'High autonomy. Basic portal or CLI covers most needs.',
              5: 'Full autonomy. An Internal Developer Platform (e.g., Backstage) covers the full lifecycle.',
            },
            shareId: 2,
          },
        ],
      },
      {
        id: 'env',
        label: 'Environments',
        weight: 1,
        questions: [
          {
            id: 'q3',
            text: 'Environment reproducibility (IaC)',
            levels: {
              1: 'Manual “ClickOps”, undocumented and not reproducible.',
              2: 'Runbooks exist but are followed manually.',
              3: 'Imperative scripts or partial IaC (Terraform) without modularity.',
              4: 'Complete modular IaC (Terraform/Ansible), versioned in Git.',
              5: 'On-demand ephemeral environments, production-like, destroyed after use.',
            },
            shareId: 3,
          },
        ],
      },
      {
        id: 'cicd',
        label: 'CI/CD (DORA)',
        weight: 1,
        questions: [
          {
            id: 'q4',
            text: 'Production deployment frequency',
            levels: {
              1: 'Monthly or less (release train, big batches).',
              2: 'Bi-weekly or weekly.',
              3: 'Daily. Deployment is manually triggered after validation.',
              4: 'Multiple times a day. Automated deployment with a light manual gate.',
              5: 'On-demand / continuous. Every green commit reaches production (continuous deployment).',
            },
            shareId: 4,
          },
          {
            id: 'q5',
            text: 'Time to restore service (rollback)',
            levels: {
              1: 'More than 1 day. Requires complex analysis and manual fixes.',
              2: 'A few hours. Rollback is documented but manual.',
              3: 'Less than 30 minutes. Scripted rollback or re-run a previous pipeline.',
              4: 'Less than 10 minutes. One-click rollback via deployment tooling.',
              5: 'Instant / automatic. Auto-rollback on error detection (canary / blue-green).',
            },
            shareId: 5,
          },
        ],
      },
      {
        id: 'kube',
        label: 'Containerization',
        weight: 1,
        questions: [
          {
            id: 'q6',
            text: 'Kubernetes maturity and workload management',
            levels: {
              1: 'Legacy non-containerized (VMs, bare metal). Artisanal deployments.',
              2: 'Basic Dockerization. Deploy via Docker Compose or scripts on VMs.',
              3: 'Basic managed Kubernetes. YAML applied manually (kubectl apply).',
              4: 'Structured Kubernetes. Helm/Kustomize; CI pushes images.',
              5: 'Advanced cloud native. Kubernetes + service mesh + full GitOps (ArgoCD/Flux).',
            },
            shareId: 6,
          },
        ],
      },
      {
        id: 'obs',
        label: 'Observability',
        weight: 1,
        questions: [
          {
            id: 'q7',
            text: 'Platform observability level',
            levels: {
              1: 'Server log files only. SSH required to debug.',
              2: 'Basic log aggregation. No centralized metrics.',
              3: 'Classic stack (ELK/Grafana/Prometheus). Technical dashboards exist.',
              4: 'Distributed tracing enabled. Links between logs, metrics, and traces.',
              5: 'Business observability. OpenTelemetry, RUM, and business correlation.',
            },
            shareId: 7,
          },
          {
            id: 'q8',
            text: 'Incident management and remediation',
            levels: {
              1: 'Reactive. Incidents discovered via user complaints.',
              2: 'Basic alerting on availability (ping/uptime).',
              3: 'Alerting on technical thresholds (CPU/RAM). Manual incident handling.',
              4: 'Alerting on SLOs/SLIs (latency, error rate). Automated runbooks.',
              5: 'Auto-healing. The system self-remediates most common incidents.',
            },
            shareId: 8,
          },
        ],
      },
      {
        id: 'sec',
        label: 'Security',
        weight: 1,
        questions: [
          {
            id: 'q9',
            text: 'Security integration (shift-left)',
            levels: {
              1: 'Manual security audit at end-of-project or yearly.',
              2: 'Occasional security scans triggered manually.',
              3: 'Automated scans in CI (SAST/dependency), but not blocking.',
              4: 'Blocking security gates in CI. Container scanning.',
              5: 'Full DevSecOps. Security-as-code, OPA policies, dynamic DAST.',
            },
            shareId: 9,
          },
          {
            id: 'q10',
            text: 'Secrets and access management',
            levels: {
              1: 'Plaintext secrets in code or versioned config files.',
              2: 'Secrets in unencrypted env vars or files on servers.',
              3: 'Basic secret management (K8s Secrets, simple Vault).',
              4: 'Dedicated solutions (Vault, AWS Secrets Manager) integrated into apps.',
              5: 'Zero trust. Automatic rotation, dynamic machine identities.',
            },
            shareId: 10,
          },
        ],
      },
      {
        id: 'improve',
        label: 'Improvement',
        weight: 1,
        questions: [
          {
            id: 'q11',
            text: 'Measurement-driven steering (data-driven)',
            levels: {
              1: 'No measurement. Steering by gut feeling or urgency.',
              2: 'A few scattered technical metrics (uptime, ticket count).',
              3: 'DORA metrics measured manually or periodically.',
              4: 'Automated DORA dashboards shared broadly.',
              5: 'Real-time DORA + SPACE (dev satisfaction, performance, adoption) steering.',
            },
            shareId: 11,
          },
          {
            id: 'q12',
            text: 'Learning culture and resilience',
            levels: {
              1: 'Blame culture. “Who broke prod?”. No post-incident sharing.',
              2: 'Occasional postmortems, poorly shared. Limited learning.',
              3: 'Regular blameless postmortems. Actions tracked, not always systemic.',
              4: 'Structured continuous improvement: systematic postmortems and resilience drills.',
              5: 'Chaos engineering. Intentional fault injection to test resilience and learn.',
            },
            shareId: 12,
          },
        ],
      },
    ];
  }

  return [
    {
      id: 'devx',
      label: 'DevX (SPACE)',
      weight: 1,
      questions: [
        {
          id: 'q1',
          text: "Temps de mise à disposition d'un environnement",
          levels: {
            1: 'Plus de 5 jours. Processus entièrement manuel nécessitant plusieurs tickets.',
            2: 'Quelques jours. Processus partiellement manuel, quelques scripts existent.',
            3: "Moins d'un jour. Processus scripté mais déclenché manuellement.",
            4: "Moins d'une heure. Automatisé via pipeline, mais nécessite une approbation.",
            5: 'Moins de 10 minutes. 100% Automatisé et Self-service (ex: DevContainers, Ephemeral Env).',
          },
          shareId: 1,
        },
        {
          id: 'q2',
          text: 'Autonomie des développeurs (Self-service)',
          levels: {
            1: "Aucune autonomie. Nécessite des tickets Ops pour toute action d'infrastructure.",
            2: 'Faible autonomie. Documentation disponible, mais exécution déléguée aux Ops.',
            3: 'Autonomie partielle. Scripts fournis aux développeurs pour certaines tâches courantes.',
            4: 'Bonne autonomie. Portail basique ou CLI permettant de gérer la majorité des besoins.',
            5: 'Autonomie totale. Internal Developer Platform (IDP) type Backstage couvrant tout le cycle de vie.',
          },
          shareId: 2,
        },
      ],
    },
    {
      id: 'env',
      label: 'Environment',
      weight: 1,
      questions: [
        {
          id: 'q3',
          text: 'Reproductibilité des environnements (IaC)',
          levels: {
            1: "Configuration manuelle ('ClickOps') non documentée et non reproductible.",
            2: 'Documentation de procédure (Runbooks) suivie manuellement.',
            3: 'Scripts impératifs (Bash/Python) ou IaC partiel (Terraform) non modulaire.',
            4: 'IaC complet et modulaire (Terraform/Ansible), versionné dans Git.',
            5: 'Environnements éphémères à la demande, identiques à la production, détruits après usage.',
          },
          shareId: 3,
        },
      ],
    },
    {
      id: 'cicd',
      label: 'CI/CD (DORA)',
      weight: 1,
      questions: [
        {
          id: 'q4',
          text: 'Fréquence de déploiement en production',
          levels: {
            1: 'Mensuelle ou moins fréquente (Release train, gros lots).',
            2: 'Bi-hebdomadaire ou hebdomadaire.',
            3: 'Quotidienne. Déploiement déclenché manuellement après validation.',
            4: 'Plusieurs fois par jour. Déploiement automatisé avec validation manuelle légère.',
            5: 'À la demande / Continu. Chaque commit passant les tests va en production (Continuous Deployment).',
          },
          shareId: 4,
        },
        {
          id: 'q5',
          text: 'Délai de rétablissement (Rollback)',
          levels: {
            1: "Plus d'un jour. Nécessite une analyse complexe et des corrections manuelles.",
            2: 'Quelques heures. Processus de rollback documenté mais manuel.',
            3: "Moins de 30 minutes. Script de rollback ou ré-exécution d'une pipeline précédente.",
            4: "Moins de 10 minutes. Rollback « One-click » via l'outil de déploiement.",
            5: "Instantané / Automatique. Rollback déclenché automatiquement sur détection d'erreur (Canary/Blue-Green).",
          },
          shareId: 5,
        },
      ],
    },
    {
      id: 'kube',
      label: 'Conteneurisation',
      weight: 1,
      questions: [
        {
          id: 'q6',
          text: 'Maturité Kubernetes et gestion des workloads',
          levels: {
            1: 'Legacy non conteneurisé (VMs, Bare Metal). Déploiement artisanal.',
            2: 'Dockerisation simple. Déploiement via Docker Compose ou scripts sur VMs.',
            3: 'Kubernetes managé basique. YAMLs appliqués manuellement (kubectl apply).',
            4: 'Kubernetes structuré. Utilisation de Helm/Kustomize, CI pousse les images.',
            5: 'Cloud Native avancé. Kubernetes + Service Mesh + GitOps (ArgoCD/Flux) complet.',
          },
          shareId: 6,
        },
      ],
    },
    {
      id: 'obs',
      label: 'Observabilité',
      weight: 1,
      questions: [
        {
          id: 'q7',
          text: "Niveau d'observabilité de la plateforme",
          levels: {
            1: 'Logs fichiers serveur uniquement. Accès SSH nécessaire pour debugger.',
            2: 'Agrégation de logs basique. Pas de métriques centralisées.',
            3: 'Stack classique (ELK/Grafana/Prometheus). Dashboards techniques disponibles.',
            4: 'Traçabilité distribuée (Tracing) implémentée. Liens Logs-Metrics-Traces.',
            5: 'Observabilité Business. OpenTelemetry, Real User Monitoring (RUM) et corrélation business.',
          },
          shareId: 7,
        },
        {
          id: 'q8',
          text: 'Gestion des incidents et remédiation',
          levels: {
            1: 'Réactif. Découverte des incidents par les plaintes utilisateurs.',
            2: 'Alerting basique sur disponibilité (Ping/Uptime).',
            3: 'Alerting sur seuils techniques (CPU/RAM). Gestion manuelle des incidents.',
            4: "Alerting sur SLOs/SLIs (Latence, Taux d'erreur). Runbooks automatisés.",
            5: 'Auto-healing (Auto-remédiation). Le système corrige seul la majorité des incidents courants.',
          },
          shareId: 8,
        },
      ],
    },
    {
      id: 'sec',
      label: 'Sécurité',
      weight: 1,
      questions: [
        {
          id: 'q9',
          text: 'Intégration de la sécurité (Shift Left)',
          levels: {
            1: 'Audit de sécurité manuel en fin de projet ou annuel.',
            2: 'Scans de sécurité ponctuels déclenchés manuellement.',
            3: 'Scans automatiques dans la CI (SAST/analyse de dépendances), mais non bloquants.',
            4: 'Security Gates bloquantes dans la CI. Analyse des conteneurs.',
            5: 'DevSecOps complet. Security as Code, politiques OPA, DAST dynamique.',
          },
          shareId: 9,
        },
        {
          id: 'q10',
          text: 'Gestion des secrets et accès',
          levels: {
            1: 'Secrets en clair dans le code ou fichiers de config versionnés.',
            2: "Secrets dans des variables d'environnement non chiffrées ou fichiers sur serveur.",
            3: 'Utilisation basique de gestionnaires de secrets (K8s Secrets, Vault simple).',
            4: 'Solutions dédiées (Vault, AWS Secrets Manager) intégrées aux applis.',
            5: 'Zéro Trust. Rotation automatique des secrets, identités machines dynamiques.',
          },
          shareId: 10,
        },
      ],
    },
    {
      id: 'improve',
      label: 'Amélioration',
      weight: 1,
      questions: [
        {
          id: 'q11',
          text: 'Pilotage par la mesure (Data-driven)',
          levels: {
            1: "Aucune mesure. Pilotage au ressenti ou à l'urgence.",
            2: 'Quelques métriques techniques éparses (Uptime, Nombre de tickets).',
            3: 'Métriques DORA mesurées manuellement ou périodiquement.',
            4: 'Tableaux de bord DORA automatisés et partagés.',
            5: 'Pilotage temps réel DORA + SPACE (Satisfaction dév, Performance, Adoption).',
          },
          shareId: 11,
        },
        {
          id: 'q12',
          text: "Culture d'apprentissage et résilience",
          levels: {
            1: "Culture du blâme. 'Qui a cassé la prod ?'. Pas de partage post-incident.",
            2: 'Postmortems occasionnels, peu partagés. Apprentissage limité.',
            3: 'Postmortems réguliers sans blâme. Actions suivies, mais pas toujours systématiques.',
            4: 'Amélioration continue structurée : postmortems systématiques et exercices de résilience.',
            5: 'Chaos Engineering. Injection volontaire de pannes pour tester la résilience et apprendre.',
          },
          shareId: 12,
        },
      ],
    },
  ];
}
