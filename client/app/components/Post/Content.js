import React from 'react';
import PropTypes from 'prop-types';


const Content = props => (
  <div className="post-content-text">
    <div>
      {props.post.content.story}
    </div>
    {props.textContent}
    {props.postContent &&
      <div className="post-inner-content">
        {props.postContent}
      </div>
    }
  </div>
);

Content.propTypes = {
  post: PropTypes.object.isRequired,
  textContent: PropTypes.any.isRequired,
  postContent: PropTypes.object,
};

Content.defaultProps = {
  postContent: undefined,
};

export default Content;
