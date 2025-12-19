const OpenAI = require("openai");
const { humanizeString } = require("humanize-ai-lib");

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

  async generateSocialSnippet({ title, excerpt, url, language }) {
    const prompt =
      "Write one short, engaging social post." +
      " Max 240 characters promoting a tech blog article." +
      ` ${this.getLanguageInstruction(language)}`;

    const response = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.5,
      max_tokens: 120,
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: `Title: ${title}\nExcerpt: ${excerpt}\nLink: ${url}`,
        },
      ],
    });

    const content = response?.choices?.[0]?.message?.content;
    if (!content) {
      return "";
    }

    return humanizeText(content.replace(/\s+/g, " "));
  }
}

module.exports = { OpenAIService, humanizeText };
