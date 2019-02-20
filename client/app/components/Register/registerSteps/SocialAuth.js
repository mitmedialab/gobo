import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SocialMediaButtons from 'components/SocialMediaButtons/SocialMediaButtons';

const propTypes = {
  onFinish: PropTypes.func.isRequired,
};

const SocialAuth = props => (
  <div>
    <p className="registration-description">
      Please Authenticate to your Facebook and Twitter
      <br />
      accounts so we can show you your feed
    </p>
    <SocialMediaButtons onFinish={props.onFinish} />
  </div>
);

SocialAuth.propTypes = propTypes;

export default connect(state => ({ twitter_data: state.twitterLogin }))(SocialAuth);
