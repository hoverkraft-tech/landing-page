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
                    One platform to manage your DevOps lifecylce with ease
                  </h3>
                </div>
                <p className="mt-3">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry.
                  <br />
                  Lorem Ipsum has been the industry's standard dummy text ever
                  since the 1500s,
                </p>
                <Link to="#" className="btn btn-secondary mt-3">
                  Learn more
                </Link>
              </div>
              <div className="mt-5 mt-lg-0">
                <img
                  src={group}
                  alt="marsmello"
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
