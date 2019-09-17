import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';

import { validateEmail } from 'utils/misc';
import { sendResetPassword } from 'actions/resetPassword';
import EmailInput from 'components/Input/EmailInput';
import SingleRegistrationWrapper from 'components/SingleRegistrationWrapper/SingleRegistrationWrapper';


class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }

  handleChange = (e) => {
    this.setState({ email: e.target.value });
  }

  checkAndDispatch = (e) => {
    e.preventDefault();
    if (this.emailRef.isValid() && validateEmail(this.state.email)) {
      this.props.dispatch(sendResetPassword(this.state.email));
    }
  }

  emailComponent = () => (
    <EmailInput
      onRef={(c) => { this.emailRef = c; }}
      email={this.state.email}
      onChange={this.handleChange}
    />
  );

  render() {
    return (
      <SingleRegistrationWrapper
        heading="Reset your password"
        buttonText="Send Email"
        checkAndDispatch={this.checkAndDispatch}
        input={this.emailComponent()}
        isFetching={this.props.isFetching}
        statusText={this.props.statusText}
      />
    );
  }
}

ForgotPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
  isFetching: PropTypes.bool,
  statusText: PropTypes.string,
};

ForgotPassword.defaultProps = {
  isFetching: false,
  statusText: '',
};

function mapStateToProps(state) {
  return {
    isFetching: state.resetPassword.isFetching,
    statusText: state.resetPassword.statusText,
  };
}

export default withRouter(connect(mapStateToProps)(ForgotPassword));
