import React from 'react';
// eslint-disable-next-line n/no-missing-import
import { SITE } from 'astrowind:config';

import logoUrl from '~/assets/images/brand/logo/logo-icon.png';
import type { MaturityAssessmentStrings } from './types';

type Props = {
  strings: Pick<MaturityAssessmentStrings, 'printFooterUrl'>;
};

const MaturityPrintFooter = ({ strings }: Props) => {
  return (
    <footer className="mt-8 hidden" data-print-footer>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center scale-90 origin-left">
          <img className="h-9 w-auto" src={logoUrl.src} alt={SITE?.name ?? 'Hoverkraft'} width={47} height={47} />
          <span className="self-center ml-2 rtl:ml-0 rtl:mr-2 text-2xl md:text-xl font-bold text-primary whitespace-nowrap dark:text-white font-heading">
            {SITE?.name}
          </span>
        </div>
        <div className="text-sm font-semibold text-muted">{strings.printFooterUrl}</div>
      </div>
    </footer>
  );
};

export default MaturityPrintFooter;
