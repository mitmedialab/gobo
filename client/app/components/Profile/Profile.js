import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import isEnabled, { MASTODON } from 'utils/featureFlags';

import SocialMediaButtons from 'components/SocialMediaButtons/SocialMediaButtons';
import DeleteAccountButton from 'components/DeleteAccountButton/DeleteAccountButton';

import PlatformConnected from './PlatformConnected';
import PlatformUnconnected from './PlatformUnconnected';

const propTypes = {
  auth: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
  };
}

const Profile = (props) => {
  if (!props.auth.isAuthenticated) {
    return <Redirect to="/" />;
  }
  const user = props.auth.user;
  const avatar = user.facebook_picture_url || user.avatar || '/images/avatar.png';
  let accountName = 'New User';
  if (user.facebook_name) {
    accountName = user.facebook_name;
  } else if (user.twitter_data) {
    accountName = user.twitter_data.name;
  }

  let twitterContent;
  if (user.twitter_authorized) {
    twitterContent = (
      <PlatformConnected
        platformName="Twitter"
        platformUrl={`https://twitter.com/@${user.twitter_name}`}
        userName={`@${user.twitter_name}`}
        userDescription={user.twitter_data.description}
      />
    );
  } else {
    twitterContent = (
      <PlatformUnconnected platformName="Twitter" />
    );
  }

  let facebookContent;
  if (user.facebook_authorized) {
    facebookContent = (
      <PlatformConnected
        platformName="Facebook"
        platformUrl={`https://facebook.com/@${user.facebook_name}`}
        userName={user.facebook_name}
      />
    );
  } else {
    facebookContent = (
      <PlatformUnconnected platformName="Facebook" />
    );
  }

  let mastodonContent;
  if (user.mastodon_authorized) {
    mastodonContent = (
      <PlatformConnected
        platformName="Mastodon"
        platformUrl={`https://${user.mastodon_domain}/@${user.mastodon_name}`}
        userName={`${user.mastodon_name}@${user.mastodon_domain}`}
      />
    );
  } else {
    mastodonContent = (
      <PlatformUnconnected platformName="Mastodon" />
    );
  }

  return (
    <div className="page">
      <div className="profile-content">
        <div className="registration-screen">
          <div className="registration-form">
            <div className="row header" >
              <img className="profile-img" src={avatar} alt={accountName} />
              <div className="profile-info">
                <h3>{accountName}</h3>
                {twitterContent}
                {facebookContent}
                {isEnabled(MASTODON) && mastodonContent}
              </div>
              <div>
                <SocialMediaButtons
                  onFinish={() => {}}
                  facebookConnected={user.facebook_authorized}
                  twitterConnected={user.twitter_authorized}
                  mastodonConnected={user.mastodon_authorized}
                />
                <DeleteAccountButton />
                <Link to="/feed">
                  <button className="button button_wide"> Back to my feed</button>
                </Link>
                <p className="profile-privacy-description"><small>See our <Link to={'/privacy'}> privacy policy</Link> for more information.</small></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = propTypes;

export default connect(mapStateToProps)(Profile);
