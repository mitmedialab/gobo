import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { logout } from 'actions/auth';
import { bindActionCreators } from 'redux';
import * as actionCreators from '../../actions/auth';

const propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func,
};

function mapStateToProps(state) {
    return {
        auth: state.auth,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}

class Settings extends Component {

    render() {
        if (!this.props.auth.isAuthenticated) {
            return <Redirect to="/"/>
        }
        return (
            <div>
                <h1>Settings</h1>
                <div>This is the settings page</div>
            </div>
        );
    }
}

Settings.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(Settings);