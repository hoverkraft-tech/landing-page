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
    return options.max_output_tokens ?? 2000;
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
   * Generate a preview using brand references with the Image Edits API
   * See https://developers.openai.com/api/docs/guides/image-generation?api=image
   */
  async generateImage(prompt, options = {}) {
    if (!Array.isArray(options.referenceImages) || options.referenceImages.length === 0) {
      throw new Error('Brand reference images are required for blog previews');
    }

    const image = await Promise.all(
      options.referenceImages.map(({ data, name }) => OpenAI.toFile(data, name, { type: 'image/png' }))
    );
    const response = await this.client.images.edit({
      model: options.model || 'gpt-image-2',
      image,
      prompt: prompt,
      n: 1,
      size: options.size || '1536x1024',
      quality: options.quality || 'high',
      background: 'transparent',
      output_format: 'png',
    });

    const imageBase64 = response.data?.[0]?.b64_json;
    if (typeof imageBase64 !== 'string' || !imageBase64.trim()) {
      throw new Error('OpenAI image response did not include base64 image data');
    }

    const normalizedImageBase64 = imageBase64.trim();
    const imageBuffer = Buffer.from(normalizedImageBase64, 'base64');
    if (imageBuffer.length === 0 || imageBuffer.toString('base64') !== normalizedImageBase64) {
      throw new Error('OpenAI image response did not include base64 image data');
    }

    return imageBuffer;
  }
}

module.exports = { OpenAIService };
