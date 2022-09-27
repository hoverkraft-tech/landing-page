import { Link } from 'gatsby-plugin-react-i18next';
import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ReactCountryFlag from 'react-country-flag';

export const LanguageDropdownItem = ({ language, originalPath }) => {
  return (
    <NavDropdown.Item
      as={Link}
      to={originalPath}
      language={language}
      className="dropdown-item"
    >
      <ReactCountryFlag
        countryCode={language === 'en' ? 'GB' : language}
        className="flag-icon"
      />{' '}
      {language}
    </NavDropdown.Item>
  );
};
