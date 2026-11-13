import { describe, expect, it } from 'vitest';
import type { CatalogLabels, CredentialEntry, PartnerEntry, PartnersCatalog } from '~/types/partners';
import {
  filterCatalogEntries,
  formatCatalogDate,
  formatCatalogLabel,
  getCatalogCategories,
  getCredentialStatus,
  getTodayInParis,
  paginateCatalogEntries,
  validatePartnersCatalog,
} from './catalog';

const labels: Pick<CatalogLabels, 'kinds' | 'scopes'> = {
  kinds: { accreditation: 'Accréditation', certification: 'Certification', label: 'Label' },
  scopes: { organization: 'Organisation', individual: 'Individu' },
};

const partner = (id: string, overrides: Partial<PartnerEntry> = {}): PartnerEntry => ({
  type: 'partner',
  id,
  name: `Partner ${id}`,
  summary: 'Managed Kubernetes hosting in France.',
  icon: 'tabler:cloud',
  website: 'https://example.com',
  categoryIds: ['hosting'],
  tags: ['Kubernetes'],
  details: { paragraphs: ['Infrastructure adapted to the project context.'] },
  ...overrides,
});

const credential = (overrides: Partial<CredentialEntry> = {}): CredentialEntry => ({
  type: 'credential',
  id: 'verified-publisher',
  name: 'Verified publisher',
  summary: 'Verification applies to the creator.',
  icon: 'tabler:rosette-discount-check',
  kind: 'accreditation',
  issuer: 'Registry',
  holder: { name: 'Example company', scope: 'organization' },
  proofUrl: 'https://example.com/proof',
  details: { paragraphs: ['A verifiable identity.'] },
  ...overrides,
});

const catalog = (partners: PartnerEntry[] = [], credentials: CredentialEntry[] = []): PartnersCatalog => ({
  categories: [
    { id: 'hosting', label: 'Cloud & hébergement' },
    { id: 'delivery', label: 'Automatisation du delivery' },
    { id: 'unused', label: 'Unused category' },
  ],
  partners,
  credentials,
});

describe('catalogue discovery', () => {
  it('handles empty collections without inventing categories or records', () => {
    const data = catalog();
    expect(() => validatePartnersCatalog(data)).not.toThrow();
    expect(getCatalogCategories(data, 'partners', labels)).toEqual([]);
    expect(getCatalogCategories(data, 'credentials', labels)).toEqual([]);
    expect(
      paginateCatalogEntries(filterCatalogEntries(data, 'partners', { category: 'all', query: '' }, labels))
    ).toEqual({ entries: [], total: 0, hasMore: false });
  });

  it('keeps a single partner and its actual category visible', () => {
    const entry = partner('one');
    const data = catalog([entry]);
    expect(getCatalogCategories(data, 'partners', labels)).toEqual([{ id: 'hosting', label: 'Cloud & hébergement' }]);
    expect(
      paginateCatalogEntries(filterCatalogEntries(data, 'partners', { category: 'all', query: '' }, labels))
    ).toEqual({ entries: [entry], total: 1, hasMore: false });
  });

  it('progressively reveals 40 entries in editorial order without modifying source content', () => {
    const entries = Array.from({ length: 40 }, (_, index) => partner(`partner-${index + 1}`));
    const data = catalog(entries);
    const matches = filterCatalogEntries(data, 'partners', { category: 'all', query: '' }, labels);
    expect(paginateCatalogEntries(matches).entries.map(({ id }) => id)).toEqual(
      entries.slice(0, 6).map(({ id }) => id)
    );
    expect(paginateCatalogEntries(matches, 12)).toEqual({ entries: entries.slice(0, 12), total: 40, hasMore: true });
    expect(paginateCatalogEntries(matches, 42)).toEqual({ entries, total: 40, hasMore: false });
    expect(data.partners).toHaveLength(40);
  });

  it('combines categories and accent-insensitive, case-insensitive search terms', () => {
    const data = catalog([
      partner('cloud', { summary: 'Hébergement Kubernetes en France.' }),
      partner('automation', {
        categoryIds: ['delivery'],
        summary: 'Tools for delivery.',
        tags: ['Open source'],
      }),
    ]);
    const search = { category: 'hosting', query: '  HEBERGEMENT   kubernetes  ' };
    expect(filterCatalogEntries(data, 'partners', search, labels).map(({ id }) => id)).toEqual(['cloud']);
    expect(filterCatalogEntries(data, 'partners', { ...search, category: 'delivery' }, labels)).toEqual([]);
    expect(filterCatalogEntries(data, 'partners', { category: 'delivery', query: 'open source' }, labels)).toEqual([
      data.partners[1],
    ]);
  });

  it('searches credential issuers, holders and localized kinds without treating them as partners', () => {
    const data = catalog([], [credential()]);
    expect(getCatalogCategories(data, 'credentials', labels)).toEqual([
      { id: 'accreditation', label: 'Accréditation' },
    ]);
    expect(
      filterCatalogEntries(data, 'credentials', { category: 'all', query: 'registry accreditation example' }, labels)
    ).toEqual(data.credentials);
    expect(filterCatalogEntries(data, 'credentials', { category: 'certification', query: '' }, labels)).toEqual([]);
    expect(data.partners).toEqual([]);
  });
});

describe('credential dates and localized presentation', () => {
  it.each([
    [{}, null],
    [{ issuedAt: '2026-01-01' }, null],
    [{ issuedAt: '2026-11-14' }, 'upcoming'],
    [{ expiresAt: '2026-11-12' }, 'expired'],
    [{ expiresAt: '2026-11-13' }, null],
    [{ expiresAt: '2026-11-14' }, null],
  ] as const)('evaluates %j against an injected day without claiming indefinite validity', (dates, expected) => {
    expect(getCredentialStatus(dates, '2026-11-13')).toBe(expected);
  });

  it('uses the Paris calendar date around UTC midnight and daylight saving time', () => {
    expect(getTodayInParis(new Date('2026-11-13T23:30:00Z'))).toBe('2026-11-14');
    expect(getTodayInParis(new Date('2026-07-01T22:30:00Z'))).toBe('2026-07-02');
  });

  it('formats date-only values without timezone shifts in both locales', () => {
    expect(formatCatalogDate('2026-11-13', 'fr')).toBe('13 novembre 2026');
    expect(formatCatalogDate('2026-11-13', 'en')).toBe('November 13, 2026');
    expect(formatCatalogLabel('{shown} sur {total} {label}', { shown: 6, total: 40, label: 'partenaires' })).toBe(
      '6 sur 40 partenaires'
    );
  });
});

describe('catalogue content validation', () => {
  it('accepts a recognition independently of any commercial partnership', () => {
    expect(() => validatePartnersCatalog(catalog([], [credential()]))).not.toThrow();
  });

  it('rejects IDs reused across the two collections and unknown references', () => {
    expect(() => validatePartnersCatalog(catalog([partner('shared')], [credential({ id: 'shared' })]))).toThrow(
      'Duplicate catalogue entry ID'
    );
    expect(() => validatePartnersCatalog(catalog([partner('orphan', { categoryIds: ['missing'] })]))).toThrow(
      'unknown category'
    );
    expect(() => validatePartnersCatalog(catalog([], [credential({ partnerId: 'missing' })]))).toThrow(
      'unknown partner'
    );
  });

  it('rejects unsafe proof links and invalid date claims', () => {
    expect(() => validatePartnersCatalog(catalog([], [credential({ proofUrl: 'javascript:alert(1)' })]))).toThrow(
      'HTTPS URL'
    );
    expect(() =>
      validatePartnersCatalog(catalog([], [credential({ proofUrl: 'https://user:password@example.com/proof' })]))
    ).toThrow('HTTPS URL');
    expect(() => validatePartnersCatalog(catalog([], [credential({ expiresAt: '2026-02-30' })]))).toThrow('valid date');
    expect(() =>
      validatePartnersCatalog(catalog([], [credential({ issuedAt: '2026-12-01', expiresAt: '2026-11-01' })]))
    ).toThrow('expires before');
  });
});
