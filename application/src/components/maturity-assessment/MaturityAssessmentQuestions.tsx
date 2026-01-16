import React from 'react';

import type { MaturityAssessmentAxis } from '~/data/maturity-assessment';
import type { MaturityAssessmentStrings } from './types';
// eslint-disable-next-line n/no-missing-import
import TablerIcon from './TablerIcon';

type Props = {
  id: string;
  axes: MaturityAssessmentAxis[];
  strings: MaturityAssessmentStrings;
  answers: Record<string, number | null>;
  collapsed: Record<string, boolean>;
  onAnswer: (questionId: string, value: number) => void;
  onToggle: (questionId: string) => void;
  registerAxisTitle: (axisId: string, element: HTMLElement | null) => void;
  registerQuestionLegend: (questionId: string, element: HTMLElement | null) => void;
};

const MaturityAssessmentQuestions = ({
  id,
  axes,
  strings,
  answers,
  collapsed,
  onAnswer,
  onToggle,
  registerAxisTitle,
  registerQuestionLegend,
}: Props) => {
  return (
    <div className="space-y-6" data-maturity-questions>
      {axes.map((axis, axisIndex) => (
        <section key={axis.id} className="rounded-2xl border border-gray-200/60 bg-page p-5 md:p-6">
          <h3
            ref={(el) => registerAxisTitle(axis.id, el)}
            className="mb-4 text-sm font-semibold tracking-wide text-heading uppercase"
            data-axis-title
            tabIndex={-1}
          >
            {axisIndex + 1}. {axis.label}
          </h3>

          <div className="space-y-6">
            {axis.questions.map((question) => {
              const selectedValue = answers[question.id];
              const isCollapsed = collapsed[question.id] ?? false;
              const description = selectedValue ? question.levels[selectedValue as 1 | 2 | 3 | 4 | 5] : '';
              const summaryText = selectedValue
                ? `${strings.levelPrefix} ${selectedValue}${description ? ` - ${description}` : ''}`
                : '';

              return (
                <fieldset
                  key={question.id}
                  className="space-y-3"
                  data-question-id={question.id}
                  data-collapsed={isCollapsed ? 'true' : 'false'}
                >
                  <legend
                    ref={(el) => registerQuestionLegend(question.id, el)}
                    className="text-base font-semibold text-heading cursor-pointer"
                    data-question-legend
                    tabIndex={-1}
                    onClick={() => onToggle(question.id)}
                  >
                    <span className="inline-flex w-full items-start justify-between gap-3">
                      <span className="min-w-0">{question.text}</span>
                      <button
                        type="button"
                        className="shrink-0 inline-flex items-center gap-1 cursor-pointer text-sm font-semibold text-primary"
                        data-question-toggle
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggle(question.id);
                        }}
                      >
                        <TablerIcon
                          name="tabler:chevron-down"
                          className={`h-5 w-5 ${isCollapsed ? '' : 'hidden'}`}
                          ariaHidden
                        />
                        <TablerIcon
                          name="tabler:chevron-up"
                          className={`h-5 w-5 ${isCollapsed ? 'hidden' : ''}`}
                          ariaHidden
                        />
                        <span className="underline underline-offset-4" data-toggle-label hidden={!isCollapsed}>
                          {strings.editLabel}
                        </span>
                      </button>
                    </span>
                  </legend>

                  <div className="text-sm text-muted" data-selected-summary hidden={!isCollapsed || !summaryText}>
                    {summaryText}
                  </div>

                  <div className="grid gap-2" data-options hidden={isCollapsed}>
                    {([1, 2, 3, 4, 5] as const).map((level) => {
                      const inputId = `${id}-${question.id}-${level}`;
                      return (
                        <label
                          key={level}
                          htmlFor={inputId}
                          data-level={level}
                          className="group flex cursor-pointer gap-3 rounded-xl border border-gray-200/60 bg-white/40 p-3 transition hover:bg-white/60 dark:bg-white/5 dark:hover:bg-white/10"
                        >
                          <input
                            id={inputId}
                            className="peer mt-1 size-4 shrink-0 cursor-pointer"
                            style={{ accentColor: 'var(--color-secondary)' }}
                            type="radio"
                            name={question.id}
                            value={level}
                            checked={selectedValue === level}
                            onChange={() => onAnswer(question.id, level)}
                          />
                          <div className="min-w-0">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                                {strings.levelPrefix} {level}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-default/90">{question.levels[level]}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MaturityAssessmentQuestions;
