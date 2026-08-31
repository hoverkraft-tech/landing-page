/**
 * File System Service
 * Handles all file system operations
 */

const fs = require('fs');
const path = require('path');

class FileSystemService {
  /**
   * Create directory if it doesn't exist
   */
  ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Write file
   */
  writeFile(filePath, content) {
    fs.writeFileSync(filePath, content, 'utf8');
  }

  /**
   * Write binary file
   */
  writeBinaryFile(filePath, content) {
    fs.writeFileSync(filePath, content);
  }

  /**
   * Check if file exists
   */
  fileExists(filePath) {
    return fs.existsSync(filePath);
  }

  /**
   * Get absolute path
   */
  getAbsolutePath(...segments) {
    return path.join(...segments);
  }
}

module.exports = { FileSystemService };
