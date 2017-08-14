import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

const propTypes = {
    auth: PropTypes.object.isRequired,

};

function mapStateToProps(state) {
    return {
        auth: state.auth,
    };
}


class Profile extends Component {
    render() {
        console.log(this.props)
        if (!this.props.auth.isAuthenticated) {
            return <Redirect to="/"/>
        }
        //todo: remove inline styles
        const user = this.props.auth.user ;
        const avatar = user.avatar || '/images/avatar.png';
        return (
            <div className={'page'}>
                <div className= {'container-fluid'} style={{'textAlign': 'center'}}>
                    <h3> My Profile Page</h3>
                    <div className= {'row'} >
                        <img src={avatar} style={{'maxHeight':'60px'}}/>
                    </div>
                    <div className= {'row'}>
                        <div>{user.facebook_name}</div>
                        <div>{(user.twitter_name && '@') + user.twitter_name}</div>
                    </div>
                    <div>
                        <Link to="/feed">
                            <button className="button"> Back to my feed</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}


Profile.propTypes = propTypes;
export default connect(mapStateToProps)(Profile);