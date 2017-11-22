import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import FacebookTwitterButtons from 'components/FacebookTwitterButtons/FacebookTwitterButtons';

const propTypes = {
	auth: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
	return {
		auth: state.auth,
	};
}

const Profile = (props) => {
	if (!props.auth.isAuthenticated) {
		return <Redirect to="/" />;
	}
	// todo: remove inline styles
	const user = props.auth.user;
	// console.log(user)
	const avatar = user.facebook_picture_url || user.avatar || '/images/avatar.png';
	let twitterContent;
	let facebookContent;
	let accountName = 'New User';
	if (user.facebook_name) {
		accountName = user.facebook_name;
	} else if (user.twitter_data) {
		accountName = user.twitter_data.name;
	}
	if (user.twitter_authorized) {
		twitterContent = (
			<div className="profile_content_twitter authorized">
				<p>
					<b>Twitter</b>:
					<a href={`https://twitter.com/@${user.twitter_name}`}>{`@${user.twitter_name}`}</a>
				</p>
				<p>{user.twitter_data.description}</p>
			</div>
		);
	} else {
		twitterContent = (
			<div className="profile_content_twitter unauthorized">
				<p>
					<b>Twitter</b>: Not Connected
				</p>
			</div>
		);
	}
	if (user.facebook_authorized) {
		facebookContent = (
			<div className="profile_content_facebook">
				<p>
					<b>Facebook</b>:
					<a href={`https://facebook.com/@${user.facebook_name}`}>{user.facebook_name}</a>
				</p>
			</div>
		);
	} else {
		facebookContent = (
			<div className="profile_content_facebook unauthorized">
				<p>
					<b>Facebook</b>: Not Connected
				</p>
			</div>
		);
	}
	return (
		<div className={'page'}>
			<div className={'profile-content'}>
				<div className="create_account_screen">
					<div className="create_account_form">
						<div className={'row header'} >
							<img className="profile-img" src={avatar} alt={accountName} />
							<div className="profile-info">
								<h3>{accountName}</h3>
								{twitterContent}
								{facebookContent}
							</div>
							{/*
								<div>
									Political Affiliation:
									<div>
									{user.political_affiliation}
									</div>
									<div>
										<button>update</button>
									</div>
								</div>
							*/}
							<div>
								<FacebookTwitterButtons
									onFinish={()=>{}}
									facebookConnected={user.facebook_authorized}
									twitterConnected={user.twitter_authorized}
								/>
								<Link to="/feed">
									<button className="button button_wide"> Back to my feed</button>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

Profile.propTypes = propTypes;

export default connect(mapStateToProps)(Profile);
