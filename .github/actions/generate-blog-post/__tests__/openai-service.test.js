const { describe, it, beforeEach, mock } = require('node:test');
const assert = require('node:assert/strict');

const { OpenAIService } = require('../src/openai-service');

describe('OpenAIService', () => {
  let service;
  const generatedImageBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0xff]);
  const referenceImages = [
    { name: 'mascot.png', data: generatedImageBytes },
    { name: 'logo-icon.png', data: Buffer.from([0x89, 0x50, 0x4e, 0x47]) },
  ];

  beforeEach(() => {
    service = new OpenAIService('test-key');
    service.client = {
      responses: {
        create: mock.fn(async () => ({ output_text: ' Generated text  ' })),
      },
      images: {
        edit: mock.fn(async () => ({
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

  it('uploads brand references and decodes the transparent preview without unsupported parameters', async () => {
    const result = await service.generateImage('Generate a release illustration', { referenceImages });

    assert.ok(Buffer.isBuffer(result));
    assert.deepEqual(result, generatedImageBytes);

    const request = service.client.images.edit.mock.calls[0].arguments[0];
    assert.equal(request.model, 'gpt-image-2');
    assert.equal(request.prompt, 'Generate a release illustration');
    assert.equal(request.n, 1);
    assert.equal(request.size, '1536x1024');
    assert.equal(request.quality, 'high');
    assert.equal(request.background, 'transparent');
    assert.equal(request.output_format, 'png');
    assert.equal(request.image.length, referenceImages.length);
    for (const [index, reference] of referenceImages.entries()) {
      assert.equal(request.image[index].name, reference.name);
      assert.equal(request.image[index].type, 'image/png');
      assert.deepEqual(Buffer.from(await request.image[index].arrayBuffer()), reference.data);
    }
    assert.equal('style' in request, false);
    assert.equal('response_format' in request, false);
    assert.equal('input_fidelity' in request, false);
  });

  it('requires brand references before calling the image API', async () => {
    await assert.rejects(
      () => service.generateImage('Generate a release illustration'),
      /reference images are required/
    );
    assert.equal(service.client.images.edit.mock.calls.length, 0);
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
      service.client.images.edit = mock.fn(async () => response);

      await assert.rejects(() => service.generateImage('Generate a release illustration', { referenceImages }), {
        message: 'OpenAI image response did not include base64 image data',
      });
    }
  });
});
