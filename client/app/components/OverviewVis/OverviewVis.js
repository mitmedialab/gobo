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
    overview = feed.filtered_posts.inFeedPosts.map((post) => {
      const filterReasons = filteredPosts.reasons[post.id];
      let postColor = 'overview-post-visible';
      if (filterReasons.length > 0) {
        postColor = 'overview-post-filtered';
      }
      return (
        <div key={post.id} className={`overview-post ${postColor}`} />
      );
    });
  }

  return (
    <div className="row">
      <div className="col">
        {overview}
      </div>
    </div>
  );
};

OverviewVis.propTypes = {
  feed: PropTypes.object.isRequired,
};

export default OverviewVis;
