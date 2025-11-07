const {
  parseJsonInput,
  normalizeBaseUrl,
  resolveWorkspacePath,
} = require("./lib/inputs");
const { loadRoutes, buildLocaleSlugMap } = require("./lib/routes");
const { createGenerationPlan } = require("./lib/plan");
const { generatePDF } = require("./lib/pdf");
const {
  startDevServer,
  waitForServer,
  stopDevServer,
} = require("./lib/server");

function assertCore(core) {
  if (
    !core ||
    typeof core.info !== "function" ||
    typeof core.setFailed !== "function"
  ) {
    throw new Error("A valid GitHub Actions core object is required");
  }
}

async function run({
  core,
  locales,
  defaultSlug,
  routesFile,
  baseUrl,
  downloadsDir,
  workingDirectory,
  puppeteerModule,
  workspace,
}) {
  assertCore(core);
  let server = null;

  try {
    const parsedLocales = parseJsonInput("locales", locales);
    if (!Array.isArray(parsedLocales) || parsedLocales.length === 0) {
      throw new Error("locales input must serialize to a non-empty array");
    }

    const defaultLocale = parsedLocales[0];
    const safeDefaultSlug = (defaultSlug ?? "").trim();
    if (!safeDefaultSlug) {
      throw new Error("default-slug input is required");
    }

    const safeRoutesFile = (routesFile ?? "").trim();
    if (!safeRoutesFile) {
      throw new Error("routes-file input is required");
    }

    const routesPath = resolveWorkspacePath(safeRoutesFile, workspace);
    const routes = loadRoutes(routesPath);
    const localeSlugMap = buildLocaleSlugMap(
      parsedLocales,
      routes,
      defaultLocale,
      safeDefaultSlug,
    );

    const normalizedBaseUrl = normalizeBaseUrl(baseUrl);
    const resolvedDownloadsDir = resolveWorkspacePath(downloadsDir, workspace);
    const resolvedWorkingDirectory = resolveWorkspacePath(
      workingDirectory,
      workspace,
    );

    const plan = createGenerationPlan(
      localeSlugMap,
      normalizedBaseUrl,
      resolvedDownloadsDir,
    );

    core.info(
      `Prepared PDF plan: ${plan
        .map(({ locale, pageUrl }) => `${locale} → ${pageUrl}`)
        .join(", ")}`,
    );

    core.info("Starting development server...");
    server = startDevServer({
      cwd: resolvedWorkingDirectory,
      core: core,
    });

    const serverUrl = new URL("/", normalizedBaseUrl).toString();

    core.info("Waiting for server to be ready...");
    await waitForServer(serverUrl, 60000);
    core.info("✓ Server is ready");

    const generatedFiles = [];

    for (const entry of plan) {
      core.startGroup(`Generating PDF for locale: ${entry.locale}`);
      await generatePDF({
        pageUrl: entry.pageUrl,
        outputPath: entry.outputFile,
        core: core,
        puppeteerModule,
      });
      generatedFiles.push(entry);
      core.endGroup();
    }

    core.setOutput("generated-files", JSON.stringify(generatedFiles));
  } catch (error) {
    core.setFailed(`Failed to generate PDFs: ${error.message}`);
  } finally {
    await stopDevServer(server, core);
  }
}

module.exports = {
  run,
};
