import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAuthUrl, waitForTwitterCallback, fetchFacebookAppId } from '../../actions/twitterLogin';
import { postFacebookResponseToServer } from '../../utils/apiRequests';


const MAX_POLLS = 120;

class SocialMediaButtons extends Component {

  constructor(props) {
    super(props);
    this.state = {
      facebookSuccess: this.props.facebookConnected || this.props.auth.user.facebook_authorized || false,
      twitterSuccess: this.props.twitterConnected || this.props.auth.user.twitter_authorized || false,
      twitterError: false,
      polling: false,
      pollCount: 0,
    };
  }

  componentWillMount() {
    this.props.dispatch(fetchFacebookAppId());
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.twitter_data.loading_oauth_url && !nextProps.twitter_data.loading_oauth_url &&
      nextProps.twitter_data.oauth_url != null) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // redirect to twitter auth
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
    } else if (this.state.polling && (!nextProps.twitter_data.isTwitterAuthorized && !nextProps.twitter_data.isFetching)) {
      this.startPoll();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onTwitterButtonClick = () => {
    this.props.dispatch(getAuthUrl());
    this.startPoll();
    this.setState({ polling: true });
  }

  getConnectButtonClass = (success) => {
    let buttonClass = 'button button_wide ';
    if (success) {
      buttonClass += 'disabled';
    }
    return buttonClass;
  }

  getButtonDefaults = (success, platformName) => ({
    buttonClass: this.getConnectButtonClass(success),
    buttonText: success ? `${platformName} Connected` : `Connect your ${platformName}`,
    buttonIcon: success ? 'icon-tick' : '',
  })

  getFacebookButton = () => {
    const buttonProps = this.getButtonDefaults(this.state.facebookSuccess, 'Facebook');
    return (
      <div>
        <FacebookLogin
          appId={this.props.twitter_data.facebookAppId}
          autoLoad={false}
          fields="name,email,picture"
          scope="public_profile,user_friends,email,user_posts,user_likes"
          callback={this.responseFacebook}
          tag="button"
          cssClass={buttonProps.buttonClass}
          textButton={buttonProps.buttonText}
          isDisabled={this.state.facebookSuccess}
          disableMobileRedirect={false}
          icon={<i className={`button-icon ${buttonProps.buttonIcon}`} />}
        />
        <p><small>Connect to Facebook to allow Gobo to read Facebook pages that you like. Gobo displays public posts from liked pages for you to filter. Unfortunately we cannot display posts on your feed from your friends.</small></p>
      </div>
    );
  }

  getTwitterButton = () => {
    const buttonProps = this.getButtonDefaults(this.state.twitterSuccess, 'Twitter');
    if (this.state.twitterError) {
      buttonProps.buttonText = 'Error authenticating twitter. Please try again ';
    }
    return (
      <div>
        <button onClick={this.onTwitterButtonClick} className={buttonProps.buttonClass} >
          {buttonProps.buttonText} <i className={`button-icon ${buttonProps.buttonIcon}`} />
        </button>
        <p><small>Connect to Twitter to allow Gobo to read tweets from your timeline. Gobo displays up to 500 of the most recent posts from your feed for you to filter.</small></p>
      </div>
    );
  }

  responseFacebook = (response) => {
    if ('name' in response) {
      this.setState({ facebookSuccess: true });
      // dispatch response to server
      postFacebookResponseToServer(response);
    }
  }

  startPoll() {
    if (this.state.pollCount > MAX_POLLS) {
      this.setState({ twitterError: true });
    } else {
      this.timeout = setTimeout(() => this.props.dispatch(waitForTwitterCallback()), 1000);
      this.setState({ pollCount: this.state.pollCount + 1 });
    }
  }

  render() {
    const isFacebookEnabled = this.props.twitter_data.isFacebookEnabled && this.props.twitter_data.facebookAppId;
    return (
      <div className="facebook_twitter_buttons">
        {this.getTwitterButton()}
        {isFacebookEnabled && this.getFacebookButton()}
      </div>
    );
  }
}

SocialMediaButtons.defaultProps = {
  facebookConnected: false,
  twitterConnected: false,
};

SocialMediaButtons.propTypes = {
  dispatch: PropTypes.func.isRequired,
  twitter_data: PropTypes.object.isRequired,
  facebookConnected: PropTypes.bool,
  twitterConnected: PropTypes.bool,
  auth: PropTypes.object.isRequired,
};

export default connect(state => ({ twitter_data: state.twitterLogin, auth: state.auth }))(SocialMediaButtons);
