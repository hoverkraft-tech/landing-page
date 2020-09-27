import React from 'react';
import Slider from 'react-slick';

import testimonial1 from '../images/testimonial/testimonial1.jpg';
import testimonial2 from '../images/testimonial/testimonial2.jpg';
import testimonial3 from '../images/testimonial/testimonial3.jpg';
import testimonial4 from '../images/testimonial/testimonial4.jpg';

const Testimonial = () => (
  <section className="testimonial" id="testimonial">
    <div className="container">
      <div className="row  mt-md-0 mt-lg-4">
        <div className="col-sm-12 text-white" data-aos="fade-up">
          <p className="font-weight-bold mb-3">Testimonials</p>
          <h3 className="font-weight-medium">
            Our customers are our <br />
            biggest fans
          </h3>
          <div className="col-sm-12" data-aos="fade-up">
            <div id="testimonial-flipster" className="testimonial">
              <Slider
                {...{
                  dots: true,
                  infinite: true,
                  speed: 500,
                  slidesToShow: 1,
                  slidesToScroll: 1,
                }}
              >
                <div className="testimonial-item">
                  <img
                    src={testimonial1}
                    alt="icon"
                    className="testimonial-icons"
                  />
                  <p>
                    Lorem ipsum dolor sit amet, consectetur pretium pretium
                    tempor.Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Ut pretium
                  </p>
                  <h6 className="testimonial-author">Mark Spenser</h6>
                  <p className="testimonial-destination">Accounts</p>
                </div>
                <div className="testimonial-item">
                  <img
                    src={testimonial2}
                    alt="icon"
                    className="testimonial-icons"
                  />
                  <p>
                    Lorem ipsum dolor sit amet, consectetur pretium pretium
                    tempor.Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Ut pretium
                  </p>
                  <h6 className="testimonial-author">Tua Manuera</h6>
                  <p className="testimonial-destination">Director,Dj market</p>
                </div>
                <div className="testimonial-item">
                  <img
                    src={testimonial3}
                    alt="icon"
                    className="testimonial-icons"
                  />
                  <p>
                    Lorem ipsum dolor sit amet, consectetur pretium pretium
                    tempor.Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Ut pretium
                  </p>
                  <h6 className="testimonial-author">Sarah Philip</h6>
                  <p className="testimonial-destination">Chief Accountant</p>
                </div>
                <div className="testimonial-item">
                  <img
                    src={testimonial4}
                    alt="icon"
                    className="testimonial-icons"
                  />
                  <p>
                    Lorem ipsum dolor sit amet, consectetur pretium pretium
                    tempor.Lorem ipsum dolor sit amet, consectetur adipiscing
                    elit. Ut pretium
                  </p>
                  <h6 className="testimonial-author">Mark Spenser</h6>
                  <p className="testimonial-destination">Director,Dj market</p>
                </div>
              </Slider>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Testimonial;
