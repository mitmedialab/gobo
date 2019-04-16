import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CouhesMessage from './registerSteps/CouhesMessage';
import SignupEmailPassword from './registerSteps/SignupEmailPassword';
import SocialAuth from './registerSteps/SocialAuth';
import RegisterSuccess from './registerSteps/RegisterSuccess';


class Register extends Component {

  constructor(props) {
    super(props);
    let step = 1;
    if (props.passwordLock.signup_step > step) {
      step = props.passwordLock.signup_step;
    }
    this.state = { step };
  }

  getCurrentElement() {
    switch (this.state.step) {
      case 1:
        return <CouhesMessage onFinish={this.nextStep} />;
      case 2:
        return <SignupEmailPassword onFinish={this.nextStep} />;
      case 3:
        return <SocialAuth onFinish={this.nextStep} />;
      case 4:
        return <RegisterSuccess />;
      default:
        return <CouhesMessage onFinish={this.nextStep} />;
    }
  }

  nextStep = () => {
    this.setState({ step: this.state.step + 1 });
  }

  prevStep = () => {
    this.setState({ step: this.state.step - 1 });
  }

  render() {
    return (
      <div className="content-with-nav registration-screen">
        <h1 className="sr-only">Registration</h1>
        <div className="registration-form">
          <div className="content">
            {this.getCurrentElement()}
            <div className="next-back-buttons">
              {(this.state.step > 3 || this.state.step === 2) && <button onClick={this.prevStep} >Back</button>}
              {this.state.step > 2 && this.state.step < 4 && <button onClick={this.nextStep} >Next</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  passwordLock: PropTypes.object.isRequired,
};

export default connect(state => ({ auth: state.auth, passwordLock: state.passwordLock }))(Register);
