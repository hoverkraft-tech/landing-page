import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const DEFAULT_SITE = {
  site: 'https://example.com/',
  contactEmail: 'hello@example.com',
  base: '/',
  trailingSlash: true,
} as const;

vi.mock('astrowind:config', () => ({
  SITE: {
    site: 'https://example.com/',
    contactEmail: 'hello@example.com',
    base: '/',
    trailingSlash: true,
  },
}));

import SiteLink from './SiteLink.astro';

async function getMockedSite() {
  const { SITE } = await import('astrowind:config');
  return SITE as Record<string, unknown>;
}

describe('SiteLink', () => {
  beforeEach(async () => {
    Object.assign(await getMockedSite(), DEFAULT_SITE);
  });

  it('renders an anchor with resolved href', async () => {
    const container = await AstroContainer.create();

    const html = await container.renderToString(SiteLink, {
      props: {
        path: '/hello',
        children: 'Go',
      },
    });

    expect(html).toContain('<a');
    expect(html).toContain('href="https://example.com/hello"');
    expect(html).toContain('Go');
  });

  it('falls back to base URL when no path/children are provided', async () => {
    const container = await AstroContainer.create();

    const html = await container.renderToString(SiteLink, {
      props: {},
    });

    expect(html).toContain('href="https://example.com/"');
    expect(html).toContain('https://example.com/');
  });

  it('uses the raw path when SITE.site is empty', async () => {
    const site = await getMockedSite();
    site.site = '';

    const container = await AstroContainer.create();

    const html = await container.renderToString(SiteLink, {
      props: {
        path: '/hello',
      },
    });

    expect(html).toContain('href="/hello"');
    expect(html).toContain('>/hello<');
  });
});
