import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { buildOrderedQuestionIds, decodeAnswersFromParam } from './client/answers-codec';
import { buildShareText, getInterpretation } from './client/radar-renderer';
import type { MaturityAssessmentAxis } from '~/data/maturity-assessment';
import type { MaturityAssessmentStrings } from './types';

type AnswerMap = Record<string, number | null>;

type UseMaturityAssessmentStateParams = {
  id: string;
  axes: MaturityAssessmentAxis[];
  strings: MaturityAssessmentStrings;
  pageUrl: string;
};

type MaturityAssessmentState = {
  answers: AnswerMap;
  setAnswer: (questionId: string, value: number) => void;
  resetAnswers: () => void;
  initialized: boolean;
  orderedQuestionIds: string[];
  displayQuestionIds: string[];
  questionAxisMap: Record<string, string>;
  answeredQuestions: number;
  totalQuestions: number;
  axisValues: Record<string, number>;
  globalAvg: number;
  progressPercent: number;
  isComplete: boolean;
  scoreLabel: string;
  interpretation: { text: string; color: string | null; hidden: boolean };
  shareUrl: string | null;
  shareText: string;
  mailBody: string;
};

const formatTemplate = (template: string, vars: Record<string, string>) =>
  String(template)
    .replaceAll('{score}', String(vars.score ?? ''))
    .replaceAll('{interpretation}', String(vars.interpretation ?? ''))
    .replaceAll('{url}', String(vars.url ?? ''));

const buildEmptyAnswers = (axes: MaturityAssessmentAxis[]): AnswerMap => {
  const entries = axes.flatMap((axis) => axis.questions.map((q) => [q.id, null] as const));
  return Object.fromEntries(entries);
};

const mapDecodedAnswers = (decoded: number[], orderedQuestionIds: string[]): AnswerMap => {
  const entries = orderedQuestionIds.map((questionId, index) => {
    const raw = decoded[index];
    const value = raw >= 1 && raw <= 5 ? raw : null;
    return [questionId, value] as const;
  });
  return Object.fromEntries(entries);
};

const encodeAnswersToParam = (answers: AnswerMap, orderedQuestionIds: string[]): string => {
  const digits = orderedQuestionIds.map((questionId) => {
    const value = answers[questionId];
    if (!Number.isFinite(value) || !value) return 0;
    if (value < 1 || value > 5) return 0;
    return value;
  });

  let packed = '';
  for (let i = 0; i < digits.length; i += 2) {
    const hi = digits[i] ?? 0;
    const lo = digits[i + 1] ?? 0;
    const n = hi * 6 + lo;
    packed += n.toString(36);
  }

  return `2${packed}`;
};

const buildStorageKey = (id: string, pageUrl: string) => {
  try {
    const pathname = new URL(pageUrl).pathname;
    return `maturity-assessment:${id}:${pathname}`;
  } catch {
    return `maturity-assessment:${id}`;
  }
};

const loadSnapshot = (storageKey: string, axes: MaturityAssessmentAxis[]): AnswerMap | null => {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { v?: number; answers?: Record<string, string> } | null;
    if (!parsed || typeof parsed !== 'object' || !parsed.answers) return null;

    const nextAnswers = buildEmptyAnswers(axes);
    for (const axis of axes) {
      for (const question of axis.questions) {
        const value = Number(parsed.answers[question.id]);
        if (Number.isFinite(value) && value >= 1 && value <= 5) {
          nextAnswers[question.id] = value;
        }
      }
    }

    return nextAnswers;
  } catch {
    return null;
  }
};

const saveSnapshot = (storageKey: string, axes: MaturityAssessmentAxis[], answers: AnswerMap) => {
  try {
    const snapshot: Record<string, string> = {};
    for (const axis of axes) {
      for (const question of axis.questions) {
        const value = answers[question.id];
        if (Number.isFinite(value) && value) snapshot[question.id] = String(value);
      }
    }
    window.localStorage.setItem(storageKey, JSON.stringify({ v: 1, answers: snapshot }));
  } catch {
    // ignore persistence failures
  }
};

const clearSnapshot = (storageKey: string) => {
  try {
    window.localStorage.removeItem(storageKey);
  } catch {
    // ignore
  }
};

export const useMaturityAssessmentState = ({ id, axes, strings, pageUrl }: UseMaturityAssessmentStateParams) => {
  const orderedQuestionIds = useMemo(() => buildOrderedQuestionIds(axes), [axes]);
  const displayQuestionIds = useMemo(() => axes.flatMap((axis) => axis.questions.map((q) => q.id)), [axes]);
  const questionAxisMap = useMemo(() => {
    const entries = axes.flatMap((axis) => axis.questions.map((q) => [q.id, axis.id] as const));
    return Object.fromEntries(entries) as Record<string, string>;
  }, [axes]);

  const [answers, setAnswers] = useState<AnswerMap>(() => buildEmptyAnswers(axes));
  const [initialized, setInitialized] = useState(false);
  const lastSyncedUrlRef = useRef<string | null>(null);
  const storageKey = useMemo(() => buildStorageKey(id, pageUrl), [id, pageUrl]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const nextAnswers = buildEmptyAnswers(axes);
    const orderedIds = orderedQuestionIds;

    const currentUrl = new URL(window.location.href);
    const encoded = currentUrl.searchParams.get('ma');
    const decoded = encoded ? decodeAnswersFromParam(encoded, orderedIds.length) : null;

    if (decoded) {
      Object.assign(nextAnswers, mapDecodedAnswers(decoded, orderedIds));
    } else {
      const stored = loadSnapshot(storageKey, axes);
      if (stored) Object.assign(nextAnswers, stored);
    }

    setAnswers(nextAnswers);
    setInitialized(true);
  }, [axes, orderedQuestionIds, storageKey]);

  const answeredQuestions = useMemo(
    () => Object.values(answers).filter((value) => Number.isFinite(value) && value).length,
    [answers]
  );

  const totalQuestions = orderedQuestionIds.length;

  const axisValues = useMemo(() => {
    const values: Record<string, number> = {};
    for (const axis of axes) {
      const sum = axis.questions.reduce((acc, question) => acc + (answers[question.id] ?? 0), 0);
      values[axis.id] = axis.questions.length > 0 ? sum / axis.questions.length : 0;
    }
    return values;
  }, [axes, answers]);

  const globalAvg = useMemo(() => {
    if (axes.length === 0) return 0;
    const total = axes.reduce((acc, axis) => acc + (axisValues[axis.id] ?? 0), 0);
    return total / axes.length;
  }, [axes, axisValues]);

  const scoreLabel = useMemo(() => `${globalAvg.toFixed(1)}/5`, [globalAvg]);
  const interpretation = useMemo(
    () => getInterpretation(strings, globalAvg, answeredQuestions),
    [strings, globalAvg, answeredQuestions]
  );
  const progressPercent = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  const isComplete = totalQuestions > 0 && answeredQuestions === totalQuestions;

  useEffect(() => {
    if (!initialized || typeof window === 'undefined') return;

    const nextUrl = new URL(window.location.href);
    nextUrl.hash = '';

    if (answeredQuestions > 0) {
      nextUrl.searchParams.set('ma', encodeAnswersToParam(answers, orderedQuestionIds));
    } else {
      nextUrl.searchParams.delete('ma');
    }

    if (typeof window.history?.replaceState === 'function') {
      const serialized = nextUrl.toString();
      if (lastSyncedUrlRef.current !== serialized) {
        window.history.replaceState(window.history.state, '', serialized);
        lastSyncedUrlRef.current = serialized;
      }
    }

    if (answeredQuestions > 0) {
      saveSnapshot(storageKey, axes, answers);
    } else {
      clearSnapshot(storageKey);
    }
  }, [answers, answeredQuestions, initialized, orderedQuestionIds, storageKey, axes]);

  const shareUrl = useMemo(() => {
    if (!isComplete) return null;
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.href : pageUrl;
      const url = new URL(baseUrl);
      url.hash = '';
      url.searchParams.set('ma', encodeAnswersToParam(answers, orderedQuestionIds));
      return url.toString();
    } catch {
      return null;
    }
  }, [answers, orderedQuestionIds, isComplete, pageUrl]);

  const shareText = useMemo(() => {
    if (!shareUrl) return '';
    return buildShareText({
      strings,
      scoreLabel,
      interpretationText: interpretation.hidden ? '' : interpretation.text,
      shareUrl,
    });
  }, [shareUrl, strings, scoreLabel, interpretation]);

  const mailBody = useMemo(() => {
    if (!shareUrl) return '';
    const template = interpretation.hidden
      ? strings.shareMailBodyWithoutInterpretation
      : strings.shareMailBodyWithInterpretation;
    return formatTemplate(template, {
      score: scoreLabel,
      interpretation: interpretation.hidden ? '' : interpretation.text,
      url: shareUrl,
    });
  }, [shareUrl, interpretation, scoreLabel, strings]);

  const setAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const resetAnswers = useCallback(() => {
    setAnswers(buildEmptyAnswers(axes));
  }, [axes]);

  return {
    answers,
    setAnswer,
    resetAnswers,
    initialized,
    orderedQuestionIds,
    displayQuestionIds,
    questionAxisMap,
    answeredQuestions,
    totalQuestions,
    axisValues,
    globalAvg,
    progressPercent,
    isComplete,
    scoreLabel,
    interpretation,
    shareUrl,
    shareText,
    mailBody,
  } satisfies MaturityAssessmentState;
};
