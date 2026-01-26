import React from 'react';

import type { SupportedLanguage } from '~/i18n/ui';
import { defaultLang } from '~/i18n/ui';
import { useTranslatedPath } from '~/i18n/utils';
// eslint-disable-next-line n/no-missing-import
import SocialShare from '~/components/common/SocialShare';
import type { MaturityAssessmentAxis } from '~/data/maturity-assessment';
import type { MaturityAssessmentStrings } from './types';
// eslint-disable-next-line n/no-missing-import
import MaturityAssessmentRadar from './MaturityAssessmentRadar';
// eslint-disable-next-line n/no-missing-import
import MaturityPrintFooter from './MaturityPrintFooter';
// eslint-disable-next-line n/no-missing-import
import MaturityPrintHeader from './MaturityPrintHeader';
// eslint-disable-next-line n/no-missing-import
import MaturityPrintSummary from './MaturityPrintSummary';

type Props = {
  id: string;
  axes: MaturityAssessmentAxis[];
  strings: MaturityAssessmentStrings;
  answers: Record<string, number | null>;
  axisValues: Record<string, number>;
  globalAvg: number;
  progressPercent: number;
  answeredQuestions: number;
  totalQuestions: number;
  interpretation: { text: string; color: string | null; hidden: boolean };
  isComplete: boolean;
  shareUrl: string | null;
  shareText: string;
  mailBody: string;
  pageUrl: string;
  lang?: SupportedLanguage;
};

const MaturityAssessmentSidebar = ({
  id,
  axes,
  strings,
  answers,
  axisValues,
  globalAvg,
  progressPercent,
  answeredQuestions,
  totalQuestions,
  interpretation,
  isComplete,
  shareUrl,
  shareText,
  mailBody,
  pageUrl,
  lang,
}: Props) => {
  const scoreValue = globalAvg.toFixed(1);
  const shareUrlResolved = shareUrl ?? pageUrl;
  const shareTextResolved = shareUrl ? shareText : '';
  const translatePath = useTranslatedPath(lang ?? defaultLang);
  const shareFormUrl = React.useMemo(() => {
    const shareFormPath = translatePath('/maturity-assessment-share');
    try {
      const url = new URL(shareFormPath, pageUrl);
      url.searchParams.set('maturity_assessment', shareUrlResolved);
      return url.toString();
    } catch {
      return shareFormPath;
    }
  }, [pageUrl, shareUrlResolved, translatePath]);
  const shareTeamClassName = `btn-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary disabled:hover:border-primary disabled:hover:brightness-100`;
  const handleShareTeamClick = () => {
    if (!isComplete) return;
    if (typeof window === 'undefined') return;
    window.location.href = shareFormUrl;
  };

  return (
    <aside className="sticky top-24 lg:top-28 self-start h-fit" data-maturity-sidebar>
      <div className="rounded-2xl border border-gray-200/60 bg-white/40 p-5 text-center backdrop-blur dark:bg-white/5">
        <MaturityPrintHeader strings={strings} />

        <h3 className="text-base font-semibold text-heading" data-current-profile-title>
          {strings.currentProfileTitle}
        </h3>

        <MaturityAssessmentRadar id={id} axes={axes} axisValues={axisValues} />

        <div className="mt-5">
          <div className="font-mono text-5xl font-bold text-heading">
            <span data-score>{scoreValue}</span>
            <span className="text-base font-medium text-muted">/ 5</span>
          </div>
          <div className="mt-1 text-xs font-semibold tracking-widest text-muted uppercase">{strings.scoreLabel}</div>

          <div className="mt-4 text-left" data-progress-section>
            <div className="flex items-center justify-between text-xs font-semibold tracking-widest text-muted uppercase">
              <span>{strings.progressLabel}</span>
              <span data-progress-count>
                {answeredQuestions}/{totalQuestions}
              </span>
            </div>
            <div
              className="mt-2 h-2 w-full rounded-full bg-gray-200/60 dark:bg-white/10"
              data-progress-bar-wrapper
              role="progressbar"
              aria-label={strings.progressLabel}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPercent}
            >
              <div
                className="h-full rounded-full bg-secondary transition-[width] duration-300"
                data-progress-bar
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 hidden" data-print-interpretation-title>
            <div className="text-xs font-semibold tracking-widest text-muted uppercase">
              {strings.printInterpretationTitle}
            </div>
          </div>

          <div
            className="mt-3 text-sm font-semibold"
            data-interpretation
            hidden={interpretation.hidden}
            style={interpretation.color ? { color: interpretation.color } : undefined}
          >
            {interpretation.text}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3" data-reset-share-row>
            <button
              type="reset"
              className="btn-secondary px-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-secondary disabled:hover:border-secondary disabled:hover:brightness-100"
              data-reset-button
              disabled={answeredQuestions === 0}
            >
              {strings.resetLabel}
            </button>
            <button
              type="button"
              className={shareTeamClassName}
              aria-disabled={!isComplete}
              disabled={!isComplete}
              onClick={handleShareTeamClick}
              data-share-team-button
            >
              {strings.shareTeamLabel}
            </button>
          </div>

          <div className="my-4 h-px w-full bg-gray-200/60 dark:bg-gray-700/60" aria-hidden="true"></div>

          <div className="mt-4 text-left" data-share-section>
            <SocialShare
              url={shareUrlResolved}
              title={shareTextResolved}
              text={mailBody}
              disabled={!isComplete}
              lang={lang}
            />
          </div>

          <MaturityPrintSummary axes={axes} answers={answers} strings={strings} />

          <MaturityPrintFooter strings={strings} />
        </div>
      </div>
    </aside>
  );
};

export default MaturityAssessmentSidebar;
