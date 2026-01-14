import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';

import MaturityPrintSummary from './MaturityPrintSummary.astro';

describe('MaturityPrintSummary', () => {
  it('renders axes and question placeholders', async () => {
    const container = await AstroContainer.create();

    const html = await container.renderToString(MaturityPrintSummary, {
      props: {
        strings: {
          printAnswersTitle: 'Your answers',
        },
        axes: [
          {
            id: 'axis-1',
            label: 'Axis label',
            weight: 1,
            questions: [
              {
                id: 'q-1',
                shareId: 1,
                text: 'Question text',
                levels: {
                  1: 'L1',
                  2: 'L2',
                  3: 'L3',
                  4: 'L4',
                  5: 'L5',
                },
              },
            ],
          },
        ],
      },
    });

    expect(html).toContain('data-print-summary');
    expect(html).toContain('Your answers');
    expect(html).toContain('Axis label');
    expect(html).toContain('Question text');
    expect(html).toContain('data-question-id="q-1"');
  });
});
