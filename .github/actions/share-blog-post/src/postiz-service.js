const Postiz = require("@postiz/node").default;

class PostizService {
  constructor({ apiKey, apiUrl, integrations, client } = {}) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
    this.integrations = integrations;

    this.client = client ?? new Postiz(this.getApiKey(), this.getBaseUrl());
  }

  getBaseUrl() {
    const baseUrl = String(this.apiUrl ?? "").trim();
    if (!baseUrl) {
      throw new Error("Postiz apiUrl is required");
    }

    let normalizedBaseUrl = baseUrl;
    while (normalizedBaseUrl.endsWith("/")) {
      normalizedBaseUrl = normalizedBaseUrl.slice(0, -1);
    }

    return normalizedBaseUrl;
  }

  getApiKey() {
    const apiKey = String(this.apiKey ?? "").trim();
    if (!apiKey) {
      throw new Error("Postiz apiKey is required");
    }
    return apiKey;
  }

  async createDraftPost({
    postId,
    content,
    contentByIntegrationType,
    socialImageUrl,
  } = {}) {
    const payload = this.buildDraftPayload({
      postId,
      content,
      contentByIntegrationType,
      socialImageUrl,
    });

    return this.createPost(payload);
  }

  buildDraftPayload({
    postId,
    content,
    contentByIntegrationType,
    socialImageUrl,
  }) {
    const integrations = this.integrations;
    if (!Array.isArray(integrations) || integrations.length === 0) {
      throw new Error("No Postiz integrations configured");
    }

    const normalizedPostId = String(postId ?? "").trim();
    if (!normalizedPostId) {
      throw new Error("Blog post id is required");
    }

    const normalizedFallbackContent = String(content ?? "").trim();

    const normalizedContentByIntegrationType =
      contentByIntegrationType && typeof contentByIntegrationType === "object"
        ? Object.fromEntries(
            Object.entries(contentByIntegrationType).map(([key, value]) => [
              String(key ?? "").trim(),
              String(value ?? "").trim(),
            ]),
          )
        : null;

    if (!normalizedFallbackContent && !normalizedContentByIntegrationType) {
      throw new Error(
        "Either 'content' or 'contentByIntegrationType' must be provided",
      );
    }

    const normalizedSocialImageUrl = String(socialImageUrl ?? "").trim();
    const images = normalizedSocialImageUrl
      ? [
          {
            id: `${normalizedPostId}-preview`,
            path: normalizedSocialImageUrl,
          },
        ]
      : [];

    return {
      id: normalizedPostId,
      type: "draft",
      date: new Date().toISOString(),
      shortLink: false,
      tags: [],
      posts: integrations.map((integration) => ({
        ...(function () {
          const perIntegrationContent =
            normalizedContentByIntegrationType?.[integration.type] ??
            normalizedFallbackContent;

          if (!perIntegrationContent) {
            throw new Error(
              `Missing content for integration type '${integration.type}' (and no fallback content provided)`,
            );
          }

          return {
            integration: { id: integration.id },
            value: [{ content: perIntegrationContent, image: images }],
            settings: { __type: integration.type },
          };
        })(),
      })),
    };
  }

  async createPost(payload) {
    const result = await this.client.post(payload);

    // The SDK currently returns `.json()` without checking HTTP status.
    // Postiz commonly returns NestJS-like error payloads; detect them and throw.
    if (result && typeof result === "object") {
      const statusCode = result.statusCode;
      const error = result.error;
      const message = result.message;

      if (
        (typeof statusCode === "number" || typeof error === "string") &&
        (typeof message === "string" || Array.isArray(message))
      ) {
        const normalizedMessage = Array.isArray(message)
          ? message.join(", ")
          : message;
        throw new Error(
          `Postiz API error (${statusCode ?? "unknown"}): ${normalizedMessage}`,
        );
      }
    }

    return result;
  }
}

module.exports = { PostizService };
