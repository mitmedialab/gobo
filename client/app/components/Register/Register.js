import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { getData } from 'actions/app';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    appData: PropTypes.object.isRequired,
};

class Register extends Component {

    render() {
        return (
            <div>
                <h1>Registration</h1>

                <div>
                    <div className="create_account_form">
                        <h1>Create account</h1>
                            <form onSubmit={this.saveAndContinue}>

                                <Input
                                    text="Email Address"
                                    ref="email"
                                    type="text"
                                    defaultValue={this.state.email}
                                    validate={this.validateEmail}
                                    value={this.state.email}
                                    onChange={this.handleEmailInput}
                                    errorMessage="Email is invalid"
                                    emptyMessage="Email can't be empty"
                                    errorVisible={this.state.showEmailError}
                                />

                                <Input
                                    text="Company Name"
                                    ref="companyName"
                                    validate={this.isEmpty}
                                    value={this.state.companyName}
                                    onChange={this.handleCompanyInput}
                                    emptyMessage="Company name can't be empty"
                                />

                                <Input
                                    text="Password"
                                    type="password"
                                    ref="password"
                                    validator="true"
                                    minCharacters="8"
                                    requireCapitals="1"
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

                                <Select
                                    options={STATES}
                                    ref="state"
                                    value={this.state.statesValue}
                                    onChange={this.updateStatesValue}
                                    searchable={this.props.searchable}
                                    emptyMessage="Please select state"
                                    errorMessage="Please select state"
                                    placeholder="Choose Your State"
                                    placeholderTitle="Your State"
                                />

                                <button
                                    type="submit"
                                    className="button button_wide">
                                    CREATE ACCOUNT
                                </button>

                            </form>

                            <a href="https://github.com/mikepro4/react-signup-form" target="_blank" className="github_link" title="View Source Code">
                                <Icon type="guthub" />
                            </a>
                        </div>

                    </div>
                </div>
        );
    }
}

Register.propTypes = propTypes;
export default connect(state => ({ appData: state.app }))(Register);
