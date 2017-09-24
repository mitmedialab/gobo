import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import FacebookTwitterButtons from 'components/FacebookTwitterButtons/FacebookTwitterButtons'

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
        if (!this.props.auth.isAuthenticated) {
            return <Redirect to="/"/>
        }
        //todo: remove inline styles
        const user = this.props.auth.user ;
        console.log(user)
        const avatar = user.facebook_picture_url || user.avatar || '/images/avatar.png';
        return (
            <div className={'page'}>
                <div className= {'profile-content'}>
                    <div className="create_account_screen">
                        <div className="create_account_form">
                            <div className= {'row header'} >
                                <img className="profile-img" src={avatar}/>
                                <div className="profile-info">
                                    <h3> {user.facebook_name || user.twitter_data.name}</h3>
                                    <div>{(user.twitter_name && '@') + user.twitter_name}</div>
                                    <div>{user.twitter_data.description}</div>

                                </div>
                                {/*<div>*/}
                                    {/*Political Affiliation:*/}
                                    {/*<div>*/}
                                        {/*{user.political_affiliation}*/}
                                    {/*</div>*/}
                                    {/*<div>*/}
                                        {/*<button>update</button>*/}
                                    {/*</div>*/}
                                {/*</div>*/}

                                <div>
                                    <FacebookTwitterButtons onFinish={()=>{}}
                                                            facebookConnected={user.facebook_authorized}
                                                            twitterConnected={user.twitter_authorized}/>
                                    <Link to="/feed">
                                        <button className="button button_wide"> Back to my feed</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


Profile.propTypes = propTypes;
export default connect(mapStateToProps)(Profile);