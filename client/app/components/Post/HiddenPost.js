import React from 'react';
import PropTypes from 'prop-types';

import { getSourceIcon } from 'utils/misc';

const HiddenPost = (props) => {
  const { filteredBy, post } = props;
  const text = `Hidden by: ${props.filteredBy.map(reason => reason.label).join(', ')}`;
  const reasons = filteredBy.map(reason =>
    <span className={`rule-icon ${reason.icon}`} key={`${post.id}-${reason.type}`} />,
  );
  const content = (
    <div className="post">
      <div className="post front">
        <div className="float-left">{ reasons }</div>
        <div className={`float-right source-icon ${getSourceIcon(post.source)}`} />
        <div className="reasons-text">{ props.showText && text }</div>
      </div>
    </div>
  );

  return props.onClick ? (
    <div className="post-container-hidden clickable" onClick={props.onClick} role="button" tabIndex="0">
      { content }
    </div>
  ) : (
    <div className="post-container-hidden">
      { content }
    </div>
  );
};

HiddenPost.propTypes = {
  filteredBy: PropTypes.array.isRequired,
  post: PropTypes.object.isRequired,
  showText: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

HiddenPost.defaultProps = {
  onClick: undefined,
};

export default HiddenPost;
