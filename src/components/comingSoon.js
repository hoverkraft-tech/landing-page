import { graphql, useStaticQuery } from 'gatsby';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import React from 'react';

import useSendFormData from '../hooks/useSendFormData';
import comingSoon from '../images/coming-soon.svg';

const ComingSoon = () => {
  const { t } = useTranslation(['coming-soon']);
  const data = useStaticQuery(graphql`
    query SubscribeFormQuery {
      site {
        siteMetadata {
          subscribeFormUrl
        }
      }
    }
  `);

  const { formData, canSendForm, onValueChange } = useSendFormData(
    data.site.siteMetadata?.subscribeFormUrl || '',
    { EMAIL: '' },
    t(
      'comingSoon::Thank you for subscribing, we will send you some news soon !'
    )
  );

  return (
    <section id="coming-soon">
      <div className="container">
        <div className="row mb-5 pb-5">
          <div className="col-sm-4" data-aos="fade-up" data-aos-offset={-500}>
            <img
              src={comingSoon}
              alt={t('comingSoon::Coming Soon')}
              className="img-fluid"
            />
          </div>
          <div className="col-sm-8" data-aos="fade-up" data-aos-offset={-500}>
            <h3 className="font-weight-medium text-dark mt-5 mt-lg-0">
              {t('comingSoon::Coming Soon')}
            </h3>
            <h4 className="text-dark mb-5">
              {t('comingSoon::Follow us for update now!')}
            </h4>
            <form
              action={data.site.siteMetadata?.subscribeFormUrl || ''}
              method="post"
              className="form-inline"
            >
              <div className="form-group mx-sm-2">
                <label htmlFor="mail" className="sr-only">
                  {t('comingSoon::Email')}
                </label>
                <input
                  type="email"
                  name="EMAIL"
                  className="form-control"
                  id="mail"
                  placeholder={t('comingSoon::Email') + '*'}
                  required
                  style={{ width: '30rem' }}
                  value={formData.EMAIL}
                  onChange={onValueChange}
                />
              </div>
              <button
                disabled={!canSendForm}
                type="submit"
                value="Subscribe"
                name="subscribe className="
                className="btn btn-secondary"
              >
                {t('comingSoon::SUBSCRIBE')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComingSoon;
