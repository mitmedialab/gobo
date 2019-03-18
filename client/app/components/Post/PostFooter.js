import React from 'react';
import PropTypes from 'prop-types';

import { getSourceIcon } from 'utils/misc';

const propTypes = {
  flipped: PropTypes.bool,
  source: PropTypes.string,
  onFlipClick: PropTypes.func,
};

const PostFooter = (props) => {
  const text = props.flipped ? 'Back to post' : 'Why am I seeing this post?';
  const icon = {
    iconClass: `source-icon ${getSourceIcon(props.source)}`,
  };
  if (props.source === 'twitter') {
    icon.url = 'https://twitter.com/';
  } else if (props.source === 'facebook') {
    icon.url = 'https://www.facebook.com/';
  } else if (props.source === 'mastodon') {
    icon.url = 'https://joinmastodon.org/';
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
