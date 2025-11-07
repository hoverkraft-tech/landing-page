const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { describe, it } = require("node:test");
const mockFs = require("mock-fs");

const { generatePDF } = require("../lib/pdf");

describe("lib/pdf", () => {
  it("generates a PDF and reports progress", async () => {
    mockFs({});
    try {
      const launchCalls = [];
      const pdfCalls = [];

      const fakePage = {
        setViewport: async (config) => {
          launchCalls.push({ type: "viewport", config });
        },
        goto: async (url, options) => {
          launchCalls.push({ type: "goto", url, options });
        },
        waitForTimeout: async (delay) => {
          launchCalls.push({ type: "wait", delay });
        },
        pdf: async (options) => {
          pdfCalls.push(options);
          fs.mkdirSync(path.dirname(options.path), { recursive: true });
          fs.writeFileSync(options.path, Buffer.alloc(2048));
        },
      };

      let browserClosed = false;
      const fakeBrowser = {
        newPage: async () => fakePage,
        close: async () => {
          browserClosed = true;
        },
      };

      const fakePuppeteer = {
        launch: async (config) => {
          launchCalls.push({ type: "launch", config });
          return fakeBrowser;
        },
      };

      const infoMessages = [];
      const core = {
        info: (message) => infoMessages.push(message),
      };

      const outputPath = path.join("/tmp", "pdf", "fr.pdf");

      await generatePDF({
        pageUrl: "https://example.com/brand",
        outputPath,
        core,
        puppeteerModule: fakePuppeteer,
      });

      assert.ok(browserClosed, "browser should close");
      assert.ok(fs.existsSync(outputPath), "pdf file should exist");
      assert.ok(
        infoMessages.some((message) =>
          message.includes("Navigating to https://example.com/brand"),
        ),
      );
      assert.ok(
        infoMessages.some((message) =>
          message.includes("✓ PDF generated successfully"),
        ),
      );
      assert.ok(infoMessages.some((message) => message.includes("File size")));

      const launchConfig = launchCalls.find((entry) => entry.type === "launch");
      assert.deepEqual(launchConfig.config, {
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const gotoCall = launchCalls.find((entry) => entry.type === "goto");
      assert.ok(gotoCall.options.waitUntil.includes("networkidle0"));

      assert.equal(pdfCalls.length, 1);
      assert.equal(pdfCalls[0].format, "A4");
    } finally {
      mockFs.restore();
    }
  });
});
