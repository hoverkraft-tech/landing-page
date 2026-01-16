export type MaturityAssessmentQuestion = {
  id: string;
  shareId?: number;
};

export type MaturityAssessmentAxis = {
  id: string;
  label?: string;
  questions: MaturityAssessmentQuestion[];
};

export type MaturityAssessmentStrings = {
  levelPrefix: string;
  editLabel?: string;
  interpretation: {
    initial: string;
    repeatable: string;
    defined: string;
    managed: string;
    optimizing: string;
  };
  shareTextWithInterpretation: string;
  shareTextWithoutInterpretation: string;
  shareMailSubject: string;
  shareMailBodyWithInterpretation: string;
  shareMailBodyWithoutInterpretation: string;
};
