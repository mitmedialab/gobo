import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAuthUrl, waitForTwitterCallback, fetchFacebookAppId } from '../../actions/twitterLogin';
import { postFacebookResponseToServer } from '../../utils/apiRequests';


const propTypes = {
	dispatch: PropTypes.func.isRequired,
	twitter_data: PropTypes.object.isRequired,
	facebookConnected: PropTypes.func,
	twitterConnected: PropTypes.func,
	auth: PropTypes.object,
	// onFinish: PropTypes.func.isRequired,
};

const MAX_POLLS = 120;

class FacebookTwitterButtons extends Component {

	constructor(props) {
		super(props);
		this.state = {
			facebookSuccess: this.props.facebookConnected || this.props.auth.user.facebook_authorized || false,
			twitterSuccess: this.props.twitterConnected || this.props.auth.user.twitter_authorized || false,
			twitterError: false,
			polling: false,
			pollCount: 0,
		};
		this.responseFacebook = this.responseFacebook.bind(this);
		this.onTwitterButtonClick = this.onTwitterButtonClick.bind(this);
		this.facebookAppId = '';
	}

	componentWillMount() {
		this.props.dispatch(fetchFacebookAppId());
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.twitter_data.loading_oauth_url && !nextProps.twitter_data.loading_oauth_url &&
			nextProps.twitter_data.oauth_url != null) {
			if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
				// redirect to twitter auth
				console.log(nextProps.twitter_data.oauth_url);
				window.location.replace(nextProps.twitter_data.oauth_url);
			} else {
				window.open(nextProps.twitter_data.oauth_url, '_blank', 'width=500,height=500');
			}
			this.props.dispatch(waitForTwitterCallback());
		} else if (!this.props.twitter_data.isTwitterAuthorized && nextProps.twitter_data.isTwitterAuthorized) {
			clearTimeout(this.timeout);
			this.setState({
				twitterSuccess: true,
			});
			this.isDone();
		} else if (this.state.polling && (!nextProps.twitter_data.isTwitterAuthorized && !nextProps.twitter_data.isFetching)) {
			this.startPoll();
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timeout);
	}

	onTwitterButtonClick() {
		this.props.dispatch(getAuthUrl());
		this.startPoll();
		this.setState({ polling: true });
	}

	startPoll() {
		if (this.state.pollCount > MAX_POLLS) {
			this.setState({ twitterError: true });
		} else {
			this.timeout = setTimeout(() => this.props.dispatch(waitForTwitterCallback()), 1000);
			this.setState({ pollCount: this.state.pollCount + 1 });
		}
	}

	responseFacebook(response) {
		console.log(response);
		if ('name' in response) {
			this.setState({ facebookSuccess: true });
			// dispatch response to server
			postFacebookResponseToServer(response);
		}
		this.isDone();
	}

	isDone() {
		if (this.state.facebookSuccess && this.state.twitterSuccess) {
			// this.props.onFinish()
		}
	}

	render() {
		let facebookButtonClass = 'button button_wide ';
		let twitterButtonClass = 'button button_wide ';

		if (this.state.facebookSuccess) {
			facebookButtonClass += 'disabled';
		}

		if (this.state.twitterSuccess) {
			twitterButtonClass += 'disabled';
		}
		const successIcon = 'icon-tick';
		const addIcon = 'icon-plus';

		const FBIcon = this.state.facebookSuccess ? successIcon : addIcon;
		const twitterIcon = this.state.twitterSuccess ? successIcon : addIcon;

		const facebookButtonText = this.state.facebookSuccess ? 'Facebook Connected' : 'Connect your Facebook';
		let twitterButtonText = this.state.twitterSuccess ? 'Twitter Connected' : 'Connect your Twitter';
		if (this.state.twitterError) {
			twitterButtonText = 'Error authenticating twitter. Please try again ';
		}
		let fbButton;
		if (this.props.twitter_data.isFacebookEnabled && this.props.twitter_data.facebookAppId) {
			fbButton = (
				<FacebookLogin
					appId={this.props.twitter_data.facebookAppId}
					autoLoad={false}
					fields="name,email,picture"
					scope="public_profile,user_friends,email,user_posts,user_likes"
					callback={this.responseFacebook}
					tag="button"
					cssClass={facebookButtonClass}
					textButton={facebookButtonText}
					isDisabled={this.state.facebookSuccess}
					disableMobileRedirect={false}
					icon={<i className={`button-icon ${FBIcon}`} />}
				/>);
		} else {
			fbButton = (<div />);
		}
		return (
			<div className="facebook_twitter_buttons">
				<button onClick={this.onTwitterButtonClick} className={twitterButtonClass} >
					{twitterButtonText} <i className={`button-icon ${twitterIcon}`} />
				</button>
				{fbButton}
			</div>
		);
	}
}

FacebookTwitterButtons.propTypes = propTypes;

export default connect(state => ({ twitter_data: state.twitterLogin, auth: state.auth }))(FacebookTwitterButtons);
