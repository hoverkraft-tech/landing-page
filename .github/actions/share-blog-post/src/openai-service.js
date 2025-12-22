const OpenAI = require("openai");
const { humanizeString } = require("humanize-ai-lib");
const { getPlatformSpec } = require("./social-platforms");

function humanizeText(value) {
  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  try {
    const result = humanizeString(trimmed, {
      transformHidden: true,
      transformTrailingWhitespace: true,
      transformNbs: true,
      transformDashes: true,
      transformQuotes: true,
      transformOther: true,
      keyboardOnly: false,
    });

    return result?.text ?? trimmed;
  } catch (error) {
    console.warn(
      "[share-blog-post][openai-service] Failed to humanize text. Returning original value.",
      error?.message || error,
    );
    return trimmed;
  }
}

class OpenAIService {
  constructor(apiKey) {
    this.client = new OpenAI({ apiKey });
  }

  getLanguageInstruction(language) {
    const normalized = `${language || ""}`.trim().toLowerCase();
    if (!normalized) {
      return "";
    }
    if (normalized === "fr") {
      return "Write the post in French.";
    }
    if (normalized === "en") {
      return "Write the post in English.";
    }
    return `Write the post in ${normalized}.`;
  }

  normalizeModelText(text, { preserveNewlines }) {
    if (typeof text !== "string") {
      return "";
    }

    const raw = text.replace(/\r\n/g, "\n");
    if (!preserveNewlines) {
      return humanizeText(raw.replace(/\s+/g, " ").trim());
    }

    // Keep paragraphs/bullets but avoid excessive blank lines.
    const compacted = raw
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    return humanizeText(compacted);
  }

  async generateSocialSnippet({
    title,
    excerpt,
    url,
    language,
    integrationType,
  }) {
    const spec = getPlatformSpec(integrationType);
    const prompt = `${spec.openAI.instruction} ${this.getLanguageInstruction(
      language,
    )}`;

    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: spec.openAI.maxTokens,
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: `Title: ${title}\nExcerpt: ${excerpt}\nLink (for context only, do not repeat): ${url}`,
        },
      ],
    });

    const content = response?.choices?.[0]?.message?.content;
    if (!content) {
      return "";
    }

    return this.normalizeModelText(content, {
      preserveNewlines: spec.openAI.preserveNewlines,
    });
  }
}

module.exports = { OpenAIService, humanizeText };
