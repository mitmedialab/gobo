import React from 'react';
import PropTypes from 'prop-types';

const LandingCard = props => (
  <div className="flip-card">
    <div className="flip-card-inner">
      <div className={`flip-card-front ${props.colorClass}`}>
        <div className="card-title">{props.title}</div>
        <p className="card-learn-more">Learn More</p>
      </div>
      <div className={`flip-card-back ${props.colorClass}`}>
        <div className="card-title">{props.title}</div>
        <div className="card-description">
          <p>{props.description}</p>
        </div>
      </div>
    </div>
  </div>
);

LandingCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  colorClass: PropTypes.string.isRequired,
};

export default LandingCard;
