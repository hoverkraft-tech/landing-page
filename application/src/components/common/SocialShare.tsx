import tablerIconData from '@iconify-json/tabler/icons.json';

import { defaultLang, type SupportedLanguage } from '~/i18n/ui';
import { useTranslations } from '~/i18n/utils';

type SocialShareNetwork = 'copy' | 'email' | 'linkedin' | 'bluesky' | 'devto' | 'print';

type SocialShareLabels = {
  share: string;
  copy: string;
  copied: string;
  email: string;
  linkedin: string;
  bluesky: string;
  devto: string;
  print: string;
};

export interface SocialShareProps {
  text: string;
  url: string | URL;
  className?: string;
  label?: string;
  networks?: SocialShareNetwork[];
  labels?: Partial<SocialShareLabels>;
  lang?: SupportedLanguage;
}

type TablerIconData = {
  icons: Record<string, { body: string; width?: number; height?: number }>;
  width?: number;
  height?: number;
};

const tablerIcons = tablerIconData as TablerIconData;

const TablerIcon = ({
  name,
  className,
  ariaHidden = true,
}: {
  name: string;
  className?: string;
  ariaHidden?: boolean;
}) => {
  const iconName = name.replace('tabler:', '');
  const icon = tablerIcons.icons[iconName];
  if (!icon) return null;

  const width = icon.width ?? tablerIcons.width ?? 24;
  const height = icon.height ?? tablerIcons.height ?? 24;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden={ariaHidden}
      focusable="false"
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
};

const scriptContent = `(() => {
  const roots = document.querySelectorAll('[data-social-share]');
  for (const root of roots) {
    if (!(root instanceof HTMLElement)) continue;
    if (root.dataset.socialShareInitialized === 'true') continue;
    root.dataset.socialShareInitialized = 'true';

    const getCurrentShareUrl = () => root.dataset.shareUrl ?? '';
    const getCurrentShareTitle = () => root.dataset.shareTitle ?? '';

    const devtoLink = root.querySelector('[data-share-devto]');
    if (devtoLink instanceof HTMLAnchorElement) {
      devtoLink.addEventListener('click', () => {
        const currentUrl = getCurrentShareUrl();
        const currentTitle = getCurrentShareTitle();
        if (!currentUrl && !currentTitle) return;

        const prefill = ['---', \`title: \${currentTitle}\`, 'published: false', '---', '', currentUrl, ''].join('\\n');
        devtoLink.href = \`https://dev.to/new?prefill=\${encodeURIComponent(prefill)}\`;
      });
    }

    const printButton = root.querySelector('[data-share-print]');
    if (printButton instanceof HTMLButtonElement) {
      printButton.addEventListener('click', () => {
        window.print();
      });
    }

    const copyButton = root.querySelector('[data-share-copy]');
    if (!(copyButton instanceof HTMLButtonElement)) continue;

    const labelEl = copyButton.querySelector('[data-share-copy-label]');
    const defaultLabel =
      root.dataset.copyLabel ?? (labelEl instanceof HTMLElement ? (labelEl.textContent ?? '') : '') ?? '';
    const copiedLabel = root.dataset.copiedLabel ?? '';
    let copiedTimeoutId;

    const copyText = async (text) => {
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch {
          // ignore
        }
      }

      try {
        // Fallback for non-secure contexts or restricted clipboard permissions.
        // We still surface the copied UI state since the user can manually copy from the prompt.
        window.prompt(defaultLabel, text);
        return true;
      } catch {
        return false;
      }
    };

    copyButton.addEventListener('click', async () => {
      const textToCopy = getCurrentShareUrl();
      if (!textToCopy) return;

      const ok = await copyText(textToCopy);
      if (!ok) return;

      copyButton.dataset.copied = 'true';
      if (typeof copiedTimeoutId === 'number') window.clearTimeout(copiedTimeoutId);
      copiedTimeoutId = window.setTimeout(() => {
        delete copyButton.dataset.copied;
      }, 900);

      if (labelEl instanceof HTMLElement) {
        labelEl.textContent = copiedLabel || labelEl.textContent || '';
        window.setTimeout(() => {
          labelEl.textContent = defaultLabel;
        }, 2000);
      }
    });
  }
})();`;

export default function SocialShare({
  text,
  url,
  className = 'inline-block',
  label,
  networks = ['copy', 'email', 'linkedin', 'bluesky', 'devto'],
  labels: labelsOverrides = {},
  lang = defaultLang,
}: SocialShareProps) {
  const t = useTranslations(lang);
  const labels = {
    share: t('social.share'),
    copy: t('social.copy'),
    copied: t('social.copied'),
    email: t('social.email'),
    linkedin: t('social.linkedin'),
    bluesky: t('social.bluesky'),
    devto: t('social.devto'),
    print: t('social.print'),
    ...labelsOverrides,
  } satisfies SocialShareLabels;

  const urlString = typeof url === 'string' ? url : url.toString();
  const defaultDevtoPrefill = ['---', `title: ${text}`, 'published: false', '---', '', urlString, ''].join('\n');
  const defaultDevtoHref = `https://dev.to/new?prefill=${encodeURIComponent(defaultDevtoPrefill)}`;

  const itemClass = 'inline-flex items-center justify-center';
  const iconClass = 'w-6 h-6 text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-slate-300';

  return (
    <>
      <div
        className={`${className} inline-flex flex-wrap items-center gap-2`}
        data-social-share
        data-share-url={urlString}
        data-share-title={text}
        data-copy-label={labels.copy}
        data-copied-label={labels.copied}
      >
        <span className="font-bold text-slate-500 dark:text-slate-400">{label ?? `${labels.share}:`}</span>

        {networks.includes('print') ? (
          <button type="button" className={itemClass} title={labels.print} data-share-print aria-label={labels.print}>
            <TablerIcon name="tabler:printer" className={iconClass} ariaHidden />
            <span className="sr-only">{labels.print}</span>
          </button>
        ) : null}

        {networks.includes('copy') ? (
          <button type="button" className={itemClass} title={labels.copy} data-share-copy aria-label={labels.copy}>
            <TablerIcon name="tabler:copy" className={`ma-copy-icon ${iconClass}`} ariaHidden />
            <TablerIcon name="tabler:check" className={`ma-copy-check ${iconClass}`} ariaHidden />
            <span className="sr-only" data-share-copy-label>
              {labels.copy}
            </span>
          </button>
        ) : null}

        {networks.includes('email') ? (
          <a
            className={itemClass}
            title={labels.email}
            href="#"
            data-sharer="email"
            data-url={urlString}
            data-title={text}
            data-subject={text}
            data-share-mail
            aria-label={labels.email}
          >
            <TablerIcon name="tabler:mail" className={iconClass} ariaHidden />
          </a>
        ) : null}

        {networks.includes('linkedin') ? (
          <a
            className={itemClass}
            title={labels.linkedin}
            href="#"
            data-sharer="linkedin"
            data-url={urlString}
            data-title={text}
            data-link="true"
            data-blank="true"
            target="_blank"
            rel="noreferrer noopener"
            data-share-linkedin
            aria-label={labels.linkedin}
          >
            <TablerIcon name="tabler:brand-linkedin" className={iconClass} ariaHidden />
          </a>
        ) : null}

        {networks.includes('devto') ? (
          <a
            className={itemClass}
            title={labels.devto}
            href={defaultDevtoHref}
            target="_blank"
            rel="noreferrer noopener"
            data-share-devto
            aria-label={labels.devto}
          >
            <TablerIcon name="tabler:device-imac-code" className={iconClass} ariaHidden />
          </a>
        ) : null}

        {networks.includes('bluesky') ? (
          <a
            className={itemClass}
            title={labels.bluesky}
            href="#"
            data-sharer="bluesky"
            data-url={urlString}
            data-title={text}
            data-link="true"
            data-blank="true"
            target="_blank"
            rel="noreferrer noopener"
            data-share-bluesky
            aria-label={labels.bluesky}
          >
            <TablerIcon name="tabler:brand-bluesky" className={iconClass} ariaHidden />
          </a>
        ) : null}
      </div>

      <style>
        {`[data-share-copy] .ma-copy-check {
  display: none;
}

[data-share-copy][data-copied='true'] .ma-copy-icon {
  display: none;
}

[data-share-copy][data-copied='true'] .ma-copy-check {
  display: inline-block;
}`}
      </style>

      <script dangerouslySetInnerHTML={{ __html: scriptContent }} />
    </>
  );
}
