import '../scss/style.scss';

import React from 'react';

import Services from '../components/about';
import About from '../components/about';
import Clients from '../components/clients';
import ComingSoon from '../components/coming-soon';
import Contact from '../components/contact';
import Home from '../components/home';
import Layout from '../components/layout';
import Plans from '../components/plans';
import Projects from '../components/projects';
import SEO from '../components/seo';
import Testimonial from '../components/testimonial';

const IndexPage = () => (
  <Layout>
    <SEO title="Home" />
    <Home />
    <ComingSoon />
    <Services />
    <About />
    <Projects />
    <Testimonial />
    <Clients />
    <Plans />
    <Contact />
  </Layout>
);

export default IndexPage;
