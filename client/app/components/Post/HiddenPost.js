import React from 'react';
import PropTypes from 'prop-types';

import { getFilterReasonIcon } from 'utils/filtering';
import { getSourceIcon } from 'utils/misc';

const HiddenPost = (props) => {
  const { filteredBy, post } = props;
  const reasons = filteredBy.map(reason =>
    <span className={getFilterReasonIcon(reason)} key={`${post.id}-${reason}`} />,
  );
  return (<div className="post-container-hidden">
    <div className="post">
      <div className="post front">
        <span>{ reasons }</span> <span className={`pull-right source-icon ${getSourceIcon(post.source)}`} />
      </div>
    </div>
  </div>);
};

HiddenPost.propTypes = {
  filteredBy: PropTypes.array.isRequired,
  post: PropTypes.object.isRequired,
};

export default HiddenPost;
