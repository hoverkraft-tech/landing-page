import { describe, expect, it, vi } from 'vitest';
import type { SupportedLanguage } from '~/i18n/ui';
import type { CatalogEntry, PartnersPageContent } from '~/types/partners';
import { getPartnersContent } from './partners';

vi.mock('astrowind:config', async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  I18N: { language: 'fr' },
}));

vi.mock('~/i18n/path-translations', () => ({
  BLOG_TRANSLATION_KEY_BY_PATH: {},
  BLOG_TRANSLATIONS_BY_KEY: {},
}));

const locales: SupportedLanguage[] = ['fr', 'en'];
const contentByLocale = locales.map(getPartnersContent);

const objectShape = (value: unknown): unknown => {
  if (Array.isArray(value)) return value.map(objectShape);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, objectShape(child)]));
  }
  return typeof value;
};

const entriesOf = ({ catalog }: PartnersPageContent): CatalogEntry[] => [...catalog.partners, ...catalog.credentials];

const factsOf = (content: PartnersPageContent) => ({
  categories: content.catalog.categories.map(({ id }) => id),
  entries: entriesOf(content).map(({ summary: _summary, details, ...entry }) => {
    const facts = entry.type === 'partner' ? { ...entry, tags: undefined } : entry;
    return { ...facts, resources: details.resources?.map(({ href }) => href) };
  }),
});

const expectHttpsUrl = (href: string) => {
  const url = new URL(href);
  expect(url.protocol).toBe('https:');
  expect(url.hostname).not.toBe('');
  expect(url.username).toBe('');
  expect(url.password).toBe('');
};

const tokensOf = (label: string) => [...label.matchAll(/\{([a-z]+)\}/g)].map((match) => match[1]).sort();

describe('partners content', () => {
  it('keeps every content field and catalogue fact synchronized between locales', () => {
    const [fr, en] = contentByLocale;

    expect(objectShape(fr)).toEqual(objectShape(en));
    expect(factsOf(fr)).toEqual(factsOf(en));
    expect(fr.lang).toBe('fr');
    expect(en.lang).toBe('en');
    expect(fr.hero.title).not.toBe(en.hero.title);
    entriesOf(fr).forEach((entry) => {
      const translation = entriesOf(en).find(({ id }) => id === entry.id);
      expect(entry.summary).not.toBe(translation?.summary);
    });
  });

  it.each(locales)('keeps GitHub solely as the issuer of an organization accreditation in %s', (lang) => {
    const { catalog } = getPartnersContent(lang);
    const github = catalog.credentials.find(({ id }) => id === 'github-verified-creator');

    expect(catalog.partners.some(({ name, id }) => /github/i.test(`${name} ${id}`))).toBe(false);
    expect(github).toMatchObject({
      type: 'credential',
      kind: 'accreditation',
      issuer: 'GitHub',
      holder: { scope: 'organization', name: 'Hoverkraft' },
      proofUrl: 'https://github.com/marketplace/actions/docker-compose-action',
    });
    expect(github).not.toHaveProperty('partnerId');
    expect(github).not.toHaveProperty('issuedAt');
    expect(github).not.toHaveProperty('expiresAt');
    expect(JSON.stringify(getPartnersContent(lang))).not.toMatch(
      /GitHub Partner Program|partenaire officiel(?:le)? GitHub|official GitHub partner|certified GitHub partner/i
    );
  });

  it.each(locales)('provides distinct identities, referenced categories and direct evidence in %s', (lang) => {
    const content = getPartnersContent(lang);
    const entries = entriesOf(content);
    const ids = entries.map(({ id }) => id);
    const categoryIds = content.catalog.categories.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(categoryIds).size).toBe(categoryIds.length);
    content.catalog.partners.forEach((partner) => {
      expect(partner.categoryIds.length).toBeGreaterThan(0);
      partner.categoryIds.forEach((id) => expect(categoryIds).toContain(id));
      expectHttpsUrl(partner.website);
    });
    content.catalog.credentials.forEach((credential) => {
      expect(credential.issuer.trim()).not.toBe('');
      expect(credential.holder.name.trim()).not.toBe('');
      expect(['organization', 'individual']).toContain(credential.holder.scope);
      expectHttpsUrl(credential.proofUrl);
      if (credential.partnerId) {
        expect(content.catalog.partners.some(({ id }) => id === credential.partnerId)).toBe(true);
      }
    });
    entries.forEach((entry) => {
      expect(entry.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(entry.name.trim()).not.toBe('');
      expect(entry.summary.trim()).not.toBe('');
      expect(entry.details.paragraphs.length).toBeGreaterThan(0);
      entry.details.resources?.forEach(({ label, href }) => {
        expect(label.trim()).not.toBe('');
        expectHttpsUrl(href);
      });
    });
  });

  it.each(locales)('keeps BlackSwift as a managed hosting partner with an imported logo in %s', (lang) => {
    const { catalog } = getPartnersContent(lang);
    const blackswift = catalog.partners.find(({ id }) => id === 'blackswift');

    expect(blackswift).toMatchObject({
      type: 'partner',
      website: 'https://www.blackswift.fr/kontainers/',
      categoryIds: expect.arrayContaining(['hosting']),
      logo: { alt: 'BlackSwift' },
    });
    expect(blackswift?.logo?.src).toBeTruthy();
    expect(JSON.parse(JSON.stringify(blackswift?.logo)).src).toMatchObject({
      src: expect.any(String),
      width: expect.any(Number),
      height: expect.any(Number),
      format: 'svg',
    });
    expect(JSON.stringify(blackswift?.logo)).not.toContain('<svg');
    expect(blackswift?.details.resources?.map(({ href }) => href)).toContain('https://docs.blackswift.cloud/');
  });

  it.each([
    ['fr', '/contact#booking', '/methodologie'],
    ['en', '/en/contact#booking', '/en/methodology'],
  ] as const)('uses translated routes and the catalogue anchor in %s', (lang, contactHref, methodologyHref) => {
    const content = getPartnersContent(lang);

    expect(content.hero.primaryAction.href).toBe('#ecosystem-catalog');
    expect(content.freedom.action.href).toBe(methodologyHref);
    for (const action of [content.hero.secondaryAction, content.cta.primaryAction, content.cta.alternateAction]) {
      expect(action.text.trim()).not.toBe('');
      expect(action.href).toBe(contactHref);
    }
  });

  it.each(locales)('preserves the interpolation contract for adaptive catalogue controls in %s', (lang) => {
    const { labels } = getPartnersContent(lang);

    expect(tokensOf(labels.count)).toEqual(['count', 'label']);
    expect(tokensOf(labels.partialCount)).toEqual(['label', 'shown', 'total']);
    expect(tokensOf(labels.showMore)).toEqual(['count']);
    expect(tokensOf(labels.viewDetailsFor)).toEqual(['name']);
    expect(tokensOf(labels.validUntil)).toEqual(['date']);
    expect(Object.keys(labels.kinds).sort()).toEqual(['accreditation', 'certification', 'label']);
    expect(Object.keys(labels.scopes).sort()).toEqual(['individual', 'organization']);
  });
});
