import React from 'react';
import PropTypes from 'prop-types';

import { getPostDateString } from 'utils/misc';
import isEnabled, { SORT_VIRALITY } from 'utils/featureFlags';

function postPosition(position) {
  if (position > 0) {
    return (<span style={{ color: '#31a354' }}>{` ⬆ by ${Math.abs(position)}`}</span>);
  } else if (position < 0) {
    return (<span style={{ color: '#de2d26' }}>{` ⬇ by ${Math.abs(position)}`}</span>);
  }
  return '';
}

const Head = props => (
  <div className="post-header">
    { props.showLogo &&
      <div className="float-right">
        <a href={props.link} target="_blank" rel="noopener noreferrer" className={`source-icon ${props.iconClass}`} />
      </div>
    }
    {Object.keys(props.repost).length > 0 &&
    <div className="rt-comment">
      <a href={props.repost.url}>
        <i className={props.repost.icon} />{props.repost.label}
      </a>
    </div>}
    {props.picSrc &&
      <img className="img-circle" src={props.picSrc} alt="circle" />
    }
    <div className="post-header-details">
      <div className="author">
        {props.author}
        {props.account && <span className="account">{props.account}</span>}
      </div>
      <div className="date">
        <a href={props.link} target="_blank" rel="noopener noreferrer">{getPostDateString(props.post)}</a>
        {isEnabled(SORT_VIRALITY) && postPosition(props.position)}
      </div>
    </div>
  </div>
);

Head.propTypes = {
  post: PropTypes.object.isRequired,
  author: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  picSrc: PropTypes.string.isRequired,
  iconClass: PropTypes.string.isRequired,
  showLogo: PropTypes.bool.isRequired,
  position: PropTypes.number.isRequired,
  repost: PropTypes.object,
  account: PropTypes.string,
};

Head.defaultProps = {
  repost: {},
  account: '',
};

export default Head;
