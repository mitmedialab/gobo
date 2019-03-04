import React from 'react';
import PropTypes from 'prop-types';

import ActionList from './ActionList';

const ActionListTwitter = (props) => {
  const { post } = props;
  const { content } = post;
  let cleanedContent = content;
  if (content.retweeted_status) {
    cleanedContent = content.retweeted_status;
  }

  const likes = {
    name: 'likes',
    count: cleanedContent.favorite_count || 0,
    link: `https://twitter.com/intent/like?tweet_id=${cleanedContent.id_str}`,
    icon: 'icon-twitter-like',
  };
  const comments = {
    name: 'comments',
    count: 0,
    link: `https://twitter.com/intent/tweet?in_reply_to=${cleanedContent.id_str}`,
    icon: 'icon-twitter-comment',
  };
  const shares = {
    name: 'shares',
    count: post.content.retweet_count || 0,
    link: `https://twitter.com/intent/retweet?tweet_id=${cleanedContent.id_str}`,
    icon: 'icon-twitter_retweet',
  };
  return (
    <ActionList postId={post.id} likes={likes} comments={comments} shares={shares} />
  );
};

ActionListTwitter.propTypes = {
  post: PropTypes.object.isRequired,
};

export default ActionListTwitter;
