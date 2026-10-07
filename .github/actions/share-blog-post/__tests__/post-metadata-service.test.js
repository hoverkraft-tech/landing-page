const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

const { PostMetadataService } = require('../src/post-metadata-service');

function createFileSystem(files) {
  return {
    async fileExists(filePath) {
      return Object.prototype.hasOwnProperty.call(files, filePath);
    },
    async readFile(filePath) {
      const value = files[filePath];
      if (value === undefined) {
        throw new Error(`Missing fixture for ${filePath}`);
      }
      return value;
    },
  };
}

describe('PostMetadataService', () => {
  it('reads metadata from YAML frontmatter and common.yaml', async () => {
    const service = new PostMetadataService(
      createFileSystem({
        'application/src/data/post/sample/en.mdx': `---
title: Hello
excerpt: Summary
slug: custom-slug
---
Body`,
        'application/src/data/post/sample/common.yaml':
          'publishDate: 2026-01-02T03:04:05Z\nimage: ~/assets/sample.png\n',
      })
    );

    const metadata = await service.readPostMetadata('sample', { language: 'en' });

    assert.deepEqual(metadata, {
      title: 'Hello',
      excerpt: 'Summary',
      slug: 'custom-slug',
      publishDate: '2026-01-02T03:04:05Z',
      socialImage: '~/assets/sample.png',
    });
  });

  it('falls back to empty frontmatter data when the MDX file has no frontmatter', async () => {
    const service = new PostMetadataService(
      createFileSystem({
        'application/src/data/post/sample/en.mdx': 'Body without frontmatter',
        'application/src/data/post/sample/common.yaml': 'image: ~/assets/sample.png\n',
      })
    );

    const metadata = await service.readPostMetadata('sample', { language: 'en' });

    assert.equal(metadata.title, '');
    assert.equal(metadata.excerpt, '');
    assert.equal(metadata.slug, 'sample');
    assert.equal(metadata.socialImage, '~/assets/sample.png');
  });
});
