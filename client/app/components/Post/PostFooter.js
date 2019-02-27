import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  flipped: PropTypes.bool,
  source: PropTypes.string,
  onFlipClick: PropTypes.func,
};

const PostFooter = (props) => {
  const text = props.flipped ? 'Back to post' : 'Why am I seeing this post?';
  let icon = {};
  if (props.source === 'twitter') {
    icon = {
      url: 'https://twitter.com/',
      iconClass: 'source-icon icon-twitter-squared',
    };
  } else if (props.source === 'facebook') {
    icon = {
      url: 'https://www.facebook.com/',
      iconClass: 'source-icon icon-facebook-squared',
    };
  } else if (props.source === 'mastodon') {
    // TODO: this needs a new icon
    icon = {
      url: 'https://joinmastodon.org/',
      iconClass: 'source-icon icon-plus',
    };
  }

  return (
    <div className="post-footer">
      <div className="footer-content">
        <a href={icon.url} target="_blank" rel="noopener noreferrer" className={icon.iconClass} />
        <a className="footer-text" onClick={props.onFlipClick} role="button">{text}</a>
      </div>
    </div>
  );
};

PostFooter.propTypes = propTypes;

export default PostFooter;
