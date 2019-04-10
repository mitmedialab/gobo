import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { loginUser } from 'actions/auth';
import { validateEmail } from 'utils/misc';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import EmailInput from 'components/Input/EmailInput';
import PasswordInput from 'components/Input/PasswordInput';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      email_error_text: null,
      password_error_text: null,
    };
  }

  handleChange = (e, type) => {
    const value = e.target.value;
    const nextState = {};
    nextState[type] = value;
    this.setState(nextState);
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      if (!this.state.disabled) {
        this.checkAndLogin(e);
      }
    }
  }

  checkAndLogin(e) {
    e.preventDefault();

    const canProceed = validateEmail(this.state.email) && this.passwordRef.isValid();
    if (canProceed) {
      this.props.dispatch(loginUser(this.state.email, this.state.password));
    } else {
      this.emailRef.isValid();
      this.passwordRef.isValid();
    }
  }

  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to="/feed" />;
    }
    return (
      <div className="registration-screen content-with-nav" id="login-box" role="button" onKeyPress={e => this.handleKeyPress(e)}>
        <div className="registration-form">
          <h1>Login to Gobo</h1>
          {this.props.isPasswordUpdated &&
            <div className="status-text">Password updated. Please login.</div>
          }
          <form>
            <EmailInput
              onRef={(c) => { this.emailRef = c; }}
              email={this.state.email}
              onChange={this.handleChange}
            />
            <PasswordInput
              useValidator={false}
              forbiddenWords={[]}
              onRef={(c) => { this.passwordRef = c; }}
              password={this.state.password}
              onChange={this.handleChange}
            />

            <Link className="forgot-password pull-right" to="/forgot_password">
              Forgot your password?
            </Link>

            <button
              className="button button_wide"
              onClick={e => this.checkAndLogin(e)}
            >
              Login
            </button>

            <div className="status-text">{this.props.auth.statusText}</div>

            {this.props.isAuthenticating && <Loader />}

            <hr />

            <div>
              <p className="registration-description">Don&apos;t have an account yet?</p>
              <p>
                <Link to="/register">
                  <button className="button button_wide"> Click here to Register</button>
                </Link>
              </p>
            </div>

          </form>

        </div>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  isAuthenticating: PropTypes.bool.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isPasswordUpdated: PropTypes.bool,
};

Login.defaultProps = {
  isPasswordUpdated: false,
};

function mapStateToProps(state) {
  return {
    auth: state.auth,
    isAuthenticating: state.auth.isAuthenticating,
    isAuthenticated: state.auth.isAuthenticated,
    isPasswordUpdated: state.resetPassword.isSuccess,
  };
}

export default connect(mapStateToProps)(Login);
