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

import ContactEmailLink from './ContactEmailLink.astro';

async function getMockedSite() {
  const { SITE } = await import('astrowind:config');
  return SITE as Record<string, unknown>;
}

describe('ContactEmailLink', () => {
  beforeEach(async () => {
    Object.assign(await getMockedSite(), DEFAULT_SITE);
  });

  it('renders a mailto link using SITE.contactEmail', async () => {
    const container = await AstroContainer.create();

    const html = await container.renderToString(ContactEmailLink, {
      props: {
        class: 'my-class',
      },
    });

    // Uses the stubbed `astrowind:config` module.
    expect(html).toContain('href="mailto:hello@example.com"');
    expect(html).toContain('hello@example.com');
    expect(html).toContain('class="my-class"');
  });

  it('renders the label text when provided', async () => {
    const container = await AstroContainer.create();

    const html = await container.renderToString(ContactEmailLink, {
      props: {
        label: 'Email us',
      },
    });

    expect(html).toContain('Email us');
  });

  it('renders nothing when label is an empty string', async () => {
    const container = await AstroContainer.create();

    const html = await container.renderToString(ContactEmailLink, {
      props: {
        label: '',
      },
    });

    expect(html.trim()).toBe('');
  });

  it('renders plain text when SITE.contactEmail is missing', async () => {
    const site = await getMockedSite();
    site.contactEmail = 123;

    const container = await AstroContainer.create();

    const html = await container.renderToString(ContactEmailLink, {
      props: {
        label: 'Email us',
      },
    });

    expect(html).toContain('Email us');
    expect(html).not.toContain('mailto:');
    expect(html).not.toContain('<a');
  });
});
