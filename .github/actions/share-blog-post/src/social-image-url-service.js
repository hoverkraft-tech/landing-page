class SocialImageUrlService {
  constructor({ core, githubRepository, githubSha } = {}) {
    this.core = core;
    this.githubRepository = githubRepository;
    this.githubSha = githubSha;
  }

  getRepository() {
    const repository = String(this.githubRepository ?? "").trim();
    if (!repository) {
      throw new Error(
        "githubRepository is required to build social image URLs",
      );
    }
    return repository;
  }

  getSha() {
    const sha = String(this.githubSha ?? "").trim();
    if (!sha) {
      throw new Error("githubSha is required to build social image URLs");
    }
    return sha;
  }

  resolveFromTildePath(socialImage) {
    if (typeof socialImage !== "string" || socialImage.trim().length === 0) {
      throw new Error("socialImage path is required");
    }

    const normalized = socialImage.trim();
    if (!normalized.startsWith("~/")) {
      throw new Error(
        `Cannot resolve social image URL from non-tilde path: ${socialImage}`,
      );
    }

    const repoPath = `application/src/${normalized.slice(2)}`;

    try {
      const repository = this.getRepository();
      const sha = this.getSha();
      return `https://raw.githubusercontent.com/${repository}/${sha}/${repoPath}`;
    } catch (error) {
      throw new Error(
        `Cannot resolve social image URL from path ${socialImage}: ${error.message}`,
      );
    }
  }
}

module.exports = { SocialImageUrlService };
