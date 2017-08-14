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

const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};

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
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state);
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (!this.state.disabled) {
                this.checkAndLogin(e);
            }
        }
    }

    checkAndLogin(e) {
        e.preventDefault();

        var canProceed = validateEmail(this.state.email) && this.refs.password.isValid()
        if(canProceed) {
            this.props.dispatch(loginUser(this.state.email, this.state.password));
        } else {
            this.refs.email.isValid();
            this.refs.password.isValid();
        }
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/feed"/>
        }
        return (
            <div className="create_account_screen" id="login-box" onKeyPress={(e) => this._handleKeyPress(e)}>
                <div>
                    <h1>Registration</h1>

                    <div>
                        <div className="create_account_form">
                            <h1>Login to Gobo</h1>
                            <form>

                                <Input
                                    text="Email Address"
                                    ref="email"
                                    type="text"
                                    defaultValue={this.state.email}
                                    validate={validateEmail}
                                    value={this.state.email}
                                    onChange={(e) => this.changeValue(e, 'email')}
                                    errorMessage="Email is invalid"
                                    emptyMessage="Email can't be empty"
                                    errorVisible={this.state.showEmailError}
                                />

                                <Input
                                    text="Password"
                                    type="password"
                                    ref="password"
                                    validator={false}
                                    minCharacters="6"
                                    requireCapitals="0"
                                    requireNumbers="1"
                                    forbiddenWords={[]}
                                    value={this.state.passsword}
                                    emptyMessage="Password is invalid"
                                    onChange={(e) => this.changeValue(e, 'password')}
                                />

                                <button
                                    className="button button_wide"
                                    onClick={(e)=>this.checkAndLogin(e)}
                                >
                                    Login
                                </button>

                                <div className="status-text">{this.props.auth.statusText}</div>

                                {this.props.isAuthenticating && <Loader/>}

                            </form>

                            <div>
                                <p>Don't have an account yet?</p>
                                <p>
                                    <Link to="/register">
                                        <button className="button"> Click here to Register</button>
                                    </Link>
                                </p>
                            </div>
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


class RegisterStepOne extends Component {

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


}