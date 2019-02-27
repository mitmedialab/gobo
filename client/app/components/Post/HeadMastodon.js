import React from 'react';
import PropTypes from 'prop-types';

import Head from './Head';


const HeadMastodon = (props) => {
  const { post } = props;
  const { content } = post;
  const repost = {};
  // if (content.retweeted_status) {
  //   content = post.content.retweeted_status;
  //   repost = {
  //     url: `https://twitter.com/statuses/${post.content.id_str}`,
  //     icon: 'icon-twitter_retweet',
  //     label: ` ${post.content.user.name} Retweeted`,
  //   };
  // }
  const author = content.account.display_name || content.account.username;
  return (
    <Head post={props.post} author={author} picSrc={content.account.avatar_static} link={content.uri} repost={repost} />
  );
};

HeadMastodon.propTypes = {
  post: PropTypes.object.isRequired,
};

export default HeadMastodon;
