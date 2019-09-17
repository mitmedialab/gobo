import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { startPostTwitterCallback } from 'actions/socialMediaLogin';
import Loader from 'components/Loader/Loader';

const propTypes = {
  location: PropTypes.object,
  dispatch: PropTypes.func,
  callbackLoading: PropTypes.func,
  auth: PropTypes.object,
};

class TwitterCallback extends Component {
  componentDidMount() {
    const parsed = queryString.parse(this.props.location.search);
    this.props.dispatch(startPostTwitterCallback(parsed));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.callbackLoading && !nextProps.callbackLoading) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        // redirect to signup or profile page
        const completedReg = this.props.auth.user.completedReg;
        let redirect = '/register';
        if (completedReg || completedReg === null) {
          redirect = '/profile';
        }
        window.location.replace(redirect);
      } else {
        window.close();
      }
    }
  }

  render() {
    return (
      <div>
        <div> Thanks for authenticating your twitter account!</div>
        <Loader />
      </div>
    );
  }
}

TwitterCallback.propTypes = propTypes;

export default withRouter(connect(state => ({ callbackLoading: state.socialMediaLogin.callbackLoading, auth: state.auth }))(TwitterCallback));
