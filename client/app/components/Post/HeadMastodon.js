import React from 'react';
import PropTypes from 'prop-types';

import Head from './Head';


const HeadMastodon = (props) => {
  const { post } = props;
  let { content } = post;
  let repost = {};

  if (content.reblog) {
    const account = content.account;
    repost = {
      url: `${content.uri}`,
      icon: 'icon-twitter_retweet',  // TODO: update this icon to "boosted"
      label: ` ${account.display_name || account.username} (${account.acct}) Boosted`,  // indicate domain
    };
    content = content.reblog;
  }

  return (
    <Head
      post={props.post}
      author={content.account.display_name || content.account.username}
      account={content.account.acct}
      picSrc={content.account.avatar_static}
      link={content.uri}
      repost={repost}
    />
  );
};

HeadMastodon.propTypes = {
  post: PropTypes.object.isRequired,
};

export default HeadMastodon;
