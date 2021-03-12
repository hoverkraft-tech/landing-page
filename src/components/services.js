import { useTranslation } from 'gatsby-plugin-react-i18next';
import React from 'react';

import cicd from '../images/services/ci-cd.png';
import dockerRegistry from '../images/services/docker-registry.webp';
import gitOps from '../images/services/gitops.png';
import metricsMonitoring from '../images/services/metrics-monitoring.png';
import rancher from '../images/services/rancher-logo-cow-blue.svg';
import secrets from '../images/services/secrets.png';

const Services = () => {
  const { t } = useTranslation(['services']);
  return (
    <section className="our-services" id="services">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h4 className="text-dark">Our platform</h4>
            <h5 className="font-weight-medium text-dark mb-5">
              {t('services::Unified services hub for DevOps lifecycle')}
            </h5>
          </div>
        </div>
        <div className="row" data-aos="fade-up">
          <div className="col-sm-4 text-center text-lg-left">
            <div
              className="services-box"
              data-aos="fade-down"
              data-aos-easing="linear"
              data-aos-duration={1500}
            >
              <img
                src={rancher}
                alt={t('services::Rancher as a service')}
                data-aos="zoom-in"
              />
              <h6 className="text-dark mb-3 mt-4 font-weight-medium">
                {t('services::Rancher as a service')}
              </h6>
              <p>
                {t(
                  'services::Hosted, fully managed Rancher control panel, to manage multiple Kubernetes clusters, while providing DevOps teams with integrated tools for running containerized workloads.'
                )}
              </p>
            </div>
          </div>
          <div className="col-sm-4 text-center text-lg-left">
            <div
              className="services-box"
              data-aos="fade-down"
              data-aos-easing="linear"
              data-aos-duration={1500}
            >
              <img
                src={metricsMonitoring}
                alt={t('services::Metrics & monitoring')}
                data-aos="zoom-in"
              />
              <h6 className="text-dark mb-3 mt-4 font-weight-medium">
                {t('services::Metrics & monitoring')}
              </h6>
              <p>
                {t(
                  'services::Monitoring service for cloud-scale applications, providing monitoring of servers, databases, tools, and services, through our SaaS-based data analytics platform'
                )}
              </p>
            </div>
          </div>
          <div className="col-sm-4 text-center text-lg-left">
            <div
              className="services-box"
              data-aos="fade-down"
              data-aos-easing="linear"
              data-aos-duration={1500}
            >
              <img
                src={dockerRegistry}
                alt={t('services::Docker registry')}
                data-aos="zoom-in"
              />
              <h6 className="text-dark mb-3 mt-4 font-weight-medium">
                {t('services::Docker registry')}
              </h6>
              <p>
                {t(
                  'services::Stateless, highly scalable server side application that stores and lets you distribute Docker images'
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="row" data-aos="fade-up">
          <div className="col-sm-4 text-center text-lg-left">
            <div
              className="services-box  pb-lg-0"
              data-aos="fade-down"
              data-aos-easing="linear"
              data-aos-duration={1500}
            >
              <img
                src={gitOps}
                alt={t('services::GitOps')}
                data-aos="zoom-in"
              />
              <h6 className="text-dark mb-3 mt-4 font-weight-medium">
                {t('services::GitOps')}
              </h6>
              <p>
                {t(
                  'services::Use Git as a single source of truth for declarative infrastructure and applications'
                )}
              </p>
            </div>
          </div>
          <div className="col-sm-4 text-center text-lg-left">
            <div
              className="services-box pb-lg-0"
              data-aos="fade-down"
              data-aos-easing="linear"
              data-aos-duration={1500}
            >
              <img src={cicd} alt={t('services::CI/CD')} data-aos="zoom-in" />
              <h6 className="text-dark mb-3 mt-4 font-weight-medium">
                {t('services::CI/CD')}
              </h6>
              <p>
                {t(
                  'services::Bridge the gaps between development and operation activities and teams by enforcing automation in building, testing and deployment of applications'
                )}
              </p>
            </div>
          </div>
          <div className="col-sm-4 text-center text-lg-left">
            <div
              className="services-box pb-0"
              data-aos="fade-down"
              data-aos-easing="linear"
              data-aos-duration={1500}
            >
              <img
                src={secrets}
                alt={t('services::Secrets as a service')}
                data-aos="zoom-in"
              />
              <h6 className="text-dark mb-3 mt-4 font-weight-medium">
                {t('services::Secrets as a service')}
              </h6>
              <p>
                {t(
                  'services::Secure, store and tightly control access to tokens, passwords, certificates, encryption keys for protecting secrets and other sensitive data using a UI, CLI, or HTTP API.'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
