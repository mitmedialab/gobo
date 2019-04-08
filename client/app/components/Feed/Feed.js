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
      showFilteredOnly: false,
      processing: false,
      minimizedSettings: false,
    };
  }

  componentWillMount() {
    this.props.dispatch(getPosts());
    this.props.dispatch(getSettings());
    this.props.dispatch(getRules());
  }

  toggleshowFilteredOnly = () => {
    this.setState({
      showFilteredOnly: !this.state.showFilteredOnly,
    });
  }

  toggleSettings = () => {
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
    const filteredText = this.state.showFilteredOnly ? 'Showing hidden posts.' : `${filteredPosts.filtered.length} posts hidden from your feed.`;
    const filteredLinkText = this.state.showFilteredOnly ? 'Back to my feed.' : 'Show me what was hidden.';
    const noPostsText = this.state.showFilteredOnly ? 'None of your posts were hidden. Try changing the filters to see them in action. ' : 'None of the posts in your feed match the filters you\'ve set. Try changing the filters.';
    const showing = this.state.showFilteredOnly ? 'filtered' : 'kept';

    let postsHtml;
    if (!this.props.feed.loading_posts &&
      !this.props.feed.loadingRules &&
      !this.props.feed.filtering_posts &&
      !this.props.feed.loading_settings
    ) {
      let postsToDisplay;
      if (this.state.showFilteredOnly) {
        postsToDisplay = filteredPosts.filtered;
      } else {
        postsToDisplay = posts;
      }
      postsHtml = postsToDisplay.map((post) => {
        const filterReasons = filteredPosts.reasons[post.id];
        const isCollapsable = filterReasons && filterReasons.length > 0 && !this.state.showFilteredOnly;
        return (
          <Post
            key={post.id}
            post={post}
            filtered_by={filterReasons}
            virality_max={filteredPosts.virality_max}
            virality_avg={filteredPosts.virality_avg}
            isCollapsable={isCollapsable}
          />
        );
      });
    }

    return (
      <div className="content-with-nav container-fluid">
        <div className="row">
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
                <div className="filtered-text">Hold on while we fetch your feed...</div>
                <Loader />
              </div>}

              {posts.length > 0 &&
              <div className="filtered-text">
                <span className="filtered-count">{filteredText}</span>
                <a onClick={this.toggleshowFilteredOnly} className="filtered-link" role="button" tabIndex="0"> {filteredLinkText}</a>
              </div>}

              {!this.props.feed.loading_posts && this.props.feed.posts.length > 0 && filteredPosts[showing].length === 0 &&
              (<div className="no-posts-text">
                {noPostsText}
              </div>)}

              {postsHtml}
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
