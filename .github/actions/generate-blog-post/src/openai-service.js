/**
 * OpenAI API Service
 * Handles all interactions with OpenAI API using official SDK
 */

const OpenAI = require("openai");

class OpenAIService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }
    this.client = new OpenAI({ apiKey });
  }

  /**
   * Call OpenAI Chat Completions API
   */
  async generateText(messages, options = {}) {
    const completion = await this.client.chat.completions.create({
      model: options.model || "gpt-4o-mini",
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 2000,
    });

    return completion.choices[0].message.content.trim();
  }

  /**
   * Generate image using DALL-E
   */
  async generateImage(prompt, options = {}) {
    const response = await this.client.images.generate({
      model: options.model || "dall-e-3",
      prompt: prompt,
      n: 1,
      size: options.size || "1792x1024",
      quality: options.quality || "standard",
      style: options.style || "vivid",
    });

    return response.data[0].url;
  }
}

module.exports = { OpenAIService };
