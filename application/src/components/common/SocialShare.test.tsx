import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
// eslint-disable-next-line n/no-unpublished-import
import { describe, expect, it, vi } from 'vitest';

vi.mock('astrowind:config', () => ({
  I18N: {
    language: 'fr',
    showDefaultLang: false,
    languages: {
      fr: 'FR',
      en: 'EN',
    },
  },
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
    expect(html).toContain(`href="mailto:?subject=${encodedTitle}&body=${encodedBody}"`);
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
