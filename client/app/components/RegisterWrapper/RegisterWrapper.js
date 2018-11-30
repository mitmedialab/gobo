import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getLockStatus } from 'actions/passwordLock';
import Register from 'components/Register/Register';
import LockScreen from 'components/LockScreen/LockScreen';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  passwordLock: PropTypes.object.isRequired,
};

class RegisterWrapper extends Component {
  componentWillMount() {
    this.props.dispatch(getLockStatus());
  }

  render() {
    let element;
    if (this.props.passwordLock.password_verified || !this.props.passwordLock.is_locked ||
      this.props.passwordLock.signup_step > -1) {
      element = <Register />;
    } else {
      element = <LockScreen />;
    }
    return element;
  }

}

const mapStateToProps = state => ({
  passwordLock: state.passwordLock,
});

RegisterWrapper.propTypes = propTypes;

export default connect(mapStateToProps)(RegisterWrapper);
