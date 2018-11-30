import React from 'react';
import PropTypes from 'prop-types';

const formatNumber = (num) => {
  if (num === 0) {
    return '';
  }
  return num > 999 ? `${(num / 1000).toFixed(1)}k` : num;
};

const propTypes = {
  post: PropTypes.object,
};

const LikesCommentsLine = (props) => {
  const { post } = props;
  const { content } = post;

  let cleanedContent = content;
  if (content.retweeted_status) {
    cleanedContent = content.retweeted_status;
  }
  const source = post.source;
  const isFB = source === 'facebook';
  let likes = 0;
  let comments = 0;
  let shares = 0;
  let icons = {};
  let links = {};
  if (isFB) {
    likes = cleanedContent.reactions.summary.total_count || 0;
    comments = post.content.comments.summary.total_count || 0;
    shares = post.content.shares ? post.content.shares.count : 0;
    icons = {
      likes: 'icon-thumbs-up',
      comments: 'icon-comment-1',
      shares: ' icon-forward-outline',
    };
    links = {
      likes: cleanedContent.permalink_url,
      comments: cleanedContent.permalink_url,
      shares: cleanedContent.permalink_url,
    };
  } else {
    likes = cleanedContent.favorite_count || 0;
    shares = post.content.retweet_count || 0;

    links = {
      likes: `https://twitter.com/intent/like?tweet_id=${cleanedContent.id_str}`,
      comments: `https://twitter.com/intent/tweet?in_reply_to=${cleanedContent.id_str}`,
      shares: `https://twitter.com/intent/retweet?tweet_id=${cleanedContent.id_str}`,
    };

    icons = {
      likes: 'icon-twitter-like',
      comments: 'icon-twitter-comment',
      shares: 'icon-twitter_retweet',
    };
  }

  return (
    <div className="post-actions-list">
      <span className="action">
        <a href={links.comments}>
          <i className={`${icons.comments} action-icon`} />
          <span className="action-count">{formatNumber(comments)}</span>
        </a>
      </span>
      <span className="action">
        <a href={links.likes}>
          <i className={`${icons.likes} action-icon`} />
          <span className="action-count">{formatNumber(likes)}</span>
        </a>
      </span>
      <span className="action">
        <a href={links.shares}>
          <i className={`${icons.shares} action-icon`} />
          <span className="action-count">{formatNumber(shares)}</span>
        </a>
      </span>

    </div>
  );
};

LikesCommentsLine.propTypes = propTypes;

export default LikesCommentsLine;
