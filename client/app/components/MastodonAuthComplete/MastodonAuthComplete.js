import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';

import { getQueryParam } from 'utils/url';

import { mastodonToken } from 'actions/socialMediaLogin';

import Loader from 'components/Loader/Loader';

class MastodonAuthComplete extends Component {
  componentDidMount() {
    const mastodonAuthCode = getQueryParam('code');
    if (mastodonAuthCode) {
      this.props.dispatch(mastodonToken(mastodonAuthCode));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.socialMediaData.mastodonAuthSuccess) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // redirect to signup or profile page
        const completedReg = this.props.auth.user.completedReg;
        let redirect = '/profile';
        if (!completedReg) {
          redirect = '/register';
        }
        window.location.replace(redirect);
      } else {
        window.close();
      }
    }
  }

  render() {
    const data = this.props.socialMediaData;
    return (
      <div>

        {data.mastodonAuthSuccess &&
          <div>
            <p>Your Mastodon account is authenticated.</p>
            <Link to="/feed">View your feed</Link>
          </div>
        }

        {!data.mastodonAuthLoading && !data.mastodonAuthSuccess &&
          <div>
            <p>Something went wrong. <Link to="/profile">Try again on your profile.</Link></p>
          </div>
        }

        {data.mastodonAuthLoading &&
          <div>
            <p>Your Mastodon account is authenticating...</p>
            <Loader />
          </div>
        }
      </div>
    );
  }
}

MastodonAuthComplete.propTypes = {
  dispatch: PropTypes.func.isRequired,
  socialMediaData: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default withRouter(connect(state => ({ socialMediaData: state.socialMediaLogin, auth: state.auth }))(MastodonAuthComplete));
