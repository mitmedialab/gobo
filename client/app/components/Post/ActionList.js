import React from 'react';
import PropTypes from 'prop-types';

import { formatNumber } from 'utils/misc';

const ActionList = (props) => {
  const { comments, likes, shares } = props;
  return (
    <span className="post-actions-list">
      {[comments, likes, shares].map(action => (
        <span className="action" key={`action-list-${props.postId}-${action.name}`}>
          { action.link &&
          <a href={action.link}>
            <span className={`${action.icon} action-icon`} />
            <span className="action-count">{formatNumber(action.count)}</span>
          </a>
            }
          { !action.link &&
          <span>
            <span className={`${action.icon} action-icon`} />
            <span className="action-count">{formatNumber(action.count)}</span>
          </span>
            }
        </span>
        ))}
    </span>
  );
};

ActionList.propTypes = {
  postId: PropTypes.number.isRequired,
  likes: PropTypes.object.isRequired,
  comments: PropTypes.object.isRequired,
  shares: PropTypes.object.isRequired,
};

export default ActionList;
