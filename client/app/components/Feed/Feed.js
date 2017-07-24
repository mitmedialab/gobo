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

class Feed extends Component {

    logout(e) {
        e.preventDefault();
        this.props.logout();
    }

    render() {
        if (!this.props.auth.isAuthenticated) {
            return <Redirect to="/"/>
        }
        return (
            <div className={'page'}>

                <h1>Feed</h1>
                <img width={'150px'} src={'images/waves.png'} alt={'Waves'} />
                <div>News feed will appear here</div>
                <button  onClick={(e) => this.logout(e)}> Log Out </button>
                <Link to="/settings">
                    <button> Settings </button>
                </Link>
            </div>
        );
    }
}

Feed.propTypes = propTypes;
export default connect(mapStateToProps, mapDispatchToProps)(Feed);