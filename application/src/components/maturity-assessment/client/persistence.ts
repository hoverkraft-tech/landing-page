import type { MaturityAssessmentAxis } from '~/data/maturity-assessment';

type StorageSnapshot = {
  v: number;
  answers: Record<string, string>;
};

export const createStorage = (root: HTMLElement) => {
  const storageKey = `maturity-assessment:${root.id}:${window.location.pathname}`;

  const getSnapshot = (): StorageSnapshot | null => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      return parsed;
    } catch {
      return null;
    }
  };

  const saveSnapshot = (axes: MaturityAssessmentAxis[]) => {
    try {
      const answers: Record<string, string> = {};
      for (const axis of axes) {
        for (const question of axis.questions) {
          const checked = root.querySelector(`input[name="${CSS.escape(question.id)}"]:checked`);
          if (checked instanceof HTMLInputElement) answers[question.id] = checked.value;
        }
      }
      window.localStorage.setItem(storageKey, JSON.stringify({ v: 1, answers } satisfies StorageSnapshot));
    } catch {
      // ignore persistence failures (privacy mode, disabled storage, etc.)
    }
  };

  const clearSnapshot = () => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // ignore
    }
  };

  return { getSnapshot, saveSnapshot, clearSnapshot };
};
