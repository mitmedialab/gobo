import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import COPY from 'constants/featuresCopy';
import LandingCard from 'components/Landing/LandingCard';


const Landing = () => (
  <div className="fluid-container landing-container">
    <div className="row no-margins">
      <div className="col-md-4 col-md-push-8 login-register">
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
        <div className="hidden-sm hidden-xs">
          <a target="_blank" rel="noopener noreferrer" href="https://www.media.mit.edu/groups/civic-media/overview/"><img className="landing-civic-logo landing-sidebar-civic-logo" alt="Civic Media Logo" src="images/civic-media-logo-white.png" /></a>
        </div>
      </div>
      <div className="col-lg-7 col-lg-pull-3 col-md-8 col-md-pull-4">
        <div className="row">
          <div className="landing-cards">
            <LandingCard
              title={COPY.control.title}
              description={COPY.control.description}
              colorClass="card-orange"
            />
            <LandingCard
              title={COPY.connect.title}
              description={COPY.connect.description}
              colorClass="card-red"
            />
            <LandingCard
              title={COPY.see.title}
              description={COPY.see.description}
              colorClass="card-green"
            />
            <LandingCard
              title={COPY.perspective.title}
              description={COPY.perspective.description}
              colorClass="card-purple"
            />
          </div>
        </div>
        <div className="row text-center">
          <div className="col-md-12 hidden-md hidden-lg">
            <a target="_blank" rel="noopener noreferrer" href="https://www.media.mit.edu/groups/civic-media/overview/"><img className="landing-civic-logo" alt="Civic Media Logo" src="images/civic-media-logo-white.png" /></a>
          </div>
        </div>
      </div>
    </div>
  </div>
  );

export default Landing;
