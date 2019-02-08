import React from 'react';
import PropTypes from 'prop-types';

import Head from './Head';


const HeadFacebook = (props) => {
  const { post } = props;
  const { content } = post;
  const picSrc = (content.from && content.from.picture) ? content.from.picture.data.url : '';
  let author = post.content.from ? post.content.from.name : '';
  if (content.post_user) {
    if (!author) {
      author = 'Wall Post';
    }
    if (content.post_user.name && content.post_user.name !== 'facebook') {
      author += ` ▶ ${content.post_user.name}`;
    } else if (content.post_user.id && typeof content.post_user.id === 'string') {
      author += ` ▶ ${content.post_user.id}`;
    }
  }
  return (
    <Head post={props.post} author={author} picSrc={picSrc} link={content.permalink_url} />
  );
};

HeadFacebook.propTypes = {
  post: PropTypes.object.isRequired,
};

export default HeadFacebook;
