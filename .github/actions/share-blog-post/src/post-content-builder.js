const { getPlatformSpec } = require("./social-platforms");

function buildPostContent({ description, url, readMoreLabel }) {
  const normalizedDescription = String(description ?? "").trim();
  const normalizedUrl = String(url ?? "").trim();
  const normalizedLabel = String(readMoreLabel ?? "").trim();

  if (!normalizedDescription) {
    return normalizedUrl;
  }

  if (normalizedUrl && normalizedDescription.includes(normalizedUrl)) {
    return normalizedDescription;
  }

  if (!normalizedUrl) {
    return normalizedDescription;
  }

  if (!normalizedLabel) {
    return `${normalizedDescription} ${normalizedUrl}`.trim();
  }

  return `${normalizedDescription} ${normalizedLabel} ${normalizedUrl}`.trim();
}

function buildPostContentForIntegration({
  description,
  url,
  readMoreLabel,
  integrationType,
}) {
  const spec = getPlatformSpec(integrationType);
  const normalizedUrl = String(url ?? "").trim();
  const normalizedDescription = String(description ?? "").trim();

  if (!normalizedDescription) {
    return normalizedUrl;
  }

  const effectiveReadMoreLabel = spec.formatting.includeReadMoreLabel
    ? readMoreLabel
    : "";

  if (!spec.formatting.appendLinkOnNewLine) {
    return buildPostContent({
      description: normalizedDescription,
      url: normalizedUrl,
      readMoreLabel: effectiveReadMoreLabel,
    });
  }

  if (!normalizedUrl) {
    return normalizedDescription;
  }

  if (normalizedDescription.includes(normalizedUrl)) {
    return normalizedDescription;
  }

  const normalizedLabel = String(effectiveReadMoreLabel ?? "").trim();
  const linkLine = normalizedLabel
    ? `${normalizedLabel} ${normalizedUrl}`
    : normalizedUrl;

  return `${normalizedDescription}\n\n${linkLine}`.trim();
}

module.exports = {
  buildPostContentForIntegration,
};
