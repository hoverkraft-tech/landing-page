import type { SupportedLanguage } from "~/i18n/ui";

export type PlatformApproachId = "composable" | "managed" | "sovereign";
export type PlatformStageId =
  "design" | "code" | "build" | "provision" | "deploy" | "observe";

export interface PlatformTechnology {
  id: string;
  name: string;
  category: string;
  description: string;
  href: string;
  icon?: string;
}

export interface PlatformApproachNote {
  title: string;
  description: string;
  technologyIds: string[];
  tradeoff: string;
}

export interface PlatformStage {
  id: PlatformStageId;
  label: string;
  action: string;
  output: string;
  journeyTitle: string;
  eyebrow: string;
  title: string;
  description: string;
  outcome: string;
  handoff: string;
  icon: string;
  technologies: PlatformTechnology[];
  approaches: Record<PlatformApproachId, PlatformApproachNote>;
}

export interface PlatformApproach {
  id: PlatformApproachId;
  label: string;
  title: string;
  description: string;
  icon: string;
  benefit: string;
  tradeoff: string;
}

export interface PlatformWorkflowCopy {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  exploreLabel: string;
  approachLabel: string;
  approachHint: string;
  workflowLabel: string;
  workflowHint: string;
  technologiesLabel: string;
  selectedTechnologiesLabel: string;
  outcomeLabel: string;
  handoffLabel: string;
  tradeoffLabel: string;
  documentationLabel: string;
  previousLabel: string;
  nextLabel: string;
  progressLabel: string;
  overviewLabel: string;
  overviewTitle: string;
  overviewDescription: string;
  loopLabel: string;
  examplesNote: string;
  ctaEyebrow: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaLabel: string;
}

export interface PlatformWorkflowContent {
  copy: PlatformWorkflowCopy;
  stages: PlatformStage[];
  approaches: PlatformApproach[];
}

export function getPlatformWorkflowContent(
  lang: SupportedLanguage,
): PlatformWorkflowContent {
  const t = (fr: string, en: string) => (lang === "en" ? en : fr);

  return {
    copy: {
      eyebrow: "Platform engineering",
      title: t("Concevez votre", "Build your"),
      titleAccent: t("plateforme", "platform"),
      description: t(
        "Choisissez vos outils, du self-service à la production. Comparez trois architectures et explorez les échanges entre étapes.",
        "Choose your tools, from self-service to production. Compare three architectures and explore the connections between stages.",
      ),
      exploreLabel: t("Explorer les étapes", "Explore the stages"),
      approachLabel: t("Approche", "Approach"),
      approachHint: t(
        "Comparez les outils et les responsabilités d’exploitation. Ces approches peuvent se combiner.",
        "Compare tools and operating responsibilities. These approaches can be combined.",
      ),
      workflowLabel: t("Du self-service à la production", "From self-service to production"),
      workflowHint: t(
        "Sélectionnez une étape pour choisir ses outils.",
        "Select a stage to choose its tools.",
      ),
      technologiesLabel: t(
        "Technologies et fournisseurs",
        "Technologies & providers",
      ),
      selectedTechnologiesLabel: t("Dans cet exemple", "In this example"),
      outcomeLabel: t("Résultat", "Output"),
      handoffLabel: t("Échange entre étapes", "Handoff"),
      tradeoffLabel: t("À prévoir", "Tradeoff"),
      documentationLabel: t(
        "Documentation officielle",
        "Official documentation",
      ),
      previousLabel: t("Étape précédente", "Previous stage"),
      nextLabel: t("Étape suivante", "Next stage"),
      progressLabel: t("Étape", "Stage"),
      overviewLabel: t("Architecture", "Architecture"),
      overviewTitle: t(
        "Les outils de votre plateforme.",
        "Your platform tools.",
      ),
      overviewDescription: t(
        "Reliez le portail développeur, Git, la CI, l’IaC, GitOps et l’observabilité.",
        "Connect the developer portal, Git, CI, IaC, GitOps, and observability.",
      ),
      loopLabel: t(
        "Les incidents et les retours des équipes font évoluer les templates et les pipelines.",
        "Incidents and team feedback inform changes to templates and pipelines.",
      ),
      examplesNote: t(
        "Exemples d’architecture. Les intégrations, les accès et les responsabilités d’exploitation restent à définir.",
        "Example architectures. Integrations, access, and operating responsibilities still need to be defined.",
      ),
      ctaEyebrow: t("Votre plateforme", "Your platform"),
      ctaTitle: t("Définissons votre architecture.", "Define your architecture."),
      ctaDescription: t(
        "Partons de vos outils et de vos contraintes pour définir les intégrations, les responsabilités et le premier service à déployer.",
        "Start with your tools and constraints. Define the integrations, ownership, and first service to deploy.",
      ),
      ctaLabel: t(
        "Parlons de votre plateforme",
        "Let’s talk about your platform",
      ),
    },
    approaches: [
      {
        id: "composable",
        label: t("Composable", "Composable"),
        title: t(
          "Assembler des outils open source",
          "Integrate open-source tools",
        ),
        description: t(
          "Votre équipe choisit, intègre et maintient les outils de la plateforme.",
          "Your team selects, integrates, and maintains the platform tools.",
        ),
        icon: "tabler:blocks",
        benefit: t(
          "Personnalisation et portabilité",
          "Customization & portability",
        ),
        tradeoff: t(
          "Maintenir les intégrations et les plugins. Appliquer les mises à jour.",
          "Maintain integrations and plugins. Apply updates.",
        ),
      },
      {
        id: "managed",
        label: t("Managée", "Managed"),
        title: t(
          "Utiliser des services managés",
          "Use managed services",
        ),
        description: t(
          "Les fournisseurs exploitent les services. Votre équipe configure les accès et les intégrations.",
          "Providers operate the services. Your team configures access and integrations.",
        ),
        icon: "tabler:cloud",
        benefit: t(
          "Moins de services à exploiter",
          "Fewer services to operate",
        ),
        tradeoff: t(
          "Suivre les coûts, les quotas et la dépendance aux fournisseurs.",
          "Track costs, quotas, and provider dependencies.",
        ),
      },
      {
        id: "sovereign",
        label: t("Souveraineté", "Sovereignty"),
        title: t(
          "Choisir l’hébergement et les accès",
          "Choose hosting and access controls",
        ),
        description: t(
          "Choisissez où héberger le code, les services et les données, et qui peut y accéder.",
          "Choose where code, services, and data are hosted, and who can access them.",
        ),
        icon: "tabler:shield-lock",
        benefit: t(
          "Maîtrise de l’hébergement et des données",
          "Hosting & data control",
        ),
        tradeoff: t(
          "Valider les contrats, les flux de données et les responsabilités d’exploitation.",
          "Review contracts, data flows, and operating responsibilities.",
        ),
      },
    ],
    stages: [
      {
        id: "design",
        journeyTitle: t(
          "Créez un service depuis un template.",
          "Create a service from a template.",
        ),
        action: t(
          "Créer un service à partir d’un template.",
          "Create a service from a template.",
        ),
        output: t("Service initialisé", "Scaffolded service"),
        label: t("Self-service", "Self-service"),
        eyebrow: t("Catalogue et self-service", "Catalog & self-service"),
        title: t(
          "Catalogue de services et templates.",
          "Service catalog and templates.",
        ),
        description: t(
          "Créez les services depuis des templates. Référencez leur documentation et leur équipe responsable dans le catalogue.",
          "Create services from templates. List their documentation and owning teams in the catalog.",
        ),
        outcome: t(
          "Un service initialisé, référencé dans le catalogue et rattaché à une équipe.",
          "A scaffolded service, listed in the catalog and assigned to a team.",
        ),
        handoff: t(
          "Le template initialise le dépôt avec les conventions de l’équipe.",
          "The template initializes the repository and its conventions.",
        ),
        icon: "tabler:layout-dashboard",
        technologies: [
          {
            id: "backstage",
            name: "Backstage",
            category: t("Portail développeur", "Developer portal"),
            description: t(
              "Catalogue de services, templates et plugins dans un portail développeur.",
              "Service catalog, templates, and plugins in a developer portal.",
            ),
            href: "https://backstage.io/docs/features/software-templates/",
            icon: "tabler:layout-dashboard",
          },
          {
            id: "port",
            name: "Port",
            category: t("Portail managé", "Managed portal"),
            description: t(
              "Catalogue et actions de self-service connectés à vos outils.",
              "Catalog and self-service actions connected to your tools.",
            ),
            href: "https://docs.port.io/",
            icon: "tabler:apps",
          },
          {
            id: "gitlab-templates",
            name: "GitLab Templates",
            category: t("Templates de projet", "Project templates"),
            description: t(
              "Templates pour initialiser des projets dans GitLab.",
              "Templates to scaffold projects in GitLab.",
            ),
            href: "https://docs.gitlab.com/user/project/",
            icon: "tabler:brand-gitlab",
          },
        ],
        approaches: {
          composable: {
            title: t(
              "Portail open source",
              "Open-source portal",
            ),
            description: t(
              "Backstage rassemble le catalogue et les templates ; votre équipe choisit les intégrations.",
              "Backstage brings together the catalog and templates; your team chooses the integrations.",
            ),
            technologyIds: ["backstage"],
            tradeoff: t(
              "Maintenir le portail, ses plugins et ses intégrations.",
              "Maintain the portal, plugins, and integrations.",
            ),
          },
          managed: {
            title: t(
              "Portail managé",
              "Managed portal",
            ),
            description: t(
              "Port expose le catalogue et déclenche vos workflows depuis des actions de self-service.",
              "Port exposes the catalog and triggers your workflows through self-service actions.",
            ),
            technologyIds: ["port"],
            tradeoff: t(
              "Vérifier le modèle de données, les connecteurs et l’offre choisie.",
              "Check the data model, connectors, and chosen plan.",
            ),
          },
          sovereign: {
            title: t(
              "Portail auto-hébergé",
              "Self-hosted portal",
            ),
            description: t(
              "Hébergez Backstage et connectez votre forge. Pour la création de projets seule, utilisez des templates GitLab.",
              "Host Backstage and connect your Git platform. For project scaffolding alone, use GitLab templates.",
            ),
            technologyIds: ["backstage", "gitlab-templates"],
            tradeoff: t(
              "Gérer l’identité, les accès et la disponibilité du portail.",
              "Manage identity, access, and portal availability.",
            ),
          },
        },
      },
      {
        id: "code",
        journeyTitle: t("Versionnez et revoyez le code.", "Version and review code."),
        action: t(
          "Versionner le code et organiser les code reviews.",
          "Version code and run code reviews.",
        ),
        output: t("Code revu", "Reviewed code"),
        label: t("Code", "Code"),
        eyebrow: t("Git & code review", "Git & code review"),
        title: t(
          "Dépôts Git et code reviews.",
          "Git repositories and code reviews.",
        ),
        description: t(
          "Versionnez le code dans Git. Définissez les règles de contribution et les validations requises avant le merge.",
          "Version code in Git. Define contribution rules and required approvals before merging.",
        ),
        outcome: t(
          "Une pull request ou merge request revue, avec les validations requises.",
          "A reviewed pull request or merge request with the required approvals.",
        ),
        handoff: t(
          "Chaque modification déclenche les contrôles du pipeline.",
          "Each change triggers the pipeline checks.",
        ),
        icon: "tabler:git-pull-request",
        technologies: [
          {
            id: "github",
            name: "GitHub",
            category: t("Git & code review", "Git & code review"),
            description: t(
              "Dépôts Git, pull requests et règles de contribution.",
              "Git repositories, pull requests, and contribution rules.",
            ),
            href: "https://docs.github.com/en/pull-requests",
            icon: "tabler:brand-github",
          },
          {
            id: "gitlab",
            name: "GitLab",
            category: t("Git & code review", "Git & code review"),
            description: t(
              "Dépôts Git et merge requests, en SaaS ou sur votre infrastructure.",
              "Repositories and merge requests, as SaaS or on your infrastructure.",
            ),
            href: "https://docs.gitlab.com/user/project/merge_requests/",
            icon: "tabler:brand-gitlab",
          },
          {
            id: "forgejo",
            name: "Forgejo",
            category: t("Forge auto-hébergée", "Self-hosted Git platform"),
            description: t(
              "Forge open source pour héberger les dépôts et les pull requests.",
              "Open-source Git hosting for repositories and pull requests.",
            ),
            href: "https://forgejo.org/docs/latest/",
            icon: "tabler:git-branch",
          },
        ],
        approaches: {
          composable: {
            title: t(
              "Forge open source",
              "Open-source Git hosting",
            ),
            description: t(
              "Forgejo héberge le code et les code reviews. Connectez les événements Git à votre pipeline CI.",
              "Forgejo hosts code and reviews; connect Git events to your CI pipeline.",
            ),
            technologyIds: ["forgejo"],
            tradeoff: t(
              "Configurer les intégrations CI et les règles de code review.",
              "Configure CI integrations and code review rules.",
            ),
          },
          managed: {
            title: t(
              "Forge SaaS",
              "SaaS Git hosting",
            ),
            description: t(
              "GitHub ou GitLab.com héberge les dépôts et les code reviews avec les règles de votre organisation.",
              "GitHub or GitLab.com hosts repositories and code reviews with your organization’s controls.",
            ),
            technologyIds: ["github", "gitlab"],
            tradeoff: t(
              "Choisir les fonctions de gouvernance et l’offre adaptées.",
              "Choose the governance features and plan you need.",
            ),
          },
          sovereign: {
            title: t(
              "Forge auto-hébergée",
              "Self-hosted Git platform",
            ),
            description: t(
              "GitLab Self-Managed ou Forgejo vous permet de choisir où héberger la forge et ses sauvegardes.",
              "GitLab Self-Managed or Forgejo lets you choose where to host the Git platform and its backups.",
            ),
            technologyIds: ["gitlab", "forgejo"],
            tradeoff: t(
              "Assurer les mises à jour, les sauvegardes et la reprise.",
              "Own upgrades, backups, and recovery.",
            ),
          },
        },
      },
      {
        id: "build",
        journeyTitle: t(
          "Exécutez les tests et le build.",
          "Run tests and build artifacts.",
        ),
        action: t(
          "Tester, analyser et produire un artefact.",
          "Test, scan, and package your code.",
        ),
        output: t("Artefact versionné", "Versioned artifact"),
        label: t("CI", "CI"),
        eyebrow: t("CI, artefacts et sécurité", "CI, artifacts & security"),
        title: t(
          "Tests, build et scans de sécurité.",
          "Tests, builds, and security scans.",
        ),
        description: t(
          "Automatisez les tests, le build et les analyses de sécurité avant de publier un artefact versionné dans votre registre.",
          "Automate tests, builds, and scans before publishing a versioned artifact to your registry.",
        ),
        outcome: t(
          "Un artefact versionné et les résultats de ses contrôles.",
          "A versioned artifact and the results of its checks.",
        ),
        handoff: t(
          "Le pipeline CI peut aussi vérifier les changements IaC avant le provisionnement.",
          "CI can also check IaC changes before provisioning.",
        ),
        icon: "tabler:settings-automation",
        technologies: [
          {
            id: "github-actions",
            name: "GitHub Actions",
            category: t("Automatisation CI/CD", "CI/CD automation"),
            description: t(
              "Workflows de build et de test déclenchés depuis GitHub.",
              "Build and test workflows triggered from GitHub.",
            ),
            href: "https://docs.github.com/en/actions/get-started/understand-github-actions",
            icon: "tabler:brand-github",
          },
          {
            id: "gitlab-ci",
            name: "GitLab CI/CD",
            category: t("Pipelines et runners", "Pipelines & runners"),
            description: t(
              "Pipelines versionnés exécutés par des runners hébergés ou gérés par votre équipe.",
              "Versioned pipelines executed by hosted or self-managed runners.",
            ),
            href: "https://docs.gitlab.com/ci/",
            icon: "tabler:brand-gitlab",
          },
          {
            id: "tekton",
            name: "Tekton",
            category: t("Pipelines Kubernetes", "Kubernetes pipelines"),
            description: t(
              "Tâches et pipelines exécutés sur Kubernetes.",
              "Tasks and pipelines that run on Kubernetes.",
            ),
            href: "https://tekton.dev/docs/pipelines/",
            icon: "tabler:subtask",
          },
          {
            id: "trivy",
            name: "Trivy",
            category: t("Analyse de sécurité", "Security scanning"),
            description: t(
              "Scans de vulnérabilités et de configuration à intégrer au pipeline.",
              "Vulnerability and configuration scans to add to your pipeline.",
            ),
            href: "https://trivy.dev/docs/latest/guide/",
            icon: "tabler:shield-check",
          },
        ],
        approaches: {
          composable: {
            title: t("Des pipelines réutilisables", "Reusable pipelines"),
            description: t(
              "Tekton exécute les tâches sur Kubernetes. Trivy analyse les artefacts avant leur publication dans votre registre.",
              "Tekton runs tasks on Kubernetes. Trivy scans artifacts before publication to your registry.",
            ),
            technologyIds: ["tekton", "trivy"],
            tradeoff: t(
              "Exploiter les workers et maintenir les tâches partagées.",
              "Operate workers and maintain shared tasks.",
            ),
          },
          managed: {
            title: t("Runners hébergés", "Hosted runners"),
            description: t(
              "Exécutez GitHub Actions ou GitLab CI/CD sur des runners hébergés. Ajoutez Trivy aux tests du projet.",
              "Run GitHub Actions or GitLab CI/CD on hosted runners. Add Trivy alongside project tests.",
            ),
            technologyIds: ["github-actions", "gitlab-ci", "trivy"],
            tradeoff: t(
              "Suivre les minutes de CI, les permissions et les accès réseau.",
              "Track CI minutes, permissions, and network access.",
            ),
          },
          sovereign: {
            title: t(
              "Runners auto-hébergés",
              "Self-hosted runners",
            ),
            description: t(
              "Associez GitLab Self-Managed, vos runners et Trivy à un registre d’artefacts hébergé dans votre réseau.",
              "Combine GitLab Self-Managed, your runners, and Trivy with an artifact registry hosted in your network.",
            ),
            technologyIds: ["gitlab-ci", "trivy"],
            tradeoff: t(
              "Isoler les jobs et gérer les secrets et la capacité des runners.",
              "Isolate jobs and manage secrets and runner capacity.",
            ),
          },
        },
      },
      {
        id: "provision",
        journeyTitle: t(
          "Provisionnez l’infrastructure.",
          "Provision infrastructure.",
        ),
        action: t(
          "Définir et provisionner l’infrastructure par le code.",
          "Define and provision infrastructure as code.",
        ),
        output: t("Infrastructure provisionnée", "Provisioned infrastructure"),
        label: t("IaC", "IaC"),
        eyebrow: "Infrastructure as Code",
        title: t(
          "Infrastructure versionnée dans Git.",
          "Infrastructure versioned in Git.",
        ),
        description: t(
          "Décrivez les réseaux, les ressources et les accès dans des modules versionnés. Examinez les plans avant d’appliquer les changements.",
          "Describe networks, resources, and access in versioned modules. Review plans before applying changes.",
        ),
        outcome: t(
          "Des ressources provisionnées à partir d’une configuration versionnée.",
          "Resources provisioned from versioned configuration.",
        ),
        handoff: t(
          "Le runtime, le réseau et les accès sont disponibles pour le déploiement.",
          "The runtime, network, and access are available for deployment.",
        ),
        icon: "tabler:server-cog",
        technologies: [
          {
            id: "opentofu",
            name: "OpenTofu",
            category: t("Moteur IaC", "IaC engine"),
            description: t(
              "Provisionnement de ressources à partir de configurations déclaratives.",
              "Resource provisioning from declarative configurations.",
            ),
            href: "https://opentofu.org/docs/intro/",
            icon: "tabler:code",
          },
          {
            id: "terraform",
            name: "Terraform",
            category: t("Moteur IaC", "IaC engine"),
            description: t(
              "Modules et providers pour gérer le cycle de vie des ressources.",
              "Modules and providers to manage resource lifecycles.",
            ),
            href: "https://developer.hashicorp.com/terraform/intro",
            icon: "tabler:brand-terraform",
          },
          {
            id: "aws",
            name: "AWS",
            category: t("Fournisseur cloud", "Cloud provider"),
            description: t(
              "Services de calcul, réseau et stockage à provisionner par API.",
              "Compute, networking, and storage services to provision through APIs.",
            ),
            href: "https://docs.aws.amazon.com/",
            icon: "tabler:brand-aws",
          },
          {
            id: "ovhcloud",
            name: "OVHcloud",
            category: t("Fournisseur cloud", "Cloud provider"),
            description: t(
              "Ressources cloud et services managés selon la région choisie.",
              "Cloud resources and managed services in your chosen region.",
            ),
            href: "https://www.ovhcloud.com/en/public-cloud/",
            icon: "tabler:cloud",
          },
          {
            id: "scaleway",
            name: "Scaleway",
            category: t("Fournisseur cloud", "Cloud provider"),
            description: t(
              "Ressources de calcul, réseau et stockage dans des régions européennes.",
              "Compute, networking, and storage resources in European regions.",
            ),
            href: "https://www.scaleway.com/en/docs/",
            icon: "tabler:cloud-computing",
          },
        ],
        approaches: {
          composable: {
            title: t(
              "Modules IaC",
              "IaC modules",
            ),
            description: t(
              "OpenTofu provisionne les ressources à partir de vos modules et des providers disponibles pour votre cloud.",
              "OpenTofu provisions resources from your modules and the providers available for your cloud.",
            ),
            technologyIds: ["opentofu"],
            tradeoff: t(
              "Maintenir les modules, le state et la compatibilité des providers.",
              "Maintain modules, state, and provider compatibility.",
            ),
          },
          managed: {
            title: t(
              "IaC et services managés",
              "IaC for managed resources",
            ),
            description: t(
              "Terraform provisionne les services AWS. Votre équipe versionne les paramètres de réseau, d’accès et de dimensionnement.",
              "Terraform provisions AWS services. Your team versions network, access, and sizing configuration.",
            ),
            technologyIds: ["terraform", "aws"],
            tradeoff: t(
              "Gérer la configuration, le state et les coûts des services.",
              "Manage configuration, state, and service costs.",
            ),
          },
          sovereign: {
            title: t(
              "Régions et hébergement",
              "Regions and hosting",
            ),
            description: t(
              "Choisissez les services OVHcloud ou Scaleway et provisionnez les ressources avec OpenTofu selon les providers disponibles.",
              "Choose OVHcloud or Scaleway services and provision resources with OpenTofu using available providers.",
            ),
            technologyIds: ["opentofu", "ovhcloud", "scaleway"],
            tradeoff: t(
              "Valider régions, contrats et flux de données pour chaque service.",
              "Validate regions, contracts, and data flows for each service.",
            ),
          },
        },
      },
      {
        id: "deploy",
        journeyTitle: t(
          "Déployez votre service.",
          "Deploy your service.",
        ),
        action: t(
          "Déployer le service dans son environnement.",
          "Deploy the service to its environment.",
        ),
        output: t("Service déployé", "Deployed service"),
        label: t("CD", "CD"),
        eyebrow: "GitOps & runtime",
        title: t(
          "Déploiement avec GitOps.",
          "Deployment with GitOps.",
        ),
        description: t(
          "Référencez l’artefact et la configuration dans Git. Les contrôleurs GitOps synchronisent le cluster avec cet état et détectent les écarts.",
          "Reference the artifact and configuration in Git. GitOps controllers synchronize the cluster with that state and detect drift.",
        ),
        outcome: t(
          "Un service déployé dont la version et l’état sont visibles.",
          "A deployed service with a visible version and state.",
        ),
        handoff: t(
          "Le service instrumenté émet des métriques, des logs et des traces pour l’observabilité.",
          "The instrumented service emits metrics, logs, and traces for observability.",
        ),
        icon: "tabler:rocket",
        technologies: [
          {
            id: "kubernetes",
            name: "Kubernetes",
            category: t(
              "Orchestration de conteneurs",
              "Container orchestration",
            ),
            description: t(
              "Orchestre les applications conteneurisées.",
              "Orchestrates containerized workloads.",
            ),
            href: "https://kubernetes.io/docs/concepts/overview/",
            icon: "tabler:hexagons",
          },
          {
            id: "argocd",
            name: "Argo CD",
            category: t("Déploiement GitOps", "GitOps deployment"),
            description: t(
              "Synchronise les applications Kubernetes avec l’état décrit dans Git.",
              "Synchronizes Kubernetes applications with the state defined in Git.",
            ),
            href: "https://argo-cd.readthedocs.io/en/stable/",
            icon: "tabler:git-merge",
          },
          {
            id: "flux",
            name: "Flux",
            category: t("Contrôleurs GitOps", "GitOps controllers"),
            description: t(
              "Contrôleurs Kubernetes qui appliquent les configurations déclaratives.",
              "Kubernetes controllers that reconcile declarative sources.",
            ),
            href: "https://fluxcd.io/flux/",
            icon: "tabler:refresh",
          },
          {
            id: "eks",
            name: "Amazon EKS",
            category: t("Kubernetes managé", "Managed Kubernetes"),
            description: t(
              "Kubernetes avec un control plane géré par AWS.",
              "Kubernetes with an AWS-managed control plane.",
            ),
            href: "https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html",
            icon: "tabler:brand-aws",
          },
        ],
        approaches: {
          composable: {
            title: t(
              "Kubernetes et Argo CD",
              "Kubernetes and Argo CD",
            ),
            description: t(
              "Kubernetes exécute les applications. Argo CD synchronise leur déploiement avec la configuration dans Git.",
              "Kubernetes runs workloads. Argo CD synchronizes deployments with the configuration in Git.",
            ),
            technologyIds: ["kubernetes", "argocd"],
            tradeoff: t(
              "Définir la promotion des versions et la stratégie de rollback.",
              "Define version promotion and rollback strategy.",
            ),
          },
          managed: {
            title: t(
              "Control plane managé",
              "Managed control plane",
            ),
            description: t(
              "Amazon EKS gère le control plane Kubernetes. Argo CD synchronise les déploiements applicatifs depuis Git.",
              "Amazon EKS operates the Kubernetes control plane. Argo CD synchronizes application deployments from Git.",
            ),
            technologyIds: ["eks", "argocd"],
            tradeoff: t(
              "Gérer les applications, les accès et les mises à jour.",
              "Manage workloads, access, and upgrades.",
            ),
          },
          sovereign: {
            title: t(
              "Kubernetes et Flux",
              "Kubernetes and Flux",
            ),
            description: t(
              "Exécutez Kubernetes sur votre infrastructure. Flux synchronise les configurations depuis votre forge.",
              "Run Kubernetes on your infrastructure. Flux reconciles configuration from your Git platform.",
            ),
            technologyIds: ["kubernetes", "flux"],
            tradeoff: t(
              "Exploiter les clusters, le réseau et les sauvegardes.",
              "Operate clusters, networking, and backups.",
            ),
          },
        },
      },
      {
        id: "observe",
        journeyTitle: t(
          "Observez les services en production.",
          "Observe services in production.",
        ),
        action: t(
          "Collecter la télémétrie et diagnostiquer les incidents.",
          "Collect telemetry and diagnose incidents.",
        ),
        output: t("Métriques, logs, traces", "Metrics, logs, traces"),
        label: t("Observabilité", "Observability"),
        eyebrow: t("Télémétrie et alertes", "Telemetry & alerts"),
        title: t(
          "Métriques, logs, traces et alertes.",
          "Metrics, logs, traces, and alerts.",
        ),
        description: t(
          "Associez les métriques, les logs et les traces aux services et aux équipes responsables. Configurez les alertes pour détecter et diagnostiquer les incidents.",
          "Connect metrics, logs, and traces to services and owning teams. Configure alerts to detect and diagnose incidents.",
        ),
        outcome: t(
          "Des dashboards par service et des alertes adressées à l’équipe responsable.",
          "Service dashboards and alerts routed to the owning team.",
        ),
        handoff: t(
          "Les incidents et les retours des équipes font évoluer les templates, les contrôles et les pipelines.",
          "Incidents and team feedback inform changes to templates, checks, and pipelines.",
        ),
        icon: "tabler:activity-heartbeat",
        technologies: [
          {
            id: "opentelemetry",
            name: "OpenTelemetry",
            category: t(
              "Instrumentation et collecte",
              "Instrumentation & collection",
            ),
            description: t(
              "Instrumente les services et transmet la télémétrie aux outils d’observabilité.",
              "Instruments services and sends telemetry to observability backends.",
            ),
            href: "https://opentelemetry.io/docs/what-is-opentelemetry/",
            icon: "tabler:radar",
          },
          {
            id: "prometheus",
            name: "Prometheus",
            category: t("Métriques et alertes", "Metrics & alerting"),
            description: t(
              "Collecte les métriques pour le monitoring et les alertes.",
              "Collects and queries metrics for monitoring and alerting.",
            ),
            href: "https://prometheus.io/docs/introduction/overview/",
            icon: "tabler:chart-line",
          },
          {
            id: "grafana",
            name: "Grafana",
            category: t("Visualisation", "Visualization"),
            description: t(
              "Dashboards pour visualiser et interroger vos sources de données.",
              "Dashboards to visualize and query your data sources.",
            ),
            href: "https://grafana.com/docs/grafana/latest/introduction/",
            icon: "tabler:chart-area-line",
          },
          {
            id: "datadog",
            name: "Datadog",
            category: t("Observabilité SaaS", "SaaS observability"),
            description: t(
              "Monitoring, traces et logs dans une plateforme SaaS.",
              "Monitoring, traces, and logs in a SaaS platform.",
            ),
            href: "https://docs.datadoghq.com/",
            icon: "tabler:activity",
          },
        ],
        approaches: {
          composable: {
            title: t(
              "Observabilité open source",
              "Open-source observability",
            ),
            description: t(
              "OpenTelemetry instrumente les services. Prometheus collecte les métriques et Grafana les affiche dans des dashboards.",
              "OpenTelemetry instruments services. Prometheus collects metrics and Grafana displays them in dashboards.",
            ),
            technologyIds: ["opentelemetry", "prometheus", "grafana"],
            tradeoff: t(
              "Ajouter le stockage des logs et des traces. Définir leur durée de conservation.",
              "Add log and trace storage. Define retention periods.",
            ),
          },
          managed: {
            title: t("Observabilité SaaS", "SaaS observability"),
            description: t(
              "Transmettez la télémétrie à Datadog, avec OpenTelemetry selon les intégrations retenues.",
              "Send telemetry to Datadog, using OpenTelemetry where your integrations support it.",
            ),
            technologyIds: ["opentelemetry", "datadog"],
            tradeoff: t(
              "Suivre les volumes ingérés, la rétention et les coûts.",
              "Track ingestion volume, retention, and costs.",
            ),
          },
          sovereign: {
            title: t(
              "Observabilité auto-hébergée",
              "Self-hosted observability",
            ),
            description: t(
              "Hébergez OpenTelemetry, Prometheus et Grafana dans votre environnement. Choisissez où stocker les logs et les traces.",
              "Host OpenTelemetry, Prometheus, and Grafana in your environment. Choose where to store logs and traces.",
            ),
            technologyIds: ["opentelemetry", "prometheus", "grafana"],
            tradeoff: t(
              "Dimensionner le stockage et contrôler les données sensibles collectées.",
              "Size storage and control the sensitive data collected.",
            ),
          },
        },
      },
    ],
  };
}
