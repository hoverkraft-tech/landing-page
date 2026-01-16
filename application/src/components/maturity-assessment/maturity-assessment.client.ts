import {
  applyDecodedAnswers,
  buildOrderedQuestionIds,
  decodeAnswersFromParam,
  encodeAnswersToParam,
} from './client/answers-codec';
import { createStorage } from './client/persistence';
import {
  buildShareText,
  computeState,
  getInterpretation,
  renderRadar,
  type RadarElements,
} from './client/radar-renderer';
import type { MaturityAssessmentAxis, MaturityAssessmentStrings } from './client/types';

const getStickyHeaderOffset = () => {
  const header = document.querySelector('[data-aw-sticky-header]');
  if (!(header instanceof HTMLElement)) return 0;

  const position = getComputedStyle(header).position;
  if (position !== 'fixed' && position !== 'sticky') return 0;

  return header.getBoundingClientRect().height;
};

const smoothScrollToElement = (element: HTMLElement) => {
  const headerOffset = getStickyHeaderOffset();
  const gap = 16;
  const top = element.getBoundingClientRect().top + window.scrollY - headerOffset - gap;
  window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
};

const restoreOptionsOrder = (_fieldset: HTMLFieldSetElement) => {
  // No-op for now.
  // The original implementation referenced this function but did not define it.
  // Keeping it here prevents reset from throwing and preserves the current UI.
};

const init = (root: Element) => {
  if (!(root instanceof HTMLElement)) return;
  if (root.dataset.maturityAssessmentInitialized === 'true') return;
  root.dataset.maturityAssessmentInitialized = 'true';

  const axesScript = root.querySelector('script[data-axes-json]');
  const stringsScript = root.querySelector('script[data-strings-json]');

  const axes = JSON.parse(axesScript?.textContent ?? '[]') as MaturityAssessmentAxis[];
  const strings = JSON.parse(stringsScript?.textContent ?? '{}') as MaturityAssessmentStrings;

  const gradientId = `${root.id}-polyGradient`;

  const svg = root.querySelector('svg[data-radar]');
  const scoreEl = root.querySelector('[data-score]');
  const interpretationEl = root.querySelector('[data-interpretation]');
  const fieldsets = Array.from(root.querySelectorAll('fieldset[data-question-id]')).filter(
    (el): el is HTMLFieldSetElement => el instanceof HTMLFieldSetElement
  );
  const resetButton = root.querySelector('[data-reset-button]');
  const progressCountEl = root.querySelector('[data-progress-count]');
  const progressWrapperEl = root.querySelector('[data-progress-bar-wrapper]');
  const progressBarEl = root.querySelector('[data-progress-bar]');
  const sharePrintButton = root.querySelector('[data-share-print]');
  const shareCopyButton = root.querySelector('[data-share-copy]');
  const shareMailLink = root.querySelector('[data-share-mail]');
  const shareLinkedInLink = root.querySelector('[data-share-linkedin]');
  const shareDevtoLink = root.querySelector('[data-share-devto]');
  const shareBlueskyLink = root.querySelector('[data-share-bluesky]');
  const shareHoverkraftLink = root.querySelector('[data-share-hoverkraft]');
  const shareHoverkraftSection = document.querySelector('[data-share-hoverkraft-section]');
  const socialShareRoot = root.querySelector('[data-social-share]');
  const printAnswerEls = Array.from(root.querySelectorAll('[data-print-answer][data-question-id]'));
  const currentProfileTitle = root.querySelector('[data-current-profile-title]');

  if (!(svg instanceof SVGSVGElement)) throw new Error('MaturityAssessment: radar svg not found');
  if (!(scoreEl instanceof HTMLElement)) throw new Error('MaturityAssessment: score element not found');
  if (!(interpretationEl instanceof HTMLElement))
    throw new Error('MaturityAssessment: interpretation element not found');

  const elements: RadarElements = {
    svg,
    scoreEl,
    interpretationEl,
    progressCountEl: progressCountEl instanceof HTMLElement ? progressCountEl : null,
    progressWrapperEl: progressWrapperEl instanceof HTMLElement ? progressWrapperEl : null,
    progressBarEl: progressBarEl instanceof HTMLElement ? progressBarEl : null,
    sharePrintButton: sharePrintButton instanceof HTMLButtonElement ? sharePrintButton : null,
    shareCopyButton: shareCopyButton instanceof HTMLButtonElement ? shareCopyButton : null,
    shareMailLink: shareMailLink instanceof HTMLAnchorElement ? shareMailLink : null,
    shareLinkedInLink: shareLinkedInLink instanceof HTMLAnchorElement ? shareLinkedInLink : null,
    shareDevtoLink: shareDevtoLink instanceof HTMLAnchorElement ? shareDevtoLink : null,
    shareBlueskyLink: shareBlueskyLink instanceof HTMLAnchorElement ? shareBlueskyLink : null,
    shareHoverkraftLink: shareHoverkraftLink instanceof HTMLAnchorElement ? shareHoverkraftLink : null,
    shareHoverkraftSection: shareHoverkraftSection instanceof HTMLElement ? shareHoverkraftSection : null,
    socialShareRoot: socialShareRoot instanceof HTMLElement ? socialShareRoot : null,
    printAnswerEls: printAnswerEls.filter((el): el is HTMLElement => el instanceof HTMLElement),
  };

  if (shareHoverkraftLink instanceof HTMLAnchorElement) {
    shareHoverkraftLink.addEventListener('click', (event) => {
      event.preventDefault();

      const shareUrl = shareHoverkraftLink.dataset.shareUrl ?? '';
      const hiddenField = document.querySelector(
        '#share-with-hoverkraft input[name="maturity_assessment"]'
      );

      if (hiddenField instanceof HTMLInputElement && shareUrl) {
        hiddenField.value = shareUrl;
      }

      const target = document.getElementById('share-with-hoverkraft');
      if (target instanceof HTMLElement) {
        smoothScrollToElement(target);
      }
    });
  }

  if (shareMailLink instanceof HTMLAnchorElement) {
    shareMailLink.addEventListener('click', (event) => {
      event.preventDefault();

      const isDisabled = shareMailLink.getAttribute('aria-disabled') === 'true';
      if (isDisabled) return;

      const subject = shareMailLink.getAttribute('data-subject') ?? '';
      const body = shareMailLink.getAttribute('data-body');
      const url = shareMailLink.getAttribute('data-url') ?? '';
      const title = shareMailLink.getAttribute('data-title') ?? '';

      const bodyText = body ?? [title, url].filter(Boolean).join('\n\n');
      const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
      window.location.href = mailto;
    });
  }

  const totalQuestions = axes.reduce((acc, axis) => acc + (axis.questions?.length ?? 0), 0);
  const orderedQuestionIds = buildOrderedQuestionIds(axes);

  const storage = createStorage(root);

  const updateResetButtonState = () => {
    if (!(resetButton instanceof HTMLButtonElement)) return;
    const hasAnySelection = root.querySelector('input[type="radio"]:checked') !== null;
    resetButton.disabled = !hasAnySelection;
  };

  const getFieldsetState = (fieldset: HTMLFieldSetElement) => {
    const checked = fieldset.querySelector('input[type="radio"]:checked');
    return checked instanceof HTMLInputElement ? checked : null;
  };

  const updateFieldsetSummary = (fieldset: HTMLFieldSetElement) => {
    const summaryEl = fieldset.querySelector('[data-selected-summary]');
    if (!(summaryEl instanceof HTMLElement)) return;

    const selected = getFieldsetState(fieldset);
    if (!selected) {
      summaryEl.textContent = '';
      summaryEl.hidden = true;
      return;
    }

    const selectedLabel = selected.closest('label');
    const description = selectedLabel?.querySelector('p')?.textContent?.trim() ?? '';
    const level = selected.value;

    summaryEl.textContent = `${strings.levelPrefix} ${level}${description ? ` — ${description}` : ''}`;
    summaryEl.hidden = false;
  };

  const setCollapsed = (fieldset: HTMLFieldSetElement, collapsed: boolean) => {
    const optionsEl = fieldset.querySelector('[data-options]');
    if (optionsEl instanceof HTMLElement) optionsEl.hidden = collapsed;

    const toggleEl = fieldset.querySelector('[data-question-toggle]');
    if (toggleEl instanceof HTMLButtonElement) {
      const toggleLabel = toggleEl.querySelector('[data-toggle-label]');
      if (toggleLabel instanceof HTMLElement) toggleLabel.hidden = !collapsed;

      const iconCollapsed = toggleEl.querySelector('[data-toggle-icon-collapsed]');
      if (iconCollapsed instanceof Element) iconCollapsed.classList.toggle('hidden', !collapsed);

      const iconExpanded = toggleEl.querySelector('[data-toggle-icon-expanded]');
      if (iconExpanded instanceof Element) iconExpanded.classList.toggle('hidden', collapsed);
    }

    fieldset.dataset.collapsed = collapsed ? 'true' : 'false';
  };

  const expandFieldset = (fieldset: HTMLFieldSetElement, focusTarget: 'input' | 'title' = 'input') => {
    setCollapsed(fieldset, false);
    const legend = fieldset.querySelector('[data-question-legend]');
    smoothScrollToElement(legend instanceof HTMLElement ? legend : fieldset);

    requestAnimationFrame(() => {
      if (focusTarget === 'title') {
        if (legend instanceof HTMLElement) {
          legend.focus({ preventScroll: true });
          return;
        }
      }

      const firstInput = fieldset.querySelector('input[type="radio"]');
      if (firstInput instanceof HTMLInputElement) firstInput.focus({ preventScroll: true });
    });
  };

  const collapseFieldset = (fieldset: HTMLFieldSetElement, preserveScroll = false) => {
    const anchorEl = preserveScroll ? (fieldset.querySelector('[data-question-legend]') ?? fieldset) : null;
    const anchorTop = anchorEl instanceof HTMLElement ? anchorEl.getBoundingClientRect().top : 0;
    const startScrollY = preserveScroll ? window.scrollY : 0;

    updateFieldsetSummary(fieldset);
    setCollapsed(fieldset, true);

    if (anchorEl instanceof HTMLElement) {
      requestAnimationFrame(() => {
        const nextAnchorTop = anchorEl.getBoundingClientRect().top;
        const delta = nextAnchorTop - anchorTop;
        if (Math.abs(delta) < 1) return;
        window.scrollTo({ top: startScrollY + delta, behavior: 'smooth' });
      });
    }
  };

  const findNextUnansweredFieldset = (startIndex: number) => {
    for (let i = startIndex + 1; i < fieldsets.length; i++) {
      if (!getFieldsetState(fieldsets[i])) return fieldsets[i];
    }
    return null;
  };

  let lastSyncedUrl: string | null = null;

  const scheduleRender = (() => {
    let raf = 0;
    return () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        raf = 0;
        render();
      });
    };
  })();

  let wasComplete = false;

  const focusRadarPanel = () => {
    const target = currentProfileTitle instanceof HTMLElement ? currentProfileTitle : null;
    if (!target) return;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    smoothScrollToElement(target);
  };

  const render = () => {
    const { globalAvg, answeredQuestions } = computeState(root, axes);
    const isComplete = totalQuestions > 0 && answeredQuestions === totalQuestions;

    // Keep the URL in sync with the current answers as the form changes.
    try {
      if (typeof window !== 'undefined' && typeof window.history?.replaceState === 'function') {
        const pageUrl = new URL(window.location.href);
        pageUrl.hash = '';

        if (answeredQuestions > 0) {
          pageUrl.searchParams.set('ma', encodeAnswersToParam(root, orderedQuestionIds));
        } else {
          pageUrl.searchParams.delete('ma');
        }

        const nextUrl = pageUrl.toString();
        if (lastSyncedUrl !== nextUrl) {
          window.history.replaceState(window.history.state, '', nextUrl);
          lastSyncedUrl = nextUrl;
        }
      }
    } catch {
      // ignore
    }

    let shareUrl: string | null = null;
    let shareText: string | null = null;

    if (isComplete) {
      const pageUrl = new URL(window.location.href);
      pageUrl.hash = '';
      pageUrl.searchParams.set('ma', encodeAnswersToParam(root, orderedQuestionIds));
      shareUrl = pageUrl.toString();

      const scoreLabel = `${globalAvg.toFixed(1)}/5`;
      const interpretation = getInterpretation(strings, globalAvg, answeredQuestions);

      shareText = buildShareText({
        strings,
        scoreLabel,
        interpretationText: interpretation.text,
        shareUrl,
      });
    }

    renderRadar({
      root,
      axes,
      strings,
      elements,
      totalQuestions,
      gradientId,
      shareUrl,
      shareText,
    });

    if (isComplete && !wasComplete) {
      focusRadarPanel();
    }

    wasComplete = isComplete;
  };

  root.addEventListener('change', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.type !== 'radio') return;

    const fieldset = target.closest('fieldset[data-question-id]');
    if (!(fieldset instanceof HTMLFieldSetElement)) return;

    updateFieldsetSummary(fieldset);
    setCollapsed(fieldset, true);

    const currentIndex = fieldsets.indexOf(fieldset);
    const nextFieldset =
      findNextUnansweredFieldset(currentIndex) ?? (currentIndex >= 0 ? fieldsets[currentIndex + 1] : null);

    if (nextFieldset) {
      const currentSection = fieldset.closest('section');
      const nextSection = nextFieldset.closest('section');
      const isCategoryChange = currentSection !== nextSection;

      if (isCategoryChange) {
        setCollapsed(nextFieldset, false);
        const nextAxisTitle = nextSection?.querySelector('[data-axis-title]');
        if (nextAxisTitle instanceof HTMLElement) {
          smoothScrollToElement(nextAxisTitle);
          requestAnimationFrame(() => {
            nextAxisTitle.focus({ preventScroll: true });
          });
        } else {
          expandFieldset(nextFieldset, 'title');
        }
      } else {
        expandFieldset(nextFieldset, 'title');
      }
    }

    updateResetButtonState();
    storage.saveSnapshot(axes);
    scheduleRender();
  });

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const toggle = target.closest('[data-question-toggle]');
    const legend = target.closest('[data-question-legend]');
    if (!toggle && !legend) return;

    const fieldset = (toggle ?? legend)?.closest('fieldset[data-question-id]');
    if (!(fieldset instanceof HTMLFieldSetElement)) return;

    const isCollapsed = fieldset.dataset.collapsed === 'true';

    if (isCollapsed) {
      expandFieldset(fieldset);
      return;
    }

    const hasSelection = getFieldsetState(fieldset) !== null;
    if (hasSelection) {
      collapseFieldset(fieldset, true);
      return;
    }

    expandFieldset(fieldset);
  });

  root.addEventListener('reset', () => {
    queueMicrotask(() => {
      for (const fieldset of fieldsets) {
        restoreOptionsOrder(fieldset);
        setCollapsed(fieldset, false);
        const summaryEl = fieldset.querySelector('[data-selected-summary]');
        if (summaryEl instanceof HTMLElement) {
          summaryEl.textContent = '';
          summaryEl.hidden = true;
        }
      }

      updateResetButtonState();
      storage.clearSnapshot();
      scheduleRender();
    });
  });

  // Restore previous answers (if any)
  const shareParam = new URLSearchParams(window.location.search).get('ma');
  const decodedFromUrl = shareParam ? decodeAnswersFromParam(shareParam, orderedQuestionIds.length) : null;

  if (decodedFromUrl && applyDecodedAnswers(root, orderedQuestionIds, decodedFromUrl)) {
    storage.saveSnapshot(axes);
  } else {
    const snapshot = storage.getSnapshot();
    const savedAnswers = snapshot && typeof snapshot === 'object' ? snapshot.answers : null;
    if (savedAnswers && typeof savedAnswers === 'object') {
      for (const axis of axes) {
        for (const question of axis.questions) {
          const value = savedAnswers[question.id];
          if (value === undefined || value === null) continue;
          const input = root.querySelector(
            `input[name="${CSS.escape(question.id)}"][value="${CSS.escape(String(value))}"]`
          );
          if (input instanceof HTMLInputElement) input.checked = true;
        }
      }
    }
  }

  for (const fieldset of fieldsets) {
    updateFieldsetSummary(fieldset);
    setCollapsed(fieldset, false);
  }

  updateResetButtonState();
  render();
};

for (const root of document.querySelectorAll('[data-maturity-assessment]')) {
  init(root);
}
