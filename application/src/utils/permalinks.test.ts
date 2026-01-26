import { describe, expect, it, vi } from 'vitest';

import {
  BLOG_BASE,
  CATEGORY_BASE,
  TAG_BASE,
  applyGetPermalinks,
  cleanSlug,
  getAsset,
  getBlogPermalink,
  getCanonical,
  getHomePermalink,
  getPermalink,
  trimSlash,
} from '~/utils/permalinks';

describe('permalinks', () => {
  it('trimSlash trims leading and trailing slashes', () => {
    expect(trimSlash('/hello/')).toBe('hello');
    expect(trimSlash('///hello///')).toBe('hello');
    expect(trimSlash('')).toBe('');
  });

  it('slugifies each path segment', () => {
    expect(cleanSlug('Hello World/Some Path')).toBe('hello-world/some-path');
  });

  it('does not rewrite absolute or special hrefs', () => {
    expect(getPermalink('https://example.com')).toBe('https://example.com');
    expect(getPermalink('http://example.com')).toBe('http://example.com');
    expect(getPermalink('://example.com')).toBe('://example.com');
    expect(getPermalink('#section')).toBe('#section');
    expect(getPermalink('javascript:alert(1)')).toBe('javascript:alert(1)');
  });

  it('builds basic permalinks (page, home, blog, tag, category, post)', () => {
    expect(getPermalink('/hello')).toBe('/hello/');
    expect(getPermalink('hello')).toBe('/hello/');

    expect(getHomePermalink()).toBe('/');
    expect(getBlogPermalink()).toBe(`/${BLOG_BASE}/`);

    expect(getPermalink('security', 'tag')).toBe(`/${TAG_BASE}/security/`);
    expect(getPermalink('/security/', 'tag')).toBe(`/${TAG_BASE}/security/`);

    expect(getPermalink('platform', 'category')).toBe(`/${CATEGORY_BASE}/platform/`);
    expect(getPermalink('blog/my-post', 'post')).toBe('/blog/my-post/');
  });

  it('builds asset URLs', () => {
    expect(getAsset('images/pages/home/hero-image.png')).toBe('/images/pages/home/hero-image.png');
    expect(getPermalink('images/pages/home/hero-image.png', 'asset')).toBe('/images/pages/home/hero-image.png/');
  });

  it('creates canonical URLs from SITE.site', () => {
    expect(String(getCanonical('/'))).toBe('https://example.com/');
    expect(String(getCanonical('/hello'))).toBe('https://example.com/hello/');
    // When path is empty, it should return the base site URL.
    expect(String(getCanonical(''))).toBe('https://example.com/');
  });

  it('applyGetPermalinks rewrites menu href fields (string and typed objects)', () => {
    const menu = {
      items: [
        { label: 'Home', href: { type: 'home' } },
        { label: 'Blog', href: { type: 'blog' } },
        { label: 'Asset', href: { type: 'asset', url: 'brand/logo.svg' } },
        { label: 'Tag', href: { type: 'tag', url: 'devx' } },
        { label: 'Page', href: '/about' },
      ],
    };

    const result = applyGetPermalinks(menu) as any;
    expect(result.items[0].href).toBe('/');
    expect(result.items[1].href).toBe(`/${BLOG_BASE}/`);
    expect(result.items[2].href).toBe('/brand/logo.svg');
    expect(result.items[3].href).toBe(`/${TAG_BASE}/devx/`);
    expect(result.items[4].href).toBe('/about/');
  });

  it('applyGetPermalinks preserves non-object inputs', () => {
    expect(applyGetPermalinks(null as any)).toBe(null);
    expect(applyGetPermalinks('hello' as any)).toBe('hello');
  });
});

describe('permalinks (with trailingSlash: false)', () => {
  it('getCanonical removes trailing slashes', async () => {
    vi.resetModules();
    vi.doMock('astrowind:config', () => ({
      SITE: {
        site: 'https://example.com/',
        base: '/',
        trailingSlash: false,
      },
      APP_BLOG: {
        list: { pathname: 'blog' },
        category: { pathname: 'category' },
        tag: { pathname: 'tag' },
        post: { permalink: 'blog/%slug%' },
      },
      I18N: { language: 'en' },
    }));

    const { getCanonical: getCanonicalNoSlash } = await import('~/utils/permalinks');
    expect(String(getCanonicalNoSlash('/hello'))).toBe('https://example.com/hello');
    expect(String(getCanonicalNoSlash('/hello/'))).toBe('https://example.com/hello');
  });
});
