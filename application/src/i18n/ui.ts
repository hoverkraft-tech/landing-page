import { I18N } from 'astrowind:config';

export const ui = {
  fr: {
    'nav.home': 'Accueil',
    'nav.about': 'À propos',
    'nav.methodology': 'Méthodologie',
    'nav.offers': 'Offres',
    'nav.resources': 'OpenKraft',
    'nav.contact': 'Contact',
    'nav.blog': 'Blog',
    'nav.brand': 'Charte graphique',
    'footer.company': 'Entreprise',
    'footer.support': 'Support',
    'footer.docs': 'Documentation',
    'footer.terms': 'Conditions',
    'footer.privacy': 'Politique de confidentialité',
    'site.title': 'Hoverkraft',
    'site.description':
      'La méthode HoverKraft : Platform Engineering orienté connecteurs pour libérer vos équipes et accélérer le time-to-market.',
    'footer.copyright': '© 2025 Hoverkraft. Tous droits réservés.',
    'button.learn-more': 'En savoir plus',
    'button.get-started': 'Commencer',
    'button.contact-us': 'Nous contacter',
    'button.contact-sales': 'Nous contacter',
    'blog.read-more': 'Lire la suite',
    'blog.published-on': 'Publié le',
    'blog.by-author': 'par',
    'blog.related-posts': 'Articles connexes',
    'blog.latest-posts': 'Derniers articles',
    'blog.back': 'Retour au blog',
    'blog.view-all': 'Voir tous les articles',
    'blog.headline.title': 'Le blog Hoverkraft',
    'blog.headline.subtitle':
      'Actualités, analyses et ressources sur le Platform Engineering souverain, la méthode HoverKraft et OpenKraft.',
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.methodology': 'Methodology',
    'nav.offers': 'Offers',
    'nav.resources': 'OpenKraft',
    'nav.contact': 'Contact',
    'nav.blog': 'Blog',
    'nav.brand': 'Brand Guidelines',
    'footer.company': 'Company',
    'footer.support': 'Support',
    'footer.docs': 'Docs',
    'footer.terms': 'Terms',
    'footer.privacy': 'Privacy Policy',
    'site.title': 'Hoverkraft',
    'site.description':
      'Cloud-native development platform for modern applications. Build, deploy, and operate with confidence.',
    'footer.copyright': '© 2025 Hoverkraft. All rights reserved.',
    'button.learn-more': 'Learn more',
    'button.get-started': 'Get started',
    'button.contact-us': 'Contact us',
    'button.contact-sales': 'Contact sales',
    'blog.read-more': 'Read more',
    'blog.published-on': 'Published on',
    'blog.by-author': 'by',
    'blog.related-posts': 'Related posts',
    'blog.latest-posts': 'Latest posts',
    'blog.back': 'Back to the blog',
    'blog.view-all': 'View all posts',
    'blog.headline.title': 'Hoverkraft Blog',
    'blog.headline.subtitle':
      'News, analysis, and resources on sovereign platform engineering, the HoverKraft method, and OpenKraft.',
  },
} as const;

export const routes = {
  en: {
    'a-propos': 'about',
    methodologie: 'methodology',
    offres: 'services',
    ressources: 'resources',
    contact: 'contact',
    blog: 'blog',
    privacy: 'privacy',
    terms: 'terms',
    'charte-graphique': 'brand-guidelines',
  },
};

type SupportedLanguage = keyof typeof ui;

const supportedLanguages = Object.keys(ui) as SupportedLanguage[];
const configuredLanguageLabels = (I18N?.languages ?? {}) as Record<string, string>;
export const languages: Record<SupportedLanguage, string> = supportedLanguages.reduce(
  (acc, lang) => {
    const configuredLabel = configuredLanguageLabels[lang];
    const fallbackLabel = lang.toUpperCase();
    acc[lang] =
      typeof configuredLabel === 'string' && configuredLabel.trim().length > 0 ? configuredLabel : fallbackLabel;
    return acc;
  },
  {} as Record<SupportedLanguage, string>
);

const configuredDefaultLang = I18N?.language as string | undefined;
const fallbackDefaultLang = (supportedLanguages.find((lang) => lang === ('fr' as SupportedLanguage)) ??
  supportedLanguages[0]) as SupportedLanguage;
const resolvedDefaultLang = supportedLanguages.find((lang) => lang === configuredDefaultLang) ?? fallbackDefaultLang;

export const defaultLang: SupportedLanguage = resolvedDefaultLang;
export const showDefaultLang = I18N?.showDefaultLang ?? false;
