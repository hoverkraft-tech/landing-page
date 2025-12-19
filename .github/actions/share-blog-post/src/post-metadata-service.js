const path = require("node:path");
const matter = require("gray-matter");
const yaml = require("js-yaml");

function toIsoUtcNow() {
  return new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
}

function trimSlashes(value, { leading, trailing }) {
  if (typeof value !== "string" || value.length === 0) {
    return "";
  }

  let start = 0;
  let end = value.length;

  if (leading) {
    while (start < end && value[start] === "/") {
      start += 1;
    }
  }

  if (trailing) {
    while (end > start && value[end - 1] === "/") {
      end -= 1;
    }
  }

  return value.slice(start, end);
}

function joinUrl(...parts) {
  return parts
    .filter((part) => typeof part === "string")
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .map((part, index) => {
      if (index === 0) {
        return trimSlashes(part, { leading: false, trailing: true });
      }
      return trimSlashes(part, { leading: true, trailing: true });
    })
    .join("/");
}

class PostMetadataService {
  constructor(fileSystemService) {
    this.fileSystemService = fileSystemService;
  }

  async readPostMetadata(folder, { language } = {}) {
    const base = path.join("application", "src", "data", "post", folder);

    const commonPath = path.join(base, "common.yaml");
    const requestedMdxPath = language
      ? path.join(base, `${language}.mdx`)
      : null;
    const enMdxPath = path.join(base, "en.mdx");
    const frMdxPath = path.join(base, "fr.mdx");

    let mdxPath = requestedMdxPath;
    if (requestedMdxPath) {
      const exists = await this.fileSystemService.fileExists(requestedMdxPath);
      if (!exists) {
        return null;
      }
    } else {
      mdxPath = (await this.fileSystemService.fileExists(enMdxPath))
        ? enMdxPath
        : frMdxPath;
    }

    const mdxExists = await this.fileSystemService.fileExists(mdxPath);
    if (!mdxExists) {
      return null;
    }

    const mdxRaw = await this.fileSystemService.readFile(mdxPath);
    const { data } = matter(mdxRaw);

    const title = typeof data.title === "string" ? data.title : "";
    const excerpt = typeof data.excerpt === "string" ? data.excerpt : "";
    const slug =
      typeof data.slug === "string" && data.slug.trim().length > 0
        ? data.slug.trim()
        : folder;

    let publishDate = toIsoUtcNow();
    if (await this.fileSystemService.fileExists(commonPath)) {
      const commonRaw = await this.fileSystemService.readFile(commonPath);
      const common = yaml.load(commonRaw);
      if (common && typeof common === "object") {
        const publishDateRaw = common.publishDate;
        if (typeof publishDateRaw === "string" && publishDateRaw.trim()) {
          publishDate = publishDateRaw.trim();
        }
      }
    }

    return { title, excerpt, slug, publishDate };
  }

  buildPostUrl({ siteBaseUrl, blogBasePath, slug }) {
    return joinUrl(siteBaseUrl, blogBasePath, slug);
  }
}

module.exports = { PostMetadataService };
