import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';

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
              title="Control your own feed"
              description="Social media companies use algorithms to control what we see on our feeds, but we don’t know how these algorithms work.  As a result, we’re often unaware why certain posts show up in our feed while others don’t. Gobo allows you to control the algorithms, or a set of “rules”, so you can decide what gets shown on your feed and know why."
              colorClass="card-orange"
            />
            <LandingCard
              title="Connect multiple platforms"
              description="We believe that multiple social media platforms should exist to serve different purposes. However, it’s not easy to keep up with all of these platforms, especially when your data can’t be easily shared between them. Gobo allows you to connect up to three platforms, so you can view all of your feeds in one place."
              colorClass="card-red"
            />
            <LandingCard
              title="See what gets hidden"
              description="We believe that transparency can help you understand what you see on social media and keep platforms accountable for algorithmic bias. Gobo tells you why certain posts are hidden based on the rules you set. It also shows you how many posts are hidden, so you can see how your rules affect your feed."
              colorClass="card-green"
            />
            <LandingCard
              title="Expand your perspective"
              description="Social media companies make assumptions about what we want to see. They tend to show us content we’re already engaging with, reinforcing our echo chambers. Instead of assuming what you want to see, Gobo allows you to add unfamiliar perspectives into your feed, so you can explore the range of opinions that are shared online."
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
