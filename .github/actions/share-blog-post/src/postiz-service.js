const Postiz = require("@postiz/node").default;

class PostizService {
  constructor({ apiKey, apiUrl, client } = {}) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;

    this.client =
      client ??
      new Postiz({
        apiKey: this.apiKey,
        baseUrl: this.getBaseUrl(),
      });
  }

  getBaseUrl() {
    const baseUrl = String(this.apiUrl ?? "").trim();
    if (!baseUrl) {
      throw new Error("Postiz apiUrl is required");
    }

    // Avoid regex on uncontrolled input (CodeQL ReDoS rule); strip trailing slashes safely.
    let normalizedBaseUrl = baseUrl;
    while (normalizedBaseUrl.endsWith("/")) {
      normalizedBaseUrl = normalizedBaseUrl.slice(0, -1);
    }

    return normalizedBaseUrl;
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
