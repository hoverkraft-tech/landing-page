/**
 * Blog Post Generator
 * Main orchestrator for blog post generation
 */

const path = require("path");
const crypto = require("crypto");

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
    // Generate unique slug based on dates
    const slug = this.generateSlug(sinceDate, untilDate);

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
    this.writeLocalizedArtifacts(postDir, "fr", frenchContent);

    // Generate English content
    const englishContent = await this.contentGenerator.generateEnglishContent(
      releasesData,
      { sinceDate, untilDate, slug },
    );
    this.writeLocalizedArtifacts(postDir, "en", englishContent);

    // Generate preview image (fail if it fails)
    const imagePath = path.join(imageDir, "preview.png");
    await this.generatePreviewImage(imagePath);

    return {
      slug,
      imageGenerated: true,
    };
  }

  /**
   * Generate slug from date range with hash to avoid conflicts
   */
  generateSlug(sinceDate, untilDate) {
    const since = new Date(sinceDate);
    const until = new Date(untilDate);

    // Create a short hash from the date range for uniqueness
    const dateString = `${since.toISOString()}-${until.toISOString()}`;
    const hash = crypto
      .createHash("sha256")
      .update(dateString)
      .digest("hex")
      .substring(0, 8);

    const year = until.getUTCFullYear();
    const month = String(until.getUTCMonth() + 1).padStart(2, "0");
    const day = String(until.getUTCDate()).padStart(2, "0");

    return `releases-${year}-${month}-${day}-${hash}`;
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
   * Generate preview image (fails strictly if generation fails)
   */
  async generatePreviewImage(outputPath) {
    const prompt = `Create a modern, professional illustration for a tech blog post about software releases. The image should represent open source collaboration, software updates, and innovation. Use geometric shapes, gradients in blue and purple tones, and abstract representations of code, packages, or version control. The style should be clean, minimalist, and tech-forward. No text in the image.`;

    const imageUrl = await this.openAIService.generateImage(prompt);
    await this.fileSystemService.downloadFile(imageUrl, outputPath);
  }

  /**
   * Write MDX + JSON data for a locale
   */
  writeLocalizedArtifacts(postDir, lang, { frontmatter, data }) {
    const jsonPath = path.join(postDir, `${lang}.data.json`);
    const mdxPath = path.join(postDir, `${lang}.mdx`);

    const normalizedFrontmatter = frontmatter.endsWith("\n\n")
      ? frontmatter
      : `${frontmatter.trimEnd()}\n\n`;

    const mdxContent = `${normalizedFrontmatter}import ReleaseSummary from '~/components/blog/ReleaseSummary.astro';
import data from './${lang}.data.json';

<ReleaseSummary data={data} />
`;

    this.fileSystemService.writeFile(
      jsonPath,
      `${JSON.stringify(data, null, 2)}\n`,
    );
    this.fileSystemService.writeFile(mdxPath, mdxContent);
  }
}

module.exports = { BlogPostGenerator };
