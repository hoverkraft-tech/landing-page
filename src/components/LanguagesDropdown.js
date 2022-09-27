import { useI18next } from 'gatsby-plugin-react-i18next';
import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ReactCountryFlag from 'react-country-flag';

import { LanguageDropdownItem } from './LanguageDropdownItem';

export const LanguagesDropdown = () => {
  const { languages, originalPath, language } = useI18next();
  return (
    <NavDropdown
      title={
        <>
          <ReactCountryFlag
            countryCode={language === 'en' ? 'GB' : language}
            className="flag-icon"
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
