const path = require('node:path');
const childProcess = require('node:child_process');

class BiomeService {
  formatDirectory(outputDir, directoryPath) {
    try {
      childProcess.execFileSync(this.getBinaryPath(), ['format', '--write', directoryPath], {
        cwd: path.resolve(outputDir),
        stdio: 'pipe',
      });
    } catch (error) {
      const details = error?.stderr?.toString()?.trim() || error?.stdout?.toString()?.trim() || error?.message;
      throw new Error(`Biome formatting failed for "${directoryPath}": ${details}`);
    }
  }

  getBinaryPath() {
    const binaryName = process.platform === 'win32' ? 'biome.cmd' : 'biome';
    return path.resolve(__dirname, '..', 'node_modules', '.bin', binaryName);
  }
}

module.exports = { BiomeService };
