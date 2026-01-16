import tablerIconData from '@iconify-json/tabler/icons.json';
import React, { useEffect, useRef, useState } from 'react';

import { defaultLang, type SupportedLanguage } from '~/i18n/ui';
import { useTranslations } from '~/i18n/utils';

type SocialShareLabels = {
  share: string;
  copy: string;
  copied: string;
  email: string;
  linkedin: string;
  bluesky: string;
  print: string;
};

export interface SocialShareProps {
  text: string;
  url: string | URL;
  title?: string;
  lang?: SupportedLanguage;
  disabled?: boolean;
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

export default function SocialShare({ text, url, title, lang = defaultLang, disabled = false }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t = useTranslations(lang);
  const labels = {
    share: t('social.share'),
    copy: t('social.copy'),
    copied: t('social.copied'),
    email: t('social.email'),
    linkedin: t('social.linkedin'),
    bluesky: t('social.bluesky'),
    print: t('social.print'),
  } satisfies SocialShareLabels;

  const urlString = typeof url === 'string' ? url : url.toString();
  const encodedUrl = encodeURIComponent(urlString);
  const shareTitle = title ?? text;
  const mailBody = text;
  const decodedMailBody = mailBody
    .replace(/\\r\\n/g, '\n')
    .replace(/\r\n/g, '\n')
    .replace(/\\n/g, '\n')
    .replace(/\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\r/g, '\n');
  const normalizedMailBody = decodedMailBody.replace(/\r?\n/g, '\r\n');
  const mailHref = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(normalizedMailBody)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const blueskyHref = `https://bsky.app/intent/compose?text=${encodeURIComponent(`${shareTitle} ${urlString}`.trim())}`;

  const containerClass = `inline-flex flex-wrap items-center gap-2 text-gray-500 dark:text-slate-600${
    disabled ? ' opacity-60 pointer-events-none' : ''
  }`;
  const itemClass = 'inline-flex items-center justify-center';
  const iconClass = 'w-6 h-6 text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-slate-300';

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    if (!urlString || disabled) return;

    let didCopy = false;
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const clipboard = typeof window !== 'undefined' ? window.navigator?.clipboard : null;
    if (clipboard && window.isSecureContext) {
      try {
        await clipboard.writeText(urlString);
        didCopy = true;
      } catch {
        didCopy = false;
      }
    }

    if (!didCopy) {
      try {
        window.prompt(labels.copy, urlString);
        didCopy = true;
      } catch {
        didCopy = false;
      }
    }

    if (!didCopy) return;

    setCopied(true);
    if (copiedTimeoutRef.current) {
      clearTimeout(copiedTimeoutRef.current);
    }
    copiedTimeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <>
      <div className={containerClass}>
        <span className="font-bold text-slate-500 dark:text-slate-400">{`${labels.share}:`}</span>

        <button
          type="button"
          className={itemClass}
          title={labels.print}
          aria-label={labels.print}
          onClick={() => window.print()}
          disabled={disabled}
        >
          <TablerIcon name="tabler:printer" className={iconClass} ariaHidden />
          <span className="sr-only">{labels.print}</span>
        </button>

        <button
          type="button"
          className={itemClass}
          title={labels.copy}
          aria-label={labels.copy}
          onClick={handleCopy}
          disabled={disabled}
        >
          <TablerIcon name="tabler:copy" className={`${iconClass} ${copied ? 'hidden' : 'inline-block'}`} ariaHidden />
          <TablerIcon name="tabler:check" className={`${iconClass} ${copied ? 'inline-block' : 'hidden'}`} ariaHidden />
          <span className="sr-only" aria-live="polite">
            {copied ? labels.copied : labels.copy}
          </span>
        </button>

        <a
          className={itemClass}
          title={labels.email}
          href={mailHref}
          aria-label={labels.email}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          onClick={disabled ? (event) => event.preventDefault() : undefined}
        >
          <TablerIcon name="tabler:mail" className={iconClass} ariaHidden />
        </a>

        <a
          className={itemClass}
          title={labels.linkedin}
          href={linkedinHref}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={labels.linkedin}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          onClick={disabled ? (event) => event.preventDefault() : undefined}
        >
          <TablerIcon name="tabler:brand-linkedin" className={iconClass} ariaHidden />
        </a>

        <a
          className={itemClass}
          title={labels.bluesky}
          href={blueskyHref}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={labels.bluesky}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
          onClick={disabled ? (event) => event.preventDefault() : undefined}
        >
          <TablerIcon name="tabler:brand-bluesky" className={iconClass} ariaHidden />
        </a>
      </div>
    </>
  );
}
