/**
 * File System Service
 * Handles all file system operations
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

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
    fs.writeFileSync(filePath, content, "utf8");
  }

  /**
   * Check if file exists
   */
  fileExists(filePath) {
    return fs.existsSync(filePath);
  }

  /**
   * Download file from URL
   */
  async downloadFile(url, outputPath) {
    return new Promise((resolve, reject) => {
      https
        .get(url, (res) => {
          if (res.statusCode === 200) {
            const file = fs.createWriteStream(outputPath);
            res.pipe(file);
            file.on("finish", () => {
              file.close();
              resolve();
            });
            file.on("error", reject);
          } else {
            reject(new Error(`Failed to download: ${res.statusCode}`));
          }
        })
        .on("error", reject);
    });
  }

  /**
   * Get absolute path
   */
  getAbsolutePath(...segments) {
    return path.join(...segments);
  }
}

module.exports = { FileSystemService };
