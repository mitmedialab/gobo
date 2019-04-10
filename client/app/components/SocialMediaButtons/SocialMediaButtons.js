import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Creatable from 'react-select/lib/Creatable';

import { getTwitterAuthUrl, waitForTwitterCallback, fetchFacebookAppId,
  fetchMastodonVerification, mastodonDomain } from 'actions/socialMediaLogin';
import { DEFAULT_MASTODON_INSTANCES } from 'constants/index';
import { postFacebookResponseToServer } from 'utils/apiRequests';
import { encodeData } from 'utils/url';

import InputError from 'components/Input/InputError';

const MAX_POLLS = 120;

class SocialMediaButtons extends Component {

  constructor(props) {
    super(props);
    this.state = {
      facebookSuccess: this.props.facebookConnected || this.props.auth.user.facebook_authorized || false,
      twitterSuccess: this.props.twitterConnected || this.props.auth.user.twitter_authorized || false,
      mastodonSuccess: this.props.mastodonConnected || this.props.auth.user.mastodon_authorized || false,
      twitterError: false,
      twitterPolling: false,
      twitterPollCount: 0,
      mastodonServerError: false,
      mastodonPolling: false,
      mastodonPollCount: 0,
      mastodonDomain: '',
      mastodonDomainError: '',
    };
  }

  componentWillMount() {
    this.props.dispatch(fetchFacebookAppId());
    this.props.dispatch(fetchMastodonVerification());
  }

  componentWillReceiveProps(nextProps) {
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
      clearTimeout(this.twitterTimer);
      this.setState({
        twitterSuccess: true,
      });
    } else if (this.state.twitterPolling && (!nextProps.socialMediaData.isTwitterAuthorized && !nextProps.socialMediaData.isFetching)) {
      this.startTwitterPoll();
    }

    if (this.props.socialMediaData.mastodon_auth_url !== nextProps.socialMediaData.mastodon_auth_url) {
      const data = nextProps.socialMediaData;
      this.openMastodonAuth(data.mastodon_auth_url, data.mastodon_client_id);
    }

    if (!this.props.socialMediaData.isMastodonAuthorized && nextProps.socialMediaData.isMastodonAuthorized) {
      clearTimeout(this.mastodonTimer);
      this.setState({
        mastodonSuccess: true,
      });
    } else if (this.state.mastodonPolling && (!nextProps.socialMediaData.isMastodonAuthorized)) {
      this.startMastodonPoll();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.twitterTimer);
    clearTimeout(this.mastodonTimer);
  }

  onTwitterButtonClick = () => {
    this.props.dispatch(getTwitterAuthUrl());
    this.startTwitterPoll();
    this.setState({ twitterPolling: true });
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
          icon={<span className={`button-icon ${buttonProps.buttonIcon}`} />}
        />
        <p><small>Connect to Facebook to allow Gobo to read Facebook pages that you like. Gobo displays public posts from liked pages for you to filter. Unfortunately we cannot display posts on your feed from your friends.</small></p>
      </div>
    );
  }

  getTwitterButton = () => {
    const buttonProps = this.getButtonDefaults(this.state.twitterSuccess, 'Twitter');
    if (this.state.twitterError) {
      buttonProps.buttonText = 'Error authenticating twitter. Try again.';
    }
    return (
      <div>
        <button onClick={this.onTwitterButtonClick} className={buttonProps.buttonClass} >
          {buttonProps.buttonText} <span className={`button-icon ${buttonProps.buttonIcon}`} />
        </button>
        <p><small>Connect to Twitter to allow Gobo to read tweets from your timeline. Gobo displays up to 500 of the most recent posts from your feed for you to filter.</small></p>
      </div>
    );
  }

  getMastodonButton = () => {
    const buttonProps = this.getButtonDefaults(this.state.mastodonSuccess, this.state.mastodonDomain ? this.state.mastodonDomain : 'Mastodon');
    if (this.state.mastodonDomain.length === 0) {
      buttonProps.buttonClass += ' disabled';
    }
    if (this.state.mastodonServerError) {
      buttonProps.buttonText = 'Error authenticating Mastodon. Try again.';
    }

    const options = DEFAULT_MASTODON_INSTANCES.map(instance => ({ value: instance, label: instance }));

    return (
      <div className="input_group">
        {!this.state.mastodonSuccess &&
          <div>
            <Creatable
              options={options}
              onChange={this.handleMastodonInputChange}
              onBlur={this.handleMastodonInputBlur}
              value={null}
              onBlurResetsInput
              onCloseResetsInput
              onSelectResetsInput
              placeholder="Select or enter your Mastodon instance"
              formatCreateLabel={input => `Mastodon instance: ${input}`}
              className="mastodonSelect"
              styles={{ control: base => ({ ...base, minHeight: '70px' }) }}
            />
          </div>
        }
        {this.state.mastodonDomainError &&
          <InputError visible errorMessage={this.state.mastodonDomainError} />
        }
        <button onClick={this.handleMastodonClick} className={buttonProps.buttonClass} >
          {buttonProps.buttonText} <span className={`button-icon ${buttonProps.buttonIcon}`} />
        </button>
        <p><small>
          Connect to Mastodon to allow Gobo to read toots from your timeline.
          Gobo displays recent posts from your feed for you to filter.
        </small></p>
      </div>
    );
  }

  setMastodonDomain = (domain) => {
    const isValidDomain = this.isValidMastodonDomain(domain);
    if (isValidDomain) {
      this.setState({
        mastodonDomain: domain,
        mastodonDomainError: '',
      });
    } else {
      this.setState({
        mastodonDomain: '',
        mastodonDomainError: 'Invalid domain: Try again.',
      });
    }
  }

  handleMastodonInputBlur = (e) => {
    if (e.target.value) {
      this.setMastodonDomain(e.target.value);
    }
  }

  handleMastodonInputChange = (input) => {
    this.setMastodonDomain(input.value);
  }

  isValidMastodonDomain = (domain) => {
    let isValid = domain !== undefined && domain !== null;
    if (isValid) {
      isValid = domain.length > 2;
    }
    if (isValid) {
      isValid = domain.indexOf('.') > 0;
    }
    return isValid;
  }

  handleMastodonClick = (e) => {
    e.preventDefault();
    if (this.isValidMastodonDomain(this.state.mastodonDomain)) {
      this.props.dispatch(mastodonDomain(this.state.mastodonDomain));
      this.startMastodonPoll();
      this.setState({ mastodonPolling: true });
    }
  }

  startMastodonPoll = () => {
    if (this.state.mastodonPollCount > MAX_POLLS) {
      this.setState({ mastodonServerError: true });
    } else {
      this.mastodonTimer = setTimeout(() => this.props.dispatch(fetchMastodonVerification()), 2000);
      this.setState({ mastodonPollCount: this.state.mastodonPollCount + 1 });
    }
  }

  openMastodonAuth = (authUrl, clientId) => {
    const baseRedirectUri = window.location.origin;
    // eslint-disable-next-line
    const queryString = encodeData({
      client_id: clientId,
      redirect_uri: `${baseRedirectUri}/mastodon_auth_complete`,
      scopes: 'read',
      response_type: 'code',
    });
    window.open(`${authUrl}?${queryString}`, '_blank', 'width=500,height=500');
  }

  responseFacebook = (response) => {
    if ('name' in response) {
      this.setState({ facebookSuccess: true });
      // dispatch response to server
      postFacebookResponseToServer(response);
    }
  }

  startTwitterPoll() {
    if (this.state.twitterPollCount > MAX_POLLS) {
      this.setState({ twitterError: true });
    } else {
      this.twitterTimer = setTimeout(() => this.props.dispatch(waitForTwitterCallback()), 2000);
      this.setState({ twitterPollCount: this.state.twitterPollCount + 1 });
    }
  }

  render() {
    const isFacebookEnabled = this.props.socialMediaData.isFacebookEnabled && this.props.socialMediaData.facebookAppId;
    const isMastodonEnabled = this.props.socialMediaData.isMastodonEnabled;
    return (
      <div className="facebook_twitter_buttons">
        {this.getTwitterButton()}
        {isFacebookEnabled && this.getFacebookButton()}
        {isMastodonEnabled && this.getMastodonButton()}
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
