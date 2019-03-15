import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { filterPostByKeywordOr } from 'utils/filtering';


const genderStrings = {
  male: ' man',
  female: ' woman',
  unknown: 'n unknown gender',
};

function rudenessScoreToString(score) {
  if (score < 0.3) {
    return 'not rude';
  } else if (score < 0.65) {
    return 'kind of rude';
  }
  return 'very rude';
}

function seriousnessScoreToString(score) {
  if (score < 0.1) {
    return 'not serious';
  } else if (score < 0.3) {
    return 'not too serious';
  } else if (score < 0.6) {
    return 'a little serious';
  } else if (score < 0.7) {
    return 'pretty serious';
  }
  return 'very serious';
}

function rulesText(post, rules) {
  const filtered = rules.reduce((accumulator, rule) => accumulator || filterPostByKeywordOr(post, rule.exclude_terms), false);
  if (filtered) {
    return ' contains words found in a rule';
  }
  return ' does not contain words found in a rule';
}

class BackOfPost extends Component {

  viralityScoreToString(score) {
    const logScore = Math.log(score + 1);
    const viralityAvg = this.props.virality_avg;
    const viralityMax = this.props.virality_max;
    if (logScore < (viralityAvg / 2)) {
      return 'in the bottom 25% of popular posts';
    } else if (logScore < viralityAvg) {
      return 'in the lower middle 25% of popular posts';
    } else if (logScore < (viralityAvg + ((viralityMax - viralityAvg) / 2))) {
      return 'in the upper middle 25% of popular posts';
    }
    return 'in the top 25% of popular posts';
  }

  politicalQuintileText(score) {
    const myQuintile = this.props.feed.settings.echo_range || 0;
    const distance = Math.abs(myQuintile - score);
    if (distance === 0) {
      return 'similar to your political perspective';
    } else if (distance <= 2) {
      // distance is between 1-2
      return 'slightly different from your political perspective';
    }
    // distance is between 3-4
    return 'very different from your political perspective';
  }

  render() {
    const post = this.props.post;
    const noContent = (post.gender === 'None') && (!post.political_quintile) && (post.toxicity === null || post.toxicity === -1) &&
                      (post.is_corporate === null) && (post.news_score === null) && (post.virality_count === null);
    const areRulesEnabled = this.props.feed.rules.length > 0;
    const descriptions = (
      <div>

        {(post.gender !== 'None') &&
        (<div className="explanation">
          <span> <i className="icon icon-gender" /> Posted by a{genderStrings[post.gender.split('.')[1]]}</span>
        </div>)
        }

        {post.political_quintile &&
        (<div className="explanation">
          <span> <i className="icon icon-echo" /> {this.politicalQuintileText(post.political_quintile)}</span>

        </div>)
        }

        {(post.toxicity !== null) && (post.toxicity !== -1) &&
        (<div className="explanation">
          <span> <i className="icon icon-toxicity" /> This post is {rudenessScoreToString(post.toxicity)}</span>

        </div>)
        }
        {(post.is_corporate !== null) &&
        (<div className="explanation">
          <span> <i className="icon icon-corporate" /> {(post.is_corporate) ? 'Posted' : 'Not Posted'} by a brand</span>

        </div>)
        }
        {(post.news_score !== null) &&
        (<div className="explanation">
          <span> <i className="icon icon-seriousness" /> This post is {seriousnessScoreToString(post.news_score)}</span>

        </div>)
        }
        {(post.virality_count !== null) &&
        (<div className="explanation">
          <span> <i className="icon icon-virality" /> This post is {this.viralityScoreToString(post.virality_count)}</span>
        </div>)
        }
        {areRulesEnabled &&
        (<div className="explanation">
          <span> <i className="icon icon-seriousness" /> This post {rulesText(post, this.props.feed.rules)}</span>
        </div>)
        }
      </div>
    );
    return (
      <div className="back-content">
        {descriptions}
        {noContent &&
        <div> We are still analyzing this post. You will see information about it shortly.</div>}
      </div>
    );
  }

}

function mapStateToProps(state) {
  return {
    feed: state.feed,
  };
}

BackOfPost.propTypes = {
  virality_avg: PropTypes.number.isRequired,
  virality_max: PropTypes.number.isRequired,
  feed: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
};

export default connect(mapStateToProps)(BackOfPost);
