import { fileURLToPath } from 'node:url';
import type { dev } from 'astro';
import puppeteer, { type Browser, type BrowserContext, type Page } from 'puppeteer';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { CatalogClientContent, CatalogCollection } from '../types/partners';

let server: Awaited<ReturnType<typeof dev>>;
let browser: Browser;
let context: BrowserContext;
let page: Page;
let origin: string;
let errors: string[];

beforeAll(async () => {
  // Use Astro's Node API rather than the virtual module used by component tests.
  const { dev } = await import(import.meta.resolve('astro'));
  const vitestEnvironment = process.env.VITEST;
  vi.stubEnv('VITEST', undefined);
  try {
    server = await dev({
      root: fileURLToPath(new URL('../../', import.meta.url)),
      logLevel: 'error',
      server: { host: '127.0.0.1', port: 0, open: false },
      devToolbar: { enabled: false },
    });
  } finally {
    vi.stubEnv('VITEST', vitestEnvironment);
  }
  origin = `http://127.0.0.1:${server.address.port}`;
  browser = await puppeteer.launch({
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
}, 60_000);

afterAll(async () => {
  try {
    await browser?.close();
  } finally {
    await server?.stop();
  }
}, 30_000);

beforeEach(async () => {
  errors = [];
  context = await browser.createBrowserContext();
  page = await context.newPage();
  page.on('pageerror', (error) => errors.push(String(error)));
  await page.setViewport({ width: 1440, height: 1000 });
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  // Test local journeys without contacting analytics, partners or booking services.
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    const url = new URL(request.url());
    void (url.origin === origin || ['data:', 'blob:'].includes(url.protocol) ? request.continue() : request.abort());
  });
});

afterEach(async () => {
  await context?.close();
  expect(errors, 'No browser runtime errors').toEqual([]);
});

async function openCatalog(route: string): Promise<CatalogClientContent> {
  await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-partners-catalog][data-enhanced="true"]');
  return page.$eval('[data-catalog-content]', (element) => JSON.parse(element.textContent ?? '{}'));
}

async function click(selector: string) {
  await page.$eval(selector, (element) =>
    element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' })
  );
  await page.locator(selector).click();
}

async function selectedCollection(): Promise<string | null> {
  return page.$eval('[data-catalog-tab][aria-selected="true"]', (element) => element.getAttribute('data-catalog-tab'));
}

async function visibleEntryIds(collection: CatalogCollection): Promise<string[]> {
  return page.$$eval(`[data-catalog-panel="${collection}"] [data-entry-id]`, (elements) =>
    elements
      .filter((element) => element.getBoundingClientRect().height > 0)
      .map((element) => element.getAttribute('data-entry-id') ?? '')
  );
}

async function waitForDetails(entryId: string) {
  await page.waitForSelector(`[data-entry-dialog][open] [data-entry-body="${entryId}"]`, { visible: true });
  expect(
    await page.$eval(
      '[data-entry-dialog]',
      (element) => element instanceof HTMLDialogElement && element.matches(':modal')
    )
  ).toBe(true);
}

async function waitForDetailsClosed() {
  await page.waitForFunction(() => !document.querySelector('[data-entry-dialog]')?.hasAttribute('open'));
}

describe.each([
  { locale: 'fr', route: '/partenaires', heading: 'Bien entourés. Toujours libres.', navigation: 'Partenaires' },
  { locale: 'en', route: '/en/partners', heading: 'In good company. Free to choose.', navigation: 'Partners' },
])('Partners catalog ($locale)', { timeout: 30_000 }, ({ locale, route, heading, navigation }) => {
  it('localizes the route and separates the real partner from the GitHub credential', async () => {
    const content = await openCatalog(route);
    expect(await page.$eval('html', (element) => element.lang)).toBe(locale);
    expect(await page.$eval('h1', (element) => element.innerText.trim().replace(/\s+/g, ' '))).toBe(heading);
    expect(
      await page.$eval('link[rel="canonical"]', (element) => new URL(element.getAttribute('href') ?? '').pathname)
    ).toBe(route);
    expect(
      await page.$eval(`#header nav a[href="${route}"] .text-heading`, (element) => element.textContent?.trim())
    ).toBe(navigation);
    expect(
      await page.$$eval('language-selector a[hreflang]', (links) =>
        Object.fromEntries(links.map((link) => [link.getAttribute('hreflang'), link.getAttribute('href')]))
      )
    ).toEqual({ fr: '/partenaires', en: '/en/partners' });
    expect(await visibleEntryIds('partners')).toEqual(['blackswift']);
    expect(await visibleEntryIds('credentials')).toEqual([]);
    await click('[data-catalog-tab="credentials"]');
    expect(await visibleEntryIds('partners')).toEqual([]);
    expect(await visibleEntryIds('credentials')).toEqual(['github-verified-creator']);
    expect(content.catalog.credentials.map(({ id, issuer }) => ({ id, issuer }))).toEqual([
      { id: 'github-verified-creator', issuer: 'GitHub' },
    ]);
    expect(
      await page.$eval('[data-entry-id="github-verified-creator"] .catalog-card-footer a', (element) =>
        element.getAttribute('href')
      )
    ).toBe(content.catalog.credentials[0].proofUrl);
    expect(await page.$eval('.partners-page', (element) => element.textContent)).not.toMatch(
      /GitHub Partner Program|partenaire officiel GitHub|official GitHub partner/i
    );
  });

  it('supports keyboard tabs and opens the requested collection from the hero', async () => {
    await openCatalog(route);
    const initialUrl = page.url();
    await page.focus('[data-catalog-tab="partners"]');
    for (const [key, collection] of [
      ['ArrowRight', 'credentials'],
      ['ArrowLeft', 'partners'],
      ['End', 'credentials'],
      ['Home', 'partners'],
    ] as const) {
      await page.keyboard.press(key);
      expect(await selectedCollection()).toBe(collection);
      expect(await page.evaluate(() => document.activeElement?.getAttribute('data-catalog-tab'))).toBe(collection);
      expect(
        await page.$eval(`[data-catalog-tab="${collection}"]`, (element) => element.getAttribute('tabindex'))
      ).toBe('0');
      expect(
        await page.$eval(`[data-catalog-panel="${collection}"]`, (element) => element.hasAttribute('hidden'))
      ).toBe(false);
    }
    expect(page.url()).toBe(initialUrl);
    await click('[data-browse="credentials"]');
    expect(await selectedCollection()).toBe('credentials');
    expect(await visibleEntryIds('credentials')).toEqual(['github-verified-creator']);
    await click('[data-browse="partners"]');
    expect(await selectedCollection()).toBe('partners');
  });

  it('uses a named native dialog and restores focus through Escape and browser history', async () => {
    const content = await openCatalog(route);
    const trigger = '[data-open-entry="blackswift"]';
    await page.focus(trigger);
    await page.keyboard.press('Enter');
    await waitForDetails('blackswift');
    expect(new URL(page.url()).hash).toBe('#fiche/blackswift');
    expect(
      await page.$eval('[data-entry-dialog]', (dialog) => {
        const heading = document.getElementById(dialog.getAttribute('aria-labelledby') ?? '');
        return heading && dialog.contains(heading) ? heading.textContent?.trim() : null;
      })
    ).toBe(content.catalog.partners[0].name);
    await page.keyboard.press('Escape');
    await waitForDetailsClosed();
    await page.waitForFunction(() => !location.hash.startsWith('#fiche/'));
    expect(await page.$eval(trigger, (element) => document.activeElement === element)).toBe(true);
    await click(trigger);
    await waitForDetails('blackswift');
    await page.evaluate(() => history.back());
    await waitForDetailsClosed();
    expect(new URL(page.url()).pathname).toBe(route);
    await page.evaluate(() => history.forward());
    await waitForDetails('blackswift');
    await click('[data-close-entry]');
    await waitForDetailsClosed();
    await page.waitForFunction(() => !location.hash.startsWith('#fiche/'));
    expect(await page.$eval(trigger, (element) => document.activeElement === element)).toBe(true);
  });

  it('restores a credential deep link on reload and closes it without leaving the page', async () => {
    await openCatalog(`${route}#fiche/github-verified-creator`);
    await waitForDetails('github-verified-creator');
    expect(await selectedCollection()).toBe('credentials');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-partners-catalog][data-enhanced="true"]');
    await waitForDetails('github-verified-creator');
    await page.keyboard.press('Escape');
    await waitForDetailsClosed();
    expect(new URL(page.url()).pathname).toBe(route);
    expect(new URL(page.url()).hash).toBe('#ecosystem-catalog');
    expect(
      await page.$eval('[data-open-entry="github-verified-creator"]', (element) => document.activeElement === element)
    ).toBe(true);
  });

  it('retains the selected collection across theme changes and fits a 320px screen', async () => {
    await openCatalog(route);
    await click('[data-catalog-tab="credentials"]');
    const initialDark = await page.$eval('html', (element) => element.classList.contains('dark'));
    const initialCardColor = await page.$eval(
      '[data-entry-id="github-verified-creator"]',
      (element) => getComputedStyle(element).color
    );
    await click('[data-aw-toggle-color-scheme]');
    await page.waitForFunction((dark) => document.documentElement.classList.contains('dark') !== dark, {}, initialDark);
    expect(await selectedCollection()).toBe('credentials');
    expect(
      await page.$eval('[data-entry-id="github-verified-creator"]', (element) => getComputedStyle(element).color)
    ).not.toBe(initialCardColor);
    await page.setViewport({ width: 320, height: 800 });
    for (const [collection, entry] of [
      ['partners', 'blackswift'],
      ['credentials', 'github-verified-creator'],
    ] as const) {
      await click(`[data-catalog-tab="${collection}"]`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
      await click(`[data-open-entry="${entry}"]`);
      await waitForDetails(entry);
      expect(
        await page.$eval('[data-entry-dialog]', (dialog) => {
          const bounds = dialog.getBoundingClientRect();
          return bounds.left >= 0 && bounds.right <= innerWidth + 1 && dialog.scrollWidth <= dialog.clientWidth + 1;
        })
      ).toBe(true);
      await page.keyboard.press('Escape');
      await waitForDetailsClosed();
      await page.waitForFunction(() => !location.hash.startsWith('#fiche/'));
    }
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-partners-catalog][data-enhanced="true"]');
    expect(await page.$eval('html', (element) => element.classList.contains('dark'))).toBe(!initialDark);
  });

  it('keeps both collections, native details and evidence links usable without JavaScript', async () => {
    await page.setJavaScriptEnabled(false);
    await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
    expect(await visibleEntryIds('partners')).toEqual(['blackswift']);
    expect(await visibleEntryIds('credentials')).toEqual(['github-verified-creator']);
    expect(await page.$eval('[data-catalog-controls]', (element) => element.hasAttribute('hidden'))).toBe(true);
    for (const entry of ['blackswift', 'github-verified-creator']) {
      const details = `[data-inline-details="${entry}"]`;
      // Locator stability checks wait for animation frames, which are disabled with page scripts.
      await page.click(`${details} summary`);
      expect(await page.$eval(details, (element) => element instanceof HTMLDetailsElement && element.open)).toBe(true);
      expect(
        await page.$eval(`${details} [data-entry-body]`, (element) => element.getBoundingClientRect().height > 0)
      ).toBe(true);
      expect(
        await page.$eval(`[data-entry-id="${entry}"] .catalog-card-footer a`, (element) => {
          const href = element.getAttribute('href') ?? '';
          return href.startsWith('https://') && element.getBoundingClientRect().height > 0;
        })
      ).toBe(true);
    }
  });
});

it('reinitializes the catalog after Astro navigation and return', async () => {
  await openCatalog('/en/partners');
  await page.evaluate(() => Object.assign(window, { partnersNavigationCheck: true }));
  await page.setViewport({ width: 1024, height: 1000 });
  await click('[data-aw-toggle-menu]');
  await click('#header nav li ul a[href^="/en/offers"]');
  await page.waitForFunction(() => location.pathname.startsWith('/en/offers'));
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-astro-transition'));
  await page.evaluate(() => history.back());
  await page.waitForSelector('[data-partners-catalog][data-enhanced="true"]');
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-astro-transition'));
  expect(await page.evaluate(() => Reflect.get(window, 'partnersNavigationCheck'))).toBe(true);
  await click('[data-catalog-tab="credentials"]');
  expect(await visibleEntryIds('credentials')).toEqual(['github-verified-creator']);
  await click('[data-open-entry="github-verified-creator"]');
  await waitForDetails('github-verified-creator');
  await page.keyboard.press('Escape');
  await waitForDetailsClosed();
  expect(
    await page.$eval('[data-open-entry="github-verified-creator"]', (element) => document.activeElement === element)
  ).toBe(true);
}, 30_000);
