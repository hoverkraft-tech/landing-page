const core = require("@actions/core");
const { spawn } = require("child_process");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

async function waitForServer(url, timeout = 60000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch (error) {
      // Server not ready yet
      core.warn(`Server not ready yet: ${error.message}`);
    }

    // Wait 1 second before trying again
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

    // Set viewport for consistent rendering
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

    // Wait a bit for any lazy-loaded content
    await page.waitForTimeout(2000);

    core.info(`Generating PDF...`);

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate PDF
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

    // Get file size
    const stats = fs.statSync(outputPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    core.info(`  File size: ${fileSizeInMB} MB`);

    return true;
  } finally {
    await browser.close();
  }
}

async function run() {
  let server = null;

  try {
    const pageUrl =
      core.getInput("page-url") || "http://localhost:4321/charte-graphique";
    const outputFile =
      core.getInput("output-file") ||
      "application/public/brand/downloads/hoverkraft-brand-guidelines.pdf";
    const workingDirectory =
      core.getInput("working-directory") || "application";

    // Start development server
    core.info("Starting development server...");
    server = spawn("npm", ["run", "dev"], {
      cwd: workingDirectory,
      stdio: "pipe",
    });

    // Wait for server to be ready
    core.info("Waiting for server to be ready...");
    await waitForServer("http://localhost:4321");
    core.info("✓ Server is ready");

    // Generate PDF
    await generatePDF(pageUrl, outputFile);

    core.setOutput("success", "true");
  } catch (error) {
    core.setFailed(`Failed to generate PDF: ${error.message}`);
    core.setOutput("success", "false");
  } finally {
    // Stop the development server
    if (server) {
      core.info("Stopping development server...");
      server.kill();
    }
  }
}

run();
