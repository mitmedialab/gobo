import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { resetPassword } from 'actions/resetPassword';
import PasswordInput from 'components/Input/PasswordInput';
import SingleRegistrationWrapper from 'components/SingleRegistrationWrapper/SingleRegistrationWrapper';


class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
  }

  handleChange = (e) => {
    this.setState({ password: e.target.value });
  }

  checkAndDispatch = (e) => {
    e.preventDefault();
    if (this.passwordRef.isValid()) {
      this.props.dispatch(resetPassword(this.props.match.params.token, this.state.password));
    }
  }

  passwordComponent = () => (
    <PasswordInput
      onRef={(c) => { this.passwordRef = c; }}
      password={this.state.password}
      onChange={this.handleChange}
    />
  );

  render() {
    if (this.props.isSuccess) {
      return <Redirect to="/login" />;
    }
    return (
      <SingleRegistrationWrapper
        heading="Change your password"
        buttonText="Change password"
        checkAndDispatch={this.checkAndDispatch}
        input={this.passwordComponent()}
        isFetching={this.props.isFetching}
        statusText={this.props.statusText}
      />
    );
  }
}

ResetPassword.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  isFetching: PropTypes.bool,
  statusText: PropTypes.string,
  isSuccess: PropTypes.bool,
};

ResetPassword.defaultProps = {
  isFetching: false,
  statusText: '',
  isSuccess: false,
};

function mapStateToProps(state) {
  return {
    isFetching: state.resetPassword.isFetching,
    statusText: state.resetPassword.statusText,
    isSuccess: state.resetPassword.isSuccess,
  };
}

export default withRouter(connect(mapStateToProps)(ResetPassword));
