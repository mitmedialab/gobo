import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { registerUser } from 'actions/auth';
import Input from 'components/Input/Input';
import { validateEmail } from 'utils/misc'
import _ from 'lodash';
import Loader from 'components/Loader/Loader';
import { Link } from 'react-router-dom';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
};

class SignupEmailPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            confirmPassword: null,
            forbiddenWords: ["password", "user", "username"]
        };
        this.handlePasswordInput = this.handlePasswordInput.bind(this);
        this.handleConfirmPasswordInput = this.handleConfirmPasswordInput.bind(this);
        this.saveAndContinue = this.saveAndContinue.bind(this);
        this.handleEmailInput = this.handleEmailInput.bind(this);
        this.isConfirmedPassword = this.isConfirmedPassword.bind(this);
    }

    handlePasswordInput(event) {
        if(!_.isEmpty(this.state.confirmPassword)){
            this.refs.passwordConfirm.isValid();
        }
        this.refs.passwordConfirm.hideError();
        this.setState({
            password: event.target.value
        });
    }

    handleConfirmPasswordInput(event) {
        this.setState({
            confirmPassword: event.target.value
        });
    }

    saveAndContinue(e) {
        e.preventDefault();

        var canProceed = validateEmail(this.state.email)
            && this.refs.password.isValid()
            && this.refs.passwordConfirm.isValid();

        if(canProceed) {
            this.props.dispatch(registerUser(this.state.email, this.state.password));
        } else {
            console.log('not valid!!')
            this.refs.email.isValid();
            this.refs.password.isValid();
            this.refs.passwordConfirm.isValid();
        }
    }

    isConfirmedPassword(event) {
        return (event == this.state.password)
    }


    handleEmailInput(event){
        this.setState({
            email: event.target.value
        });
    }

    isEmpty(value) {
        return !_.isEmpty(value);
    }

    componentWillReceiveProps(nextProps){
       if (!this.props.auth.isRegistered && nextProps.auth.isRegistered ) {
           this.props.onFinish()
       }
    }

    render() {
        return (
                <div>

                            <form>

                                <p>Register with email and password</p>

                                <Input
                                    text="Email Address"
                                    ref="email"
                                    type="text"
                                    defaultValue={this.state.email}
                                    validate={validateEmail}
                                    value={this.state.email}
                                    onChange={this.handleEmailInput}
                                    errorMessage="Email is invalid"
                                    emptyMessage="Email can't be empty"
                                    errorVisible={this.state.showEmailError}
                                />

                                <Input
                                    text="Password"
                                    type="password"
                                    ref="password"
                                    validator="true"
                                    minCharacters="6"
                                    requireCapitals="0"
                                    requireNumbers="1"
                                    forbiddenWords={this.state.forbiddenWords}
                                    value={this.state.passsword}
                                    emptyMessage="Password is invalid"
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

                                {this.props.auth.isRegistering && <Loader/>}

                                <div className="status-text"> {this.props.auth.registerStatusText} </div>

                            </form>


                            <div>
                                <p>Already have an account?</p>
                                <p>
                                    <Link to="/login">
                                        <button className="button"> Click here to login</button>
                                    </Link>
                                </p>
                            </div>
                </div>
        );
    }
}

SignupEmailPassword.propTypes = propTypes;
export default connect(state => ({ auth: state.auth }))(SignupEmailPassword);
