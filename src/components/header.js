import { Link, useI18next, useTranslation } from 'gatsby-plugin-react-i18next';
import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ReactCountryFlag from 'react-country-flag';

import logoDark from '../images/logo-dark.png';
import logo from '../images/logo.png';

const LanguageDropdownItem = ({ language, originalPath }) => {
  return (
    <NavDropdown.Item
      as={Link}
      to={originalPath}
      language={language}
      className="dropdown-item"
    >
      <ReactCountryFlag
        countryCode={language === 'en' ? 'GB' : language}
        style={{ fontSize: '0.7em' }}
      />{' '}
      {language}
    </NavDropdown.Item>
  );
};

const LanguagesDropdown = () => {
  const { languages, originalPath, language } = useI18next();
  return (
    <NavDropdown
      title={
        <>
          <ReactCountryFlag
            countryCode={language === 'en' ? 'GB' : language}
            style={{ fontSize: '0.7em' }}
          />{' '}
          {language}
        </>
      }
      id="language-nav-dropdown"
    >
      {languages
        .filter((lng) => language !== lng)
        .map((lng) => (
          <LanguageDropdownItem
            key={lng}
            language={lng}
            originalPath={originalPath}
          />
        ))}
    </NavDropdown>
  );
};

const Header = ({ light, siteTitle }) => {
  const { t } = useTranslation(['header']);

  return (
    <Navbar variant={light ? 'light' : 'dark'} expand="lg" fixed="top">
      <div className="container">
        <Navbar.Brand as={Link} to="/">
          <img src={light ? logoDark : logo} alt={siteTitle} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ml-auto align-items-center" as="ul">
            <Nav.Item as="li">
              <Nav.Link as={Link} to="/">
                {t('header::Home')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link href="#services">{t('header::Service')}</Nav.Link>
            </Nav.Item>
            <Nav.Item as="li">
              <Nav.Link href="#contact">{t('header::Contact')}</Nav.Link>
            </Nav.Item>
            <LanguagesDropdown />
            {/* <li className="nav-item">
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
          </li> */}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default Header;
