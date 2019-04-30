import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { getSourceIcon } from 'utils/misc';
import ActionListFacebook from './ActionListFacebook';
import ActionListTwitter from './ActionListTwitter';
import ActionListMastodon from './ActionListMastodon';


class PostFooter extends Component {

  makeActionList = () => {
    const post = this.props.post;
    switch (post.source) {
      case 'twitter':
        return (<ActionListTwitter post={post} />);
      case 'facebook':
        return (<ActionListFacebook post={post} />);
      case 'mastodon':
        return (<ActionListMastodon post={post} />);
      default:
        return (<div />);
    }
  }

  render() {
    const text = this.props.flipped ? 'Back to post' : 'Why am I seeing this?';
    const icon = {
      iconClass: `source-icon ${getSourceIcon(this.props.source)}`,
    };
    if (this.props.source === 'twitter') {
      icon.url = 'https://twitter.com/';
    } else if (this.props.source === 'facebook') {
      icon.url = 'https://www.facebook.com/';
    } else if (this.props.source === 'mastodon') {
      icon.url = 'https://joinmastodon.org/';
    }

    const isAdditive = this.props.post.is_news || this.props.post.rules;
    const additiveCSS = isAdditive ? 'additive-post' : '';

    return (
      <div className={`post-footer ${additiveCSS}`}>
        <div className="footer-content">
          <span className="d-none d-sm-inline">{!this.props.flipped && this.makeActionList()}</span>
          <a className="footer-text clickable btn" onClick={this.props.onFlipClick} role="button" tabIndex="0">
            <span className="footer-underline">{text}</span>
          </a>
        </div>
      </div>
    );
  }
}

PostFooter.propTypes = {
  post: PropTypes.object.isRequired,
  flipped: PropTypes.bool.isRequired,
  source: PropTypes.string.isRequired,
  onFlipClick: PropTypes.func.isRequired,
};

export default PostFooter;
