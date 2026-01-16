import React from 'react';

import type { MaturityAssessmentStrings } from './types';

type Props = {
  strings: Pick<MaturityAssessmentStrings, 'printTagline' | 'printTitle'>;
};

const MaturityPrintHeader = ({ strings }: Props) => {
  return (
    <header className="hidden" data-print-header>
      {strings.printTagline ? (
        <p className="text-sm font-semibold tracking-wide text-muted uppercase">{strings.printTagline}</p>
      ) : null}
      <h1 className="text-2xl font-bold tracking-tighter text-heading">{strings.printTitle}</h1>
    </header>
  );
};

export default MaturityPrintHeader;
