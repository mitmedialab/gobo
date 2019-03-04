import React from 'react';
import PropTypes from 'prop-types';

import ActionList from './ActionList';

const ActionListFacebook = (props) => {
  const { post } = props;
  const { content } = post;
  const likes = {
    name: 'likes',
    count: content.reactions.summary.total_count || 0,
    link: content.permalink_url,
    icon: 'icon-thumbs-up',
  };
  const comments = {
    name: 'comments',
    count: content.comments.summary.total_count || 0,
    link: content.permalink_url,
    icon: 'icon-comment-1',
  };
  const shares = {
    name: 'shares',
    count: content.shares ? content.shares.count : 0,
    link: content.permalink_url,
    icon: 'icon-forward-outline',
  };
  return (
    <ActionList likes={likes} comments={comments} shares={shares} />
  );
};

ActionListFacebook.propTypes = {
  post: PropTypes.object.isRequired,
};

export default ActionListFacebook;
