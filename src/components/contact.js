import { graphql, useStaticQuery } from 'gatsby';
import { StaticImage } from 'gatsby-plugin-image';
import { useTranslation } from 'gatsby-plugin-react-i18next';
import React from 'react';

import useSendFormData from '../hooks/useSendFormData';

const Contact = () => {
  const { t } = useTranslation(['contact']);
  const data = useStaticQuery(graphql`
    query ContactFormQuery {
      site {
        siteMetadata {
          contactFormUrl
        }
      }
    }
  `);

  const { formData, canSendForm, onSubmit, onValueChange, formMessage } =
    useSendFormData(
      data.site.siteMetadata?.contactFormUrl || '',
      { name: '', mail: '', message: '' },
      t(
        'contact::Your message has been sent ! We will reply to you as soon as possible. Thank you.'
      )
    );

  return (
    <section className="contactus" id="contact">
      <div className="container">
        <div className="row mb-5 pb-5">
          <div className="col-sm-5" data-aos="fade-up" data-aos-offset={-500}>
            <StaticImage
              src="../images/contact.jpg"
              alt={t('contact::Contact us')}
              className="img-fluid"
              placeholder="tracedSVG"
              width={300}
            />
          </div>
          <div className="col-sm-7" data-aos="fade-up" data-aos-offset={-500}>
            <h3 className="font-weight-medium text-dark mt-5 mt-lg-0">
              {t('contact::Contact us')}
            </h3>
            <h4 className="text-dark mb-5">
              {t('contact::Do You Have Any Questions?')}
            </h4>
            {formMessage}
            <form
              action="#"
              method="post"
              className="pageclip-form"
              onSubmit={onSubmit}
            >
              <div className="row">
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="contact-name" className="visually-hidden">
                      {t('contact::Name*')}
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contact-name"
                      name="name"
                      placeholder={t('contact::Name*')}
                      value={formData.name}
                      onChange={onValueChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="form-group">
                    <label htmlFor="contact-mail" className="visually-hidden">
                      {t('contact::Email*')}
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="contact-mail"
                      name="mail"
                      placeholder={t('contact::Email*')}
                      value={formData.mail}
                      onChange={onValueChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-12">
                  <div className="form-group">
                    <label
                      htmlFor="contact-message"
                      className="visually-hidden"
                    >
                      {t('contact::Message*')}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className="form-control"
                      placeholder={t('contact::Message*')}
                      rows={5}
                      value={formData.message}
                      onChange={onValueChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-sm-12">
                  <button
                    type="submit"
                    className="btn btn-secondary"
                    disabled={!canSendForm}
                  >
                    {t('contact::SEND')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
