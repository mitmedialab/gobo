import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { getPosts, getRules, getSettings } from 'actions/feed';

import Post from 'components/Post/Post';
import Settings from 'components/Settings/Settings';
import Loader from 'components/Loader/Loader';

function mapStateToProps(state) {
  return {
    auth: state.auth,
    feed: state.feed,
  };
}

class Feed extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showFiltered: false,
      processing: false,
      minimizedSettings: false,
    };
    this.toggleShowFiltered = this.toggleShowFiltered.bind(this);
    this.toggleSettings = this.toggleSettings.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(getPosts());
    this.props.dispatch(getSettings());
    this.props.dispatch(getRules());
  }

  toggleShowFiltered() {
    this.setState({
      showFiltered: !this.state.showFiltered,
    });
  }

  toggleSettings() {
    this.setState({
      minimizedSettings: !this.state.minimizedSettings,
    });
  }

  render() {
    if (!this.props.auth.isAuthenticated) {
      return <Redirect to="/" />;
    }
    const posts = this.props.feed.posts;
    const filteredPosts = this.props.feed.filtered_posts;
    const showing = this.state.showFiltered ? 'filtered' : 'kept';

    const filteredText = this.state.showFiltered ? 'Showing filtered posts.' : `${filteredPosts.filtered.length} posts filtered out of your feed.`;
    const filteredLinkText = this.state.showFiltered ? '  Back to my feed.' : '  Show me what was taken out.';

    const noPostsText = this.state.showFiltered ? 'None of your posts were filtered out. Try changing the filters to see them in action. ' : 'None of the posts in your feed match the filters you\'ve set. Try changing the filters.';

    const postsHtml = filteredPosts[showing].map(post => (
      <Post
        key={post.id}
        post={post}
        filtered={this.state.showFiltered}
        filtered_by={filteredPosts.reasons[post.id]}
        virality_max={filteredPosts.virality_max}
        virality_avg={filteredPosts.virality_avg}
      />
    ));

    return (
      <div className="container-fluid">
        <div className={'row'}>
          <div className={this.state.minimizedSettings ? 'feed wide' : 'feed'}>
            <div className="posts">
              {(!this.props.feed.loading_posts) && (this.props.feed.posts.length === 0) &&
              (<div>
                <p>We couldn't find any posts for your feed.</p>
                <p>Did you authenticate your social media accounts?</p>
                <p>Visit your <Link to="/profile">profile</Link> page to add your accounts.</p>
                <p>If you did authenticate, try refreshing this page.</p>
              </div>)}

              {(this.props.feed.loading_posts || this.props.feed.filtering_posts) &&
              <div>
                <div className="filtered-text">Hold on while we fetch your feed</div>
                <Loader />
              </div>}

              {posts.length > 0 &&
              <div className="filtered-text">
                <span className="filtered-count">{filteredText}</span>
                <a onClick={this.toggleShowFiltered} className="filtered-link" role="button">{filteredLinkText}</a>
              </div>}

              {(!this.props.feed.loading_posts) && (this.props.feed.posts.length > 0) && (filteredPosts[showing].length === 0) &&
              (<div className="no-posts-text">
                {noPostsText}
              </div>)}

              {postsHtml}

              {/* <ReactCSSTransitionGroup */}
              {/* ransitionName="example" */}
              {/* transitionEnterTimeout={500} */}
              {/* transitionLeaveTimeout={300}> */}
              {/* {postsHtml} */}
              {/* </ReactCSSTransitionGroup> */}

            </div>

          </div>
          <div className={this.state.minimizedSettings ? 'sidebar minimized' : 'sidebar'}>
            <Settings neutralFB={filteredPosts.fb} onMinimize={this.toggleSettings} minimized={this.state.minimizedSettings} />
          </div>
        </div>
      </div>
    );
  }
}

Feed.propTypes = {
  auth: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  feed: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(Feed);
