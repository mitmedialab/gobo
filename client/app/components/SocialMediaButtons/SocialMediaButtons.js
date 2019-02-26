import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getTwitterAuthUrl, waitForTwitterCallback, fetchFacebookAppId,
  fetchMastodonVerification, mastodonToken, mastodonDomain } from 'actions/socialMediaLogin';
import { postFacebookResponseToServer } from 'utils/apiRequests';
import isEnabled, { MASTODON } from 'utils/featureFlags';
import { getQueryParam, encodeData } from 'utils/url';

import Input from 'components/Input/Input';

const MAX_POLLS = 120;

class SocialMediaButtons extends Component {

  constructor(props) {
    super(props);
    this.state = {
      facebookSuccess: this.props.facebookConnected || this.props.auth.user.facebook_authorized || false,
      twitterSuccess: this.props.twitterConnected || this.props.auth.user.twitter_authorized || false,
      mastodonSuccess: this.props.mastodonConnected || this.props.auth.user.mastodon_authorized || false,
      twitterError: false,
      polling: false,
      pollCount: 0,
      mastodonNameDomain: '',
    };
  }

  componentWillMount() {
    this.props.dispatch(fetchFacebookAppId());
    this.props.dispatch(fetchMastodonVerification());
  }

  componentWillReceiveProps(nextProps) {
    // TODO: oauth_url is not being used?
    if (this.props.socialMediaData.loading_oauth_url && !nextProps.socialMediaData.loading_oauth_url &&
      nextProps.socialMediaData.oauth_url != null) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // redirect to twitter auth
        window.location.replace(nextProps.socialMediaData.oauth_url);
      } else {
        window.open(nextProps.socialMediaData.oauth_url, '_blank', 'width=500,height=500');
      }
      this.props.dispatch(waitForTwitterCallback());
    } else if (!this.props.socialMediaData.isTwitterAuthorized && nextProps.socialMediaData.isTwitterAuthorized) {
      clearTimeout(this.timeout);
      this.setState({
        twitterSuccess: true,
      });
    } else if (this.state.polling && (!nextProps.socialMediaData.isTwitterAuthorized && !nextProps.socialMediaData.isFetching)) {
      this.startPoll();
    }

    if (this.props.socialMediaData.mastodon_auth_url !== nextProps.socialMediaData.mastodon_auth_url) {
      const data = nextProps.socialMediaData;
      this.openMastodonAuth(data.mastodon_auth_url, data.mastodon_client_id);
    }

    // TODO: this will eventually go into its own callback/redirect view
    const mastodonAuthCode = getQueryParam('code');
    if (mastodonAuthCode) {
      this.props.dispatch(mastodonToken(mastodonAuthCode));
      // TODO: this will be made mobile friendly
      window.close();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  onTwitterButtonClick = () => {
    this.props.dispatch(getTwitterAuthUrl());
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
          appId={this.props.socialMediaData.facebookAppId}
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

  getMastodonButton = () => {
    const buttonProps = this.getButtonDefaults(this.state.mastodonAuthorized, 'Mastodon');
    return (
      <div>
        <Input
          text="Enter your Mastodon username@domain"
          ref={(c) => { this.mastodonInputRef = c; }}
          validate={text => text.indexOf('@') > 0}
          minCharacters="3"
          requireCapitals="0"
          requireNumbers="0"
          emptyMessage="Username and domain cannot be empty"
          onChange={this.handleMastodonInputChange}
        />
        <button onClick={this.handleMastodonClick} className={buttonProps.buttonClass} >
          {buttonProps.buttonText} <i className={`button-icon ${buttonProps.buttonIcon}`} />
        </button>
        <p><small>MASTODON DETAILS</small></p>
      </div>
    );
  }

  handleMastodonInputChange = (e) => {
    this.setState({ mastodonNameDomain: e.target.value });
  }

  handleMastodonClick = (e) => {
    // TODO: polling will be done
    e.preventDefault();
    if (this.mastodonInputRef.isValid()) {
      const domain = this.state.mastodonNameDomain.split('@')[1];
      this.props.dispatch(mastodonDomain(domain));
    }
  }

  openMastodonAuth = (authUrl, clientId) => {
    // eslint-disable-next-line class-methods-use-this
    const queryString = encodeData({
      client_id: clientId,
      redirect_uri: 'http://localhost:5000/profile',
      scopes: 'read',
      response_type: 'code',
    });
    window.open(`${authUrl}?${queryString}`);
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
    const isFacebookEnabled = this.props.socialMediaData.isFacebookEnabled && this.props.socialMediaData.facebookAppId;
    const isMastodonEnabled = this.props.socialMediaData.isMastodonEnabled;
    return (
      <div className="facebook_twitter_buttons">
        {this.getTwitterButton()}
        {isFacebookEnabled && this.getFacebookButton()}
        {isEnabled(MASTODON) && isMastodonEnabled && this.getMastodonButton()}
      </div>
    );
  }
}

SocialMediaButtons.defaultProps = {
  facebookConnected: false,
  twitterConnected: false,
  mastodonConnected: false,
};

SocialMediaButtons.propTypes = {
  dispatch: PropTypes.func.isRequired,
  socialMediaData: PropTypes.object.isRequired,
  facebookConnected: PropTypes.bool,
  twitterConnected: PropTypes.bool,
  mastodonConnected: PropTypes.bool,
  auth: PropTypes.object.isRequired,
};

export default connect(state => ({ socialMediaData: state.socialMediaLogin, auth: state.auth }))(SocialMediaButtons);
