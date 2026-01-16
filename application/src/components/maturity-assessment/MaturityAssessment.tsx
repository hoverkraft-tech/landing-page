import type { PropsWithChildren } from 'react';

import maturityAssessmentScript from './maturity-assessment.client.ts?url';
import './maturity-assessment.css';
import type { MaturityAssessmentProps } from './types';

export type Props = PropsWithChildren<MaturityAssessmentProps>;

export default function MaturityAssessment({ id = 'maturity-assessment', axes, strings, children }: Props) {
  return (
    <form id={id} data-maturity-assessment data-form className="grid gap-8 lg:grid-cols-2" noValidate>
      {children}

      <script type="application/json" data-axes-json dangerouslySetInnerHTML={{ __html: JSON.stringify(axes) }} />
      <script type="application/json" data-strings-json dangerouslySetInnerHTML={{ __html: JSON.stringify(strings) }} />
      <script type="module" src={maturityAssessmentScript} />
    </form>
  );
}
