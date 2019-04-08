import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button } from '@blueprintjs/core';
import { connect } from 'react-redux';

import { VERSION } from '../../constants/index';

const propTypes = {
  auth: PropTypes.object.isRequired,
};

const Landing = (props) => {
  let loginContent;
  if (!props.auth.isAuthenticated) {
    loginContent = (
      <div>
        <div>
          <Link to={'/login'}>
            <Button text={'Login'} />
          </Link>
        </div>
        <div>
          <Link to={'/register'}>
            <Button text={'Register'} />
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="content-with-nav" id="landing-page">
      <div className="content">

        <h1>Take control of your social feed</h1>
        {loginContent}

        <div>

          <h2>Algorithms control what we see on our feeds,<br />but we can't control the algorithms.</h2>

          <p>Do you get most of your news from social media? Us too. Do you know anything about how they pick
          what to show you? No? Neither do we. Facebook, Twitter, and others sites use complicated computerized
          rules to decide which posts you see at the top of your feed and which you don't. These
          algorithms have reinforced our echo chamber - showing us content like what we share - and made
          hard to burst our filter bubbles - hiding content that is different than what we believe. We
          think escaping these echo chambers and seeing a wider picture of the news is a critical piece of
          democratic society. We built Gobo to help demonstrate, and think about, how to do that.</p>

          <h2>Gobo lets you control what you see on your feed,<br />and what gets hidden.</h2>

          <p>Sign up for Gobo, link it to your other social media profiles, and you can take control of your
          feed. Want to read news you aren't otherwise seeing? Use our "Echo Chamber" filter to see what
          we call "wider" news. Want a better balance of men and women in your feed? Use our "gender"
          filter to rebalance it. Want to take a lunch break and just see popular funny videos your friends
          are sharing? Use our "virality" filter to pick only the most shared content. With Gobo you're in
          charge of the algorithmic filters that control what you see on social media. We've built a bunch
          of filters like these already, are building more, and have made it possible for other developers
          to add filters too. Sign up, try it out, and see if it changes how you think about how social
          media should work.</p>

          <h2>We want to change how you think social media should work</h2>

          <p>Gobo is an experiment, not a startup. We are building it to change the conversation about social
          media, algorithms, and feeds. This is a technology-to-think-with; a tool that you should play
          with and challenge yourself to use. Gobo is being built by a small team of developers at the <a href="https://www.media.mit.edu/groups/civic-media/overview/">MIT Media Lab's Center for Civic
          Media</a>, where we work on technologies for social change like this. Want to learn more about
          our motivation? Read our director <a href="https://www.theatlantic.com/technology/archive/2017/05/the-case-for-a-taxpayer-supported-version-of-facebook/524037/">Ethan
          Zuckerman's piece in the Atlantic</a> for some more background about why we are building Gobo.</p>

          <p>If you have any questions, feedback, or other thoughts you can contact the Gobo team at gobo@media.mit.edu</p>

          <p>{VERSION}</p>

        </div>
      </div>
      <div className="logos">
        <a href="https://knightfoundation.org/"><img src="images/KF_logo.png" alt="Knight Foundation" /></a>
        <a href="https://civic.mit.edu/"><img src="images/CivicMedia_Symbol.jpg" alt="Center for Civic Media" /></a>
      </div>
    </div>
  );
};

Landing.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

export default connect(mapStateToProps)(Landing);
