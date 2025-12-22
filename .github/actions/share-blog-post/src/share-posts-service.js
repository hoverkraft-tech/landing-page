function splitLines(value) {
  if (!value) {
    return [];
  }
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

class SharePostsService {
  constructor({
    core,
    postMetadataService,
    openAIService,
    postizService,
    socialImageUrlService,
  }) {
    this.core = core;
    this.postMetadataService = postMetadataService;
    this.openAIService = openAIService;
    this.postizService = postizService;
    this.socialImageUrlService = socialImageUrlService;
  }

  getReadMoreLabel(language) {
    const normalized = `${language || ""}`.trim().toLowerCase();
    if (normalized === "fr") {
      return "Lire la suite :";
    }
    return "Read more:";
  }

  async sharePosts({ postsRaw, language, siteBaseUrl, blogBasePath }) {
    const folders = splitLines(postsRaw);
    if (folders.length === 0) {
      this.core.info("No new posts to share");
      return;
    }

    for (const folder of folders) {
      const metadata = await this.postMetadataService.readPostMetadata(folder, {
        language,
      });
      if (!metadata) {
        this.core.warning(`Skipping ${folder}: no ${language}.mdx found`);
        continue;
      }

      const url = this.postMetadataService.buildPostUrl({
        siteBaseUrl,
        blogBasePath,
        slug: metadata.slug,
      });

      let description = await this.openAIService.generateSocialSnippet({
        title: metadata.title,
        excerpt: metadata.excerpt,
        url,
        language,
      });

      if (!description) {
        description = metadata.excerpt;
      }

      const content = `${description} ${this.getReadMoreLabel(
        language,
      )} ${url}`;

      const socialImageUrl = this.socialImageUrlService.resolveFromTildePath(
        metadata.socialImage,
      );

      const response = await this.postizService.createDraftPost({
        content,
        socialImageUrl,
      });

      this.core.info(`✅ Shared ${folder}: ${JSON.stringify(response)}`);
    }
  }
}

module.exports = { SharePostsService };
