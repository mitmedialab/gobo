import React from 'react';
import PropTypes from 'prop-types';

const PlatformConnected = props => (
  <div className="profile-content authorized">
    <p>
      <b>{props.platformName}</b>:
      <a href={props.platformUrl}>{props.userName}</a>
    </p>
    { props.userDescription &&
    <p>{props.userDescription}</p>
      }
  </div>
  );

PlatformConnected.defaultProps = {
  userDescription: '',
};

PlatformConnected.propTypes = {
  platformUrl: PropTypes.string.isRequired,
  platformName: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  userDescription: PropTypes.string,
};

export default PlatformConnected;
