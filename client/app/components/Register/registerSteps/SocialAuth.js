import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FacebookTwitterButtons from 'components/FacebookTwitterButtons/FacebookTwitterButtons';

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
    <FacebookTwitterButtons onFinish={props.onFinish} />
  </div>
);

SocialAuth.propTypes = propTypes;

export default connect(state => ({ twitter_data: state.twitterLogin }))(SocialAuth);
