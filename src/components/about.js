import React from 'react';

import idea from '../images/idea.png';
import tick from '../images/tick.png';

const About = () => {
  return (
    <section className="our-process" id="about">
      <div className="container">
        <div className="row">
          <div className="col-sm-6" data-aos="fade-up">
            <h5 className="text-dark">Our work process</h5>
            <h3 className="font-weight-medium text-dark">
              Discover New Idea With Us!
            </h3>
            <h5 className="text-dark mb-3">
              Imagination will take us everywhere
            </h5>
            <p className="font-weight-medium mb-4">
              Lorem ipsum dolor sit amet, <br />
              pretium pretium tempor.Lorem ipsum dolor sit amet, consectetur
            </p>
            <div className="d-flex justify-content-start mb-3">
              <img src={tick} alt="tick" className="mr-3 tick-icon" />
              <p className="mb-0">
                Lorem ipsum dolor sit amet, pretium pretium
              </p>
            </div>
            <div className="d-flex justify-content-start mb-3">
              <img src={tick} alt="tick" className="mr-3 tick-icon" />
              <p className="mb-0">
                Lorem ipsum dolor sit amet, pretium pretium
              </p>
            </div>
            <div className="d-flex justify-content-start">
              <img src={tick} alt="tick" className="mr-3 tick-icon" />
              <p className="mb-0">
                Lorem ipsum dolor sit amet, pretium pretium
              </p>
            </div>
          </div>
          <div
            className="col-sm-6 text-right"
            data-aos="flip-left"
            data-aos-easing="ease-out-cubic"
            data-aos-duration={2000}
          >
            <img src={idea} alt="idea" className="img-fluid" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
