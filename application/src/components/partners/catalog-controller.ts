import type { CatalogClientContent, CatalogCollection } from '~/types/partners';
import {
  CATALOG_COLLECTIONS,
  CATALOG_PAGE_SIZE,
  filterCatalogEntries,
  formatCatalogLabel,
  getCatalogCategories,
  getCredentialStatus,
  getTodayInParis,
  paginateCatalogEntries,
  validatePartnersCatalog,
} from './catalog';
import { initializeCatalogDialog } from './catalog-dialog';

interface CollectionState {
  category: string;
  query: string;
  limit: number;
  searchOpen: boolean;
}

const initialized = new WeakMap<HTMLElement, AbortController>();

function requireElement<T extends Element>(root: ParentNode, selector: string): T {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Catalogue markup is missing ${selector}.`);
  return element;
}

function isCollection(value: string | undefined): value is CatalogCollection {
  return CATALOG_COLLECTIONS.some((collection) => collection === value);
}

function readContent(root: HTMLElement): CatalogClientContent {
  const payload = requireElement<HTMLScriptElement>(root, '[data-catalog-content]');
  const content = JSON.parse(payload.textContent ?? '') as CatalogClientContent;
  validatePartnersCatalog(content.catalog);
  if (!['fr', 'en'].includes(content.lang) || !content.labels)
    throw new TypeError('Invalid catalogue locale or labels.');
  return content;
}

function enhanceCatalog(root: HTMLElement): void {
  const { catalog, labels } = readContent(root);
  const controls = requireElement<HTMLElement>(root, '[data-catalog-controls]');
  const filters = requireElement<HTMLElement>(root, '[data-category-filters]');
  const categorySelect = requireElement<HTMLSelectElement>(root, '[data-category-select]');
  const categorySelectLabel = requireElement<HTMLElement>(root, '[data-category-select-label]');
  const searchToggle = requireElement<HTMLButtonElement>(root, '[data-search-toggle]');
  const searchArea = requireElement<HTMLElement>(root, '[data-search-area]');
  const searchInput = requireElement<HTMLInputElement>(root, '[data-catalog-search]');
  const clearSearch = requireElement<HTMLButtonElement>(root, '[data-clear-search]');
  const resultCount = requireElement<HTMLElement>(root, '[data-result-count]');
  const context = requireElement<HTMLElement>(root, '[data-catalog-context]');
  const empty = requireElement<HTMLElement>(root, '[data-catalog-empty]');
  const emptyTitle = requireElement<HTMLElement>(empty, 'h3');
  const emptyDescription = requireElement<HTMLElement>(empty, 'p');
  const reset = requireElement<HTMLButtonElement>(empty, '[data-reset-catalog]');
  const more = requireElement<HTMLButtonElement>(root, '[data-show-more]');
  const dialog = requireElement<HTMLDialogElement>(root, '[data-entry-dialog]');
  if (typeof dialog.showModal !== 'function') return;
  const dialogContent = requireElement<HTMLElement>(dialog, '[data-entry-dialog-content]');
  const closeButton = requireElement<HTMLButtonElement>(dialog, '[data-close-entry]');
  const tabs = new Map(
    CATALOG_COLLECTIONS.map((collection) => [
      collection,
      requireElement<HTMLButtonElement>(root, `[data-catalog-tab="${collection}"]`),
    ])
  );
  const panels = new Map(
    CATALOG_COLLECTIONS.map((collection) => [
      collection,
      requireElement<HTMLElement>(root, `[data-catalog-panel="${collection}"]`),
    ])
  );
  const grids = new Map(
    CATALOG_COLLECTIONS.map((collection) => [
      collection,
      requireElement<HTMLElement>(root, `[data-catalog-grid="${collection}"]`),
    ])
  );
  const cards = new Map(
    [...root.querySelectorAll<HTMLElement>('[data-entry-id]')].map((card) => [card.dataset.entryId!, card])
  );
  const entries = new Map(
    CATALOG_COLLECTIONS.flatMap((collection) =>
      catalog[collection].map((entry) => {
        const card = cards.get(entry.id);
        if (!card) throw new Error(`Catalogue card is missing for ${entry.id}.`);
        return [
          entry.id,
          {
            collection,
            body: requireElement<HTMLElement>(card, '[data-entry-body]'),
            trigger: requireElement<HTMLButtonElement>(card, '[data-open-entry]'),
          },
        ] as const;
      })
    )
  );
  const abort = new AbortController();
  const { signal } = abort;
  const states: Record<CatalogCollection, CollectionState> = {
    partners: {
      category: 'all',
      query: '',
      limit: CATALOG_PAGE_SIZE,
      searchOpen: catalog.partners.length > CATALOG_PAGE_SIZE,
    },
    credentials: {
      category: 'all',
      query: '',
      limit: CATALOG_PAGE_SIZE,
      searchOpen: catalog.credentials.length > CATALOG_PAGE_SIZE,
    },
  };
  let active: CatalogCollection =
    CATALOG_COLLECTIONS.find((collection) => location.hash === `#${panels.get(collection)!.id}`) ?? 'partners';
  const moreLabel = document.createElement('span');
  more.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) node.remove();
  });
  more.prepend(moreLabel);

  const matches = (collection = active) => filterCatalogEntries(catalog, collection, states[collection], labels);

  function refreshStatuses(): void {
    const today = getTodayInParis();
    for (const entry of catalog.credentials) {
      const status = getCredentialStatus(entry, today);
      root.querySelectorAll<HTMLElement>(`[data-credential-status="${entry.id}"]`).forEach((node) => {
        node.hidden = status === null;
        node.textContent = status ? labels[status] : '';
        if (status) node.dataset.status = status;
        else delete node.dataset.status;
      });
    }
  }

  function renderCategories(): void {
    const categories = getCatalogCategories(catalog, active, labels);
    const options = [{ id: 'all', label: labels.all }, ...categories];
    filters.replaceChildren(
      ...options.map(({ id, label }) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'catalog-filter-chip';
        button.dataset.category = id;
        button.textContent = label;
        button.setAttribute('aria-pressed', String(id === states[active].category));
        return button;
      })
    );
    filters.hidden = categories.length < 2 || categories.length > 5;
    categorySelect.replaceChildren(
      ...options.map(({ id, label }) => new Option(id === 'all' ? labels.allCategories : label, id))
    );
    categorySelect.value = states[active].category;
    categorySelectLabel.hidden = categories.length < 2;
    categorySelectLabel.classList.toggle('many-categories', categories.length > 5);
  }

  function renderResults(): void {
    const page = paginateCatalogEntries(matches(), states[active].limit);
    const visible = new Set(page.entries.map(({ id }) => id));
    for (const [id, card] of cards) card.hidden = !visible.has(id);
    for (const [collection, grid] of grids)
      grid.dataset.visibleCount = String(collection === active ? visible.size : 0);
    const label = labels.nouns[active][page.total === 1 ? 'one' : 'many'];
    resultCount.textContent = formatCatalogLabel(page.hasMore ? labels.partialCount : labels.count, {
      count: page.total,
      shown: page.entries.length,
      total: page.total,
      label,
    });
    const collectionEmpty = catalog[active].length === 0;
    empty.hidden = page.total > 0;
    emptyTitle.textContent = collectionEmpty ? labels.emptyTitle : labels.noResultsTitle;
    emptyDescription.textContent = collectionEmpty ? labels.emptyDescription : labels.noResultsDescription;
    reset.hidden = collectionEmpty;
    more.hidden = !page.hasMore;
    moreLabel.textContent = formatCatalogLabel(labels.showMore, {
      count: Math.min(CATALOG_PAGE_SIZE, page.total - page.entries.length),
      shown: page.entries.length,
      total: page.total,
      label,
    });
    clearSearch.hidden = !states[active].query;
  }

  function activateCollection(collection: CatalogCollection): void {
    active = collection;
    for (const [name, tab] of tabs) {
      tab.setAttribute('aria-selected', String(name === active));
      tab.tabIndex = name === active ? 0 : -1;
    }
    for (const [name, panel] of panels) {
      panel.hidden = name !== active;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tabs.get(name)!.id);
    }
    context.textContent = labels.context[active];
    searchInput.value = states[active].query;
    searchArea.hidden = !states[active].searchOpen;
    searchToggle.setAttribute('aria-expanded', String(states[active].searchOpen));
    renderCategories();
    renderResults();
  }

  function revealEntry(id: string, collection: CatalogCollection): void {
    let filtered = matches(collection);
    if (!filtered.some((entry) => entry.id === id)) {
      states[collection].category = 'all';
      states[collection].query = '';
      filtered = matches(collection);
    }
    const position = filtered.findIndex((entry) => entry.id === id);
    states[collection].limit = Math.max(
      states[collection].limit,
      Math.ceil((position + 1) / CATALOG_PAGE_SIZE) * CATALOG_PAGE_SIZE
    );
    activateCollection(collection);
  }

  const details = initializeCatalogDialog({
    root,
    dialog,
    content: dialogContent,
    closeButton,
    entries,
    signal,
    revealEntry,
    refreshStatuses,
    fallbackFocus: () => tabs.get(active)!,
  });

  for (const [collection, tab] of tabs) {
    tab.addEventListener('click', () => activateCollection(collection), { signal });
    tab.addEventListener(
      'keydown',
      (event) => {
        const index = CATALOG_COLLECTIONS.indexOf(collection);
        const next =
          event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? CATALOG_COLLECTIONS.length - 1
              : event.key === 'ArrowRight'
                ? (index + 1) % CATALOG_COLLECTIONS.length
                : event.key === 'ArrowLeft'
                  ? (index + CATALOG_COLLECTIONS.length - 1) % CATALOG_COLLECTIONS.length
                  : -1;
        if (next < 0) return;
        event.preventDefault();
        const target = CATALOG_COLLECTIONS[next];
        activateCollection(target);
        tabs.get(target)!.focus();
      },
      { signal }
    );
  }
  filters.addEventListener(
    'click',
    (event) => {
      const button = (event.target as Element).closest<HTMLButtonElement>('[data-category]');
      if (!button || !filters.contains(button)) return;
      states[active].category = button.dataset.category!;
      states[active].limit = CATALOG_PAGE_SIZE;
      renderCategories();
      renderResults();
      filters.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();
    },
    { signal }
  );
  categorySelect.addEventListener(
    'change',
    () => {
      states[active].category = categorySelect.value;
      states[active].limit = CATALOG_PAGE_SIZE;
      renderCategories();
      renderResults();
    },
    { signal }
  );
  searchToggle.addEventListener(
    'click',
    () => {
      states[active].searchOpen = !states[active].searchOpen;
      searchArea.hidden = !states[active].searchOpen;
      searchToggle.setAttribute('aria-expanded', String(states[active].searchOpen));
      if (states[active].searchOpen) searchInput.focus();
    },
    { signal }
  );
  searchInput.addEventListener(
    'input',
    () => {
      states[active].query = searchInput.value;
      states[active].limit = CATALOG_PAGE_SIZE;
      renderResults();
    },
    { signal }
  );
  clearSearch.addEventListener(
    'click',
    () => {
      states[active].query = '';
      states[active].limit = CATALOG_PAGE_SIZE;
      searchInput.value = '';
      renderResults();
      searchInput.focus();
    },
    { signal }
  );
  reset.addEventListener(
    'click',
    () => {
      states[active].category = 'all';
      states[active].query = '';
      states[active].limit = CATALOG_PAGE_SIZE;
      activateCollection(active);
      tabs.get(active)!.focus();
    },
    { signal }
  );
  more.addEventListener(
    'click',
    () => {
      const previous = states[active].limit;
      states[active].limit += CATALOG_PAGE_SIZE;
      renderResults();
      const next = matches()[previous];
      if (next) entries.get(next.id)?.trigger.focus();
    },
    { signal }
  );
  root.addEventListener(
    'click',
    (event) => {
      const button = (event.target as Element).closest<HTMLButtonElement>('[data-open-entry]');
      if (button && root.contains(button)) details.openEntry(button.dataset.openEntry!, button);
    },
    { signal }
  );
  document.querySelectorAll<HTMLAnchorElement>('[data-browse]').forEach((link) => {
    link.addEventListener(
      'click',
      (event) => {
        const collection = link.dataset.browse;
        if (!isCollection(collection) || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        activateCollection(collection);
        root.scrollIntoView({
          behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
          block: 'start',
        });
        tabs.get(collection)!.focus({ preventScroll: true });
      },
      { signal }
    );
  });
  document.addEventListener(
    'astro:before-swap',
    () => {
      abort.abort();
      initialized.delete(root);
    },
    { once: true, signal }
  );

  initialized.set(root, abort);
  activateCollection(active);
  refreshStatuses();
  for (const [id, entry] of entries) {
    entry.trigger.hidden = false;
    // Keep SSR fragment anchors for no-JS access, but let the enhanced dialog own these URLs.
    // Astro also performs native fragment navigation, which otherwise focuses the hidden inline body.
    if (entry.body.id === `fiche/${id}`) entry.body.id = `inline-entry-${id}`;
  }
  root.querySelectorAll<HTMLDetailsElement>('[data-inline-details]').forEach((detail) => {
    detail.hidden = true;
  });
  controls.hidden = false;
  root.dataset.enhanced = 'true';
  details.synchronizeLocation();
}

/** Called on first load and Astro navigation; each mounted catalogue owns its listeners. */
export function initializePartnersCatalog(): void {
  document.querySelectorAll<HTMLElement>('[data-partners-catalog]').forEach((root) => {
    if (initialized.has(root)) return;
    try {
      enhanceCatalog(root);
    } catch (error) {
      console.warn('Catalogue enhancement unavailable; server-rendered details remain available.', error);
    }
  });
}
