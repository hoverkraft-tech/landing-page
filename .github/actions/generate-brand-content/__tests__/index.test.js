const assert = require("node:assert/strict");
const { describe, it, beforeEach, afterEach } = require("node:test");
const fs = require("fs");
const path = require("path");
const mock = require("mock-fs");

const { run } = require("../index.js");

describe("generate-brand-content run", () => {
  let messages;
  let core;
  let io;
  let outputDir;
  let defaultInputs;

  beforeEach(() => {
    messages = [];
    core = {
      info: (message) => {
        messages.push(message);
      },
    };

    io = {
      mkdirP: async (dir) => fs.promises.mkdir(dir, { recursive: true }),
    };

    outputDir = path.join("tmp", "brand");

    defaultInputs = {
      version: "1.2.3",
      commit: "deadbeef",
      colors: JSON.stringify({
        items: [
          { id: "primary", value: "#000000" },
          { id: "secondary", value: "#ffffff" },
        ],
      }),
      brandMission: JSON.stringify({ statement: "Empower builders" }),
      logos: JSON.stringify({
        items: [
          {
            name: { fr: "Logo principal", en: "Primary Logo" },
            path: "logos/primary.svg",
            formats: ["svg"],
            usage: { fr: "Utilisation", en: "Usage" },
          },
        ],
      }),
      mascot: JSON.stringify({
        name: { fr: "Mascotte", en: "Mascot" },
        path: "logo/mascot.svg",
        usage: { fr: "Utilisation", en: "Usage" },
      }),
      typography: JSON.stringify({
        items: [{ id: "heading", family: "HK Grotesk" }],
      }),
    };
  });

  afterEach(() => {
    mock.restore();
  });

  it("writes generated files and logs progress", async () => {
    mock({});

    await run({
      ...defaultInputs,
      core,
      io,
      outputDir,
    });

    const colorsFile = fs.readFileSync(
      path.join(outputDir, "generated-colors.ts"),
      "utf8",
    );
    assert.match(colorsFile, /export const brandColors: ColorCollection =/);
    assert.match(colorsFile, /Version: 1\.2\.3/);
    assert.match(colorsFile, /Commit: deadbeef/);

    const missionFile = fs.readFileSync(
      path.join(outputDir, "generated-mission.ts"),
      "utf8",
    );
    assert.match(missionFile, /export const brandMission: BrandMission =/);

    const typographyFile = fs.readFileSync(
      path.join(outputDir, "generated-typography.ts"),
      "utf8",
    );
    assert.match(
      typographyFile,
      /export const typography: TypographyCollection =/,
    );

    const mascotFile = fs.readFileSync(
      path.join(outputDir, "generated-mascot.ts"),
      "utf8",
    );
    assert.match(mascotFile, /export const mascot: MascotAsset =/);

    const logosFile = fs.readFileSync(
      path.join(outputDir, "generated-logos.ts"),
      "utf8",
    );
    assert.match(logosFile, /formats: \['svg'\],/);
    assert.doesNotMatch(logosFile, /\\"/);

    assert.deepEqual(messages, [
      "\u2713 Generated generated-colors.ts (2 items)",
      "\u2713 Generated generated-mission.ts",
      "\u2713 Generated generated-typography.ts (1 items)",
      "\u2713 Generated generated-logos.ts (1 items)",
      "\u2713 Generated generated-mascot.ts",
      "\u2705 All brand content files generated successfully",
    ]);
  });

  it("throws when required version is missing", async () => {
    await assert.rejects(
      () =>
        run({
          ...defaultInputs,
          version: "   ",
          core,
          io,
          outputDir,
        }),
      /version input is required/,
    );
  });

  it("throws when colors payload is not valid JSON", async () => {
    await assert.rejects(
      () =>
        run({
          ...defaultInputs,
          colors: "not-json",
          core,
          io,
          outputDir,
        }),
      /Failed to parse colors input/,
    );
  });

  it("throws when core toolkit is missing", async () => {
    await assert.rejects(
      () =>
        run({
          ...defaultInputs,
          core: null,
          io,
          outputDir,
        }),
      /@actions\/core instance must be provided/,
    );
  });
});
