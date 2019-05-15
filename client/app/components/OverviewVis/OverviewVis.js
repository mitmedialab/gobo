import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactTooltip from 'react-tooltip';

class OverviewVis extends Component {

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const { feed } = this.props;
    const highlightHidden = false;

    let overview;
    if (!feed.loading_posts &&
      !feed.loadingRules &&
      !feed.filtering_posts &&
      !feed.loading_settings
    ) {
      const filteredPosts = feed.filtered_posts;
      overview = feed.filtered_posts.inFeedPosts.map((post, i) => {
        const filterReasons = filteredPosts.reasons[post.id];
        let postColor;
        if (highlightHidden) {
          if (filterReasons.length > 0) {
            postColor = 'overview-post-filtered';
            return (
              <div data-tip={`Reasons: ${filterReasons.map(reason => reason.label).join(', ')}`} data-for="overview-tip" key={post.id} className={`overview-post ${postColor}`} style={{ width: `${(1.2 / feed.filtered_posts.inFeedPosts.length) * 100}%`, left: `${(i / feed.filtered_posts.inFeedPosts.length) * 100}%` }} />
            );
          }
        } else if (!filterReasons.length) {
          postColor = 'overview-post-visible';
          const additiveCSS = post.rules ? 'overview-post-additive' : '';
          return (
            <div data-tip={post.content.name} data-for="overview-tip" key={post.id} className={`overview-post ${postColor} ${additiveCSS}`} style={{ width: `${(1.2 / feed.filtered_posts.inFeedPosts.length) * 100}%`, left: `${(i / feed.filtered_posts.inFeedPosts.length) * 100}%` }} />
          );
        }
        // TODO:
        return (
          <span />
        );
      });
    }

    return (
      <React.Fragment>
        <div className="overview-wrapper">
          {overview}
        </div>
        <ReactTooltip id="overview-tip" place="bottom" type="dark" effect="solid" />
      </React.Fragment>
    );
  }
}

OverviewVis.propTypes = {
  feed: PropTypes.object.isRequired,
};

export default OverviewVis;
