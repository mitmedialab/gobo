import React from 'react';
import PropTypes from 'prop-types';

import { getPostDateString } from 'utils/misc';


const Head = props => (
  <div className="post-header">
    { props.showLogo &&
      <div className="float-right">
        <a href={props.iconUrl} target="_blank" rel="noopener noreferrer" className={`source-icon ${props.iconClass}`} />
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
        {props.author} {props.account && <span className="account">{props.account}</span>}
      </div>
      <div className="date">
        <a href={props.link}>{getPostDateString(props.post)}</a>
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
  iconUrl: PropTypes.string.isRequired,
  showLogo: PropTypes.bool.isRequired,
  repost: PropTypes.object,
  account: PropTypes.string,
};

Head.defaultProps = {
  repost: {},
  account: '',
};

export default Head;
