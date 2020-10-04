import { Link } from 'gatsby';
import React from 'react';

import group from '../images/group.png';

const Home = () => (
  <section id="home" className="home">
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <div className="main-banner">
            <div className="d-sm-flex justify-content-between">
              <div data-aos="zoom-in-up">
                <div className="banner-title">
                  <h3 className="font-weight-medium">
                    One platform to manage your DevOps lifecycle with ease
                  </h3>
                </div>
                <p className="mt-3">
                  Hoverkraft provides a unified hub of services to manage the
                  lifecycle of your applications and micro-services within a
                  cloud infrastructure.
                </p>
                <p className="mt-3">
                  From development{' '}
                  <span role="img" aria-label="development">
                    🏗️
                  </span>{' '}
                  to supervision{' '}
                  <span role="img" aria-label="supervision">
                    📈
                  </span>
                  , including deployment{' '}
                  <span role="img" aria-label="deployment">
                    🚀
                  </span>{' '}
                  and scaling{' '}
                  <span role="img" aria-label="scaling">
                    ⚖️
                  </span>
                </p>
                <p className="mt-3 font-weight-bold">
                  Get started in a few clicks, pick-up the on demand services
                  you need, pay as you go !
                </p>
                <Link to="#services" className="btn btn-secondary mt-3">
                  Learn more
                </Link>
              </div>
              <div className="mt-5 mt-lg-0">
                <img
                  src={group}
                  alt="hoverkraft"
                  className="img-fluid"
                  data-aos="zoom-in-up"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Home;
