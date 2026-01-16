import type { MaturityAssessmentStrings } from '../types';

export const getInterpretation = (
  strings: MaturityAssessmentStrings,
  globalAvg: number,
  answeredQuestions: number
): { text: string; color: string | null; hidden: boolean } => {
  if (answeredQuestions === 0) {
    return { text: '', color: null, hidden: true };
  }

  const danger = 'var(--aw-color-danger)';
  const warning = 'var(--aw-color-warning)';
  const primary = 'var(--aw-color-secondary)';
  const success = 'var(--aw-color-success)';

  if (globalAvg < 2) {
    return { text: strings.interpretation.initial, color: danger, hidden: false };
  }

  if (globalAvg < 3) {
    return { text: strings.interpretation.repeatable, color: 'var(--aw-color-accent)', hidden: false };
  }

  if (globalAvg < 4) {
    return { text: strings.interpretation.defined, color: warning, hidden: false };
  }

  if (globalAvg < 4.8) {
    return { text: strings.interpretation.managed, color: primary, hidden: false };
  }

  return { text: strings.interpretation.optimizing, color: success, hidden: false };
};

const formatTemplate = (template: string, vars: Record<string, string>) =>
  String(template)
    .replaceAll('{score}', String(vars.score ?? ''))
    .replaceAll('{interpretation}', String(vars.interpretation ?? ''))
    .replaceAll('{url}', String(vars.url ?? ''));

export const buildShareText = (params: {
  strings: MaturityAssessmentStrings;
  scoreLabel: string;
  interpretationText: string;
  shareUrl: string;
}) => {
  const { strings, scoreLabel, interpretationText, shareUrl } = params;

  if (interpretationText) {
    return formatTemplate(strings.shareTextWithInterpretation, {
      score: scoreLabel,
      interpretation: interpretationText,
      url: shareUrl,
    });
  }

  return formatTemplate(strings.shareTextWithoutInterpretation, {
    score: scoreLabel,
    interpretation: '',
    url: shareUrl,
  });
};
