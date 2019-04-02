import React from 'react';
import PropTypes from 'prop-types';

import { getSourceIcon } from 'utils/misc';
import Head from './Head';


const HeadTwitter = (props) => {
  const { post } = props;
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
      iconUrl="https://twitter.com/"
      iconClass={getSourceIcon('twitter')}
    />
  );
};

HeadTwitter.propTypes = {
  post: PropTypes.object.isRequired,
};

export default HeadTwitter;
