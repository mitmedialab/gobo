import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { loginUser } from 'actions/auth';
import { validateEmail } from 'utils/misc';
import PropTypes from 'prop-types';
import Loader from 'components/Loader/Loader';
import Input from 'components/Input/Input';

function mapStateToProps(state) {
  return {
    auth: state.auth,
    isAuthenticating: state.auth.isAuthenticating,
    isAuthenticated: state.auth.isAuthenticated,
  };
}

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

  changeValue(e, type) {
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
      <div className="create_account_screen" id="login-box" role="button" onKeyPress={e => this.handleKeyPress(e)}>
        <div>
          <h1>Registration</h1>

          <div>
            <div className="create_account_form">
              <h1>Login to Gobo</h1>
              <form>

                <Input
                  text="Email Address"
                  ref={(c) => { this.emailRef = c; }}
                  type="text"
                  defaultValue={this.state.email}
                  validate={validateEmail}
                  value={this.state.email}
                  onChange={e => this.changeValue(e, 'email')}
                  errorMessage="Email is invalid"
                  emptyMessage="Email can't be empty"
                  errorVisible={this.state.showEmailError}
                />

                <Input
                  text="Password"
                  type="password"
                  ref={(c) => { this.passwordRef = c; }}
                  validator={false}
                  minCharacters="6"
                  requireCapitals="0"
                  requireNumbers="1"
                  forbiddenWords={[]}
                  value={this.state.passsword}
                  emptyMessage="Password is invalid"
                  onChange={e => this.changeValue(e, 'password')}
                />

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
        </div>
      </div>
    );
  }
}

const propTypes = {
  dispatch: PropTypes.func,
  auth: PropTypes.object,
  isAuthenticating: PropTypes.bool,
  isAuthenticated: PropTypes.bool,
};

Login.propTypes = propTypes;

export default connect(mapStateToProps)(Login);
