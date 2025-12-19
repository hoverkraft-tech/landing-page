const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { IntegrationsService } = require("../src/integrations-service");

describe("IntegrationsService", () => {
  describe("parse", () => {
    it("throws when nothing provided", () => {
      const service = new IntegrationsService();
      assert.throws(
        () =>
          service.parse({
            integrationsRaw: "",
          }),
        /postiz-integrations is required/,
      );
    });

    it("parses platform->id JSON object", () => {
      const service = new IntegrationsService();
      const integrations = service.parse({
        integrationsRaw: JSON.stringify({
          bluesky: "xyz",
          linkedin: "abc",
        }),
      });

      assert.deepEqual(integrations, [
        { id: "xyz", type: "bluesky" },
        { id: "abc", type: "linkedin" },
      ]);
    });

    it("throws if integrations are not an object map", () => {
      const service = new IntegrationsService();
      assert.throws(
        () =>
          service.parse({
            integrationsRaw: JSON.stringify([{ id: "x" }]),
          }),
        /must be a JSON object mapping platform -> integration id/,
      );
    });

    it("throws on invalid JSON", () => {
      const service = new IntegrationsService();
      assert.throws(
        () =>
          service.parse({
            integrationsRaw: "{not-json}",
          }),
        /must be valid JSON/,
      );
    });

    it("throws if an integration id is empty", () => {
      const service = new IntegrationsService();
      assert.throws(
        () =>
          service.parse({
            integrationsRaw: JSON.stringify({ bluesky: "" }),
          }),
        /must provide a non-empty integration id/,
      );
    });
  });
});
