import _ from 'lodash';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser } from 'actions/auth';
import EmailInput from 'components/Input/EmailInput';
import PasswordInput from 'components/Input/PasswordInput';
import Input from 'components/Input/Input';
import { validateEmail } from 'utils/misc';
import Loader from 'components/Loader/Loader';

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  onFinish: PropTypes.func.isRequired,
};

class SignupEmailPassword extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: null,
    };
    this.handlePasswordInput = this.handlePasswordInput.bind(this);
    this.handleConfirmPasswordInput = this.handleConfirmPasswordInput.bind(this);
    this.saveAndContinue = this.saveAndContinue.bind(this);
    this.handleEmailInput = this.handleEmailInput.bind(this);
    this.isConfirmedPassword = this.isConfirmedPassword.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.auth.isRegistered && nextProps.auth.isRegistered) {
      this.props.onFinish();
    }
  }

  saveAndContinue(e) {
    e.preventDefault();

    const canProceed = validateEmail(this.state.email)
      && this.passwordRef.isValid()
      && this.refs.passwordConfirm.isValid();

    if (canProceed) {
      this.props.dispatch(registerUser(this.state.email, this.state.password));
    } else {
      this.emailRef.isValid();
      this.passwordRef.isValid();
      this.refs.passwordConfirm.isValid();
    }
  }

  isConfirmedPassword(event) {
    return (event === this.state.password);
  }

  handleEmailInput(event) {
    this.setState({
      email: event.target.value,
    });
  }

  handlePasswordInput(event) {
    if (!_.isEmpty(this.state.confirmPassword)) {
      this.refs.passwordConfirm.isValid();
    }
    this.refs.passwordConfirm.hideError();
    this.setState({
      password: event.target.value,
    });
  }

  handleConfirmPasswordInput(event) {
    this.setState({
      confirmPassword: event.target.value,
    });
  }

  render() {
    return (
      <div>
        <form>
          <p className="registration-description">Register with email and password</p>
          <EmailInput
            onRef={(c) => { this.emailRef = c; }}
            email={this.state.email}
            onChange={this.handleEmailInput}
          />
          <PasswordInput
            onRef={(c) => { this.passwordRef = c; }}
            password={this.state.password}
            onChange={this.handlePasswordInput}
          />
          <Input
            text="Confirm password"
            ref="passwordConfirm"
            type="password"
            validate={this.isConfirmedPassword}
            value={this.state.confirmPassword}
            onChange={this.handleConfirmPasswordInput}
            emptyMessage="Please confirm your password"
            errorMessage="Passwords don't match"
          />
          <button
            className="button button_wide"
            onClick={this.saveAndContinue}
          >
            Create Account
          </button>

          {this.props.auth.isRegistering && <Loader />}

          <div className="status-text"> {this.props.auth.registerStatusText} </div>

          <hr />

          <div>
            <p className="registration-description">Already have an account?</p>
            <p>
              <Link to="/login">
                <button className="button button_wide"> Click here to login</button>
              </Link>
            </p>
          </div>

        </form>

      </div>
    );
  }
}

SignupEmailPassword.propTypes = propTypes;

export default connect(state => ({ auth: state.auth }))(SignupEmailPassword);
