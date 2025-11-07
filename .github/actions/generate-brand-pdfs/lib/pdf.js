const fs = require("node:fs");
const path = require("node:path");
const puppeteer = require("puppeteer");

async function generatePDF({
  pageUrl,
  outputPath,
  core,
  puppeteerModule = puppeteer,
}) {
  const browser = await puppeteerModule.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    await page.setViewport({
      width: 1200,
      height: 800,
      deviceScaleFactor: 2,
    });

    core.info(`Navigating to ${pageUrl}...`);
    await page.goto(pageUrl, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });

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

module.exports = {
  generatePDF,
};
