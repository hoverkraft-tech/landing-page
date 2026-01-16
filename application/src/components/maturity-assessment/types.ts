import type { MaturityAssessmentAxis } from '~/data/maturity-assessment';

export interface MaturityAssessmentStrings {
  currentProfileTitle: string;
  scoreLabel: string;
  progressLabel: string;
  printTagline?: string;
  printTitle: string;
  printAnswersTitle: string;
  printInterpretationTitle: string;
  printFooterUrl: string;
  shareLabel: string;
  sharePrintLabel: string;
  shareCopyLabel: string;
  shareCopySuccessLabel: string;
  shareMailLabel: string;
  shareMailSubject: string;
  shareTextWithInterpretation: string;
  shareTextWithoutInterpretation: string;
  shareMailBodyWithInterpretation: string;
  shareMailBodyWithoutInterpretation: string;
  shareLinkedInLabel: string;
  shareBlueskyLabel: string;
  resetLabel: string;
  editLabel: string;
  levelPrefix: string;
  interpretation: {
    initial: string;
    repeatable: string;
    defined: string;
    managed: string;
    optimizing: string;
  };
}

export interface MaturityAssessmentProps {
  id?: string;
  axes: MaturityAssessmentAxis[];
  strings: MaturityAssessmentStrings;
}
