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
    const text = this.props.flipped ? (<span className="footer-underline">Back to post</span>) : (<span className="icon-question-circle-o" />);
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
          {!this.props.flipped && this.makeActionList()}
          <a className="footer-text" onClick={this.props.onFlipClick} role="button" tabIndex="0">{text}</a>
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
