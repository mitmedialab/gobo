import React from 'react';
import PropTypes from 'prop-types';
import twitterText from 'twitter-text';
import twemoji from 'twemoji';

const propTypes = {
	data: PropTypes.object,
};

const TweetText = (props) => {
	const { entities, text, quoted_status } = props.data;

	let cleanedText;

	// remove any embedded media links
	if (entities && entities.media) {
		entities.media.forEach((e) => {
			cleanedText = text.replace(e.url, '');
		});
	}

	// remove any quote links
	if (entities && quoted_status) {
		entities.urls.forEach((u) => {
			if (u.expanded_url.indexOf('/status/') > -1) {
				cleanedText = cleanedText.replace(u.url, '');
			}
		});
	}

	// replace + style links and mentions
	cleanedText = twitterText.autoLinkWithJSON(cleanedText, (entities || {}), { usernameIncludeSymbol: true });
	cleanedText = text.replace(/href=/g, 'style="text-decoration: none;color:#6CCCF9;" href=');

	// replace + style emoji
	cleanedText = twemoji.parse(cleanedText);
	cleanedText = cleanedText.replace(/<img class="emoji"/g, '<img class="emoji" style="height:14px;margin-right:5px;"');
	// browsers add http which causes isomorphic rendering probs
	cleanedText = cleanedText.replace(/src="\/\/twemoji/g, 'src="http://twemoji');

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

