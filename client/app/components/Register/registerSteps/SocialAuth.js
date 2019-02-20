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
      To show your feed, authenticate your social media accounts.
    </p>
    <SocialMediaButtons onFinish={props.onFinish} />
  </div>
);

SocialAuth.propTypes = propTypes;

export default connect(state => ({ socialMediaData: state.socialMediaLogin }))(SocialAuth);
