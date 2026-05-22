import { describe, expect, it, vi } from 'vitest';

import type { HomeAction, HomePageContent } from '~/components/home/types';
import type { SupportedLanguage } from '~/i18n/ui';

vi.mock('~/i18n/utils', () => ({
  useTranslatedPath: (lang: SupportedLanguage) => (path: string) => {
    const normalizedPath = path === '/' ? '' : path;
    return lang === 'en' ? `/en${normalizedPath}` : normalizedPath || '/';
  },
}));

const { getHomepageContent } = await import('./homepage');

const locales: SupportedLanguage[] = ['fr', 'en'];

const collectActions = (content: HomePageContent): HomeAction[] => [
  content.hero.primaryAction,
  content.hero.secondaryAction,
  content.operatingModel.primaryAction,
  content.operatingModel.secondaryAction,
  content.activation.audit.action,
  content.activation.assessment.action,
  content.finalCta.primaryAction,
  content.finalCta.secondaryAction,
  ...content.useCases.items.map((item) => item.action),
  ...content.platformModel.pillars.map((pillar) => pillar.action),
];

describe('homepage content', () => {
  it('provides synchronized top-level content for every supported locale', () => {
    const [frKeys, enKeys] = locales.map((locale) => Object.keys(getHomepageContent(locale)));

    expect(frKeys).toEqual(enKeys);
  });

  it('keeps homepage sections within the expected bounds', () => {
    locales.forEach((locale) => {
      const content = getHomepageContent(locale);

      expect(content.hero.proof).toHaveLength(3);
      expect(content.proofStrip.length).toBeGreaterThanOrEqual(3);
      expect(content.proofStrip.length).toBeLessThanOrEqual(5);
      expect(content.useCases.items).toHaveLength(4);
      expect(content.platformModel.pillars).toHaveLength(3);
      expect(content.comparison.columns).toHaveLength(2);
      expect(content.operatingModel.steps.length).toBeGreaterThanOrEqual(4);
      expect(content.operatingModel.steps.length).toBeLessThanOrEqual(6);
      expect(content.resources.items.length).toBeGreaterThanOrEqual(3);
      expect(content.integrations.items.length).toBeGreaterThanOrEqual(8);
    });
  });

  it('provides non-empty CTA labels and hrefs', () => {
    locales.forEach((locale) => {
      const content = getHomepageContent(locale);

      collectActions(content).forEach((action) => {
        expect(action.text.trim()).not.toBe('');
        expect(action.href.trim()).not.toBe('');
      });
    });
  });
});
