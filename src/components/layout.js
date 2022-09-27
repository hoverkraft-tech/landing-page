/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import React from 'react';

import Footer from './footer';
import Header from './header';

const Layout = ({ light, children }) => {
  return (
    <>
      <Header light={light} />
      <main>
        <div id="mobile-menu-overlay" />
        <div className="page-body-wrapper">{children}</div>
      </main>
      <Footer light={light} />
    </>
  );
};

export default Layout;
