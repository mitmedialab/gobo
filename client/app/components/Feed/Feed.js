import React, { Component } from 'react';
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
// import { tryGetUser } from 'actions/auth';
import { getPosts, getSettings } from 'actions/feed';
// import ReactList from 'react-list';
// import Infinite from 'react-infinite'

import Post from 'components/Post/Post';
import Settings from 'components/Settings/Settings';
import Loader from 'components/Loader/Loader';

const propTypes = {
	auth: PropTypes.object,
	dispatch: PropTypes.func,
	feed: PropTypes.object
};

function mapStateToProps(state) {
	return {
		auth: state.auth,
		feed: state.feed,
	};
}

class Feed extends Component {

	constructor(props) {
		super(props);
		this.state = {
			showFiltered: false,
			processing: false,
			minimizedSettings: false,
		};
		this.toggleShowFiltered = this.toggleShowFiltered.bind(this);
		this.toggleSettings = this.toggleSettings.bind(this);
	}

	componentWillMount() {
		const { dispatch } = this.props;
		// dispatch(tryGetUser());
		dispatch(getPosts());
		dispatch(getSettings());
	}

	toggleShowFiltered() {
		this.setState({
			showFiltered: !this.state.showFiltered
		});
	}

	toggleSettings() {
		this.setState({
			minimizedSettings: !this.state.minimizedSettings
		});
	}

	render() {
		const { auth, feed } = this.props;
		const { posts, filteredPosts, loading_posts, filtering_posts, loading_settings } = feed;

		if (!auth.isAuthenticated) {
			return <Redirect to="/" />;
		}

		const loadingPosts = loading_posts;
		const showing = this.state.showFiltered ? 'filtered' : 'kept';

		let filteredText;
		let filteredLinkText;
		if (posts.length > 0) {
			filteredText = this.state.showFiltered ? 'Showing filtered posts.' : `${filteredPosts.filtered.length} posts filtered out of your feed.`;
			filteredLinkText = this.state.showFiltered ? '  Back to my feed.' : '  Show me what was taken out.';
		}

		// if (this.props.feed.sort_by) {
		//   filteredPosts[showing].sortOn(this.props.feed.sort_by);
		//   if (this.props.feed.sort_reverse) {
		//     filteredPosts[showing].reverse()
		//   }
		// }
		const noPostsText = this.state.showFiltered ? 'None of your posts were filtered out. Try changing the filters to see them in action. ' : 'None of the posts in your feed match the filters you\'ve set. Try changing the filters.';

		let postsHtml;
		if (filteredPosts) {
			postsHtml = filteredPosts[showing].map(post => (
				<Post
					key={post.id}
					post={post}
					filtered={this.state.showFiltered}
					filtered_by={filteredPosts.reasons[post.id]}
					virality_max={filteredPosts.virality_max}
					virality_avg={filteredPosts.virality_avg}
				/>
			));
		}

		let fetchingContent;
		if (loadingPosts || filtering_posts) {
			fetchingContent = (
				<div>
					<div className="filtered-text">Hold on while we are fetching your feed</div>
					<Loader />
				</div>
			);
		}

		let showFilteredControl;
		if (posts.length > 0) {
			showFilteredControl = (
				<div className="filtered-text">
					<span className="filtered-count">{filteredText}</span>
					<a onClick={this.toggleShowFiltered} className="filtered-link" role="button">{filteredLinkText}</a>
				</div>
			);
		}

		let noPostsContent;
		if ((!loadingPosts) && (posts.length > 0) && (filteredPosts[showing].length === 0)) {
			noPostsContent = (
				<div className="no-posts-text">
					{noPostsText}
				</div>
			);
		}

		let settingsContent;
		if (filteredPosts) {
			settingsContent = (
				<Settings neutralFB={filteredPosts.fb} onMinimize={this.toggleSettings} minimized={this.state.minimizedSettings} />
			);
		}

		return (
			<div className="container-fluid">
				<div className={'row'}>
					<div className={this.state.minimizedSettings ? 'feed wide' : 'feed'}>

						{(!loadingPosts) && (posts.length === 0) &&
						(<div>
							We couldn't find any posts for your feed.
							<br />
							Did you authenticate your secial media accounts?
							<br />
							You can go to your profile page to add Facebook or Twitter
							<br />
							If you did authenticate - try refreshing this page
						</div>)}

						<div className="posts">

							{fetchingContent}

							{showFilteredControl}

							{noPostsContent}

							{postsHtml}

							{/* <ReactCSSTransitionGroup */}
							{/* ransitionName="example" */}
							{/* transitionEnterTimeout={500} */}
							{/* transitionLeaveTimeout={300}> */}
							{/* {postsHtml} */}
							{/* </ReactCSSTransitionGroup> */}

						</div>

					</div>
					<div className={this.state.minimizedSettings ? 'sidebar minimized' : 'sidebar'}>
						{settingsContent}
					</div>
				</div>
			</div>
		);
	}
}

Feed.propTypes = propTypes;
export default connect(mapStateToProps)(Feed);

/*
Array.prototype.sortOn = function(key){
	this.sort(function(a, b) {
	if(b[key] < a[key]){
		return -1;
	} else if(b[key] > a[key]) {
		return 1;
	}
	return 0;
});
}
*/
