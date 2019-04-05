import React from 'react';
import PropTypes from 'prop-types';

import { getSourceIcon } from 'utils/misc';

const HiddenPost = (props) => {
  const { filteredBy, post } = props;
  const text = `Hidden because of: ${props.filteredBy.map(reason => reason.label).join(', ')}`;
  const reasons = filteredBy.map(reason =>
    <span className={`rule-icon ${reason.icon}`} key={`${post.id}-${reason.type}`} />,
  );
  const content = (
    <div className="post">
      <div className="post front">
        <span>{ reasons } { props.showText && text }</span>
        <span className={`pull-right source-icon ${getSourceIcon(post.source)}`} />
      </div>
    </div>
  );

  return props.onClick ? (
    <div className="post-container-hidden" onClick={props.onClick} role="button" tabIndex="0">
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
