const { describe, it, beforeEach, mock } = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const childProcess = require('node:child_process');
const { BiomeService } = require('../src/biome-service');

describe('BiomeService', () => {
  let biomeService;

  beforeEach(() => {
    biomeService = new BiomeService();
  });

  it('should format generated content with biome', () => {
    const execFileSyncMock = mock.method(childProcess, 'execFileSync', () => {});

    biomeService.formatDirectory('/repo/application', 'src/data/post/releases-2025-11-15-abc123de');

    assert.strictEqual(execFileSyncMock.mock.calls.length, 1);
    assert.match(execFileSyncMock.mock.calls[0].arguments[0], /node_modules[\/\\]\.bin[\/\\]biome(?:\.cmd)?$/);
    assert.deepStrictEqual(execFileSyncMock.mock.calls[0].arguments[1], [
      'format',
      '--write',
      'src/data/post/releases-2025-11-15-abc123de',
    ]);
    assert.deepStrictEqual(execFileSyncMock.mock.calls[0].arguments[2], {
      cwd: path.resolve('/repo/application'),
      stdio: 'pipe',
    });
  });

  it('should surface biome formatting failures', () => {
    mock.method(childProcess, 'execFileSync', () => {
      const error = new Error('Command failed');
      error.stderr = Buffer.from('Syntax error');
      throw error;
    });

    assert.throws(
      () => biomeService.formatDirectory('/repo/application', 'src/data/post/releases-2025-11-15-abc123de'),
      {
        message:
          'Biome formatting failed for "src/data/post/releases-2025-11-15-abc123de": Syntax error',
      }
    );
  });
});
