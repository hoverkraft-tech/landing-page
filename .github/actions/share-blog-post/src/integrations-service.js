class IntegrationsService {
  parse({ integrationsRaw }) {
    if (!integrationsRaw || integrationsRaw.trim().length === 0) {
      throw new Error("postiz-integrations is required");
    }

    let parsed;
    try {
      parsed = JSON.parse(integrationsRaw);
    } catch (error) {
      throw new Error(
        "postiz-integrations must be valid JSON: " + error.message,
        { cause: error },
      );
    }

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error(
        "postiz-integrations must be a JSON object mapping platform -> integration id",
      );
    }

    const integrations = Object.entries(parsed).map(
      ([platformRaw, integrationIdRaw]) => {
        const platform = `${platformRaw ?? ""}`.trim();
        const integrationId = `${integrationIdRaw ?? ""}`.trim();

        if (platform.length === 0) {
          throw new Error(
            "postiz-integrations keys must be non-empty platform names",
          );
        }

        if (integrationId.length === 0) {
          throw new Error(
            `postiz-integrations must provide a non-empty integration id for '${platform}'`,
          );
        }

        return { id: integrationId, type: platform };
      },
    );

    if (integrations.length === 0) {
      throw new Error(
        "postiz-integrations must contain at least one integration",
      );
    }

    return integrations;
  }
}

module.exports = { IntegrationsService };
