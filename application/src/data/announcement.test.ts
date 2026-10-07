import { describe, expect, it } from 'vitest';

import { getAnnouncementContent } from './announcement';

describe('announcement content', () => {
  it('returns localized sponsor copy for each supported locale', () => {
    expect(getAnnouncementContent('fr')).toEqual({
      text: 'Hoverkraft est sponsor des Kubernetes Community Days Provence 2026',
      href: 'https://cloudnative-provence.fr/',
    });

    expect(getAnnouncementContent('en')).toEqual({
      text: 'Hoverkraft is a sponsor of Kubernetes Community Days Provence 2026',
      href: 'https://cloudnative-provence.fr/',
    });
  });
});
