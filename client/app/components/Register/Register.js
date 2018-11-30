import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import CouhesMessage from './registerSteps/CouhesMessage';
import SignupEmailPassword from './registerSteps/SignupEmailPassword';
import SocialAuth from './registerSteps/SocialAuth';
import SelectPersona from './registerSteps/SelectPersona';
import RegisterSuccess from './registerSteps/RegisterSuccess';

const propTypes = {
  passwordLock: PropTypes.object.isRequired,
};

class Register extends Component {

  constructor(props) {
    super(props);
    let step = 1;
    if (props.passwordLock.signup_step > step) {
      step = props.passwordLock.signup_step;
    }
    this.state = { step };
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
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
        return <SelectPersona onFinish={this.nextStep} />;
      case 5:
        return <RegisterSuccess />;
      default:
        return <CouhesMessage onFinish={this.nextStep} />;
    }
  }

  nextStep() {
    this.setState({ step: this.state.step + 1 });
  }

  prevStep() {
    this.setState({ step: this.state.step - 1 });
  }

  render() {
    const element = this.getCurrentElement();

    return (
      <div className="create_account_screen">
        <h1>Registration</h1>
        <div className="create_account_form">
          <div className="content">
            {element}

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

Register.propTypes = propTypes;

export default connect(state => ({ auth: state.auth, passwordLock: state.passwordLock }))(Register);
