export const SITE = {
  site: 'https://example.com/',
  contactEmail: 'hello@example.com',
  base: '/',
  trailingSlash: true,
} as const;

export const APP_BLOG = {
  list: { pathname: 'blog' },
  category: { pathname: 'category' },
  tag: { pathname: 'tag' },
  post: { permalink: 'blog/%slug%' },
} as const;

export const I18N = {
  language: 'en',
} as const;
