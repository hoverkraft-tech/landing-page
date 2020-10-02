import React from 'react';

import cicd from '../images/services/ci-cd.png';
import dockerRegistry from '../images/services/docker-registry.webp';
import gitOps from '../images/services/gitops.png';
import metricsMonitoring from '../images/services/metrics-monitoring.png';
import rancher from '../images/services/rancher-logo-cow-blue.svg';
import secrets from '../images/services/secrets.png';

const Services = () => (
  <section className="our-services" id="services">
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <h5 className="text-dark">Our platform</h5>
          <h3 className="font-weight-medium text-dark mb-5">
            Unified services hub for DevOps lifecycle
          </h3>
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
            <img src={rancher} alt="rancher" data-aos="zoom-in" />
            <h6 className="text-dark mb-3 mt-4 font-weight-medium">
              Rancher as a service
            </h6>
            <p>
              Hosted, fully managed Rancher control plane, to manage multiple
              Kubernetes clusters, while providing DevOps teams with integrated
              tools for running containerized workloads.
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
              alt="metrics-monitoring"
              data-aos="zoom-in"
            />
            <h6 className="text-dark mb-3 mt-4 font-weight-medium">
              Metrics & monitoring
            </h6>
            <p>
              Monitoring service for cloud-scale applications, providing
              monitoring of servers, databases, tools, and services, through our
              SaaS-based data analytics platform
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
              alt="docker-registry"
              data-aos="zoom-in"
            />
            <h6 className="text-dark mb-3 mt-4 font-weight-medium">
              Docker registry
            </h6>
            <p>
              Stateless, highly scalable server side application that stores and
              lets you distribute Docker images
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
            <img src={gitOps} alt="digital-marketing" data-aos="zoom-in" />
            <h6 className="text-dark mb-3 mt-4 font-weight-medium">GitOps</h6>
            <p>
              Use Git as a single source of truth for declarative infrastructure
              and applications
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
            <img src={cicd} alt="ci-cd" data-aos="zoom-in" />
            <h6 className="text-dark mb-3 mt-4 font-weight-medium">CI/CD</h6>
            <p>
              Bridge the gaps between development and operation activities and
              teams by enforcing automation in building, testing and deployment
              of applications
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
            <img src={secrets} alt="secrets-as-a-service" data-aos="zoom-in" />
            <h6 className="text-dark mb-3 mt-4 font-weight-medium">
              Secrets as a service
            </h6>
            <p>
              Secure, store and tightly control access to tokens, passwords,
              certificates, encryption keys for protecting secrets and other
              sensitive data using a UI, CLI, or HTTP API.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Services;
