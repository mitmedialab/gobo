import React from 'react';
import PropTypes from 'prop-types';

const PlatformUnconnected = props => (
  <div className="profile-content unauthorized">
    <p>
      <b>{props.platformName}</b>: Not Connected
    </p>
  </div>
  );

PlatformUnconnected.propTypes = {
  platformName: PropTypes.string.isRequired,
};

export default PlatformUnconnected;
