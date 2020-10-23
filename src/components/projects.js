import { Link } from 'gatsby';
import React from 'react';

import slider1 from '../images/carousel/slider1.jpg';
import slider2 from '../images/carousel/slider2.jpg';
import slider3 from '../images/carousel/slider3.jpg';
import slider4 from '../images/carousel/slider4.jpg';
import slider5 from '../images/carousel/slider5.jpg';
import finishedProject from '../images/finished-project.svg';
import ourBlogPosts from '../images/our-blog-posts.svg';
import satisfiedClient from '../images/satisfied-client.svg';
import teamMembers from '../images/team-members.svg';

const Projects = () => (
  <section className="our-projects" id="projects">
    <div className="container">
      <div className="row mb-5">
        <div className="col-sm-12">
          <div className="d-sm-flex justify-content-between align-items-center mb-2">
            <h3 className="font-weight-medium text-dark ">
              Let's See Our Latest Project
            </h3>
            <div>
              <Link to="#" className="btn btn-outline-primary">
                View more
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="mb-5" data-aos="fade-up">
      <Carousel>
        <Carousel.Item>
          <img src={slider1} alt="slider" />
        </Carousel.Item>
        <Carousel.Item>
          <img src={slider2} alt="slider" />
        </Carousel.Item>
        <Carousel.Item>
          <img src={slider3} alt="slider" />
        </Carousel.Item>
        <Carousel.Item>
          <img src={slider4} alt="slider" />
        </Carousel.Item>
        <Carousel.Item>
          <img src={slider5} alt="slider" />
        </Carousel.Item>
      </Carousel>
    </div>
    <div className="container">
      <div className="row pt-5 mt-5 pb-5 mb-5">
        <div className="col-sm-3">
          <div
            className="d-flex py-3 my-3 my-lg-0 justify-content-center"
            data-aos="fade-down"
          >
            <img
              src={satisfiedClient}
              alt="satisfied-client"
              className="mr-3"
            />
            <div>
              <h4 className="font-weight-bold text-dark mb-0">
                <span className="scVal">0</span>%
              </h4>
              <h5 className="text-dark mb-0">Satisfied clients</h5>
            </div>
          </div>
        </div>
        <div className="col-sm-3">
          <div
            className="d-flex py-3 my-3 my-lg-0 justify-content-center"
            data-aos="fade-up"
          >
            <img
              src={finishedProject}
              alt="satisfied-client"
              className="mr-3"
            />
            <div>
              <h4 className="font-weight-bold text-dark mb-0">
                <span className="fpVal">0</span>
              </h4>
              <h5 className="text-dark mb-0">Finished Project</h5>
            </div>
          </div>
        </div>
        <div className="col-sm-3">
          <div
            className="d-flex py-3 my-3 my-lg-0 justify-content-center"
            data-aos="fade-down"
          >
            <img src={teamMembers} alt="Team Members" className="mr-3" />
            <div>
              <h4 className="font-weight-bold text-dark mb-0">
                <span className="tMVal">0</span>
              </h4>
              <h5 className="text-dark mb-0">Team Members</h5>
            </div>
          </div>
        </div>
        <div className="col-sm-3">
          <div
            className="d-flex py-3 my-3 my-lg-0 justify-content-center"
            data-aos="fade-up"
          >
            <img src={ourBlogPosts} alt="Our Blog Posts" className="mr-3" />
            <div>
              <h4 className="font-weight-bold text-dark mb-0">
                <span className="bPVal">0</span>
              </h4>
              <h5 className="text-dark mb-0">Our Blog Posts</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Projects;
