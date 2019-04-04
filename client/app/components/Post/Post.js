import React, { Component } from 'react';
import PropTypes from 'prop-types';

import HiddenPost from 'components/Post/HiddenPost';
import BackOfPost from './BackOfPost';
import PostFooter from './PostFooter';
import ContentTwitter from './ContentTwitter';
import ContentFacebook from './ContentFacebook';
import ContentMastodon from './ContentMastodon';
import HeadTwitter from './HeadTwitter';
import HeadFacebook from './HeadFacebook';
import HeadMastodon from './HeadMastodon';

class Post extends Component {

  // Facebook post object reference https://developers.facebook.com/docs/graph-api/reference/v2.10/post
  // Facebook type is one of {link, status, photo, video, offer}
  // if type = status, status_type is one of {mobile_status_update, created_note, added_photos, added_video, shared_story, created_group, created_event, wall_post, app_created_story, published_story, tagged_in_photo, approved_friend}

  constructor(props) {
    super(props);
    this.state = {
      flipped: false,
      expandClicked: false,
    };
  }

  onExpandClicked = () => {
    this.setState({
      expandClicked: true,
    });
  }

  onCollapseClicked = () => {
    this.setState({
      expandClicked: false,
    });
  }

  makePostContent() {
    const post = this.props.post;
    switch (post.source) {
      case 'twitter':
        return (<ContentTwitter post={post} />);
      case 'facebook':
        return (<ContentFacebook post={post} />);
      case 'mastodon':
        return (<ContentMastodon post={post} />);
      default:
        return (<div />);
    }
  }

  flip = () => {
    this.setState({ flipped: true });
  }

  unFlip = () => {
    this.setState({ flipped: false });
  }

  makePostHead = () => {
    const { post } = this.props;
    const showLogo = this.props.filtered_by.length === 0;
    switch (post.source) {
      case 'twitter':
        return (<HeadTwitter post={post} showLogo={showLogo} />);
      case 'facebook':
        return (<HeadFacebook post={post} showLogo={showLogo} />);
      case 'mastodon':
        return (<HeadMastodon post={post} showLogo={showLogo} />);
      default:
        return (<div />);
    }
  }

  render() {
    const { post } = this.props;
    const { content, source } = this.props.post;

    if (!content) {
      return <div />;
    }

    const flippedClass = this.state.flipped ? 'flipped' : '';
    const showCollapsed = !this.state.expandClicked && this.props.isCollapsable;

    return (
      <div className="post-container">
        { showCollapsed &&
          <HiddenPost showText={false} post={post} filteredBy={this.props.filtered_by} onClick={this.onExpandClicked} />
        }
        { !showCollapsed &&
          <div className="flip-container">
            <div className={`post flipper ${flippedClass}`}>
              <div className="front">
                {this.props.filtered_by.length > 0 &&
                  <HiddenPost
                    showText
                    post={this.props.post}
                    filteredBy={this.props.filtered_by}
                    onClick={this.props.isCollapsable ? this.onCollapseClicked : undefined}
                  />
                }
                <div className="post-content">
                  {this.makePostHead()}
                  {this.makePostContent()}
                </div>
                <PostFooter post={post} flipped={false} source={source} onFlipClick={this.flip} />
              </div>
              <div className="back">
                <BackOfPost post={post} filteredBy={this.props.filtered_by} virality_max={this.props.virality_max} virality_avg={this.props.virality_avg} />
                <PostFooter post={post} flipped source={source} onFlipClick={this.unFlip} />
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  virality_max: PropTypes.number.isRequired,
  virality_avg: PropTypes.number.isRequired,
  isCollapsable: PropTypes.bool.isRequired,
  filtered_by: PropTypes.array,
};

Post.defaultProps = {
  filtered_by: [],
};

export default Post;
