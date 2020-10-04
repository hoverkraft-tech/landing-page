/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import { graphql, useStaticQuery } from 'gatsby';
import React from 'react';

import Footer from './footer';
import Header from './header';

const Layout = ({ light, children }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <Header
        siteTitle={data.site.siteMetadata?.title || `Title`}
        light={light}
      />
      <main>
        <div id="mobile-menu-overlay" />
        <div className="page-body-wrapper">{children}</div>
      </main>
      <Footer
        siteTitle={data.site.siteMetadata?.title || `Title`}
        light={light}
      />
    </>
  );
};

export default Layout;
