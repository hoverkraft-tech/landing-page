import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './maturity-assessment.css';
import type { SupportedLanguage } from '~/i18n/ui';
import type { MaturityAssessmentProps } from './types';
import MaturityAssessmentQuestions from './MaturityAssessmentQuestions.tsx';
import MaturityAssessmentSidebar from './MaturityAssessmentSidebar.tsx';
import { useMaturityAssessmentState } from './useMaturityAssessmentState';

export type Props = MaturityAssessmentProps & {
  pageUrl: string;
  lang?: SupportedLanguage;
};

const buildCollapsedState = (axes: MaturityAssessmentProps['axes']) => {
  const entries = axes.flatMap((axis) => axis.questions.map((question) => [question.id, false] as const));
  return Object.fromEntries(entries) as Record<string, boolean>;
};

const getStickyHeaderOffset = () => {
  if (typeof window === 'undefined') return 0;
  const header = document.querySelector('[data-aw-sticky-header]');
  if (!(header instanceof HTMLElement)) return 0;
  const position = getComputedStyle(header).position;
  if (position !== 'fixed' && position !== 'sticky') return 0;
  return header.getBoundingClientRect().height;
};

const smoothScrollToElement = (element: HTMLElement) => {
  if (typeof window === 'undefined') return;
  const headerOffset = getStickyHeaderOffset();
  const gap = 8;
  const rect = element.getBoundingClientRect();
  const top = rect.top + window.scrollY - headerOffset - gap;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
};

export default function MaturityAssessment({ id = 'maturity-assessment', axes, strings, pageUrl, lang }: Props) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const axisTitleRefs = useRef(new Map<string, HTMLElement>());
  const questionLegendRefs = useRef(new Map<string, HTMLElement>());

  const initialCollapsed = useMemo(() => buildCollapsedState(axes), [axes]);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(initialCollapsed);

  const {
    answers,
    setAnswer,
    resetAnswers,
    initialized,
    displayQuestionIds,
    questionAxisMap,
    answeredQuestions,
    totalQuestions,
    axisValues,
    globalAvg,
    progressPercent,
    isComplete,
    interpretation,
    shareUrl,
    shareText,
    mailBody,
  } = useMaturityAssessmentState({ id, axes, strings, pageUrl });

  const axisOrder = useMemo(() => axes.map((axis) => axis.id), [axes]);
  const lastQuestionByAxis = useMemo(() => {
    const entries = axes
      .map((axis) => {
        const lastQuestion = axis.questions[axis.questions.length - 1];
        return lastQuestion ? ([axis.id, lastQuestion.id] as const) : null;
      })
      .filter((entry): entry is readonly [string, string] => Boolean(entry));
    return new Map(entries);
  }, [axes]);
  const firstQuestionByAxis = useMemo(() => {
    const entries = axes
      .map((axis) => {
        const firstQuestion = axis.questions[0];
        return firstQuestion ? ([axis.id, firstQuestion.id] as const) : null;
      })
      .filter((entry): entry is readonly [string, string] => Boolean(entry));
    return new Map(entries);
  }, [axes]);

  const hasAppliedInitialCollapseRef = useRef(false);

  useEffect(() => {
    setCollapsed(initialCollapsed);
  }, [initialCollapsed]);

  useEffect(() => {
    if (!initialized || hasAppliedInitialCollapseRef.current) return;
    hasAppliedInitialCollapseRef.current = true;

    const nextCollapsed = displayQuestionIds.reduce<Record<string, boolean>>((acc, questionId) => {
      acc[questionId] = Boolean(answers[questionId]);
      return acc;
    }, {});

    if (Object.values(nextCollapsed).some(Boolean)) {
      setCollapsed(nextCollapsed);
    }
  }, [answers, displayQuestionIds, initialized]);

  const registerAxisTitle = useCallback((axisId: string, element: HTMLElement | null) => {
    if (element) {
      axisTitleRefs.current.set(axisId, element);
    } else {
      axisTitleRefs.current.delete(axisId);
    }
  }, []);

  const registerQuestionLegend = useCallback((questionId: string, element: HTMLElement | null) => {
    if (element) {
      questionLegendRefs.current.set(questionId, element);
    } else {
      questionLegendRefs.current.delete(questionId);
    }
  }, []);

  const focusElement = (element: HTMLElement | undefined) => {
    if (!element) return;
    requestAnimationFrame(() => {
      element.focus({ preventScroll: true });
      requestAnimationFrame(() => {
        smoothScrollToElement(element);
      });
    });
  };

  const focusRadar = useCallback(() => {
    const radar = formRef.current?.querySelector('[data-radar]') as HTMLElement | null;
    if (!radar) return;
    smoothScrollToElement(radar);
    focusElement(radar);
  }, []);

  const expandQuestion = useCallback((questionId: string) => {
    setCollapsed((prev) => ({ ...prev, [questionId]: false }));
    const legend = questionLegendRefs.current.get(questionId);
    if (legend) {
      smoothScrollToElement(legend);
      focusElement(legend);
    }
  }, []);

  const collapseQuestion = useCallback((questionId: string, preserveScroll = false) => {
    if (!preserveScroll || typeof window === 'undefined') {
      setCollapsed((prev) => ({ ...prev, [questionId]: true }));
      return;
    }

    const legend = questionLegendRefs.current.get(questionId);
    if (!legend) {
      setCollapsed((prev) => ({ ...prev, [questionId]: true }));
      return;
    }

    const anchorTop = legend.getBoundingClientRect().top;
    const startScrollY = window.scrollY;

    setCollapsed((prev) => ({ ...prev, [questionId]: true }));

    requestAnimationFrame(() => {
      const nextAnchorTop = legend.getBoundingClientRect().top;
      const delta = nextAnchorTop - anchorTop;
      if (Math.abs(delta) < 1) return;
      window.scrollTo({ top: startScrollY + delta, behavior: 'smooth' });
    });
  }, []);

  const handleAnswer = useCallback(
    (questionId: string, value: number) => {
      const nextAnswers = { ...answers, [questionId]: value };
      setAnswer(questionId, value);

      const currentIndex = displayQuestionIds.indexOf(questionId);
      let nextQuestionId: string | null = null;
      for (let i = currentIndex + 1; i < displayQuestionIds.length; i += 1) {
        const candidate = displayQuestionIds[i];
        if (!nextAnswers[candidate]) {
          nextQuestionId = candidate;
          break;
        }
      }

      setCollapsed((prev) => {
        const nextState = { ...prev, [questionId]: true };
        if (nextQuestionId) nextState[nextQuestionId] = false;
        return nextState;
      });

      const currentAxis = questionAxisMap[questionId];
      const isLastInAxis = currentAxis ? lastQuestionByAxis.get(currentAxis) === questionId : false;
      const isCompleteNow = displayQuestionIds.every((idToCheck) => Boolean(nextAnswers[idToCheck]));

      if (isCompleteNow) {
        focusRadar();
        return;
      }

      if (!nextQuestionId) {
        return;
      }
      if (isLastInAxis && currentAxis) {
        const currentAxisIndex = axisOrder.indexOf(currentAxis);
        const nextAxisId = currentAxisIndex >= 0 ? axisOrder[currentAxisIndex + 1] : undefined;
        const nextAxisFirstQuestionId = nextAxisId ? firstQuestionByAxis.get(nextAxisId) : undefined;
        if (nextAxisFirstQuestionId) {
          setCollapsed((prev) => ({ ...prev, [nextAxisFirstQuestionId]: false }));
          const nextLegend = questionLegendRefs.current.get(nextAxisFirstQuestionId);
          if (nextLegend) {
            smoothScrollToElement(nextLegend);
            focusElement(nextLegend);
            return;
          }
        }
      }

      const nextAxis = questionAxisMap[nextQuestionId];

      if (currentAxis && nextAxis && currentAxis !== nextAxis) {
        const axisTitle = axisTitleRefs.current.get(nextAxis);
        if (axisTitle) {
          smoothScrollToElement(axisTitle);
          focusElement(axisTitle);
          return;
        }
      }

      const nextLegend = questionLegendRefs.current.get(nextQuestionId);
      if (nextLegend) {
        smoothScrollToElement(nextLegend);
        focusElement(nextLegend);
      }
    },
    [
      answers,
      axisOrder,
      displayQuestionIds,
      focusRadar,
      firstQuestionByAxis,
      lastQuestionByAxis,
      questionAxisMap,
      setAnswer,
    ]
  );

  const handleToggle = useCallback(
    (questionId: string) => {
      const isCollapsed = collapsed[questionId] ?? false;
      if (isCollapsed) {
        expandQuestion(questionId);
        return;
      }

      const hasSelection = Boolean(answers[questionId]);
      if (hasSelection) {
        collapseQuestion(questionId, true);
        return;
      }

      expandQuestion(questionId);
    },
    [answers, collapsed, collapseQuestion, expandQuestion]
  );

  const handleReset = useCallback(() => {
    resetAnswers();
    setCollapsed(initialCollapsed);
    const firstQuestionId = axes[0]?.questions[0]?.id;
    if (!firstQuestionId) return;
    const legend = questionLegendRefs.current.get(firstQuestionId);
    if (!legend) return;
    smoothScrollToElement(legend);
    focusElement(legend);
  }, [axes, initialCollapsed, resetAnswers]);

  const handleFormReset = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleReset();
    },
    [handleReset]
  );

  return (
    <form
      ref={formRef}
      id={id}
      data-maturity-assessment
      data-form
      className="grid gap-8 lg:grid-cols-2"
      noValidate
      onReset={handleFormReset}
    >
      <MaturityAssessmentQuestions
        id={id}
        axes={axes}
        strings={strings}
        answers={answers}
        collapsed={collapsed}
        onAnswer={handleAnswer}
        onToggle={handleToggle}
        registerAxisTitle={registerAxisTitle}
        registerQuestionLegend={registerQuestionLegend}
      />

      <MaturityAssessmentSidebar
        id={id}
        axes={axes}
        strings={strings}
        answers={answers}
        axisValues={axisValues}
        globalAvg={globalAvg}
        progressPercent={progressPercent}
        answeredQuestions={answeredQuestions}
        totalQuestions={totalQuestions}
        interpretation={interpretation}
        isComplete={isComplete}
        shareUrl={shareUrl}
        shareText={shareText}
        mailBody={mailBody}
        pageUrl={pageUrl}
        lang={lang}
      />
    </form>
  );
}
