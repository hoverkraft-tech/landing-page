/**
 * Blog Post Generator
 * Main orchestrator for blog post generation
 */

const path = require("path");

class BlogPostGenerator {
  constructor(contentGenerator, openAIService, fileSystemService) {
    this.contentGenerator = contentGenerator;
    this.openAIService = openAIService;
    this.fileSystemService = fileSystemService;
  }

  /**
   * Generate complete blog post
   */
  async generate(releasesData, { sinceDate, untilDate, outputDir }) {
    // Generate slug
    const slug = this.generateSlug(untilDate);

    // Create directories
    const postDir = this.fileSystemService.getAbsolutePath(
      outputDir,
      "src/data/post",
      slug,
    );
    const imageDir = this.fileSystemService.getAbsolutePath(
      outputDir,
      "src/assets/images/blog",
      slug,
    );

    this.fileSystemService.ensureDirectory(postDir);
    this.fileSystemService.ensureDirectory(imageDir);

    // Generate common.yaml
    const commonYaml = this.generateCommonYaml(slug);
    this.fileSystemService.writeFile(
      path.join(postDir, "common.yaml"),
      commonYaml,
    );

    // Generate French content
    const frenchContent = await this.contentGenerator.generateFrenchContent(
      releasesData,
      { sinceDate, untilDate, slug },
    );
    this.fileSystemService.writeFile(
      path.join(postDir, "fr.mdx"),
      frenchContent,
    );

    // Generate English content
    const englishContent = await this.contentGenerator.generateEnglishContent(
      releasesData,
      { sinceDate, untilDate, slug },
    );
    this.fileSystemService.writeFile(
      path.join(postDir, "en.mdx"),
      englishContent,
    );

    // Generate preview image
    const imagePath = path.join(imageDir, "preview.png");
    const imageGenerated = await this.generatePreviewImage(
      releasesData,
      imagePath,
    );

    if (!imageGenerated) {
      // Create README with instructions
      const readmeContent = this.generateImageReadme(slug);
      this.fileSystemService.writeFile(
        path.join(imageDir, "README.md"),
        readmeContent,
      );
    }

    return {
      slug,
      postDir,
      imageDir,
      imageGenerated,
    };
  }

  /**
   * Generate slug from date
   */
  generateSlug(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    return `releases-${year}-${month}`;
  }

  /**
   * Generate common.yaml content
   */
  generateCommonYaml(slug) {
    const publishDate = new Date().toISOString().split("T")[0];
    return `publishDate: ${publishDate}T00:00:00Z
image: ~/assets/images/blog/${slug}/preview.png
tags:
  - releases
  - open-source
  - hoverkraft-tech
category: Open Source
translationKey: ${slug}
`;
  }

  /**
   * Generate preview image
   */
  async generatePreviewImage(releasesData, outputPath) {
    try {
      const prompt = `Create a modern, professional illustration for a tech blog post about software releases. The image should represent open source collaboration, software updates, and innovation. Use geometric shapes, gradients in blue and purple tones, and abstract representations of code, packages, or version control. The style should be clean, minimalist, and tech-forward. No text in the image.`;

      const imageUrl = await this.openAIService.generateImage(prompt);
      await this.fileSystemService.downloadFile(imageUrl, outputPath);
      return true;
    } catch (error) {
      console.log(`⚠ Image generation failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Generate README for manual image addition
   */
  generateImageReadme(slug) {
    return `# Preview Image for ${slug}

A preview image should be added here as \`preview.png\`.

This image will be used as the blog post's featured image.

Suggested dimensions: 1200x630px
Suggested content: Visual representation of software releases, updates, or open source collaboration.
`;
  }
}

module.exports = { BlogPostGenerator };
