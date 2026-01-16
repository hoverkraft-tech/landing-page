import type { MaturityAssessmentAxis } from '~/data/maturity-assessment';

export const buildOrderedQuestionIds = (axes: MaturityAssessmentAxis[]): string[] => {
  const orderedQuestions = axes
    .flatMap((axis) => axis.questions)
    .slice()
    .sort((a, b) => (a.shareId ?? 0) - (b.shareId ?? 0) || String(a.id).localeCompare(String(b.id)));

  return orderedQuestions.map((q) => q.id);
};

export const decodeAnswersFromParam = (param: string, questionCount: number): number[] | null => {
  if (typeof param !== 'string') return null;

  if (!param.startsWith('2')) return null;

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
};
