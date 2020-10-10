module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title: 'Hoverkraft',
    description: 'Frictionless DevOps cloud platform as a service',
    author: '@hoverkraft',
    contactFormUrl:
      'https://send.pageclip.co/zSPWTmFycyOKcVDIW2vvZKAbkjQqZ9o8/contact-form',
    subscribeFormUrl:
      'https://hoverkraft.us2.list-manage.com/subscribe/post?u=74407d5544e6e09de1a62cccf&amp;id=5a44d0bce9',
    siteUrl: 'https://hoverkraft.sh',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-plausible`,
      options: {
        domain: `hoverkraft.sh`,
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'images',
        path: `${__dirname}/src/images`,
      },
    },
    'gatsby-transformer-sharp',
    'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'gatsby-starter-default',
        short_name: 'starter',
        start_url: '/',
        background_color: '#663399',
        theme_color: '#663399',
        display: 'minimal-ui',
        icon: 'src/images/gatsby-icon.png', // This path is relative to the root of the site.
      },
    },
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-prefetch-google-fonts',
      options: {
        fonts: [
          {
            family: 'Abel',
            variants: ['300', '400', '700'],
          },
        ],
      },
    },
    {
      resolve: `gatsby-plugin-react-i18next`,
      options: {
        path: `${__dirname}/src/locales`,
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
        name: `Hoverkraft.sh`,
        short_name: `Hoverkraft.sh`,
        start_url: `/`,
        background_color: `#1d2026`,
        theme_color: `#1998ff`,
        display: `minimal-ui`,
        icon: `${__dirname}/src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        exclude: ['/**/404', '/**/404.html'],
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage(filter: {context: {i18n: {routed: {eq: false}}}}) {
              edges {
                node {
                  context {
                    i18n {
                      defaultLanguage
                      languages
                      originalPath
                    }
                  }
                  path
                }
              }
            }
          }
        `,
        serialize: ({ site, allSitePage }) => {
          return allSitePage.edges.map((edge) => {
            const {
              languages,
              originalPath,
              defaultLanguage,
            } = edge.node.context.i18n;
            const { siteUrl } = site.siteMetadata;
            const url = siteUrl + originalPath;
            const links = [
              { lang: defaultLanguage, url },
              { lang: 'x-default', url },
            ];
            languages.forEach((lang) => {
              if (lang === defaultLanguage) return;
              links.push({ lang, url: `${siteUrl}/${lang}${originalPath}` });
            });
            return {
              url,
              changefreq: 'daily',
              priority: originalPath === '/' ? 1.0 : 0.7,
              links,
            };
          });
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    'gatsby-plugin-offline',
  ],
};
