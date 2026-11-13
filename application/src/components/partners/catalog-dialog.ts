import { navigate } from 'astro:transitions/client';
import type { CatalogCollection } from '~/types/partners';

interface DialogEntry {
  collection: CatalogCollection;
  body: HTMLElement;
  trigger: HTMLButtonElement;
}

interface CatalogDialogOptions {
  root: HTMLElement;
  dialog: HTMLDialogElement;
  content: HTMLElement;
  closeButton: HTMLButtonElement;
  entries: Map<string, DialogEntry>;
  signal: AbortSignal;
  revealEntry: (id: string, collection: CatalogCollection) => void;
  refreshStatuses: () => void;
  fallbackFocus: () => HTMLElement;
}

interface CatalogHistoryEntry {
  rootId: string;
  entryId: string;
  returnUrl: string;
}

function historyObject(): Record<string, unknown> {
  return history.state && typeof history.state === 'object' ? { ...history.state } : {};
}

function entryFromHash(): string | null {
  if (!location.hash.startsWith('#fiche/')) return null;
  try {
    return decodeURIComponent(location.hash.slice('#fiche/'.length));
  } catch {
    return null;
  }
}

/** Clone server-rendered details without duplicating document IDs or local references. */
function cloneDetails(body: HTMLElement, entryId: string): { body: HTMLElement; heading: HTMLHeadingElement } {
  const clone = body.cloneNode(true) as HTMLElement;
  const ids = new Map<string, string>();
  [clone, ...clone.querySelectorAll<HTMLElement>('[id]')].forEach((node) => {
    if (!node.id) return;
    const previous = node.id;
    node.id = `dialog-${entryId}-${previous}`;
    ids.set(previous, node.id);
  });
  clone.querySelectorAll<HTMLElement>('*').forEach((node) => {
    for (const attribute of ['aria-labelledby', 'aria-describedby', 'aria-controls', 'for']) {
      const value = node.getAttribute(attribute);
      if (value)
        node.setAttribute(
          attribute,
          value
            .split(/\s+/)
            .map((id) => ids.get(id) ?? id)
            .join(' ')
        );
    }
    for (const attribute of ['href', 'xlink:href']) {
      const value = node.getAttribute(attribute);
      if (value?.startsWith('#') && ids.has(value.slice(1)))
        node.setAttribute(attribute, `#${ids.get(value.slice(1))}`);
    }
  });
  const heading = clone.querySelector<HTMLHeadingElement>('h2');
  if (!heading) throw new Error(`Catalogue entry ${entryId} is missing its detail heading.`);
  heading.tabIndex = -1;
  return { body: clone, heading };
}

/** Native dialog behavior and browser history stay separate from catalogue discovery. */
export function initializeCatalogDialog(options: CatalogDialogOptions) {
  const { root, dialog, content, closeButton, entries, signal } = options;
  let activeId: string | null = null;
  let returnFocus: HTMLElement | null = null;
  let ignoredCloseEvents = 0;
  let disposed = false;

  function restoreFocus(): void {
    const target =
      returnFocus?.isConnected && returnFocus.getClientRects().length ? returnFocus : options.fallbackFocus();
    target.focus({ preventScroll: true });
    returnFocus = null;
  }

  function presentEntry(id: string, trigger?: HTMLElement): void {
    const entry = entries.get(id);
    if (!entry || (activeId === id && dialog.open)) return;
    options.revealEntry(id, entry.collection);
    options.refreshStatuses();
    const detail = cloneDetails(entry.body, id);
    content.replaceChildren(detail.body);
    dialog.setAttribute('aria-labelledby', detail.heading.id);
    returnFocus = trigger ?? entry.trigger;
    activeId = id;
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    detail.heading.focus({ preventScroll: true });
  }

  function synchronizeLocation(): void {
    const id = entryFromHash();
    if (id && entries.has(id)) {
      presentEntry(id);
    } else if (dialog.open) {
      activeId = null;
      ignoredCloseEvents += 1;
      dialog.close();
      restoreFocus();
    }
  }

  async function openEntry(id: string, trigger?: HTMLElement): Promise<void> {
    if (!entries.has(id)) return;
    if (entryFromHash() !== id) {
      const entry: CatalogHistoryEntry = { rootId: root.id, entryId: id, returnUrl: location.href };
      const url = new URL(location.href);
      url.hash = `fiche/${encodeURIComponent(id)}`;
      // Let Astro update its history index and previous URL alongside our detail state.
      await navigate(url.href, { history: 'push', state: { ...historyObject(), partnersCatalog: entry } });
    }
    if (!signal.aborted && entryFromHash() === id) presentEntry(id, trigger);
  }

  dialog.addEventListener(
    'close',
    async () => {
      if (disposed) return;
      if (ignoredCloseEvents > 0) {
        ignoredCloseEvents -= 1;
        return;
      }
      const previousId = activeId;
      activeId = null;
      const state = historyObject();
      const entry = state.partnersCatalog as CatalogHistoryEntry | undefined;
      if (entry?.rootId === root.id && entry.entryId === previousId && typeof entry.returnUrl === 'string') {
        history.back();
      } else if (entryFromHash() === previousId) {
        const url = new URL(location.href);
        url.hash = root.id;
        delete state.partnersCatalog;
        await navigate(url.href, { history: 'replace', state });
      }
      if (!signal.aborted) restoreFocus();
    },
    { signal }
  );

  closeButton.addEventListener('click', () => dialog.close(), { signal });
  dialog.addEventListener(
    'click',
    (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        dialog.close();
      }
    },
    { signal }
  );
  window.addEventListener('popstate', synchronizeLocation, { signal });
  window.addEventListener('hashchange', synchronizeLocation, { signal });
  signal.addEventListener(
    'abort',
    () => {
      disposed = true;
      if (dialog.open) dialog.close();
    },
    { once: true }
  );

  return { openEntry, synchronizeLocation };
}
