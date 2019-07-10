import React from 'react';
import PropTypes from 'prop-types';

const OverviewVis = (props) => {
  const { feed } = props;
  let overview;
  if (!feed.loading_posts &&
    !feed.loadingRules &&
    !feed.filtering_posts &&
    !feed.loading_settings
  ) {
    const filteredPosts = feed.filtered_posts;
    const postWidth = `${(1.0 / feed.filtered_posts.inFeedPosts.length) * 100}%`;
    overview = feed.filtered_posts.inFeedPosts.map((post) => {
      const filterReasons = filteredPosts.reasons[post.id];
      const postClasses = ['overview-post'];
      if (filterReasons.length === 0) {
        postClasses.push('overview-post-visible');
        // in this case, we know that any rules would be additive
        if (post.rules) {
          postClasses.push('overview-post-additive');
        }
      } else {
        postClasses.push('overview-post-filtered');
      }
      return (
        <div key={post.id} className={postClasses.join(' ')} style={{ width: postWidth }} />
      );
    });
  }

  return (
    <React.Fragment>
      <div className="overview-wrapper">
        {overview}
      </div>
    </React.Fragment>
  );
};

OverviewVis.propTypes = {
  feed: PropTypes.object.isRequired,
};

export default OverviewVis;
