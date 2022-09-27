import { graphql, useStaticQuery } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import { Link, useTranslation } from 'gatsby-plugin-react-i18next';
import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { LanguagesDropdown } from './LanguagesDropdown';

const Header = ({ light }) => {
  const { t } = useTranslation(['header']);

  const data = useStaticQuery(graphql`
    query HeaderQuery {
      site {
        siteMetadata {
          siteUrl
          title
        }
      }
    }
  `);

  return (
    <Navbar
      variant={light ? 'light' : 'dark'}
      bg={light ? 'light' : 'dark'}
      expand="lg"
      fixed="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" title={data.site.siteMetadata.title}>
          {light ? (
            <StaticImage
              src="../images/logos/logo-dark.png"
              alt={data.site.siteMetadata.title}
              placeholder="tracedSVG"
              width={420}
            />
          ) : (
            <StaticImage
              src="../images/logos/logo.png"
              alt={data.site.siteMetadata.title}
              width={420}
              placeholder="tracedSVG"
            />
          )}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ml-auto align-items-center">
            <Nav.Item>
              <Nav.Link as={Link} to="/">
                {t('header::Home')}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#services">{t('header::Service')}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="#contact">{t('header::Contact')}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <LanguagesDropdown />
            </Nav.Item>
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
      </Container>
    </Navbar>
  );
};

export default Header;
