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
    postizService,
    socialImageUrlService,
    socialCopyService,
    postDateService,
  }) {
    this.core = core;
    this.postMetadataService = postMetadataService;
    this.postizService = postizService;
    this.socialImageUrlService = socialImageUrlService;
    this.socialCopyService = socialCopyService;

    if (!postDateService) {
      throw new Error("postDateService is required");
    }
    this.postDateService = postDateService;
  }

  async sharePosts({ postsRaw, language, siteBaseUrl, blogBasePath }) {
    const folders = splitLines(postsRaw);
    if (folders.length === 0) {
      this.core.info("No new posts to share");
      return;
    }

    const resolvedPostDate =
      this.postDateService.buildRandomAtLeast24HoursAwayInBusinessHoursIso({
        timeZone: "Europe/Paris",
        startHourInclusive: 9,
        endHourExclusive: 18,
      });

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

      if (!this.socialCopyService) {
        throw new Error("socialCopyService is required");
      }

      const contentByIntegrationType =
        await this.socialCopyService.buildContentByIntegrationType({
          title: metadata.title,
          excerpt: metadata.excerpt,
          url,
          language,
        });

      const socialImageUrl = this.socialImageUrlService.resolveFromTildePath(
        metadata.socialImage,
      );

      const response = await this.postizService.createDraftPost({
        postId: metadata.slug,
        contentByIntegrationType,
        socialImageUrl,
        date: resolvedPostDate,
      });

      this.core.info(`✅ Shared ${folder}: ${JSON.stringify(response)}`);
    }
  }
}

module.exports = { SharePostsService };
