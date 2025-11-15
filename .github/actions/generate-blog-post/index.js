/**
 * GitHub Action: Generate Blog Post
 * Main entry point for the action
 */

const { OpenAIService } = require("./src/openai-service");
const { ContentGenerator } = require("./src/content-generator");
const { FileSystemService } = require("./src/file-system-service");
const { BlogPostGenerator } = require("./src/blog-post-generator");

async function run({
  core,
  releasesData,
  sinceDate,
  untilDate,
  outputDir,
  openAIKey,
}) {
  try {
    // Validate inputs
    if (!core) {
      throw new Error("@actions/core instance is required");
    }

    if (!openAIKey) {
      throw new Error(
        "OpenAI API key is required. Please set OPENAI_API_KEY secret.",
      );
    }

    if (!releasesData || releasesData.length === 0) {
      throw new Error("No releases data provided");
    }

    core.info("✓ OpenAI API key found - using AI-generated content");
    core.info(`Processing ${releasesData.length} repositories`);

    // Initialize services
    const openAIService = new OpenAIService(openAIKey);
    const contentGenerator = new ContentGenerator(openAIService);
    const fileSystemService = new FileSystemService();
    const blogPostGenerator = new BlogPostGenerator(
      contentGenerator,
      openAIService,
      fileSystemService,
    );

    // Generate blog post
    const result = await blogPostGenerator.generate(releasesData, {
      sinceDate: new Date(sinceDate),
      untilDate: new Date(untilDate),
      outputDir,
    });

    // Set outputs
    core.setOutput("slug", result.slug);
    core.setOutput("image-generated", result.imageGenerated ? "true" : "false");

    core.info(`✅ Blog post generated successfully!`);
    core.info(`  Slug: ${result.slug}`);
    core.info(`  Image generated: ${result.imageGenerated}`);
  } catch (error) {
    core.setFailed(`Action failed: ${error.message}`);
    throw error;
  }
}

module.exports = { run };
