const path = require("node:path");

function parseJsonInput(name, rawValue) {
  if (rawValue === undefined || rawValue === "") {
    throw new Error(`Input ${name} is required`);
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    throw new Error(`Failed to parse ${name} input: ${error.message}`);
  }
}

function normalizeBaseUrl(rawBaseUrl) {
  if (
    !rawBaseUrl ||
    typeof rawBaseUrl !== "string" ||
    rawBaseUrl.trim().length === 0
  ) {
    throw new Error("base-url input is required and must be a string");
  }

  return rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;
}

function resolveWorkspacePath(targetPath, workspace) {
  if (
    !targetPath ||
    typeof targetPath !== "string" ||
    targetPath.trim().length === 0
  ) {
    throw new Error("Path input must be a non-empty string");
  }

  return path.isAbsolute(targetPath)
    ? targetPath
    : path.join(workspace, targetPath);
}

module.exports = {
  parseJsonInput,
  normalizeBaseUrl,
  resolveWorkspacePath,
};
