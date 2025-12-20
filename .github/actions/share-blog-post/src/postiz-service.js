class PostizService {
  constructor({ apiKey, apiUrl }) {
    this.apiKey = apiKey;
    this.apiUrl = apiUrl;
  }

  getPostsUrl() {
    const baseUrl = String(this.apiUrl ?? "").trim();
    if (!baseUrl) {
      throw new Error("Postiz apiUrl is required");
    }

    // Avoid regex on uncontrolled input (CodeQL ReDoS rule); strip trailing slashes safely.
    let normalizedBaseUrl = baseUrl;
    while (normalizedBaseUrl.endsWith("/")) {
      normalizedBaseUrl = normalizedBaseUrl.slice(0, -1);
    }

    if (normalizedBaseUrl.toLowerCase().endsWith("/posts")) {
      return normalizedBaseUrl;
    }

    return `${normalizedBaseUrl}/posts`;
  }

  async createPost(payload) {
    const response = await fetch(this.getPostsUrl(), {
      method: "POST",
      headers: {
        Authorization: this.apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new Error(
        `Postiz API error (${response.status}): ${body || response.statusText}`,
      );
    }

    return response
      .clone()
      .json()
      .catch(() => response.text());
  }
}

module.exports = { PostizService };
