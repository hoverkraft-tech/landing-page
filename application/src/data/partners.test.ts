import { describe, expect, it, vi } from 'vitest';

import type { PartnersAction, PartnersPageContent } from '~/components/partners/types';
import type { SupportedLanguage } from '~/i18n/ui';

vi.mock('~/i18n/utils', () => ({
  useTranslatedPath: (lang: SupportedLanguage) => (path: string) => {
    const normalizedPath = path === '/' ? '' : path;
    return lang === 'en' ? `/en${normalizedPath}` : normalizedPath || '/';
  },
}));

const { getPartnersContent } = await import('./partners');

const locales: SupportedLanguage[] = ['fr', 'en'];

const collectActions = (content: PartnersPageContent): PartnersAction[] => [
  content.hero.primaryAction,
  content.hero.secondaryAction,
  content.cta.primaryAction,
  content.cta.secondaryAction,
  ...content.accreditations.items.flatMap((item) => (item.link ? [item.link] : [])),
  ...content.alliances.items.flatMap((item) => (item.action ? [item.action] : [])),
];

describe('partners content', () => {
  it('provides synchronized top-level content for every supported locale', () => {
    const [frKeys, enKeys] = locales.map((locale) => Object.keys(getPartnersContent(locale)));

    expect(frKeys).toEqual(enKeys);
  });

  it('keeps partners sections within the expected bounds', () => {
    locales.forEach((locale) => {
      const content = getPartnersContent(locale);

      expect(content.hero.proof).toHaveLength(3);
      expect(content.accreditations.items).toHaveLength(4);
      expect(content.accreditations.items.filter((item) => item.featured)).toHaveLength(1);
      expect(content.alliances.items.length).toBeGreaterThanOrEqual(1);
      content.alliances.items.forEach((item) => {
        expect(item.highlights.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  it('exposes the featured accreditation announcement link per locale', () => {
    const featuredLinks = locales.map((locale) => {
      const content = getPartnersContent(locale);
      return content.accreditations.items.find((item) => item.featured)?.link?.href;
    });

    expect(featuredLinks).toEqual([
      '/blog/hoverkraft-partenaire-officiel-github',
      '/en/blog/hoverkraft-official-github-partner',
    ]);
  });

  it('provides non-empty action labels and hrefs', () => {
    locales.forEach((locale) => {
      const content = getPartnersContent(locale);

      collectActions(content).forEach((action) => {
        expect(action.text.trim()).not.toBe('');
        expect(action.href.trim()).not.toBe('');
      });
    });
  });
});
