/**
 * OpenAI API Service
 * Handles all interactions with OpenAI API
 */

const https = require("https");

class OpenAIService {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }
    this.apiKey = apiKey;
  }

  /**
   * Call OpenAI Chat Completions API
   */
  async generateText(messages, options = {}) {
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
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Length": Buffer.byteLength(payload),
          },
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            if (res.statusCode === 200) {
              const response = JSON.parse(data);
              resolve(response.choices[0].message.content.trim());
            } else {
              reject(
                new Error(`OpenAI API error: ${res.statusCode} - ${data}`),
              );
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
   * Generate image using DALL-E
   */
  async generateImage(prompt, options = {}) {
    const payload = JSON.stringify({
      model: options.model || "dall-e-3",
      prompt: prompt,
      n: 1,
      size: options.size || "1792x1024",
      quality: options.quality || "standard",
      style: options.style || "vivid",
    });

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: "api.openai.com",
          path: "/v1/images/generations",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
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
              reject(
                new Error(`OpenAI API error: ${res.statusCode} - ${data}`),
              );
            }
          });
        },
      );

      req.on("error", reject);
      req.write(payload);
      req.end();
    });
  }
}

module.exports = { OpenAIService };
