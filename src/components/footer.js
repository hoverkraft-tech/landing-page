import { useTranslation } from 'gatsby-plugin-react-i18next';
import React from 'react';

import logo from '../images/logo.png';

const Footer = ({ siteTitle }) => {
  const { t } = useTranslation(['footer']);
  return (
    <footer className="footer">
      {/* <div className="footer-top">
      <div className="container">
        <div className="row">
          <div className="col-sm-6">
            <address>
              <p>143 castle road 517</p>
              <p className="mb-4">district, kiyev port south Canada</p>
              <div className="d-flex align-items-center">
                <p className="mr-4 mb-0">+3 123 456 789</p>
                <Link to="mailto:contact@hoverkraft.sh" className="footer-link">
                  contact@hoverkraft.sh
                </Link>
              </div>
              <div className="d-flex align-items-center">
                <p className="mr-4 mb-0">+1 222 345 342</p>
                <Link to="mailto:contact@hoverkraft.sh" className="footer-link">
                  contact@hoverkraft.sh
                </Link>
              </div>
            </address>
            <div className="social-icons">
              <h6 className="footer-title font-weight-bold">Social Share</h6>
              <div className="d-flex">
                <Link to="#">
                  <i className="mdi mdi-github-circle" />
                </Link>
                <Link to="#">
                  <i className="mdi mdi-facebook-box" />
                </Link>
                <Link to="#">
                  <i className="mdi mdi-twitter" />
                </Link>
                <Link to="#">
                  <i className="mdi mdi-dribbble" />
                </Link>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="row">
              <div className="col-sm-4">
                <h6 className="footer-title">Social Share</h6>
                <ul className="list-footer">
                  <li>
                    <Link to="#home" className="footer-link">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="#about" className="footer-link">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="#services" className="footer-link">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link to="#portfolio" className="footer-link">
                      Portfolio
                    </Link>
                  </li>
                  <li>
                    <Link to="#contact" className="footer-link">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-sm-4">
                <h6 className="footer-title">Product</h6>
                <ul className="list-footer">
                  <li>
                    <Link to="#" className="footer-link">
                      Digital Marketing
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="footer-link">
                      Web Development
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="footer-link">
                      App Development
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="footer-link">
                      Design
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-sm-4">
                <h6 className="footer-title">Company</h6>
                <ul className="list-footer">
                  <li>
                    <Link to="#" className="footer-link">
                      Partners
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="footer-link">
                      Investors
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="footer-link">
                      Partners
                    </Link>
                  </li>
                  <li>
                    <Link to="#" className="footer-link">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> */}
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col">
              <img src={logo} alt="logo" className="mr-3" />
            </div>
            <div className="col">
              <p className="mb-0 text-small pt-1 text-center">
                © {new Date().getFullYear()}{' '}
                <a href="https://hoverkraft.sh" className="text-white">
                  {siteTitle}
                </a>
                . {t('All rights reserved.')}
              </p>
            </div>
          </div>
          {/* <div>
            <div className="d-flex">
              <Link to="#" className="text-small text-white mx-2 footer-link">
                Privacy Policy
              </Link>
              {' - '}
              <Link to="#" className="text-small text-white mx-2 footer-link">
                Customer Support
              </Link>
              {' - '}
              <Link to="#" className="text-small text-white mx-2 footer-link">
                Careers
              </Link>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
