import React from 'react';

import comingSoon from '../images/coming-soon.svg';

const ComingSoon = () => (
  <section className="" id="coming-soon">
    <div className="container">
      <div className="row mb-5 pb-5">
        <div className="col-sm-4" data-aos="fade-up" data-aos-offset={-500}>
          <img src={comingSoon} alt="coming soon" className="img-fluid" />
        </div>
        <div className="col-sm-8" data-aos="fade-up" data-aos-offset={-500}>
          <h3 className="font-weight-medium text-dark mt-5 mt-lg-0">
            Coming Soon
          </h3>
          <h5 className="text-dark mb-5">Follow us for update now!</h5>
          <form className="form-inline">
            <div className="form-group mx-sm-2">
              <label htmlFor="mail" class="sr-only">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="mail"
                placeholder="Email*"
                required
                style={{ width: '30rem' }}
              />
            </div>
            <button type="submit" className="btn btn-secondary">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
);

export default ComingSoon;
