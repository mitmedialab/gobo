import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BackOfPost from './BackOfPost';
import PostFooter from './PostFooter';
import ActionListFacebook from './ActionListFacebook';
import ActionListTwitter from './ActionListTwitter';
import ActionListMastodon from './ActionListMastodon';
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
    this.state = { flipped: false };
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

  makeActionList() {
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

  flip = () => {
    this.setState({ flipped: true });
  }

  unFlip = () => {
    this.setState({ flipped: false });
  }

  makePostHead = () => {
    const { post } = this.props;
    switch (post.source) {
      case 'twitter':
        return (<HeadTwitter post={post} />);
      case 'facebook':
        return (<HeadFacebook post={post} />);
      case 'mastodon':
        return (<HeadMastodon post={post} />);
      default:
        return (<div />);
    }
  }

  render() {
    const { post } = this.props;
    const source = this.props.post.source;
    const content = this.props.post.content;

    if (!content) {
      return <div />;
    }

    const flippedClass = this.state.flipped ? 'flipped' : '';

    return (
      <div className="post-container">
        <div className="flip-container ">
          <div className={`post flipper ${flippedClass}`}>
            <div className="front">
              <div className="post-content">
                {this.props.filtered &&
                <div className="toxicity">
                  Filtered because: {this.props.filtered_by.toString()}
                </div>}
                {this.makePostHead()}
                {this.makePostContent()}
                {this.makeActionList()}
              </div>
              <PostFooter flipped={false} source={source} onFlipClick={this.flip} />
            </div>

            <div className="back">
              <BackOfPost post={post} virality_max={this.props.virality_max} virality_avg={this.props.virality_avg} />
              <PostFooter flipped source={source} onFlipClick={this.unFlip} />
            </div>

          </div>
        </div>
      </div>
    );
  }
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  filtered: PropTypes.bool.isRequired,
  filtered_by: PropTypes.array,
  virality_max: PropTypes.number,
  virality_avg: PropTypes.number,
};

export default Post;
