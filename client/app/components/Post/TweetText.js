import React from 'react';
import PropTypes from 'prop-types';
import twitterText from 'twitter-text';
import twemoji from 'twemoji';

const propTypes = {
	data: PropTypes.object,
};

const TweetText = (props) => {
	const { data } = props;
	const entities = data.entities;
	let text = data.full_text;


	// remove any embedded media links
	if (entities && entities.media) {
		entities.media.forEach((e) => {
			text = text.replace(e.url, '');
		});
	}

	// remove any quote links
	if (entities && data.quoted_status) {
		entities.urls.forEach((u) => {
			if (u.expanded_url.indexOf('/status/') > -1) {
				text = text.replace(u.url, '');
			}
		});
	}

	// replace + style links and mentions
	text = twitterText.autoLinkWithJSON(text, (entities || {}), { usernameIncludeSymbol: true });
	text = text.replace(/href=/g, 'style="text-decoration: none;color:#6CCCF9;" href=');

	// replace + style emoji
	text = twemoji.parse(text);
	text = text.replace(/<img class="emoji"/g, '<img class="emoji" style="height:14px;margin-right:5px;"');
	// browsers add http which causes isomorphic rendering probs
	text = text.replace(/src="\/\/twemoji/g, 'src="http://twemoji');

	const tweetProps = {
		className: 'tweet-text',
		dangerouslySetInnerHTML: {
			__html: text
		}
	};

	return <p {... tweetProps} />;
};

TweetText.propTypes = propTypes;

export default TweetText;

