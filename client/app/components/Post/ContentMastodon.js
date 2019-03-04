import React from 'react';
import PropTypes from 'prop-types';

import parse from 'html-react-parser';

import Content from './Content';


const ContentMastodon = (props) => {
  const content = props.post.content;
  const text = content.content;

  // we only support one image attachment currently
  let postContent;
  if (content.media_attachments) {
    const pictures = content.media_attachments.filter(media => media.type === 'image');
    if (pictures.length > 0) {
      const pic = pictures[0];
      postContent = (
        <div>
          <img src={pic.preview_url} alt={pic.description ? pic.description : ''} />
        </div>
      );
    }
  }

  return (
    <Content post={props.post} textContent={parse(text)} postContent={postContent} />
  );
};

ContentMastodon.propTypes = {
  post: PropTypes.object.isRequired,
};

export default ContentMastodon;
