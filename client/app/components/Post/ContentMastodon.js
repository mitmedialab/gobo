import React from 'react';
import PropTypes from 'prop-types';

import parse from 'html-react-parser';

import Content from './Content';


const ContentMastodon = (props) => {
  const content = props.post.content;
  const text = content.content;

  // TODO: what about images
  return (
    <Content post={props.post} textContent={parse(text)} />
  );
};

ContentMastodon.propTypes = {
  post: PropTypes.object.isRequired,
};

export default ContentMastodon;
