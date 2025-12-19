const fs = require("node:fs/promises");

class FileSystemService {
  async fileExists(filePath) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  async readFile(filePath) {
    return fs.readFile(filePath, "utf8");
  }
}

module.exports = { FileSystemService };
