/**
 * OpenAI API Service
 * Handles all interactions with OpenAI API using official SDK
 */

const OpenAI = require('openai');

class OpenAIService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('OpenAI API key is required');
    }
    this.client = new OpenAI({ apiKey });
  }

  getMaxOutputTokens(options = {}) {
    return options.max_output_tokens ?? options.max_tokens ?? 2000;
  }

  getMessageText(content) {
    if (typeof content === 'string') {
      return content.trim();
    }

    if (!Array.isArray(content)) {
      return '';
    }

    return content
      .map((item) => {
        if (typeof item === 'string') {
          return item.trim();
        }

        if (typeof item?.text === 'string') {
          return item.text.trim();
        }

        if (typeof item?.content === 'string') {
          return item.content.trim();
        }

        return '';
      })
      .filter(Boolean)
      .join('\n')
      .trim();
  }

  buildResponsesRequest(messages) {
    const instructions = [];
    const inputMessages = [];

    for (const message of Array.isArray(messages) ? messages : []) {
      const text = this.getMessageText(message?.content);
      if (!text) {
        continue;
      }

      if (message?.role === 'system' || message?.role === 'developer') {
        instructions.push(text);
        continue;
      }

      const role = typeof message?.role === 'string' ? message.role : 'user';
      inputMessages.push(role === 'user' ? text : `${role}: ${text}`);
    }

    const input = inputMessages.join('\n\n').trim();

    return {
      instructions: instructions.join('\n\n').trim() || undefined,
      input: input || 'Provide the requested result.',
    };
  }

  /**
   * Call OpenAI Responses API
   * See https://developers.openai.com/api/docs/guides/image-generation?api=responses
   */
  async generateText(messages, options = {}) {
    const request = this.buildResponsesRequest(messages);
    const response = await this.client.responses.create({
      model: options.model ?? 'gpt-5.4-nano',
      instructions: request.instructions,
      input: request.input,
      temperature: options.temperature ?? 0.7,
      max_output_tokens: this.getMaxOutputTokens(options),
    });

    return (response.output_text || '').trim();
  }

  /**
   * Generate image using Image API
   * See https://developers.openai.com/api/docs/guides/image-generation?api=image
   */
  async generateImage(prompt, options = {}) {
    const response = await this.client.images.generate({
      model: options.model || 'gpt-image-2',
      prompt: prompt,
      n: 1,
      size: options.size || '1792x1024',
      quality: options.quality || 'high',
    });

    return response.data[0].url;
  }
}

module.exports = { OpenAIService };
