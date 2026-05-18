const { describe, it, beforeEach, mock } = require("node:test");
const assert = require("node:assert/strict");

const { OpenAIService } = require("../src/openai-service");

describe("OpenAIService", () => {
  let service;

  beforeEach(() => {
    service = new OpenAIService("test-key");
    service.client = {
      responses: {
        create: mock.fn(async () => ({ output_text: " Generated text  " })),
      },
      images: {
        generate: mock.fn(async () => ({
          data: [{ url: "https://example.com/image.png" }],
        })),
      },
    };
  });

  it("maps system and user messages to responses.create", async () => {
    const result = await service.generateText(
      [
        { role: "system", content: "Answer in French." },
        { role: "user", content: "Summarize these releases." },
      ],
      {
        temperature: 0.35,
        max_tokens: 600,
      },
    );

    assert.equal(result, "Generated text");

    const request = service.client.responses.create.mock.calls[0].arguments[0];
    assert.equal(request.model, "gpt-5.4-nano");
    assert.equal(request.temperature, 0.35);
    assert.equal(request.max_tokens, 600);
    assert.equal(request.instructions, "Answer in French.");
    assert.equal(request.input, "Summarize these releases.");
  });

  it("flattens array content into plain text input", async () => {
    await service.generateText([
      {
        role: "system",
        content: [{ text: "Preserve Markdown." }],
      },
      {
        role: "user",
        content: [{ text: "Line one." }, { content: "Line two." }],
      },
    ]);

    const request = service.client.responses.create.mock.calls[0].arguments[0];
    assert.equal(request.instructions, "Preserve Markdown.");
    assert.equal(request.input, "Line one.\nLine two.");
  });
});
