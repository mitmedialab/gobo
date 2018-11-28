import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  flipped: PropTypes.bool,
  source: PropTypes.string,
  onFlipClick: PropTypes.func,
};

const PostFooter = (props) => {
  const text = props.flipped ? 'Back to post' : 'Why am I seeing this post?';
  const url = props.source === 'twitter' ? 'https://twitter.com/' : 'https://www.facebook.com/';
  const iconClass = props.source === 'twitter' ? 'source-icon icon-twitter-squared' : 'source-icon icon-facebook-squared';
  return (
    <div className="post-footer">
      <div className="footer-content">
        <a href={url} target="_blank" className={iconClass} />
        <a className="footer-text" onClick={props.onFlipClick} role="button">{text}</a>
      </div>
    </div>
  );
};

PostFooter.propTypes = propTypes;

export default PostFooter;
