import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import * as actionCreators from '../../actions/auth';
import { validateEmail } from '../../utils/misc';
import { Button, Card } from '@blueprintjs/core';
import PropTypes from 'prop-types';

function mapStateToProps(state) {
    return {
        isAuthenticating: state.auth.isAuthenticating,
        isAuthenticated: state.auth.isAuthenticated,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
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
        const redirectRoute = '/login';
        this.state = {
            email: '',
            password: '',
            email_error_text: null,
            password_error_text: null,
            redirectTo: redirectRoute,
            disabled: true,
        };
    }

    isDisabled() {
        let email_is_valid = false;
        let password_is_valid = false;

        if (this.state.email === '') {
            this.setState({
                email_error_text: null,
            });
        } else if (validateEmail(this.state.email)) {
            email_is_valid = true;
            this.setState({
                email_error_text: null,
            });

        } else {
            this.setState({
                email_error_text: 'Sorry, this is not a valid email',
            });
        }

        if (this.state.password === '' || !this.state.password) {
            this.setState({
                password_error_text: null,
            });
        } else if (this.state.password.length >= 6) {
            password_is_valid = true;
            this.setState({
                password_error_text: null,
            });
        } else {
            this.setState({
                password_error_text: 'Your password must be at least 6 characters',
            });

        }

        if (email_is_valid && password_is_valid) {
            this.setState({
                disabled: false,
            });
        }

    }

    changeValue(e, type) {
        const value = e.target.value;
        const next_state = {};
        next_state[type] = value;
        this.setState(next_state, () => {
            this.isDisabled();
        });
    }

    _handleKeyPress(e) {
        if (e.key === 'Enter') {
            if (!this.state.disabled) {
                this.login(e);
            }
        }
    }

    login(e) {
        e.preventDefault();
        this.props.loginUser(this.state.email, this.state.password);
    }

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to="/feed"/>
        }
        return (
            <div className="col-md-6 col-md-offset-3" onKeyPress={(e) => this._handleKeyPress(e)}>
                <div className="pt-card  pt-elevation-0">
                        <div>
                            <h2>Login to Silica</h2>
                            <Link to="/register">
                                Click here to create a new account
                            </Link>
                            <label className="pt-label">
                                Email
                                <input className="pt-input"
                                       type="text"
                                       placeholder="e-mail"
                                       onChange={(e) => this.changeValue(e, 'email')} />
                            </label>
                            <label className="pt-label">
                                Password
                                    <input className="pt-input"
                                           type="password"
                                           placeholder="Password"
                                           onChange={(e) => this.changeValue(e, 'password')}/>
                            </label>

                            <Button
                                disabled={this.state.disabled}
                                text="Submit"
                                onClick={(e) => this.login(e)}
                            />

                        </div>

                </div>
            </div>
        );

    }
}

const propTypes = {
    loginUser: PropTypes.func,
    isAuthenticating: PropTypes.bool,
    isAuthenticated: PropTypes.bool,
};

Login.propTypes = propTypes;

export default connect(mapStateToProps, mapDispatchToProps)(Login);