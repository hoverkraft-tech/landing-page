const { describe, it, beforeEach, mock } = require('node:test');
const assert = require('node:assert/strict');

const { OpenAIService } = require('../src/openai-service');

describe('OpenAIService', () => {
  let service;
  const generatedImageBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xff]);

  beforeEach(() => {
    service = new OpenAIService('test-key');
    service.client = {
      responses: {
        create: mock.fn(async () => ({ output_text: ' Generated text  ' })),
      },
      images: {
        generate: mock.fn(async () => ({
          data: [{ b64_json: generatedImageBytes.toString('base64') }],
        })),
      },
    };
  });

  it('maps system and user messages to responses.create', async () => {
    const result = await service.generateText(
      [
        { role: 'system', content: 'Answer in French.' },
        { role: 'user', content: 'Summarize these releases.' },
      ],
      {
        temperature: 0.35,
        max_output_tokens: 600,
      }
    );

    assert.equal(result, 'Generated text');

    const request = service.client.responses.create.mock.calls[0].arguments[0];
    assert.equal(request.model, 'gpt-5.4-nano');
    assert.equal(request.temperature, 0.35);
    assert.equal(request.max_output_tokens, 600);
    assert.equal(request.instructions, 'Answer in French.');
    assert.equal(request.input, 'Summarize these releases.');
  });

  it('flattens array content into plain text input', async () => {
    await service.generateText([
      {
        role: 'system',
        content: [{ text: 'Preserve Markdown.' }],
      },
      {
        role: 'user',
        content: [{ text: 'Line one.' }, { content: 'Line two.' }],
      },
    ]);

    const request = service.client.responses.create.mock.calls[0].arguments[0];
    assert.equal(request.instructions, 'Preserve Markdown.');
    assert.equal(request.input, 'Line one.\nLine two.');
  });

  it('decodes generated image data without unsupported request parameters', async () => {
    const result = await service.generateImage('Generate a release illustration');

    assert.ok(Buffer.isBuffer(result));
    assert.deepEqual(result, generatedImageBytes);

    const request = service.client.images.generate.mock.calls[0].arguments[0];
    assert.equal(request.model, 'gpt-image-2');
    assert.equal(request.prompt, 'Generate a release illustration');
    assert.equal(request.n, 1);
    assert.equal(request.size, '1792x1024');
    assert.equal(request.quality, 'high');
    assert.equal('style' in request, false);
    assert.equal('response_format' in request, false);
  });

  it('fails clearly when generated image data is missing', async () => {
    const invalidResponses = [
      {},
      { data: [] },
      { data: [{}] },
      { data: [{ b64_json: '' }] },
      { data: [{ b64_json: ' ' }] },
      { data: [{ b64_json: 'A' }] },
      { data: [{ b64_json: 'not-base64!!!' }] },
    ];

    for (const response of invalidResponses) {
      service.client.images.generate = mock.fn(async () => response);

      await assert.rejects(() => service.generateImage('Generate a release illustration'), {
        message: 'OpenAI image response did not include base64 image data',
      });
    }
  });
});
