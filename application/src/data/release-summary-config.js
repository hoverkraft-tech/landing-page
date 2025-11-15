const languageLabels = {
  fr: 'French (France)',
  en: 'English (US)',
};

const locales = {
  fr: {
    locale: 'fr-FR',
    author: 'Équipe HoverKraft',
    buildTitle: (dateLabel) => `Releases HoverKraft Tech - ${dateLabel}`,
    buildExcerpt: (total, monthLabel) =>
      `Découvrez les dernières mises à jour de nos projets open source : ${total} nouvelle${total > 1 ? 's' : ''} release${total > 1 ? 's' : ''} publiée${total > 1 ? 's' : ''} en ${monthLabel}.`,
  },
  en: {
    locale: 'en-US',
    author: 'HoverKraft Team',
    buildTitle: (dateLabel) => `HoverKraft Tech Releases - ${dateLabel}`,
    buildExcerpt: (total, monthLabel) =>
      `Discover the latest updates from our open source projects: ${total} new release${total > 1 ? 's' : ''} published in ${monthLabel}.`,
  },
};

const ui = {
  fr: {
    intro: {
      heading: 'Résumé express',
    },
    stats: {
      title: "Synthèse d'activité",
      period: 'Période',
      repositories: 'Dépôts analysés',
      releases: 'Releases publiées',
      busiest: 'Projet le plus actif',
      latest: 'Release la plus récente',
      busiestFallback: 'Activité répartie sur les dépôts',
      latestFallback: 'Release récente non disponible',
    },
    repo: {
      descriptionFallback: 'Pas de description fournie.',
      releasesHeading: 'Releases couvertes',
      starsLabel: 'Stars',
      repoLinkLabel: 'Dépôt',
      repoLinkCta: 'Voir le dépôt',
      releaseCountLabel: 'Releases sur la période',
      releaseCountShort: 'releases',
    },
    release: {
      publishedOn: 'Publié le',
      version: 'Version',
      linkLabel: 'Lien GitHub',
      linkCta: 'Consulter la release',
      highlights: 'Points clés',
      highlightsFallback: 'Notes non fournies pour cette release.',
    },
    closing: {
      title: "Passez à l'action",
      signature: '**HoverKraft Tech** - _Simplifier la complexité, accélérer la delivery_',
    },
  },
  en: {
    intro: {
      heading: 'Quick glance',
    },
    stats: {
      title: 'Activity snapshot',
      period: 'Period',
      repositories: 'Repositories covered',
      releases: 'Releases shipped',
      busiest: 'Busiest project',
      latest: 'Most recent release',
      busiestFallback: 'Even activity across repositories',
      latestFallback: 'Recent release not available',
    },
    repo: {
      descriptionFallback: 'No description provided.',
      releasesHeading: 'Covered releases',
      starsLabel: 'Stars',
      repoLinkLabel: 'Repository',
      repoLinkCta: 'View repository',
      releaseCountLabel: 'Releases in this period',
      releaseCountShort: 'releases',
    },
    release: {
      publishedOn: 'Published on',
      version: 'Version',
      linkLabel: 'GitHub link',
      linkCta: 'View release',
      highlights: 'Highlights',
      highlightsFallback: 'Release notes were not provided.',
    },
    closing: {
      title: 'Keep the momentum',
      signature: '**HoverKraft Tech** - _Simplifying complexity, accelerating delivery_',
    },
  },
};

const promptCopy = {
  fr: {
    contextHeading: 'Données pour ton résumé',
    highlightHeading: 'Dépôts en lumière',
    periodLabel: 'Période / Period',
    noHighlights: 'Aucun dépôt distinct à signaler.',
  },
  en: {
    contextHeading: 'Data points',
    highlightHeading: 'Repositories to note',
    periodLabel: 'Period',
    noHighlights: 'No standout repository this time.',
  },
};

const buildHighlightBlock = (language, repoHighlights) => {
  const copy = promptCopy[language];
  if (!Array.isArray(repoHighlights) || repoHighlights.length === 0) {
    return copy?.noHighlights || '';
  }
  return repoHighlights.map((item) => `- ${item}`).join('\n');
};

const prompts = {
  system: (language) => {
    const label = languageLabels[language] ?? language;
    return `You are a senior technical writer for HoverKraft Tech. Always write in ${label}.`;
  },
  introduction: (language, stats, repoHighlights) => {
    const statsLabels = ui[language]?.stats ?? {};
    const copy = promptCopy[language];
    const label = languageLabels[language] ?? language;
    const highlightBlock = buildHighlightBlock(language, repoHighlights);

    return `${copy.contextHeading}:
- ${statsLabels.period}: ${stats.periodLabel}
- ${statsLabels.repositories}: ${stats.totalRepos}
- ${statsLabels.releases}: ${stats.totalReleases}
- ${statsLabels.busiest}: ${
      stats.busiestRepo ? `${stats.busiestRepo.name} (${stats.busiestRepo.count})` : statsLabels.busiestFallback
    }
- ${statsLabels.latest}: ${
      stats.mostRecentRelease
        ? `${stats.mostRecentRelease.repo} ${stats.mostRecentRelease.name} (${stats.mostRecentRelease.dateLabel})`
        : statsLabels.latestFallback
    }

${copy.highlightHeading}:
${highlightBlock}

Write the full response in ${label}. Produce a short update in raw Markdown (no \`\`\` fences): start with a strong hook or quote about the period, follow with one factual paragraph, then optionally add a bulleted list of 2-3 takeaways. No emoji or extra commentary.`;
  },
  closing: (language, stats, repoHighlights) => {
    const statsLabels = ui[language]?.stats ?? {};
    const copy = promptCopy[language];
    const label = languageLabels[language] ?? language;
    const highlightBlock = buildHighlightBlock(language, repoHighlights);

    return `${copy.periodLabel}: ${stats.periodLabel}
${statsLabels.repositories}: ${stats.totalRepos}
${statsLabels.releases}: ${stats.totalReleases}
${statsLabels.busiest}: ${
      stats.busiestRepo ? `${stats.busiestRepo.name} (${stats.busiestRepo.count})` : statsLabels.busiestFallback
    }
${statsLabels.latest}: ${
      stats.mostRecentRelease
        ? `${stats.mostRecentRelease.repo} ${stats.mostRecentRelease.name}`
        : statsLabels.latestFallback
    }

${copy.highlightHeading}:
${highlightBlock}

Write the entire response in ${label}. Provide a concise closing paragraph followed by a bulleted list of 2-3 concrete actions in raw Markdown (no \`\`\` fences or commentary).`;
  },
};

const releaseSummaryConfig = {
  locales,
  ui,
  prompts,
};

module.exports = releaseSummaryConfig;
