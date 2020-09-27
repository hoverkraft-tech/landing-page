import React from 'react';

import designDevelopment from '../images/design-development.svg';
import digitalMarketing from '../images/digital-marketing.svg';
import digitalStrategy from '../images/digital-strategy.svg';
import growthStrategy from '../images/growth-strategy.svg';
import integratedMarketing from '../images/integrated-marketing.svg';
import savingStrategy from '../images/saving-strategy.svg';

const Services = () => (
  <section className="our-services" id="services">
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <h5 className="text-dark">We’re offering</h5>
          <h3 className="font-weight-medium text-dark mb-5">
            Creative Digital Agency
          </h3>
        </div>
      </div>
      <div className="row" data-aos="fade-up">
        <div className="col-sm-4 text-center text-lg-left">
          <div
            className="services-box"
            data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration={1500}
          >
            <img
              src={integratedMarketing}
              alt="integrated-marketing"
              data-aos="zoom-in"
            />
            <h6 className="text-dark mb-3 mt-4 font-weight-medium">
              Integrated Marketing
            </h6>
            <p>
              Lorem ipsum dolor sit amet, pretium pretium tempor.Lorem ipsum
            </p>
          </div>
        </div>
        <div className="col-sm-4 text-center text-lg-left">
          <div
            className="services-box"
            data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration={1500}
          >
            <img
              src={designDevelopment}
              alt="design-development"
              data-aos="zoom-in"
            />
            <h6 className="text-dark mb-3 mt-4 font-weight-medium">
              Design &amp; Development
            </h6>
            <p>
              Lorem ipsum dolor sit amet, pretium pretium tempor.Lorem ipsum
            </p>
          </div>
        </div>
        <div className="col-sm-4 text-center text-lg-left">
          <div
            className="services-box"
            data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration={1500}
          >
            <img
              src={digitalStrategy}
              alt="digital-strategy"
              data-aos="zoom-in"
            />
            <h6 className="text-dark mb-3 mt-4 font-weight-medium">
              Digital Strategy
            </h6>
            <p>
              Lorem ipsum dolor sit amet, pretium pretium tempor.Lorem ipsum
            </p>
          </div>
        </div>
      </div>
      <div className="row" data-aos="fade-up">
        <div className="col-sm-4 text-center text-lg-left">
          <div
            className="services-box  pb-lg-0"
            data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration={1500}
          >
            <img
              src={digitalMarketing}
              alt="digital-marketing"
              data-aos="zoom-in"
            />
            <h6 className="text-dark mb-3 mt-4 font-weight-medium">
              Digital Marketing
            </h6>
            <p>
              Lorem ipsum dolor sit amet, pretium pretium tempor.Lorem ipsum
            </p>
          </div>
        </div>
        <div className="col-sm-4 text-center text-lg-left">
          <div
            className="services-box pb-lg-0"
            data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration={1500}
          >
            <img
              src={growthStrategy}
              alt="growth-strategy"
              data-aos="zoom-in"
            />
            <h6 className="text-dark mb-3 mt-4 font-weight-medium">
              Growth Strategy
            </h6>
            <p>
              Lorem ipsum dolor sit amet, pretium pretium tempor.Lorem ipsum
            </p>
          </div>
        </div>
        <div className="col-sm-4 text-center text-lg-left">
          <div
            className="services-box pb-0"
            data-aos="fade-down"
            data-aos-easing="linear"
            data-aos-duration={1500}
          >
            <img
              src={savingStrategy}
              alt="saving-strategy"
              data-aos="zoom-in"
            />
            <h6 className="text-dark mb-3 mt-4 font-weight-medium">
              Saving Strategy
            </h6>
            <p>
              Lorem ipsum dolor sit amet, pretium pretium tempor.Lorem ipsum
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Services;
