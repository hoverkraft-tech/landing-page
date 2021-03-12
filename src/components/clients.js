import React from 'react';

import coinbase from '../images/coinbase.svg';
import deloit from '../images/deloit.svg';
import erricson from '../images/erricson.svg';
import instagram from '../images/instagram.svg';
import netflix from '../images/netflix.svg';

const Clients = () => (
  <section
    className="clients pt-5 mt-5"
    id="clients"
    data-aos="fade-up"
    data-aos-offset={-400}
  >
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <div className="d-sm-flex justify-content-between align-items-center">
            <img
              src={deloit}
              alt="deloit"
              className="p-2 p-lg-0"
              data-aos="fade-down"
              data-aos-offset={-400}
            />
            <img
              src={erricson}
              alt="erricson"
              className="p-2 p-lg-0"
              data-aos="fade-up"
              data-aos-offset={-400}
            />
            <img
              src={netflix}
              alt="netflix"
              className="p-2 p-lg-0"
              data-aos="fade-down"
              data-aos-offset={-400}
            />
            <img
              src={instagram}
              alt="instagram"
              className="p-2 p-lg-0"
              data-aos="fade-up"
              data-aos-offset={-400}
            />
            <img
              src={coinbase}
              alt="coinbase"
              className="p-2 p-lg-0"
              data-aos="fade-down"
              data-aos-offset={-400}
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Clients;
