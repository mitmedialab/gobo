import React from 'react';
import PropTypes from 'prop-types';

import { getSourceIcon } from 'utils/misc';

const HiddenPost = (props) => {
  const { filteredBy, post } = props;
  const reasons = filteredBy.map(reason =>
    <span className={reason.icon} key={`${post.id}-${reason.type}`} />,
  );
  return (<div className="post-container-hidden" onClick={props.onClick} role="button" tabIndex="0">
    <div className="post">
      <div className="post front">
        <span>{ reasons }</span>
        <span className={`pull-right source-icon ${getSourceIcon(post.source)}`} />
      </div>
    </div>
  </div>);
};

HiddenPost.propTypes = {
  filteredBy: PropTypes.array.isRequired,
  post: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default HiddenPost;
