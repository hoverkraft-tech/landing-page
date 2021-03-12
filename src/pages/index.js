import '../scss/style.scss';

import { useTranslation } from 'gatsby-plugin-react-i18next';
import React from 'react';

import ComingSoon from '../components/comingSoon';
import Contact from '../components/contact';
import Home from '../components/home';
import Layout from '../components/layout';
import SEO from '../components/seo';
import Services from '../components/services';

// import About from '../components/about';
// import Clients from '../components/clients';
// import Plans from '../components/plans';
// import Projects from '../components/projects';
// import Testimonial from '../components/testimonial';

const IndexPage = () => {
  const { t } = useTranslation(['index']);
  return (
    <Layout>
      <SEO title={t('index::Home')} />
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
