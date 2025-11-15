#!/usr/bin/env node

/**
 * Script to generate a bilingual blog post from Hoverkraft Tech releases data.
 * This script creates the folder structure and files needed for an Astro blog post.
 */

const fs = require("fs");
const path = require("path");

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
const generateFrenchContent = () => {
  const period = `${formatDate(sinceDate, "fr-FR")} - ${formatDate(untilDate, "fr-FR")}`;

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
const generateEnglishContent = () => {
  const period = `${formatDate(sinceDate, "en-US")} - ${formatDate(untilDate, "en-US")}`;

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
fs.writeFileSync(path.join(postDir, "fr.mdx"), generateFrenchContent());
console.log("Created fr.mdx");

fs.writeFileSync(path.join(postDir, "en.mdx"), generateEnglishContent());
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

// Create a note about the preview image
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

console.log("\n✅ Blog post structure created successfully!");
console.log(`📁 Location: ${postDir}`);
console.log(
  `\n⚠️  Note: A preview image needs to be added at: ${path.join(imageDir, "preview.png")}`,
);
console.log(
  "    You can use the blog-post custom agent or an image generation tool to create it.",
);
