import { Link } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import React from 'react';

import group from '../images/group.png';

const Home = () => {
  const { t } = useTranslation(['home']);
  return (
    <section id="home" className="home">
      <h1 className="sr-only">{t('home::Hoverkraft.sh')}</h1>
      <h2 className="sr-only">
        {t('home::The frictionless DevOps Cloud platform')}
      </h2>
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <div className="main-banner">
              <div className="d-sm-flex justify-content-between">
                <div data-aos="zoom-in-up">
                  <div className="banner-title">
                    <h3 className="font-weight-medium">
                      {t(
                        'home::One platform to manage your DevOps lifecycle with ease'
                      )}
                    </h3>
                  </div>
                  <p className="mt-3">
                    {t(
                      'home::Hoverkraft provides a unified hub of services to manage the lifecycle of your applications and micro-services within a Cloud infrastructure.'
                    )}
                  </p>
                  <p className="mt-3">
                    {t('home::From development')}{' '}
                    <span role="img" aria-label="development">
                      🏗️
                    </span>{' '}
                    {t('home::to supervision')}{' '}
                    <span role="img" aria-label="supervision">
                      📈
                    </span>
                    , {t('home::including deployment')}{' '}
                    <span role="img" aria-label="deployment">
                      🚀
                    </span>{' '}
                    {t('home::and scaling')}{' '}
                    <span role="img" aria-label="scaling">
                      ⚖️
                    </span>
                  </p>
                  <p className="mt-3 font-weight-bold">
                    {t(
                      'home::Get started in a few clicks, pick-up the on demand services you need, pay as you go !'
                    )}
                  </p>
                  <Link to="#services" className="btn btn-secondary mt-3">
                    {t('home::Learn more')}
                  </Link>
                </div>
                <div className="mt-5 mt-lg-0">
                  <img
                    src={group}
                    alt="hoverkraft"
                    className="img-fluid"
                    data-aos="zoom-in-up"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
