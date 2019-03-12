import React from 'react';
import PropTypes from 'prop-types';

import ActionList from './ActionList';

const ActionListMastodon = (props) => {
  const { post } = props;
  const { content } = post;
  const likes = {
    name: 'likes',
    count: content.favourites_count || 0,
    link: content.uri,
    icon: 'glyphicon glyphicon-star-empty',
  };
  const comments = {
    name: 'comments',
    count: content.replies_count,
    link: content.uri,
    icon: 'icon-twitter-comment',
  };
  const shares = {
    name: 'shares',
    count: content.reblogs_count || 0,
    link: content.uri,
    icon: 'icon-twitter_retweet',
  };
  return (
    <ActionList postId={post.id} likes={likes} comments={comments} shares={shares} />
  );
};

ActionListMastodon.propTypes = {
  post: PropTypes.object.isRequired,
};

export default ActionListMastodon;
