import React from 'react';

import contact from '../images/contact.jpg';

const Contact = () => (
  <section className="contactus" id="contact">
    <div className="container">
      <div className="row mb-5 pb-5">
        <div className="col-sm-5" data-aos="fade-up" data-aos-offset={-500}>
          <img src={contact} alt="contact" className="img-fluid" />
        </div>
        <div className="col-sm-7" data-aos="fade-up" data-aos-offset={-500}>
          <h3 className="font-weight-medium text-dark mt-5 mt-lg-0">
            Contact us
          </h3>
          <h5 className="text-dark mb-5">Do You Have Any Questions?</h5>
          <form>
            <div className="row">
              <div className="col-sm-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Name*"
                  />
                </div>
              </div>
              <div className="col-sm-6">
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    id="mail"
                    placeholder="Email*"
                  />
                </div>
              </div>
              <div className="col-sm-12">
                <div className="form-group">
                  <textarea
                    name="message"
                    id="message"
                    className="form-control"
                    placeholder="Message*"
                    rows={5}
                    defaultValue={''}
                  />
                </div>
              </div>
              <div className="col-sm-12">
                <button type="submit" className="btn btn-secondary">
                  SEND
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
);

export default Contact;
