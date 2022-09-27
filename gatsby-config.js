const title = 'Hoverkraft';
const hostname = 'hoverkraft.cloud';
const siteUrl = `https://${hostname}`;

module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title,
    description: 'Frictionless DevOps cloud platform as a service',
    author: '@hoverkraft',
    contactFormUrl:
      'https://send.pageclip.co/zSPWTmFycyOKcVDIW2vvZKAbkjQqZ9o8/contact-form',
    subscribeFormUrl:
      'https://hoverkraft.us2.list-manage.com/subscribe/post?u=74407d5544e6e09de1a62cccf&amp;id=5a44d0bce9',
    siteUrl,
  },
  plugins: [
    'gatsby-plugin-minify-html',
    'gatsby-plugin-sass',
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    'gatsby-plugin-offline',
    'gatsby-plugin-sitemap',
    'gatsby-plugin-image',
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-plugin-plausible`,
      options: {
        domain: hostname,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `locale`,
        path: `${__dirname}/src/locales`,
      },
    },
    {
      resolve: `gatsby-plugin-webfonts`,
      options: {
        fonts: {
          google: [
            {
              family: 'Abel',
              variants: ['300', '400', '500'],
            },
          ],
        },
      },
    },

    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        siteUrl,
        localeJsonSourceName: `locale`,
        languages: [`en`, `fr`],
        defaultLanguage: `en`,
        i18nextOptions: {
          keySeparator: false,
          nsSeparator: '::',
        },
        pages: [],
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: title,
        short_name: title,
        start_url: `/`,
        background_color: `#1d2026`,
        theme_color: `#1998ff`,
        display: `minimal-ui`,
        icon: `${__dirname}/src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true, // Print removed selectors and processed file names
        develop: true, // Enable while using `gatsby develop`
        purgeCSSOptions: {
          safelist: [
            'navbar',
            'navbar-expand-lg',
            'navbar-dark',
            'navbar-light',
            'navbar-collapse',
            'collapse',
            'collapsed',
            'navbar-brand',
            'navbar-toggler',
            'navbar-toggler-icon',
            'navbar-nav',
            'nav-item',
            'nav-link',
            'dropdown',
            'dropdown-toggle',
            'dropdown-item',
            'dropdown-menu',
            'show',
            'alert',
            'alert-success',
            'alert-danger',
            'visually-hidden',
          ],
        },
      },
    },
  ],
};
