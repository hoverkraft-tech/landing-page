#!/usr/bin/env node

/**
 * Script to generate a bilingual blog post from Hoverkraft Tech releases data.
 * This script creates the folder structure and files needed for an Astro blog post.
 * Uses OpenAI API to generate engaging content and preview images.
 */

const fs = require("fs");
const path = require("path");
const https = require("https");

// Parse command line arguments
const releasesDataJson = process.env.RELEASES_DATA || process.argv[2];
const sinceDateStr = process.env.SINCE_DATE || process.argv[3];
const untilDateStr = process.env.UNTIL_DATE || process.argv[4];

if (!releasesDataJson || !sinceDateStr || !untilDateStr) {
  console.error(
    "Usage: generate-release-blog-post.js <releases-data-json> <since-date> <until-date>",
  );
  console.error(
    "Or set environment variables: RELEASES_DATA, SINCE_DATE, UNTIL_DATE",
  );
  process.exit(1);
}

const releasesData = JSON.parse(releasesDataJson);
const sinceDate = new Date(sinceDateStr);
const untilDate = new Date(untilDateStr);

// OpenAI API configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const USE_OPENAI = !!OPENAI_API_KEY;

if (USE_OPENAI) {
  console.log("✓ OpenAI API key found - will use AI-generated content");
} else {
  console.log(
    "⚠ No OpenAI API key found - using template-based content generation",
  );
}

/**
 * Make a request to OpenAI API
 */
async function callOpenAI(messages, options = {}) {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key not available");
  }

  const payload = JSON.stringify({
    model: options.model || "gpt-4o-mini",
    messages: messages,
    temperature: options.temperature || 0.7,
    max_tokens: options.max_tokens || 2000,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.openai.com",
        path: "/v1/chat/completions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`OpenAI API error: ${res.statusCode} - ${data}`));
          }
        });
      },
    );

    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

/**
 * Generate preview image using DALL-E
 */
async function generatePreviewImage(slug, releasesData) {
  if (!OPENAI_API_KEY) {
    console.log("⚠ Skipping image generation - no API key");
    return null;
  }

  console.log("Generating preview image with DALL-E...");

  const repoNames = releasesData.map((r) => r.repo).join(", ");
  const prompt = `Create a modern, professional illustration for a tech blog post about software releases. The image should represent open source collaboration, software updates, and innovation. Use geometric shapes, gradients in blue and purple tones, and abstract representations of code, packages, or version control. The style should be clean, minimalist, and tech-forward. No text in the image.`;

  const payload = JSON.stringify({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1792x1024",
    quality: "standard",
    style: "vivid",
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "api.openai.com",
        path: "/v1/images/generations",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode === 200) {
            const response = JSON.parse(data);
            if (response.data && response.data[0] && response.data[0].url) {
              resolve(response.data[0].url);
            } else {
              reject(new Error("No image URL in response"));
            }
          } else {
            console.log(
              `⚠ Image generation failed: ${res.statusCode} - ${data}`,
            );
            resolve(null); // Don't fail the whole process
          }
        });
      },
    );

    req.on("error", (err) => {
      console.log(`⚠ Image generation error: ${err.message}`);
      resolve(null); // Don't fail the whole process
    });
    req.write(payload);
    req.end();
  });
}

/**
 * Download image from URL
 */
async function downloadImage(url, outputPath) {
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
        } else {
          reject(new Error(`Failed to download: ${res.statusCode}`));
        }
      })
      .on("error", reject);
  });
}

// Format dates
const formatDate = (date, locale = "fr-FR") => {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
  });
};

const formatFullDate = (date, locale = "fr-FR") => {
  return new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Generate slug
const year = untilDate.getFullYear();
const month = String(untilDate.getMonth() + 1).padStart(2, "0");
const slug = `releases-${year}-${month}`;

// Calculate totals
const totalRepos = releasesData.length;
const totalReleases = releasesData.reduce(
  (sum, repo) => sum + repo.releases.length,
  0,
);

console.log(
  `Generating blog post for ${totalRepos} repositories with ${totalReleases} releases`,
);
console.log(`Slug: ${slug}`);
console.log(`Period: ${formatDate(sinceDate)} - ${formatDate(untilDate)}`);

// Create post directory
const postDir = path.join(__dirname, "../../application/src/data/post", slug);
if (!fs.existsSync(postDir)) {
  fs.mkdirSync(postDir, { recursive: true });
  console.log(`Created directory: ${postDir}`);
}

// Generate common.yaml
const commonYaml = `publishDate: ${new Date().toISOString().split("T")[0]}T00:00:00Z
image: ~/assets/images/blog/${slug}/preview.png
tags:
  - releases
  - open-source
  - hoverkraft-tech
category: Open Source
translationKey: ${slug}
`;

fs.writeFileSync(path.join(postDir, "common.yaml"), commonYaml);
console.log("Created common.yaml");

// Generate French version (fr.mdx)
const generateFrenchContent = async () => {
  const period = `${formatDate(sinceDate, "fr-FR")} - ${formatDate(untilDate, "fr-FR")}`;

  if (USE_OPENAI) {
    console.log("Generating French content with OpenAI...");

    // Prepare release data summary for AI
    const releasesSummary = releasesData
      .map((repo) => {
        const releases = repo.releases
          .map(
            (r) =>
              `- ${r.name || r.tag} (${r.tag}): ${r.body ? r.body.substring(0, 300) : "No notes"}`,
          )
          .join("\n");
        return `**${repo.repo}** (${repo.stars} ⭐)\n${repo.description || "No description"}\n${releases}`;
      })
      .join("\n\n");

    const prompt = `Tu es un rédacteur technique professionnel pour le blog HoverKraft Tech. Crée un article de blog en français sur les dernières releases de projets open source.

**Contexte:**
- Période: ${period}
- ${totalRepos} projet${totalRepos > 1 ? "s" : ""} avec ${totalReleases} release${totalReleases > 1 ? "s" : ""}
- Style HoverKraft: professionnel mais accessible, orienté action, concis

**Releases:**
${releasesSummary}

**Instructions:**
1. Commence par une citation inspirante sur l'innovation (40-80 caractères, format: > citation)
2. Section d'introduction: résumé enthousiaste de l'activité
3. Pour chaque projet: titre (##), description, lien, étoiles, et releases (####)
4. Pour chaque release: version, date, lien GitHub, notes principales (résumées)
5. Section finale: appel à l'action communautaire (essayer, contribuer, partager)
6. Garde un ton professionnel mais engageant
7. Maximum 1 emoji par section
8. Reste concis et direct

Génère UNIQUEMENT le contenu markdown (sans les métadonnées frontmatter). Commence directement par la citation.`;

    try {
      const response = await callOpenAI([
        {
          role: "system",
          content:
            "Tu es un expert en rédaction technique pour blogs tech français.",
        },
        { role: "user", content: prompt },
      ]);

      const aiContent = response.choices[0].message.content.trim();

      return `---
title: 'Releases HoverKraft Tech - ${formatDate(untilDate, "fr-FR")}'
excerpt: 'Découvrez les dernières mises à jour de nos projets open source : ${totalReleases} nouvelle${totalReleases > 1 ? "s" : ""} release${totalReleases > 1 ? "s" : ""} publiée${totalReleases > 1 ? "s" : ""} en ${formatDate(untilDate, "fr-FR")}.'
slug: ${slug}
author: 'Équipe HoverKraft'
lang: fr
---

${aiContent}

**HoverKraft Tech** - _Simplifier la complexité, accélérer la delivery_
`;
    } catch (error) {
      console.log(
        `⚠ OpenAI generation failed: ${error.message}, using template`,
      );
      // Fall back to template
    }
  }

  // Template-based generation (fallback)
  let releasesSection = releasesData
    .map((repo) => {
      const releasesText = repo.releases
        .map(
          (r) => `
#### ${r.name || r.tag}

**Version:** ${r.tag} | **Date:** ${formatFullDate(r.publishedAt, "fr-FR")}

[📦 Voir la release sur GitHub](${r.url})

${r.body ? r.body.split("\n").slice(0, 10).join("\n") : "Pas de notes de version disponibles."}
`,
        )
        .join("\n");

      return `
## ${repo.repo}

${repo.description || "Pas de description disponible."}

**Repository:** [${repo.url}](${repo.url}) | **Stars:** ⭐ ${repo.stars}

${releasesText}
`;
    })
    .join("\n---\n");

  return `---
title: 'Releases HoverKraft Tech - ${formatDate(untilDate, "fr-FR")}'
excerpt: 'Découvrez les dernières mises à jour de nos projets open source : ${totalReleases} nouvelle${totalReleases > 1 ? "s" : ""} release${totalReleases > 1 ? "s" : ""} publiée${totalReleases > 1 ? "s" : ""} en ${formatDate(untilDate, "fr-FR")}.'
slug: ${slug}
author: 'Équipe HoverKraft'
lang: fr
---

> 🚀 L'innovation ne s'arrête jamais : découvrez nos dernières releases open source.

## Nouveautés Open Source HoverKraft Tech

Période couverte : **${period}**

Nous sommes heureux de partager avec vous les dernières évolutions de notre écosystème open source. Ce mois-ci, **${totalRepos} projet${totalRepos > 1 ? "s ont" : " a"} bénéficié de ${totalReleases} nouvelle${totalReleases > 1 ? "s" : ""} release${totalReleases > 1 ? "s" : ""}**, apportant de nouvelles fonctionnalités, des améliorations de performance et des corrections de bugs.

Notre engagement envers l'open source reste au cœur de notre mission : fournir des outils robustes, maintenables et accessibles à toute la communauté DevOps et Platform Engineering.

${releasesSection}

---

## Rejoignez la communauté

Ces releases sont le fruit du travail de notre équipe et de la communauté. Nous vous encourageons à :

- 🌟 **Essayer ces nouvelles versions** dans vos projets
- 🐛 **Signaler des bugs** ou suggérer des améliorations via GitHub Issues
- 💡 **Contribuer** : nos projets sont ouverts aux contributions
- 📣 **Partager** : si ces outils vous sont utiles, n'hésitez pas à en parler

Vous avez des questions ou besoin d'accompagnement sur nos outils ? [Contactez-nous](https://hoverkraft.tech/contact) ou rejoignez nos discussions sur GitHub.

**HoverKraft Tech** - _Simplifier la complexité, accélérer la delivery_
`;
};

// Generate English version (en.mdx)
const generateEnglishContent = async () => {
  const period = `${formatDate(sinceDate, "en-US")} - ${formatDate(untilDate, "en-US")}`;

  if (USE_OPENAI) {
    console.log("Generating English content with OpenAI...");

    // Prepare release data summary for AI
    const releasesSummary = releasesData
      .map((repo) => {
        const releases = repo.releases
          .map(
            (r) =>
              `- ${r.name || r.tag} (${r.tag}): ${r.body ? r.body.substring(0, 300) : "No notes"}`,
          )
          .join("\n");
        return `**${repo.repo}** (${repo.stars} ⭐)\n${repo.description || "No description"}\n${releases}`;
      })
      .join("\n\n");

    const prompt = `You are a professional technical writer for HoverKraft Tech blog. Create a blog post in English about the latest open source project releases.

**Context:**
- Period: ${period}
- ${totalRepos} project${totalRepos > 1 ? "s" : ""} with ${totalReleases} release${totalReleases > 1 ? "s" : ""}
- HoverKraft Style: professional yet accessible, action-oriented, concise

**Releases:**
${releasesSummary}

**Instructions:**
1. Start with an inspiring quote about innovation (40-80 chars, format: > quote)
2. Introduction section: enthusiastic summary of activity
3. For each project: title (##), description, link, stars, and releases (####)
4. For each release: version, date, GitHub link, main notes (summarized)
5. Final section: community call-to-action (try, contribute, share)
6. Keep a professional but engaging tone
7. Maximum 1 emoji per section
8. Stay concise and direct

Generate ONLY the markdown content (without frontmatter metadata). Start directly with the quote.`;

    try {
      const response = await callOpenAI([
        {
          role: "system",
          content: "You are an expert technical writer for tech blogs.",
        },
        { role: "user", content: prompt },
      ]);

      const aiContent = response.choices[0].message.content.trim();

      return `---
title: 'HoverKraft Tech Releases - ${formatDate(untilDate, "en-US")}'
excerpt: 'Discover the latest updates from our open source projects: ${totalReleases} new release${totalReleases > 1 ? "s" : ""} published in ${formatDate(untilDate, "en-US")}.'
slug: ${slug}
author: 'HoverKraft Team'
lang: en
---

${aiContent}

**HoverKraft Tech** - _Simplifying complexity, accelerating delivery_
`;
    } catch (error) {
      console.log(
        `⚠ OpenAI generation failed: ${error.message}, using template`,
      );
      // Fall back to template
    }
  }

  // Template-based generation (fallback)
  let releasesSection = releasesData
    .map((repo) => {
      const releasesText = repo.releases
        .map(
          (r) => `
#### ${r.name || r.tag}

**Version:** ${r.tag} | **Date:** ${formatFullDate(r.publishedAt, "en-US")}

[📦 View release on GitHub](${r.url})

${r.body ? r.body.split("\n").slice(0, 10).join("\n") : "No release notes available."}
`,
        )
        .join("\n");

      return `
## ${repo.repo}

${repo.description || "No description available."}

**Repository:** [${repo.url}](${repo.url}) | **Stars:** ⭐ ${repo.stars}

${releasesText}
`;
    })
    .join("\n---\n");

  return `---
title: 'HoverKraft Tech Releases - ${formatDate(untilDate, "en-US")}'
excerpt: 'Discover the latest updates from our open source projects: ${totalReleases} new release${totalReleases > 1 ? "s" : ""} published in ${formatDate(untilDate, "en-US")}.'
slug: ${slug}
author: 'HoverKraft Team'
lang: en
---

> 🚀 Innovation never stops: discover our latest open source releases.

## HoverKraft Tech Open Source Updates

Period covered: **${period}**

We're excited to share the latest developments in our open source ecosystem. This month, **${totalRepos} project${totalRepos > 1 ? "s have" : " has"} received ${totalReleases} new release${totalReleases > 1 ? "s" : ""}**, bringing new features, performance improvements, and bug fixes.

Our commitment to open source remains at the heart of our mission: providing robust, maintainable, and accessible tools to the entire DevOps and Platform Engineering community.

${releasesSection}

---

## Join the Community

These releases are the result of our team's work and community contributions. We encourage you to:

- 🌟 **Try these new versions** in your projects
- 🐛 **Report bugs** or suggest improvements via GitHub Issues
- 💡 **Contribute**: our projects welcome contributions
- 📣 **Share**: if these tools help you, spread the word

Questions or need guidance on our tools? [Contact us](https://hoverkraft.tech/contact) or join discussions on GitHub.

**HoverKraft Tech** - _Simplifying complexity, accelerating delivery_
`;
};

// Write content files
(async () => {
  try {
    fs.writeFileSync(
      path.join(postDir, "fr.mdx"),
      await generateFrenchContent(),
    );
    console.log("Created fr.mdx");

    fs.writeFileSync(
      path.join(postDir, "en.mdx"),
      await generateEnglishContent(),
    );
    console.log("Created en.mdx");

    // Create placeholder image directory structure
    const imageDir = path.join(
      __dirname,
      "../../application/src/assets/images/blog",
      slug,
    );
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
      console.log(`Created image directory: ${imageDir}`);
    }

    // Try to generate preview image with OpenAI
    if (USE_OPENAI) {
      try {
        const imageUrl = await generatePreviewImage(slug, releasesData);
        if (imageUrl) {
          const imagePath = path.join(imageDir, "preview.png");
          await downloadImage(imageUrl, imagePath);
          console.log(`✓ Generated and saved preview image: ${imagePath}`);
        }
      } catch (error) {
        console.log(`⚠ Failed to generate image: ${error.message}`);
      }
    }

    // Create a note about the preview image if not generated
    if (!fs.existsSync(path.join(imageDir, "preview.png"))) {
      fs.writeFileSync(
        path.join(imageDir, "README.md"),
        `# Preview Image for ${slug}

A preview image should be added here as \`preview.png\`.

This image will be used as the blog post's featured image.

Suggested dimensions: 1200x630px
Suggested content: Visual representation of software releases, updates, or open source collaboration.
`,
      );
      console.log("Created image README.md");
    }

    console.log("\n✅ Blog post structure created successfully!");
    console.log(`📁 Location: ${postDir}`);

    if (!fs.existsSync(path.join(imageDir, "preview.png"))) {
      console.log(
        `\n⚠️  Note: A preview image needs to be added at: ${path.join(imageDir, "preview.png")}`,
      );
      console.log(
        "    You can use the blog-post custom agent or an image generation tool to create it.",
      );
    }
  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
    process.exit(1);
  }
})();
