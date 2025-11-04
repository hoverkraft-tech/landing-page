const core = require("@actions/core");
const { spawn } = require("child_process");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const vm = require("vm");

function resolveWorkspacePath(targetPath) {
  const workspace = process.env.GITHUB_WORKSPACE || process.cwd();
  return path.isAbsolute(targetPath)
    ? targetPath
    : path.join(workspace, targetPath);
}

function loadRoutes(routesPath) {
  try {
    const uiContent = fs.readFileSync(routesPath, "utf8");
    const match = uiContent.match(/export const routes = (\{[\s\S]*?\});/);

    if (!match) {
      core.warning(
        `Could not locate routes definition in ${routesPath}; falling back to default slugs.`,
      );
      return {};
    }

    const objectLiteral = match[1].replace(/;$/, "");
    return vm.runInNewContext(`(${objectLiteral})`);
  } catch (error) {
    core.warning(`Failed to read routes from ${routesPath}: ${error.message}`);
    return {};
  }
}

function buildLocaleSlugMap(locales, routes, defaultLocale, defaultSlug) {
  if (!defaultLocale || !defaultSlug) {
    throw new Error("default-locale and default-slug inputs are required");
  }

  const normalizedDefaultSlug = defaultSlug.trim().replace(/^\/+/u, "");
  const map = {};

  for (const item of locales) {
    const locale = typeof item === "string" ? item.trim() : String(item ?? "");

    if (!locale) {
      throw new Error("Locales must contain non-empty strings");
    }

    if (locale === defaultLocale) {
      map[locale] = normalizedDefaultSlug;
      continue;
    }

    const localeRoutes = routes?.[locale] || {};
    const translatedSlug = localeRoutes?.[normalizedDefaultSlug];
    const resolvedSlug =
      typeof translatedSlug === "string" && translatedSlug.trim().length > 0
        ? translatedSlug.trim()
        : normalizedDefaultSlug;

    map[locale] = `${locale}/${resolvedSlug.replace(/^\/+/u, "")}`;
  }

  return map;
}

async function waitForServer(url, timeout = 60000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch (error) {
      // Server not ready yet; retry after a short delay.
      core.warn(`Server not ready yet: ${error.message}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  throw new Error(`Server at ${url} did not become ready within ${timeout}ms`);
}

async function generatePDF(url, outputPath) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Set viewport for consistent rendering across locales.
    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 2,
    });

    core.info(`Navigating to ${url}...`);
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

    // Allow lazy-loaded content to settle before capture.
    await page.waitForTimeout(2000);

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await page.pdf({
      path: outputPath,
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "15mm",
        bottom: "20mm",
        left: "15mm",
      },
    });

    core.info(`✓ PDF generated successfully: ${outputPath}`);

    const stats = fs.statSync(outputPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    core.info(`  File size: ${fileSizeInMB} MB`);
  } finally {
    await browser.close();
  }
}

function normalizeBaseUrl(rawBaseUrl) {
  if (!rawBaseUrl || typeof rawBaseUrl !== "string") {
    throw new Error("base-url input is required and must be a string");
  }

  return rawBaseUrl.endsWith("/") ? rawBaseUrl : `${rawBaseUrl}/`;
}

async function run() {
  let server = null;

  try {
    const localesJson = core.getInput("locales", { required: true });
    const defaultSlug = core.getInput("default-slug", { required: true });
    const routesFileInput = core.getInput("routes-file");
    const baseUrlInput = core.getInput("base-url", { required: true });
    const downloadsDir = core.getInput("downloads-dir", { required: true });
    const workingDirectory = core.getInput("working-directory", {
      required: true,
    });

    let locales;
    try {
      locales = JSON.parse(localesJson);
    } catch (error) {
      throw new Error(`Invalid locales-json input: ${error.message}`);
    }

    if (!Array.isArray(locales) || locales.length === 0) {
      throw new Error("locales-json must serialize to a non-empty array");
    }

    const defaultLocale = locales[0];

    const routesPath = resolveWorkspacePath(
      routesFileInput || "application/src/i18n/ui.ts",
    );
    const routes = loadRoutes(routesPath);
    const localeSlugMap = buildLocaleSlugMap(
      locales,
      routes,
      defaultLocale,
      defaultSlug,
    );

    const entries = Object.entries(localeSlugMap);
    const baseUrl = normalizeBaseUrl(baseUrlInput);
    const resolvedDownloadsDir = resolveWorkspacePath(downloadsDir);
    const resolvedWorkingDirectory = resolveWorkspacePath(workingDirectory);

    const pages = entries.map(([locale, slug], index) => {
      if (typeof locale !== "string" || locale.trim().length === 0) {
        throw new Error(
          `Locale key at index ${index} must be a non-empty string`,
        );
      }

      if (typeof slug !== "string" || slug.trim().length === 0) {
        throw new Error(
          `Slug for locale "${locale}" must be a non-empty string`,
        );
      }

      const normalizedSlug = slug.trim().replace(/^\/+/u, "");
      const pageUrl = new URL(normalizedSlug, baseUrl).toString();
      const outputFile = path.join(
        resolvedDownloadsDir,
        `hoverkraft-brand-guidelines-${locale}.pdf`,
      );

      return {
        locale,
        pageUrl,
        outputFile,
      };
    });

    core.info(
      `Prepared PDF plan: ${pages
        .map(({ locale, pageUrl }) => `${locale} → ${pageUrl}`)
        .join(", ")}`,
    );

    core.info("Starting development server...");
    server = spawn("npm", ["run", "dev"], {
      cwd: resolvedWorkingDirectory,
      stdio: "pipe",
    });

    const serverUrl = new URL("/", baseUrl).toString();

    core.info("Waiting for server to be ready...");
    await waitForServer(serverUrl);
    core.info("✓ Server is ready");

    const generatedFiles = [];

    for (const { locale, pageUrl, outputFile } of pages) {
      core.startGroup(`Generating PDF for locale: ${locale}`);
      await generatePDF(pageUrl, outputFile);
      generatedFiles.push({ locale, pageUrl, outputFile });
      core.endGroup();
    }

    core.setOutput("generated-files", JSON.stringify(generatedFiles));
  } catch (error) {
    core.setFailed(`Failed to generate PDFs: ${error.message}`);
  } finally {
    if (server) {
      core.info("Stopping development server...");
      server.kill();
    }
  }
}

run();
