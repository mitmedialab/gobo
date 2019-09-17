import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import COPY from 'constants/featuresCopy';
import LandingCard from 'components/Landing/LandingCard';


const Landing = () => (
  <div className="fluid-container landing-container">
    <div className="row no-margins">
      <div className="col-lg-4 order-lg-1 login-register">
        <div>
          <img className="logo" alt="Gobo logo" src="images/gobo-logo.png" /><h1 className="landing-title">Gobo</h1>
          <p className="landing-subtitle">Your social media. Your rules.</p>
          <div>
            <Link to={'/login'}>
              <Button className="landing-button" text={'Login'} />
            </Link>
          </div>
          <div>
            <Link to={'/register'}>
              <Button className="landing-button" text={'Register'} />
            </Link>
          </div>
        </div>
        <div className="d-none d-lg-block">
          <a target="_blank" rel="noopener noreferrer" href="https://www.media.mit.edu/groups/civic-media/overview/"><img className="landing-civic-logo landing-sidebar-civic-logo" alt="Civic Media Logo" src="images/civic-media-logo-white.png" /></a>
        </div>
      </div>
      <div className="col-lg-8 order-lg-0">
        <div className="row landing-cards">
          <div className="col-lg-6 p-0">
            <LandingCard
              title={COPY.control.title}
              description={COPY.control.description}
              colorClass="card-orange"
            />
          </div>
          <div className="col-lg-6 p-0">
            <LandingCard
              title={COPY.connect.title}
              description={COPY.connect.description}
              colorClass="card-red"
            />
          </div>
          <div className="col-lg-6 p-0">
            <LandingCard
              title={COPY.see.title}
              description={COPY.see.description}
              colorClass="card-green"
            />
          </div>
          <div className="col-lg-6 p-0">
            <LandingCard
              title={COPY.perspective.title}
              description={COPY.perspective.description}
              colorClass="card-purple"
            />
          </div>
        </div>
        <div className="row text-center">
          <div className="col-lg-12 d-none d-sm-block d-xs-block d-md-none">
            <a target="_blank" rel="noopener noreferrer" href="https://www.media.mit.edu/groups/civic-media/overview/"><img className="landing-civic-logo" alt="Civic Media Logo" src="images/civic-media-logo-white.png" /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Landing;
