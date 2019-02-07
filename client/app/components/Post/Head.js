import React, { Component } from 'react';
import PropTypes from 'prop-types';

import moment from 'moment';


class Head extends Component {

  getDateString = () => {
    const post = this.props.post;
    const date = post.created_at || post.content.created_at || post.content.created_time;
    const dateMoment = moment(date);
    const now = moment();
    if (dateMoment.isAfter(now.subtract(24, 'hours'))) {
      return dateMoment.fromNow();
    }
    return dateMoment.format('MMM D [at] H:mma');
  }

  render() {
    const { repost } = this.props;
    return (
      <div className="post-header">
        {repost &&
        <div className="rt-comment">
          <a href={repost.url}>
            <i className={repost.icon} />{repost.label}
          </a>
        </div>}
        <img className="img-circle" src={this.props.picSrc} alt="circle" />
        <div className="post-header-details">
          <div className="author">
            {this.props.author}
          </div>
          <div className="date">
            <a href={this.props.link}>{this.getDateString()}</a>
          </div>
        </div>
      </div>
    );
  }
}

Head.propTypes = {
  post: PropTypes.object.isRequired,
  author: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  picSrc: PropTypes.string.isRequired,
  repost: PropTypes.object,
};

Head.defaultProps = {
  repost: {},
};

export default Head;
