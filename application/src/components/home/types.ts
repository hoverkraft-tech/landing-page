import type { CallToAction } from '~/types';

export type HomeAction = Pick<CallToAction, 'variant' | 'icon' | 'target'> & {
  text: string;
  href: string;
};

export type HomeSectionHeader = {
  tagline?: string;
  title: string;
  subtitle?: string;
};

export type HomeBullet = {
  text: string;
  icon?: string;
};

export type HomeUseCase = {
  id: string;
  title: string;
  role: string;
  problem: string;
  response: string;
  outcomes: string[];
  action: HomeAction;
  icon?: string;
};

export type HomePillar = {
  id: string;
  title: string;
  description: string;
  action: HomeAction;
  icon?: string;
};

export type HomeComparisonColumn = {
  title: string;
  items: string[];
  tone: 'negative' | 'positive';
};

export type HomeOperatingStep = {
  index: number;
  title: string;
  deliverables: string[];
  icon?: string;
};

export type HomeCredibilityCard = {
  title: string;
  description: string;
  icon?: string;
  href?: string;
};

export type HomeFaqItem = {
  question: string;
  answer: string;
};

export type HomeHeroContent = HomeSectionHeader & {
  primaryAction: HomeAction;
  secondaryAction: HomeAction;
  proof: HomeBullet[];
  visual: {
    title: string;
    subtitle: string;
    nodes: string[];
    metrics: string[];
  };
};

export type HomePageContent = {
  metadata: {
    title: string;
    description: string;
  };
  announcement: {
    text: string;
    href: string;
  };
  hero: HomeHeroContent;
  useCases: {
    header: HomeSectionHeader;
    items: HomeUseCase[];
  };
  platformModel: {
    header: HomeSectionHeader;
    pillars: HomePillar[];
  };
  comparison: {
    header: HomeSectionHeader;
    columns: [HomeComparisonColumn, HomeComparisonColumn];
  };
  operatingModel: {
    header: HomeSectionHeader;
    steps: HomeOperatingStep[];
    primaryAction: HomeAction;
    secondaryAction: HomeAction;
  };
  credibility: {
    header: HomeSectionHeader;
    cards: HomeCredibilityCard[];
  };
  faq: {
    header: HomeSectionHeader;
    items: HomeFaqItem[];
  };
  activation: {
    header: HomeSectionHeader;
    audit: {
      title: string;
      description: string;
      bullets: string[];
      action: HomeAction;
    };
    assessment: {
      title: string;
      description: string;
      bullets: string[];
      action: HomeAction;
    };
  };
  finalCta: {
    title: string;
    subtitle: string;
    primaryAction: HomeAction;
    secondaryAction: HomeAction;
  };
};
