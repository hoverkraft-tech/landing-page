import type { MaturityAssessmentAxis, MaturityAssessmentStrings } from './types';

export type RadarElements = {
  svg: SVGSVGElement;
  scoreEl: HTMLElement;
  interpretationEl: HTMLElement;
  progressCountEl: HTMLElement | null;
  progressWrapperEl: HTMLElement | null;
  progressBarEl: HTMLElement | null;
  sharePrintButton: HTMLButtonElement | null;
  shareCopyButton: HTMLButtonElement | null;
  shareMailLink: HTMLAnchorElement | null;
  shareLinkedInLink: HTMLAnchorElement | null;
  shareDevtoLink: HTMLAnchorElement | null;
  shareBlueskyLink: HTMLAnchorElement | null;
  socialShareRoot: HTMLElement | null;
  printAnswerEls: HTMLElement[];
};

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

const createSvgEl = (name: string) => document.createElementNS('http://www.w3.org/2000/svg', name);

const clearSvg = (svg: SVGSVGElement) => {
  const defs = svg.querySelector('defs');
  while (svg.lastChild) svg.removeChild(svg.lastChild);
  if (defs) svg.appendChild(defs);
};

const formatTemplate = (template: string, vars: Record<string, string>) =>
  String(template)
    .replaceAll('{score}', String(vars.score ?? ''))
    .replaceAll('{interpretation}', String(vars.interpretation ?? ''))
    .replaceAll('{url}', String(vars.url ?? ''));

export const computeState = (root: HTMLElement, axes: MaturityAssessmentAxis[]) => {
  const questionValues: Record<string, number> = {};
  let answeredQuestions = 0;

  for (const axis of axes) {
    for (const question of axis.questions) {
      const checked = root.querySelector(`input[name="${CSS.escape(question.id)}"]:checked`);
      if (checked) answeredQuestions += 1;
      questionValues[question.id] = checked instanceof HTMLInputElement ? Number(checked.value) : 0;
    }
  }

  const axisValues: Record<string, number> = {};
  for (const axis of axes) {
    const sum = axis.questions.reduce((acc, q) => acc + (questionValues[q.id] ?? 1), 0);
    axisValues[axis.id] = sum / axis.questions.length;
  }

  const total = axes.reduce((acc, axis) => acc + (axisValues[axis.id] ?? 0), 0);
  const globalAvg = total / axes.length;

  return { axisValues, globalAvg, answeredQuestions };
};

export const renderRadar = (params: {
  root: HTMLElement;
  axes: MaturityAssessmentAxis[];
  strings: MaturityAssessmentStrings;
  elements: RadarElements;
  totalQuestions: number;
  gradientId: string;
  shareUrl: string | null;
  shareText: string | null;
}) => {
  const { root, axes, strings, elements, totalQuestions, gradientId } = params;
  const {
    svg,
    scoreEl,
    interpretationEl,
    progressCountEl,
    progressWrapperEl,
    progressBarEl,
    sharePrintButton,
    shareCopyButton,
    shareMailLink,
    shareLinkedInLink,
    shareDevtoLink,
    shareBlueskyLink,
    socialShareRoot,
    printAnswerEls,
  } = elements;

  const { axisValues, globalAvg, answeredQuestions } = computeState(root, axes);
  const isComplete = totalQuestions > 0 && answeredQuestions === totalQuestions;

  if (sharePrintButton) sharePrintButton.disabled = !isComplete;
  if (shareCopyButton) shareCopyButton.disabled = !isComplete;

  const shareLinks = [shareMailLink, shareLinkedInLink, shareDevtoLink, shareBlueskyLink];
  for (const link of shareLinks) {
    if (!(link instanceof HTMLAnchorElement)) continue;
    link.setAttribute('aria-disabled', (!isComplete).toString());
    link.classList.toggle('pointer-events-none', !isComplete);
    link.classList.toggle('opacity-50', !isComplete);
    if (!isComplete) link.setAttribute('tabindex', '-1');
    else link.removeAttribute('tabindex');
  }

  for (const el of printAnswerEls) {
    const questionId = el.dataset.questionId;
    if (!questionId) continue;
    const checked = root.querySelector(`input[name="${CSS.escape(questionId)}"]:checked`);
    el.textContent = checked instanceof HTMLInputElement ? checked.value : '—';
  }

  if (progressCountEl) {
    progressCountEl.textContent = `${answeredQuestions}/${totalQuestions}`;
  }

  const progressPercent = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  if (progressWrapperEl) progressWrapperEl.setAttribute('aria-valuenow', String(progressPercent));
  if (progressBarEl) progressBarEl.style.width = `${progressPercent}%`;

  scoreEl.textContent = globalAvg.toFixed(1);

  const interpretation = getInterpretation(strings, globalAvg, answeredQuestions);
  interpretationEl.textContent = interpretation.text;
  interpretationEl.hidden = interpretation.hidden;
  if (interpretation.color) interpretationEl.style.color = interpretation.color;

  if (isComplete && params.shareUrl && params.shareText) {
    if (socialShareRoot) {
      socialShareRoot.dataset.shareUrl = params.shareUrl;
      socialShareRoot.dataset.shareTitle = params.shareText;
    }

    if (shareMailLink) {
      shareMailLink.href = '#';
      shareMailLink.setAttribute('data-url', params.shareUrl);
      shareMailLink.setAttribute('data-title', params.shareText);
      shareMailLink.setAttribute('data-subject', strings.shareMailSubject);
    }

    for (const el of [shareLinkedInLink, shareBlueskyLink]) {
      if (!(el instanceof HTMLAnchorElement)) continue;
      el.href = '#';
      el.setAttribute('data-url', params.shareUrl);
      el.setAttribute('data-title', params.shareText);
    }

    if (shareDevtoLink) {
      shareDevtoLink.href = '#';
    }
  } else {
    if (socialShareRoot) {
      delete socialShareRoot.dataset.shareUrl;
      delete socialShareRoot.dataset.shareTitle;
    }

    if (shareMailLink) {
      shareMailLink.href = '#';
      shareMailLink.removeAttribute('data-url');
      shareMailLink.removeAttribute('data-title');
      shareMailLink.removeAttribute('data-subject');
    }

    for (const el of [shareLinkedInLink, shareBlueskyLink]) {
      if (!(el instanceof HTMLAnchorElement)) continue;
      el.href = '#';
      el.removeAttribute('data-url');
      el.removeAttribute('data-title');
    }

    if (shareDevtoLink) {
      shareDevtoLink.href = '#';
    }
  }

  const cx = 250;
  const cy = 250;
  const radius = 180;
  const levels = 5;

  const numAxes = axes.length;
  const angleSlice = (Math.PI * 2) / numAxes;

  clearSvg(svg);

  for (let level = 1; level <= levels; level++) {
    const factor = level / levels;
    const points: string[] = [];

    for (let i = 0; i < numAxes; i++) {
      const angle = i * angleSlice - Math.PI / 2;
      const x = cx + radius * factor * Math.cos(angle);
      const y = cy + radius * factor * Math.sin(angle);
      points.push(`${x},${y}`);
    }

    const poly = createSvgEl('polygon');
    poly.setAttribute('points', points.join(' '));
    poly.setAttribute('fill', 'none');
    poly.setAttribute('stroke', 'var(--aw-color-text-muted)');
    poly.setAttribute('stroke-opacity', '0.35');
    poly.setAttribute('stroke-width', '1');
    svg.appendChild(poly);
  }

  axes.forEach((axis, i) => {
    const angle = i * angleSlice - Math.PI / 2;
    const x2 = cx + radius * Math.cos(angle);
    const y2 = cy + radius * Math.sin(angle);

    const line = createSvgEl('line');
    line.setAttribute('x1', String(cx));
    line.setAttribute('y1', String(cy));
    line.setAttribute('x2', String(x2));
    line.setAttribute('y2', String(y2));
    line.setAttribute('stroke', 'var(--aw-color-text-muted)');
    line.setAttribute('stroke-opacity', '0.35');
    line.setAttribute('stroke-width', '1');
    svg.appendChild(line);

    const labelRadius = radius + 28;
    const lx = cx + labelRadius * Math.cos(angle);
    const ly = cy + labelRadius * Math.sin(angle);

    const text = createSvgEl('text');
    text.setAttribute('x', String(lx));
    text.setAttribute('y', String(ly));
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('dominant-baseline', 'middle');
    text.setAttribute('fill', 'var(--aw-color-text-muted)');
    text.setAttribute('font-size', '11px');
    text.setAttribute('font-weight', '600');

    const parts = String(axis.label ?? '')
      .split(' ')
      .filter(Boolean);
    if (parts.length > 1) {
      parts.forEach((part, idx) => {
        const tspan = createSvgEl('tspan');
        tspan.textContent = part;
        tspan.setAttribute('x', String(lx));
        tspan.setAttribute('dy', idx === 0 ? '-0.4em' : '1.1em');
        text.appendChild(tspan);
      });
    } else {
      text.textContent = axis.label ?? '';
    }

    svg.appendChild(text);
  });

  const dataPoints = axes.map((axis, i) => {
    const angle = i * angleSlice - Math.PI / 2;
    const value = axisValues[axis.id] ?? 0;
    const factor = value / 5;
    const x = cx + radius * factor * Math.cos(angle);
    const y = cy + radius * factor * Math.sin(angle);
    return `${x},${y}`;
  });

  const dataPoly = createSvgEl('polygon');
  dataPoly.setAttribute('points', dataPoints.join(' '));
  dataPoly.setAttribute('fill', `url(#${gradientId})`);
  dataPoly.setAttribute('stroke', 'currentColor');
  dataPoly.setAttribute('stroke-width', '2');
  dataPoly.setAttribute('opacity', '0.95');
  svg.appendChild(dataPoly);

  dataPoints.forEach((point) => {
    const [x, y] = point.split(',');
    const circle = createSvgEl('circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', '4');
    circle.setAttribute('fill', 'var(--aw-color-bg-page)');
    circle.setAttribute('stroke', 'currentColor');
    circle.setAttribute('stroke-width', '2');
    svg.appendChild(circle);
  });
};

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
