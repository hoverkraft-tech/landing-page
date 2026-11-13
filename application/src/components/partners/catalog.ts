import type { SupportedLanguage } from '~/i18n/ui';
import type {
  CatalogCategory,
  CatalogCollection,
  CatalogEntry,
  CatalogLabels,
  CredentialEntry,
  CredentialKind,
  PartnersCatalog,
} from '~/types/partners';

export const CATALOG_COLLECTIONS = ['partners', 'credentials'] as const;
export const CATALOG_PAGE_SIZE = 6;
const CREDENTIAL_KINDS: CredentialKind[] = ['accreditation', 'certification', 'label'];
const ID_PATTERN = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

export interface CatalogFilter {
  category: string;
  query: string;
}

export interface CatalogPage {
  entries: CatalogEntry[];
  total: number;
  hasMore: boolean;
}

type SearchLabels = Pick<CatalogLabels, 'kinds' | 'scopes'>;
export type CredentialStatus = 'expired' | 'upcoming' | null;

/** Normalize accents and case consistently for the two supported locales. */
export function normalizeCatalogText(value: string): string {
  return value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();
}

export function getCatalogCategories(
  catalog: PartnersCatalog,
  collection: CatalogCollection,
  labels: Pick<CatalogLabels, 'kinds'>
): CatalogCategory[] {
  if (collection === 'partners') {
    const used = new Set(catalog.partners.flatMap((entry) => entry.categoryIds));
    return catalog.categories.filter((category) => used.has(category.id));
  }
  const used = new Set(catalog.credentials.map((entry) => entry.kind));
  return CREDENTIAL_KINDS.filter((kind) => used.has(kind)).map((id) => ({ id, label: labels.kinds[id] }));
}

function entrySearchText(entry: CatalogEntry, categories: Map<string, string>, labels: SearchLabels): string {
  const specific =
    entry.type === 'partner'
      ? [...entry.categoryIds.map((id) => categories.get(id) ?? ''), ...(entry.tags ?? [])]
      : [entry.issuer, entry.holder.name, labels.kinds[entry.kind], labels.scopes[entry.holder.scope]];
  return normalizeCatalogText([entry.name, entry.summary, ...specific, ...(entry.details.bullets ?? [])].join(' '));
}

/** Combine category and every search term while preserving editorial order. */
export function filterCatalogEntries(
  catalog: PartnersCatalog,
  collection: CatalogCollection,
  filter: CatalogFilter,
  labels: SearchLabels
): CatalogEntry[] {
  const categories = new Map(catalog.categories.map((category) => [category.id, category.label]));
  const terms = normalizeCatalogText(filter.query).trim().split(/\s+/).filter(Boolean);
  return catalog[collection].filter((entry) => {
    const categoryMatches =
      filter.category === 'all' ||
      (entry.type === 'partner' ? entry.categoryIds.includes(filter.category) : entry.kind === filter.category);
    if (!categoryMatches) return false;
    const text = entrySearchText(entry, categories, labels);
    return terms.every((term) => text.includes(term));
  });
}

export function paginateCatalogEntries(entries: CatalogEntry[], limit = CATALOG_PAGE_SIZE): CatalogPage {
  if (!Number.isSafeInteger(limit) || limit < 1)
    throw new RangeError('Catalogue page limit must be a positive integer.');
  return { entries: entries.slice(0, limit), total: entries.length, hasMore: entries.length > limit };
}

/** Date-only strings are compared inclusively: a credential expires after its final valid day. */
export function getCredentialStatus(
  entry: Pick<CredentialEntry, 'issuedAt' | 'expiresAt'>,
  today: string
): CredentialStatus {
  if (entry.issuedAt && entry.issuedAt > today) return 'upcoming';
  if (entry.expiresAt && entry.expiresAt < today) return 'expired';
  return null;
}

export function getTodayInParis(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function formatCatalogDate(value: string, lang: SupportedLanguage): string {
  return new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`));
}

/** Keep translations in content; substitute only the explicit template parameters. */
export function formatCatalogLabel(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (token, key: string) =>
    Object.hasOwn(values, key) ? String(values[key]) : token
  );
}

function requireText(value: unknown, path: string): asserts value is string {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${path} must contain text.`);
}

function requireId(value: unknown, path: string): asserts value is string {
  requireText(value, path);
  if (!ID_PATTERN.test(value)) throw new TypeError(`${path} must be a stable lowercase identifier.`);
}

function requireDate(value: string | undefined, path: string): void {
  if (value === undefined) return;
  const date = new Date(`${value}T00:00:00Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    throw new TypeError(`${path} must be a valid date in YYYY-MM-DD format.`);
  }
}

function requireUrl(value: unknown, path: string, internalAllowed = false): void {
  requireText(value, path);
  if (internalAllowed && /^\/(?!\/)/.test(value)) return;
  try {
    const url = new URL(value);
    if (url.protocol === 'https:' && !url.username && !url.password) return;
  } catch {
    // The field-specific error below also covers malformed absolute URLs.
  }
  throw new TypeError(`${path} must be an HTTPS URL${internalAllowed ? ' or a root-relative path' : ''}.`);
}

function validateEntry(entry: CatalogEntry, path: string, ids: Set<string>): void {
  requireId(entry.id, `${path}.id`);
  if (ids.has(entry.id)) throw new TypeError(`Duplicate catalogue entry ID: ${entry.id}.`);
  ids.add(entry.id);
  for (const field of ['name', 'summary', 'icon'] as const) requireText(entry[field], `${path}.${field}`);
  if (!Array.isArray(entry.details?.paragraphs)) throw new TypeError(`${path}.details.paragraphs must be an array.`);
  entry.details.paragraphs.forEach((value, index) => requireText(value, `${path}.details.paragraphs[${index}]`));
  entry.details.bullets?.forEach((value, index) => requireText(value, `${path}.details.bullets[${index}]`));
  entry.details.responsibilities?.forEach((role, index) => {
    requireText(role.name, `${path}.details.responsibilities[${index}].name`);
    requireText(role.description, `${path}.details.responsibilities[${index}].description`);
  });
  entry.details.resources?.forEach((resource, index) => {
    requireText(resource.label, `${path}.details.resources[${index}].label`);
    requireUrl(resource.href, `${path}.details.resources[${index}].href`, true);
  });
}

/** Fail at the content boundary before generating public cards and their client payload. */
export function validatePartnersCatalog(catalog: PartnersCatalog): void {
  for (const field of ['categories', ...CATALOG_COLLECTIONS] as const) {
    if (!Array.isArray(catalog?.[field])) throw new TypeError(`catalog.${field} must be an array.`);
  }
  const categories = new Set<string>();
  catalog.categories.forEach((category) => {
    requireId(category.id, 'category.id');
    requireText(category.label, `category.${category.id}.label`);
    if (category.id === 'all' || categories.has(category.id))
      throw new TypeError(`Invalid or duplicate category: ${category.id}.`);
    categories.add(category.id);
  });
  const ids = new Set<string>();
  catalog.partners.forEach((entry) => {
    validateEntry(entry, `partner.${entry.id}`, ids);
    if (entry.type !== 'partner') throw new TypeError(`${entry.id} must be a partner.`);
    requireUrl(entry.website, `${entry.id}.website`);
    if (!Array.isArray(entry.categoryIds) || !entry.categoryIds.length)
      throw new TypeError(`${entry.id} needs a category.`);
    if (new Set(entry.categoryIds).size !== entry.categoryIds.length)
      throw new TypeError(`${entry.id} repeats a category.`);
    entry.categoryIds.forEach((id) => {
      if (!categories.has(id)) throw new TypeError(`${entry.id} references unknown category: ${id}.`);
    });
    entry.tags?.forEach((tag, index) => requireText(tag, `${entry.id}.tags[${index}]`));
  });
  const partnerIds = new Set(catalog.partners.map((entry) => entry.id));
  catalog.credentials.forEach((entry) => {
    validateEntry(entry, `credential.${entry.id}`, ids);
    if (entry.type !== 'credential' || !CREDENTIAL_KINDS.includes(entry.kind))
      throw new TypeError(`${entry.id} has an invalid credential kind.`);
    requireText(entry.issuer, `${entry.id}.issuer`);
    requireText(entry.holder?.name, `${entry.id}.holder.name`);
    if (!['organization', 'individual'].includes(entry.holder.scope))
      throw new TypeError(`${entry.id} has an invalid holder scope.`);
    requireUrl(entry.proofUrl, `${entry.id}.proofUrl`);
    requireDate(entry.issuedAt, `${entry.id}.issuedAt`);
    requireDate(entry.expiresAt, `${entry.id}.expiresAt`);
    if (entry.issuedAt && entry.expiresAt && entry.expiresAt < entry.issuedAt)
      throw new TypeError(`${entry.id} expires before it was issued.`);
    if (entry.partnerId && !partnerIds.has(entry.partnerId))
      throw new TypeError(`${entry.id} references unknown partner: ${entry.partnerId}.`);
  });
}
