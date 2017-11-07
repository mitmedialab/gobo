import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';

import CouhesMessage from './registerSteps/CouhesMessage';
import SignupEmailPassword from './registerSteps/SignupEmailPassword';
import SocialAuth from './registerSteps/SocialAuth';
import SelectPersona from './registerSteps/SelectPersona';
import RegisterSuccess from './registerSteps/RegisterSuccess';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    passwordLock: PropTypes.object.isRequired,
};

class Register extends Component {

    constructor(props) {
        super(props);
        var step = 1
        if (props.passwordLock.signup_step > step) {
            step = props.passwordLock.signup_step
        }
        this.state = {
            step: step,
        };
        this.nextStep = this.nextStep.bind(this);
        this.prevStep = this.prevStep.bind(this);
    }
    nextStep() {
        this.setState({
            step : this.state.step + 1
        })
    }

    prevStep() {
        this.setState({
            step : this.state.step - 1
        })
    }

    getCurrentElement() {
        switch(this.state.step) {
            case 1:
                return <CouhesMessage onFinish={this.nextStep}/>
            case 2:
                return <SignupEmailPassword onFinish={this.nextStep}/>
            case 3:
                return <SocialAuth onFinish={this.nextStep}/>
            case 4:
                return <SelectPersona onFinish={this.nextStep}/>
            case 5:
                return <RegisterSuccess />
        }
    }

    render() {
        let element = this.getCurrentElement();

        return (
            <div className="create_account_screen">
                <h1>Registration</h1>
                <div className="create_account_form">
                    <div className="content">
                        {element}

                        <div className="next-back-buttons">
                            {(this.state.step>3 || this.state.step==2) && <button onClick={this.prevStep} >Back</button>}
                            {this.state.step>2 && this.state.step<4 && <button onClick={this.nextStep} >Next</button>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Register.propTypes = propTypes;
export default connect(state => ({ auth: state.auth, passwordLock: state.passwordLock}))(Register);