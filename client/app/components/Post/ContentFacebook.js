import React from 'react';
import PropTypes from 'prop-types';

import Content from './Content';


const ContentFacebook = (props) => {
  const content = props.post.content;
  let postContent;
  let caption = '';
  switch (content.type) {
    case 'link':
      if (content.caption) {
        caption = content.caption.toUpperCase() || '';
      }
      postContent = (
        <a href={content.link}>
          <div>
            <div className="link-card">
              <img src={content.full_picture || content.picture} alt="content" />
              <div className="link-text">
                <div className="link-caption">
                  {content.name}
                </div>
                <div className="link-description">
                  {content.description}
                </div>
                <div className="link-name">
                  {caption}
                </div>
              </div>
            </div>
          </div>
        </a>
      );
      break;
    case 'photo':
      postContent = (
        <div>
          <img src={content.full_picture || content.picture} alt="content" />
        </div>
      );
      break;
    case 'video':
      postContent = (
        <div>
          <video controls poster={content.full_picture || content.picture}>
            <source src={content.source} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
      break;
    default:
      break;
  }

  const text = props.post.content.message || '';
  return (
    <Content post={props.post} textContent={text} postContent={postContent} />
  );
};

ContentFacebook.propTypes = {
  post: PropTypes.object.isRequired,
};

export default ContentFacebook;
