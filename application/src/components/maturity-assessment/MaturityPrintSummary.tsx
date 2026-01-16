import React from 'react';

import type { MaturityAssessmentAxis } from '~/data/maturity-assessment';
import type { MaturityAssessmentStrings } from './types';

type Props = {
  axes: MaturityAssessmentAxis[];
  answers: Record<string, number | null>;
  strings: Pick<MaturityAssessmentStrings, 'printAnswersTitle' | 'levelPrefix'>;
};

const MaturityPrintSummary = ({ axes, answers, strings }: Props) => {
  return (
    <div className="mt-6 border-t border-gray-200/60 pt-6 hidden" data-print-summary>
      <div className="text-left">
        <div className="text-xs font-semibold tracking-widest text-muted uppercase">{strings.printAnswersTitle}</div>
        <div className="mt-3 space-y-4">
          {axes.map((axis, axisIndex) => (
            <section key={axis.id}>
              <h4 className="text-base font-semibold text-heading">
                {axisIndex + 1}. {axis.label}
              </h4>
              <ul className="mt-2 space-y-1">
                {axis.questions.map((question) => {
                  const value = answers[question.id];
                  const description = value ? question.levels[value as 1 | 2 | 3 | 4 | 5] : '';
                  const answerText = value
                    ? `${strings.levelPrefix} ${value}${description ? ` - ${description}` : ''}`
                    : '-';
                  return (
                    <li key={question.id} className="flex flex-col gap-1">
                      <span className="text-sm text-default/90" data-print-question>
                        {question.text}
                      </span>
                      <span
                        className="text-sm font-semibold text-heading"
                        data-print-answer
                        data-question-id={question.id}
                      >
                        {answerText}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaturityPrintSummary;
