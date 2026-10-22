import { fileURLToPath } from 'node:url';
import type { dev } from 'astro';
import puppeteer, { type Browser, type BrowserContext, type Page } from 'puppeteer';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { PlatformWorkflowContent } from '../data/platform-workflow';

let server: Awaited<ReturnType<typeof dev>>;
let browser: Browser;
let context: BrowserContext;
let page: Page;
let origin: string;
let errors: string[];

beforeAll(async () => {
  // Resolve the Node API instead of Astro's virtual module used in component tests.
  const { dev } = await import(import.meta.resolve('astro'));
  // Astro disables page serving inside Vitest; enable it only while creating our server.
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
  // These journeys exercise local UI behavior without contacting analytics or providers.
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

async function openBuilder(route: string): Promise<PlatformWorkflowContent> {
  await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-platform-builder][data-enhanced="true"]');
  return page.$eval('[data-builder-content]', (element) => JSON.parse(element.textContent ?? '{}'));
}

async function click(selector: string) {
  await page.$eval(selector, (element) =>
    element.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' })
  );
  await page.locator(selector).click();
}

async function placedTechnologies() {
  return page.$$eval('[data-placed-technology]:not([hidden])', (elements) =>
    elements
      .map((element) => `${element.getAttribute('data-stage')}:${element.getAttribute('data-placed-technology')}`)
      .sort()
  );
}

describe.each([
  { locale: 'fr', route: '/platform-builder', heading: 'Concevez votre plateforme' },
  { locale: 'en', route: '/en/platform-builder', heading: 'Build your platform' },
])('Platform Builder ($locale)', { timeout: 30_000 }, ({ locale, route, heading }) => {
  it('uses the localized heading, canonical URL, navigation and language links', async () => {
    await openBuilder(route);
    expect(await page.$eval('html', (element) => element.lang)).toBe(locale);
    expect(await page.$eval('h1', (element) => element.textContent?.trim().replace(/\s+/g, ' '))).toBe(heading);
    expect(
      await page.$eval('link[rel="canonical"]', (element) => new URL(element.getAttribute('href') ?? '').pathname)
    ).toBe(route);
    expect(
      await page.$eval(`#header nav a[href="${route}"] .text-heading`, (element) => element.textContent?.trim())
    ).toBe('Platform Builder');
    expect(
      await page.$$eval('language-selector a[hreflang]', (links) =>
        Object.fromEntries(links.map((link) => [link.getAttribute('hreflang'), link.getAttribute('href')]))
      )
    ).toEqual({ fr: '/platform-builder', en: '/en/platform-builder' });
  });

  it('builds from scratch with the keyboard, removes tools and applies presets', async () => {
    const content = await openBuilder(route);
    await click('[data-builder-clear]');
    expect(await placedTechnologies()).toEqual([]);
    for (const stage of content.stages) {
      const technology = stage.technologies[0].id;
      await page.focus(`[data-builder-stage="${stage.id}"]`);
      await page.keyboard.press('Enter');
      await page.focus(`[data-add-technology="${technology}"][data-stage="${stage.id}"]`);
      await page.keyboard.press('Space');
      expect(await placedTechnologies()).toContain(`${stage.id}:${technology}`);
      await click(`[data-remove-technology="${technology}"][data-stage="${stage.id}"]`);
      expect(await placedTechnologies()).not.toContain(`${stage.id}:${technology}`);
    }
    for (const preset of content.approaches) {
      await click(`[data-builder-preset="${preset.id}"]`);
      expect(await placedTechnologies()).toEqual(
        content.stages
          .flatMap((stage) => stage.approaches[preset.id].technologyIds.map((id) => `${stage.id}:${id}`))
          .sort()
      );
    }
    await page.focus(`[data-builder-stage="${content.stages[0].id}"]`);
    await page.keyboard.press('End');
    expect(await page.evaluate(() => document.activeElement?.getAttribute('data-builder-stage'))).toBe(
      content.stages.at(-1)?.id
    );
  });

  it('opens a connection with its endpoints and restores focus when closed', async () => {
    const { stages } = await openBuilder(route);
    const connection = `[data-builder-connection="${stages[0].id}"]`;
    await click(connection);
    expect(await page.$eval('[data-connection-detail]', (element) => element.hasAttribute('hidden'))).toBe(false);
    for (const [endpoint, stage] of [
      ['source', stages[0]],
      ['target', stages[1]],
    ] as const) {
      expect(
        await page.$eval(`[data-connection-endpoint="${endpoint}"] [data-connection-stage]:not([hidden])`, (element) =>
          element.getAttribute('data-connection-stage')
        )
      ).toBe(stage.id);
      expect(
        await page.$$eval(
          `[data-connection-endpoint="${endpoint}"] [data-connection-stage="${stage.id}"] [data-connection-technology]:not([hidden])`,
          (elements) => elements.map((element) => element.getAttribute('data-connection-technology')).sort()
        )
      ).toEqual([...stage.approaches.composable.technologyIds].sort());
    }
    await page.focus('[data-builder-close-connection]');
    await page.keyboard.press('Escape');
    expect(await page.$eval('[data-connection-detail]', (element) => element.hasAttribute('hidden'))).toBe(true);
    expect(await page.$eval(connection, (element) => document.activeElement === element)).toBe(true);
  });

  it('keeps the architecture usable on mobile and across theme changes', async () => {
    await openBuilder(route);
    await click('[data-builder-preset="managed"]');
    const selection = await placedTechnologies();
    const initialBackground = await page.$eval(
      '.builder-library',
      (element) => getComputedStyle(element).backgroundColor
    );
    const initialDark = await page.$eval('html', (element) => element.classList.contains('dark'));
    await click('[data-aw-toggle-color-scheme]');
    await page.waitForFunction((dark) => document.documentElement.classList.contains('dark') !== dark, {}, initialDark);
    expect(await page.$eval('.builder-library', (element) => getComputedStyle(element).backgroundColor)).not.toBe(
      initialBackground
    );
    expect(await placedTechnologies()).toEqual(selection);
    await page.setViewport({ width: 360, height: 800 });
    await click('[data-builder-clear]');
    expect(await placedTechnologies()).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-platform-builder][data-enhanced="true"]');
    expect(await page.$eval('html', (element) => element.classList.contains('dark'))).toBe(!initialDark);
  });

  it('keeps stage descriptions and provider links readable without JavaScript', async () => {
    await page.setJavaScriptEnabled(false);
    await page.goto(`${origin}${route}`, { waitUntil: 'domcontentloaded' });
    expect(
      await page.$$eval(
        '[data-builder-detail]',
        (elements) =>
          elements.filter((element) => element.getBoundingClientRect().height > 0 && element.textContent?.trim()).length
      )
    ).toBe(6);
    expect(
      await page.$$eval(
        '[data-platform-builder] a[href^="https://"]',
        (links) => links.filter((link) => link.getBoundingClientRect().height > 0).length
      )
    ).toBeGreaterThanOrEqual(6);
    expect(
      await page.$$eval('[data-builder-stage], [data-add-technology]', (elements) =>
        elements.every((element) => element.hasAttribute('disabled'))
      )
    ).toBe(true);
  });
});

it('reinitializes the builder after client navigation', async () => {
  const { stages } = await openBuilder('/en/platform-builder');
  await page.evaluate(() => Object.assign(window, { builderNavigationCheck: true }));
  await page.setViewport({ width: 1024, height: 1000 });
  await click('[data-aw-toggle-menu]');
  await click('#header nav li ul a[href^="/en/offers"]');
  await page.waitForFunction(() => location.pathname.startsWith('/en/offers'));
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-astro-transition'));
  await page.evaluate(() => history.back());
  await page.waitForSelector('[data-platform-builder][data-enhanced="true"]');
  await page.waitForFunction(() => !document.documentElement.hasAttribute('data-astro-transition'));
  expect(await page.evaluate(() => Reflect.get(window, 'builderNavigationCheck'))).toBe(true);
  await click('[data-builder-clear]');
  const stage = stages[0];
  const technology = stage.technologies[0].id;
  await click(`[data-builder-stage="${stage.id}"]`);
  await click(`[data-add-technology="${technology}"][data-stage="${stage.id}"]`);
  expect(await placedTechnologies()).toEqual([`${stage.id}:${technology}`]);
}, 30_000);

it.each([
  ['/cas-d-usage', '/platform-builder'],
  ['/use-cases', '/platform-builder'],
  ['/en/use-cases', '/en/platform-builder'],
])(
  'redirects %s to %s',
  async (source, destination) => {
    await openBuilder(source);
    expect(new URL(page.url()).pathname).toBe(destination);
  },
  30_000
);
