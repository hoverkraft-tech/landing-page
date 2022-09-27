import '../scss/style.scss';

import { graphql } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import React from 'react';

import ComingSoon from '../components/comingSoon';
import Contact from '../components/contact';
import HeadComponent from '../components/head';
import Home from '../components/home';
import Layout from '../components/layout';
import Services from '../components/services';

// import About from '../components/about';
// import Clients from '../components/clients';
// import Plans from '../components/plans';
// import Projects from '../components/projects';
// import Testimonial from '../components/testimonial';

const IndexPage = () => {
  return (
    <Layout>
      <Home />
      <ComingSoon />
      <Services />
      {/* <About /> */}
      {/* <Projects /> */}
      {/* <Testimonial /> */}
      {/* <Clients /> */}
      {/* <Plans /> */}
      <Contact />
    </Layout>
  );
};

export default IndexPage;

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;

export function Head() {
  const { t } = useTranslation(['index']);

  return <HeadComponent title={t('Home')} />;
}
