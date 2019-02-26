import React from 'react';
import PropTypes from 'prop-types';

import Content from './Content';


const ContentMastodon = (props) => {
  const content = props.post.content;
  const text = content.content;

  // TODO: do something less dangerous
  // TODO: what about images
  const postContent = <div dangerouslySetInnerHTML={{ __html: text }} />;

  return (
    <Content post={props.post} textContent={postContent} />
  );
};

ContentMastodon.propTypes = {
  post: PropTypes.object.isRequired,
};

export default ContentMastodon;
