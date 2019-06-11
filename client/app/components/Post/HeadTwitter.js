import React from 'react';
import PropTypes from 'prop-types';

import { getSourceIcon } from 'utils/misc';
import Head from './Head';


const HeadTwitter = (props) => {
  const { post, position } = props;
  let { content } = post;
  let repost = {};
  if (content.retweeted_status) {
    content = post.content.retweeted_status;
    repost = {
      url: `https://twitter.com/statuses/${post.content.id_str}`,
      icon: 'icon-twitter_retweet',
      label: ` ${post.content.user.name} Retweeted`,
    };
  }
  const link = `https://twitter.com/statuses/${content.id_str}`;
  const author = content.user.name;
  return (
    <Head
      post={props.post}
      author={author}
      picSrc={content.user.profile_image_url_https}
      link={link}
      repost={repost}
      iconClass={getSourceIcon('twitter')}
      showLogo={props.showLogo}
      position={position}
    />
  );
};

HeadTwitter.propTypes = {
  post: PropTypes.object.isRequired,
  showLogo: PropTypes.bool.isRequired,
  position: PropTypes.number.isRequired,
};

export default HeadTwitter;
