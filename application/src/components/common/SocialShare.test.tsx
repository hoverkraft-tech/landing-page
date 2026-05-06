import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
// eslint-disable-next-line n/no-unpublished-import
import { describe, expect, it, vi } from 'vitest';

vi.mock('astrowind:config', () => ({
  SITE: {
    site: 'https://example.com/',
    contactEmail: 'hello@example.com',
    base: '/',
    trailingSlash: true,
  },
  APP_BLOG: {
    list: { pathname: 'blog' },
    category: { pathname: 'category' },
    tag: { pathname: 'tag' },
    post: { permalink: 'blog/%slug%' },
  },
  I18N: {
    language: 'fr',
    showDefaultLang: false,
    languages: {
      fr: 'FR',
      en: 'EN',
    },
  },
}));

vi.mock('~/i18n/utils', () => ({
  useTranslations: () => (key: string) =>
    (
      ({
        'social.share': 'Partager',
        'social.copy': 'Copier',
        'social.copied': 'Copie effectuee',
        'social.email': 'Email',
        'social.linkedin': 'LinkedIn',
        'social.bluesky': 'Bluesky',
        'social.print': 'Imprimer',
      }) as const
    )[
      key as keyof {
        'social.share': string;
        'social.copy': string;
        'social.copied': string;
        'social.email': string;
        'social.linkedin': string;
        'social.bluesky': string;
        'social.print': string;
      }
    ] ?? key,
}));

// eslint-disable-next-line n/no-missing-import
import SocialShare from './SocialShare';

describe('SocialShare', () => {
  it('renders share links with expected hrefs', () => {
    const text = 'Hello world';
    const title = 'Share title';
    const url = 'https://example.com/post';

    const html = renderToStaticMarkup(<SocialShare text={text} title={title} url={url} />);

    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedBody = encodeURIComponent(text.replace(/\r?\n/g, '\r\n'));
    const blueskyText = encodeURIComponent(`${title} ${url}`);

    expect(html).toContain('Partager:');
    expect(html).toContain(`href="mailto:?subject=${encodedTitle}&amp;body=${encodedBody}"`);
    expect(html).toContain(`href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}"`);
    expect(html).toContain(`href="https://bsky.app/intent/compose?text=${blueskyText}"`);
  });

  it('disables all share actions when disabled', () => {
    const html = renderToStaticMarkup(<SocialShare text="Hello" url="https://example.com" disabled />);

    const disabledButtons = html.match(/<button[^>]*disabled/g) ?? [];
    expect(disabledButtons).toHaveLength(2);

    const disabledLinks = html.match(/aria-disabled="true"/g) ?? [];
    expect(disabledLinks).toHaveLength(3);

    expect(html).toContain('pointer-events-none');
  });
});
