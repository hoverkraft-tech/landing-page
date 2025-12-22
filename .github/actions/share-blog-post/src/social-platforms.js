function normalizeIntegrationType(integrationType) {
  const normalized = `${integrationType ?? ""}`.trim().toLowerCase();
  if (!normalized) {
    return "";
  }

  // Common aliases
  if (normalized === "dev.to") {
    return "devto";
  }

  return normalized;
}

function getPlatformSpec(integrationType) {
  const type = normalizeIntegrationType(integrationType);

  if (type === "bluesky") {
    return {
      type,
      openAI: {
        instruction:
          "Write a short Bluesky post. Casual, punchy, no emojis." +
          " Max 240 characters." +
          " Do NOT include the link (it will be appended)." +
          " Avoid more than 2 hashtags.",
        maxTokens: 120,
        preserveNewlines: false,
      },
      formatting: {
        includeReadMoreLabel: false,
        appendLinkOnNewLine: false,
      },
    };
  }

  if (type === "linkedin") {
    return {
      type,
      openAI: {
        instruction:
          "Write a LinkedIn post. Professional and helpful." +
          " 1-2 short sentences, optionally one short line break." +
          " Max 600 characters." +
          " Do NOT include the link (it will be appended)." +
          " Avoid hype and avoid more than 3 hashtags.",
        maxTokens: 200,
        preserveNewlines: false,
      },
      formatting: {
        includeReadMoreLabel: true,
        appendLinkOnNewLine: false,
      },
    };
  }

  if (type === "medium" || type === "devto") {
    return {
      type,
      openAI: {
        instruction:
          "Write a longer teaser for a technical article." +
          " 2-3 sentences then 3 bullet takeaways (each bullet starts with '- ')." +
          " No emojis, no hashtags." +
          " Max 1200 characters." +
          " Do NOT include the link (it will be appended on a new line).",
        maxTokens: 400,
        preserveNewlines: true,
      },
      formatting: {
        includeReadMoreLabel: true,
        appendLinkOnNewLine: true,
      },
    };
  }

  return {
    type,
    openAI: {
      instruction:
        "Write one short, engaging social post promoting a tech blog article." +
        " Max 240 characters." +
        " Do NOT include the link (it will be appended).",
      maxTokens: 120,
      preserveNewlines: false,
    },
    formatting: {
      includeReadMoreLabel: true,
      appendLinkOnNewLine: false,
    },
  };
}

module.exports = {
  normalizeIntegrationType,
  getPlatformSpec,
};
