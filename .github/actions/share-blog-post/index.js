/**
 * GitHub Action: Share Blog Posts via Postiz
 * Main entry point for the action
 */

const { OpenAIService } = require("./src/openai-service");
const { FileSystemService } = require("./src/file-system-service");
const { PostMetadataService } = require("./src/post-metadata-service");
const { IntegrationsService } = require("./src/integrations-service");
const { PostizService } = require("./src/postiz-service");
const { SharePostsService } = require("./src/share-posts-service");

async function run({
  core,
  postsRaw,
  language,
  siteBaseUrl,
  blogBasePath,
  postizApiKey,
  postizApiUrl,
  postizIntegrations,
  openAIKey,
}) {
  try {
    if (!core) {
      throw new Error("@actions/core instance is required");
    }

    if (!postizApiKey) {
      throw new Error("POSTIZ_API_KEY secret is required");
    }

    if (!postizApiUrl) {
      throw new Error("POSTIZ_API_URL is required");
    }

    if (!siteBaseUrl) {
      throw new Error("SITE_BASE_URL is required");
    }

    if (!blogBasePath) {
      throw new Error("BLOG_BASE_PATH is required");
    }

    if (!language) {
      throw new Error("LANGUAGE is required");
    }

    if (!openAIKey) {
      throw new Error("OPENAI_API_KEY secret is required");
    }

    if (!postizIntegrations) {
      throw new Error("POSTIZ_INTEGRATIONS is required");
    }

    const fileSystemService = new FileSystemService();
    const postMetadataService = new PostMetadataService(fileSystemService);
    const integrationsService = new IntegrationsService();
    const openAIService = new OpenAIService(openAIKey);
    const postizService = new PostizService({
      apiKey: postizApiKey,
      apiUrl: postizApiUrl,
    });

    const sharePostsService = new SharePostsService({
      core,
      postMetadataService,
      integrationsService,
      openAIService,
      postizService,
    });

    await sharePostsService.sharePosts({
      postsRaw,
      language,
      siteBaseUrl,
      blogBasePath,
      postizIntegrations,
    });
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
    throw error;
  }
}

module.exports = { run };
