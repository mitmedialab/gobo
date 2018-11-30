import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Loader from 'components/Loader/Loader';

import Input from 'components/Input/Input';

import { verifyBetaPassword } from 'actions/passwordLock';


const propTypes = {
  dispatch: PropTypes.func.isRequired,
  passwordLock: PropTypes.object.isRequired,
};

class LockScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      passwordValue: '',
      focus: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    this.props.dispatch(verifyBetaPassword(this.state.passwordValue));
  }

  handleChange(event) {
    this.setState({
      passwordValue: event.target.value,
    });
  }

  render() {
    return (
      <div className="create_account_screen">
        <h1>Registration</h1>
        <div className="create_account_form">
          <div className="content">
            <div>
              <p>
                Gobo is currently testing with a select group of people (we called this a &ldquo;closed beta&rdquo;).
                <br />
                If you have the access code that lets you create an account, enter it below and then you can register.
                <br />
                If you don&apos;t have the access code, check back in early November!
              </p>

              <Input
                text="Beta Password"
                type="password"
                ref="beta-password"
                minCharacters="0"
                requireCapitals="0"
                requireNumbers="0"
                value={this.state.passwordValue}
                emptyMessage="Password can't be empty"
                onChange={this.handleChange}
              />

              <button className="button button_wide" onClick={this.onSubmit}>Register</button>

              {this.props.passwordLock.checking_password && <Loader />}

              <div className="status-text"> {this.props.passwordLock.pw_error_text} </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

LockScreen.propTypes = propTypes;

export default connect(state => ({ passwordLock: state.passwordLock }))(LockScreen);
