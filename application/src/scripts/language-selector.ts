const handleDocumentClick = (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  document.querySelectorAll<HTMLElement>('[data-language-menu]').forEach((menu) => {
    const selector = menu.closest<HTMLElement>('[data-language-selector]');
    if (!selector) {
      return;
    }

    if (!selector.contains(target)) {
      menu.classList.add('hidden');
    }
  });
};

const handleDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') {
    return;
  }

  document.querySelectorAll<HTMLElement>('[data-language-menu]').forEach((menu) => {
    if (menu.classList.contains('hidden')) {
      return;
    }

    menu.classList.add('hidden');
    const selector = menu.closest<HTMLElement>('[data-language-selector]');
    const button = selector?.querySelector<HTMLButtonElement>('[data-toggle-language]');

    button?.focus();
  });
};

const bindSelector = (selector: HTMLElement) => {
  if (selector.dataset.languageInitialized === 'true') {
    return;
  }

  const button = selector.querySelector<HTMLButtonElement>('[data-toggle-language]');
  const menu = selector.querySelector<HTMLElement>('[data-language-menu]');

  if (!button || !menu) {
    return;
  }

  button.addEventListener('click', (event) => {
    event.stopPropagation();
    menu.classList.toggle('hidden');
  });

  selector.dataset.languageInitialized = 'true';
};

const initLanguageSelector = () => {
  document.querySelectorAll<HTMLElement>('[data-language-selector]').forEach((selector) => bindSelector(selector));

  document.removeEventListener('click', handleDocumentClick);
  document.addEventListener('click', handleDocumentClick);

  document.removeEventListener('keydown', handleDocumentKeydown);
  document.addEventListener('keydown', handleDocumentKeydown);
};

document.addEventListener('astro:page-load', initLanguageSelector);
initLanguageSelector();
