import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';

import MaturityPrintHeader from './MaturityPrintHeader.astro';

describe('MaturityPrintHeader', () => {
  it('renders title and optional tagline', async () => {
    const container = await AstroContainer.create();

    const html = await container.renderToString(MaturityPrintHeader, {
      props: {
        strings: {
          printTagline: 'My tagline',
          printTitle: 'My title',
        },
      },
    });

    expect(html).toContain('data-print-header');
    expect(html).toContain('My tagline');
    expect(html).toContain('My title');
  });

  it('omits the tagline element when empty', async () => {
    const container = await AstroContainer.create();

    const html = await container.renderToString(MaturityPrintHeader, {
      props: {
        strings: {
          printTagline: '',
          printTitle: 'Only title',
        },
      },
    });

    expect(html).toContain('Only title');
    expect(html).not.toContain('My tagline');
  });
});
