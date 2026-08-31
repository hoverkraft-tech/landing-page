const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { FileSystemService } = require('../src/file-system-service');

describe('FileSystemService', () => {
  it('writes binary data without changing its bytes', (context) => {
    const temporaryDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'generate-blog-post-'));
    context.after(() => fs.rmSync(temporaryDirectory, { recursive: true, force: true }));

    const outputPath = path.join(temporaryDirectory, 'preview.png');
    const expectedBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xff]);

    new FileSystemService().writeBinaryFile(outputPath, expectedBytes);

    assert.deepEqual(fs.readFileSync(outputPath), expectedBytes);
  });
});
