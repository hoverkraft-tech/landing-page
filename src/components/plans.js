import { Link } from 'gatsby';
import React from 'react';

import premium from '../images/premium.svg';
import proffessional from '../images/proffessional.svg';
import starter from '../images/starter.svg';

const Plans = () => (
  <section className="pricing-list" id="plans">
    <div className="container">
      <div className="row" data-aos="fade-up" data-aos-offset={-500}>
        <div className="col-sm-12">
          <div className="d-sm-flex justify-content-between align-items-center mb-2">
            <div>
              <h3 className="font-weight-medium text-dark">Pricing</h3>
              <h5 className="text-dark">
                Flexible plans. No Commitment! Learn about our pricing for
                pay-as-you-go options
              </h5>
            </div>
            <div className="mb-5 mb-lg-0 mt-3 mt-lg-0">
              <div className="d-flex align-items-center">
                <p className="mr-2 font-weight-medium monthly text-active check-box-label">
                  Monthly
                </p>
                <label className="toggle-switch toggle-switch">
                  <input type="checkbox" defaultChecked id="toggle-switch" />
                  <span className="toggle-slider round" />
                </label>
                <p className="ml-2 font-weight-medium yearly check-box-label">
                  Yearly
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row" data-aos="fade-up" data-aos-offset={-300}>
        <div className="col-sm-4">
          <div className="pricing-box">
            <img src={starter} alt="starter" />
            <h6 className="font-weight-medium title-text">Starter Business</h6>
            <h1 className="text-amount mb-4 mt-2">$23</h1>
            <ul className="pricing-list">
              <li>Create a free website</li>
              <li>Connect Domain</li>
              <li>Business and ecommerce</li>
              <li>Idea for smaller professional websites</li>
              <li>Web space</li>
            </ul>
            <Link to="#" className="btn btn-outline-primary">
              Puchase Now
            </Link>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="pricing-box selected">
            <img src={proffessional} alt="starter" />
            <h6 className="font-weight-medium title-text">Professional</h6>
            <h1 className="text-amount mb-4 mt-2">$45</h1>
            <ul className="pricing-list">
              <li>Create a free website</li>
              <li>Connect Domain</li>
              <li>Business and ecommerce</li>
              <li>Idea for smaller professional websites</li>
              <li>Web space</li>
            </ul>
            <Link to="#" className="btn btn-primary">
              Puchase Now
            </Link>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="pricing-box">
            <img src={premium} alt="starter" />
            <h6 className="font-weight-medium title-text">Premium</h6>
            <h1 className="text-amount mb-4 mt-2">$87</h1>
            <ul className="pricing-list">
              <li>Create a free website</li>
              <li>Connect Domain</li>
              <li>Business and ecommerce</li>
              <li>Idea for smaller professional websites</li>
              <li>Web space</li>
            </ul>
            <Link to="#" className="btn btn-outline-primary">
              Puchase Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Plans;
