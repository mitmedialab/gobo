import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import BackOfPost from './BackOfPost';
import PostFooter from './PostFooter';
import TweetText from './TweetText';
import Media from './Media';
import LikesCommentsLine from './LikesCommentsLine';
// import Photos from './Photos';
// import Video from './Video';
// import styles from './styles';

const propTypes = {
	post: PropTypes.object.isRequired,
	filtered: PropTypes.bool.isRequired,
	filtered_by: PropTypes.string,
	virality_max: PropTypes.number,
	virality_avg: PropTypes.number,
};

class Post extends Component {

	// Facebook post object reference https://developers.facebook.com/docs/graph-api/reference/v2.10/post
	// Facebook type is one of {link, status, photo, video, offer}
	// if type = status, status_type is one of {mobile_status_update, created_note, added_photos, added_video, shared_story, created_group, created_event, wall_post, app_created_story, published_story, tagged_in_photo, approved_friend}

	constructor(props) {
		super(props);
		this.state = { flipped: false };
		this.flip = this.flip.bind(this);
		this.unFlip = this.unFlip.bind(this);
	}

	getAuthorString(content) {
		const post = this.props.post;
		let source = post.source === 'twitter' ? content.user.name : post.content.from.name;
		if ((post.source === 'facebook') && (content.post_user) && (source !== content.post_user.name)) {
			source += ` ▶ ${post.content.post_user.name}`;
		}
		return source;
	}

	getDateString() {
		const post = this.props.post;

		const date = post.created_at || post.content.created_at || post.content.created_time;

		const dateMoment = moment(date);
		const now = moment();

		if (dateMoment.isAfter(now.subtract(24, 'hours'))) {
			return dateMoment.fromNow();
		}
		return dateMoment.format('MMM D [at] H:mma');
	}

	makePostContent(content) {
		const post = this.props.post;

		const text = (post.source === 'twitter') ? <TweetText data={content} /> : content.message || '';

		let postContent = null;

		if (post.source === 'facebook') {
			switch (content.type) {
			case 'link': {
				let caption = '';
				if (content.caption) {
					caption = content.caption.toUpperCase() || '';
				}
				postContent = (
					<a href={content.link}>
						<div>
							<div className="link-card">
								<img src={content.full_picture || content.picture} alt="content" />
								<div className="link-text">
									<div className="link-caption">
										{content.name}
									</div>
									<div className="link-description">
										{content.description}
									</div>
									<div className="link-name">
										{caption}
									</div>
								</div>
							</div>
						</div>
					</a>
				);
				break;
			}
			case 'status': {
				break;
			}
			case 'photo': {
				postContent = (
					<div>
						<img src={content.full_picture || content.picture} alt="content" />
					</div>
				);
				break;
			}
			case 'video': {
				postContent = (
					<div>
						<video controls poster={content.full_picture || content.picture}>
							<source src={content.source} type="video/mp4" />
							Your browser does not support the video tag.
						</video>
					</div>
				);
				break;
			}
			case 'offer': {
				break;
			}
			default:
				break;
			}
		} else {
			// const tweet = 'https://twitter.com/intent/tweet?in_reply_to=897819616369573888';
			// const retweet = 'https://twitter.com/intent/retweet?tweet_id=897819616369573888';
			// const like = 'https://twitter.com/intent/like?tweet_id=897819616369573888';
			// return (<TweetFix tweetId={post.content.id_str} options={{width:'auto', dnt:true, link_color:'#ff3b3f'}}></TweetFix>)
			// postContent = <TweetText data={post.content}/>
			let MediaComponent = null;
			// use Media component if media entities exist
			if (content.entities && content.entities.media) {
				MediaComponent = <Media media={content.entities.media} />;
			}
			// extended_entities override, these are multi images, videos, gifs
			if (content.extended_entities && content.extended_entities.media) {
				MediaComponent = <Media media={content.extended_entities.media} />;
			}
			postContent = MediaComponent;
		}

		return (
			<div className="post-content-text">
				<div>
					{content.story}
				</div>
				{text}
				<div className="post-inner-content">
					{postContent}
				</div>
			</div>
		);
	}

	flip() {
		this.setState({ flipped: true });
	}

	unFlip() {
		this.setState({ flipped: false });
	}

	render() {
		const post = this.props.post;
		const source = post.source;
		let content = post.content;

		let isRT = false;


		if (content.retweeted_status) {
			content = post.content.retweeted_status;
			isRT = true;
		}
		const link = (source === 'twitter') ? `https://twitter.com/statuses/${content.id_str}` : content.permalink_url;

		if (!content) {
			return <div />;
		}

		const from = this.getAuthorString(content);
		let picSrc = '';
		if (source === 'twitter') {
			picSrc = content.user.profile_image_url_https;
		} else {
			picSrc = content.from.picture ? content.from.picture.data.url : '';
		}

		const dateString = this.getDateString();

		const contentElement = this.makePostContent(content);
		const flippedClass = this.state.flipped ? 'flipped' : '';

		// const srcIconClass = source=='twitter'? "source-icon icon-twitter-squared": "source-icon icon-facebook-squared";
		// const sourceLink = source=='twitter'? "https://twitter.com/": "https://www.facebook.com/";

		return (
			<div className="post-container">
				<div className="flip-container ">
					<div className={`post flipper ${flippedClass}`}>
						<div className="front">
							<div className="post-content">
								{this.props.filtered &&
								<div className="toxicity">
									Filtered because: {this.props.filtered_by.toString()}
								</div>}
								<div className="post-header">
									{isRT &&
									<div className="rt-comment">
										<a href={`https://twitter.com/statuses/${post.content.id_str}`}>
											<i className="icon-twitter_retweet" />&nbsp;&nbsp;{post.content.user.name} Retweeted
										</a>
									</div>}
									<img className="img-circle" src={picSrc} alt="circle" />
									<div className="post-header-details">
										<div className="author">
											{from}
										</div>
										<div className="date">
											<a href={link}>{dateString}</a>
										</div>
									</div>
								</div>
								{contentElement}
								<LikesCommentsLine post={post} />
							</div>
							<PostFooter flipped={false} source={source} onFlipClick={this.flip} />
						</div>

						<div className="back">
							<BackOfPost post={post} virality_max={this.props.virality_max} virality_avg={this.props.virality_avg} />
							<PostFooter flipped source={source} onFlipClick={this.unFlip} />
						</div>

					</div>
				</div>
			</div>
		);
	}
}

Post.propTypes = propTypes;
export default Post;
