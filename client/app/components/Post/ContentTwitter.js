import React from 'react';
import PropTypes from 'prop-types';

import Content from './Content';
import Media from './Media';
import TweetText from './TweetText';


const ContentTwitter = (props) => {
  const content = props.post.content;
  const text = <TweetText data={content} />;

  let postContent;
  // use Media component if media entities exist
  if (content.entities && content.entities.media) {
    postContent = <Media media={content.entities.media} />;
  }
  // extended_entities override, these are multi images, videos, gifs
  if (content.extended_entities && content.extended_entities.media) {
    postContent = <Media media={content.extended_entities.media} />;
  }

  return (
    <Content post={props.post} textContent={text} postContent={postContent} />
  );
};

ContentTwitter.propTypes = {
  post: PropTypes.object.isRequired,
};

export default ContentTwitter;
