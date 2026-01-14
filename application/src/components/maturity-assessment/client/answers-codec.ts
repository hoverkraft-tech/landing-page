import type { MaturityAssessmentAxis } from './types';

export const buildOrderedQuestionIds = (axes: MaturityAssessmentAxis[]): string[] => {
  const orderedQuestions = axes
    .flatMap((axis) => axis.questions)
    .slice()
    .sort((a, b) => (a.shareId ?? 0) - (b.shareId ?? 0) || String(a.id).localeCompare(String(b.id)));

  return orderedQuestions.map((q) => q.id);
};

export const encodeAnswersToParam = (root: HTMLElement, orderedQuestionIds: string[]): string => {
  const digits = orderedQuestionIds.map((questionId) => {
    const checked = root.querySelector(`input[name="${CSS.escape(questionId)}"]:checked`);
    if (!(checked instanceof HTMLInputElement)) return 0;
    const value = Number(checked.value);
    if (!Number.isFinite(value)) return 0;
    if (value < 1 || value > 5) return 0;
    return value;
  });

  // v2: pack 2 base-6 digits into one base36 char => 6^2 = 36
  let packed = '';
  for (let i = 0; i < digits.length; i += 2) {
    const hi = digits[i] ?? 0;
    const lo = digits[i + 1] ?? 0;
    const n = hi * 6 + lo;
    packed += n.toString(36);
  }

  return `2${packed}`;
};

export const decodeAnswersFromParam = (param: string, questionCount: number): number[] | null => {
  if (typeof param !== 'string') return null;

  // v2: base36 packed
  if (param.startsWith('2')) {
    const payload = param.slice(1);
    if (!payload) return null;
    if (!/^[0-9a-z]+$/.test(payload)) return null;

    const digits: number[] = [];
    for (const ch of payload) {
      const n = Number.parseInt(ch, 36);
      if (!Number.isFinite(n) || n < 0 || n > 35) return null;
      digits.push(Math.floor(n / 6));
      digits.push(n % 6);
    }

    return digits.slice(0, questionCount);
  }

  // v1 (legacy): one digit per question
  if (param.startsWith('1')) {
    const digits = param.slice(1);
    if (digits.length !== questionCount) return null;
    if (!/^[0-5]+$/.test(digits)) return null;
    return digits.split('').map((d) => Number(d));
  }

  return null;
};

export const applyDecodedAnswers = (root: HTMLElement, orderedQuestionIds: string[], decoded: number[]): boolean => {
  if (!Array.isArray(decoded)) return false;
  if (decoded.length !== orderedQuestionIds.length) return false;

  for (let i = 0; i < orderedQuestionIds.length; i += 1) {
    const questionId = orderedQuestionIds[i];
    const value = decoded[i];
    if (value === 0) continue;

    const input = root.querySelector(`input[name="${CSS.escape(questionId)}"][value="${CSS.escape(String(value))}"]`);

    if (input instanceof HTMLInputElement) input.checked = true;
  }

  return true;
};
