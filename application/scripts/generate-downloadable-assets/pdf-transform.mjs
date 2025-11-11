async function applyPdfTransformations(origin) {
  function ensureLightTheme() {
    try {
      localStorage.setItem('theme', 'light');
    } catch {
      /* ignore storage access issues */
    }

    document.documentElement.classList.remove('dark');
    document.body.classList.add('pdf-export');
  }

  function hideDownloadCenter() {
    const downloadSection = document.querySelector('[data-pdf-hide="download-center"]');
    if (!downloadSection) {
      return;
    }
    downloadSection.remove();
  }

  async function revealAnimatedContent() {
    try {
      if (typeof window.Observer?.removeAnimationDelay === 'function') {
        window.Observer.removeAnimationDelay();
      }
    } catch {
      /* ignore animation observer issues */
    }

    const animatedElements = document.querySelectorAll('[no-intersect],[class*="intersect"],[data-animated="true"]');
    animatedElements.forEach((element) => {
      element.removeAttribute('no-intersect');
      element.setAttribute('data-animated', 'true');
      element.style.opacity = '1';
      element.style.animation = 'none';
      element.style.transition = 'none';
      element.style.transform = 'none';
    });

    window.scrollTo(0, document.body.scrollHeight);
    await new Promise((resolve) => setTimeout(resolve, 200));
    window.scrollTo(0, 0);
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  async function ensureImagesLoaded() {
    const images = Array.from(document.querySelectorAll('img'));
    if (images.length === 0) {
      return;
    }

    const imagePromises = images.map(async (image) => {
      const target = image;
      target.loading = 'eager';
      target.decoding = 'sync';
      target.fetchPriority = 'high';

      if (target.complete && target.naturalWidth > 0) {
        return;
      }

      const currentSrc = target.getAttribute('src');
      if (currentSrc) {
        target.setAttribute('src', currentSrc);
      }

      const currentSrcSet = target.getAttribute('srcset');
      if (currentSrcSet) {
        target.setAttribute('srcset', currentSrcSet);
      }

      if (typeof target.decode === 'function') {
        try {
          await target.decode();
        } catch {
          /* ignore decoding issues */
        }
        return;
      }

      await new Promise((resolve) => {
        const handleDone = () => {
          target.removeEventListener('load', handleDone);
          target.removeEventListener('error', handleDone);
          resolve();
        };

        target.addEventListener('load', handleDone, { once: true });
        target.addEventListener('error', handleDone, { once: true });
      });
    });

    await Promise.allSettled(imagePromises);
  }

  function absolutizeLinks(baseOrigin) {
    document.querySelectorAll('a[href]').forEach((anchor) => {
      const href = anchor.getAttribute('href');
      if (!href) {
        return;
      }

      if (
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:')
      ) {
        return;
      }

      try {
        const absoluteHref = new URL(href, baseOrigin).toString();
        anchor.setAttribute('href', absoluteHref);
      } catch {
        /* ignore invalid urls */
      }
    });
  }

  ensureLightTheme();
  hideDownloadCenter();
  absolutizeLinks(origin);
  await revealAnimatedContent();
  await ensureImagesLoaded();
}

function getPdfTransformSource() {
  return `(${applyPdfTransformations.toString()})`;
}

export { getPdfTransformSource };
