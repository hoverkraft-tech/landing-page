import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import React from 'react';

import logoDark from '../images/logo-dark.png';
import logo from '../images/logo.png';

const Header = ({ siteTitle }) => (
  <nav className="navbar navbar-expand-lg fixed-top">
    <div className="container">
      <Link className="navbar-brand" to="#">
        <img src={logo} alt={siteTitle} />
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo01"
        aria-controls="navbarTogglerDemo01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon">
          <i className="mdi mdi-menu"> </i>
        </span>
      </button>
      <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
        <div className="d-lg-none d-flex justify-content-between px-4 py-3 align-items-center">
          <img src={logoDark} className="logo-mobile-menu" alt="logo" />
          <Link to="#" className="close-menu">
            <i className="mdi mdi-close" />
          </Link>
        </div>
        <ul className="navbar-nav ml-auto align-items-center">
          <li className="nav-item active">
            <Link to="#home" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="#services" className="nav-link">
              Services
            </Link>
          </li>
          <li className="nav-item">
            <Link to="#about" className="nav-link">
              About
            </Link>
          </li>
          <li className="nav-item">
            <Link to="#projects" className="nav-link">
              Projects
            </Link>
          </li>
          <li className="nav-item">
            <Link to="#testimonial" className="nav-link">
              Testimonial
            </Link>
          </li>
          <li className="nav-item">
            <Link to="#plans" className="nav-link">
              Plans
            </Link>
          </li>
          <li className="nav-item">
            <Link to="#contact" className="nav-link">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
);

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
