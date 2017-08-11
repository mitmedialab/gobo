import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAuthUrl, waitForTwitterCallback, fetchFacebookAppId } from '../../../actions/twitterLogin';
import { postFacebookResponseToServer} from '../../../utils/apiRequests'


const propTypes = {
    dispatch: PropTypes.func.isRequired,
    twitter_data: PropTypes.object.isRequired,
    onFinish: PropTypes.func.isRequired,
};

const MAX_POLLS = 40;

class SocialAuth extends Component {

    constructor(props) {
        super(props);
        this.state = {
            facebookSuccess: false,
            twitterSuccess: false,
            twitterError: false,
            polling: false,
            pollCount:0,
        };
        this.responseFacebook = this.responseFacebook.bind(this);
        this.onTwitterButtonClick = this.onTwitterButtonClick.bind(this);
        this.facebookAppId = ""
    }

    componentWillMount() {
        this.props.dispatch(fetchFacebookAppId());
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    responseFacebook(response) {
        console.log(response);
        if ('name' in response) {
            this.setState({facebookSuccess:true})
            // dispatch response to server
            postFacebookResponseToServer(response);
        }
        this.isDone();
    }

    isDone() {
        if (this.state.facebookSuccess && this.state.twitterSuccess) {
            this.props.onFinish()
        }
    }

    componentWillReceiveProps(nextProps){
        if (this.props.twitter_data.loading_oauth_url && !nextProps.twitter_data.loading_oauth_url &&
            nextProps.twitter_data.oauth_url!=null ) {
            window.open(nextProps.twitter_data.oauth_url, '_blank', 'width=500,height=500');
            this.props.dispatch(waitForTwitterCallback());
        }
        else if (!this.props.twitter_data.isTwitterAuthorized && nextProps.twitter_data.isTwitterAuthorized) {

            clearTimeout(this.timeout);
            this.setState({
                twitterSuccess: true,
            });
            this.isDone();
        }

        else if (this.state.polling && (!nextProps.twitter_data.isTwitterAuthorized && !nextProps.twitter_data.isFetching)) {
            this.startPoll()
        }
    }

    startPoll() {
        if (this.state.pollCount>MAX_POLLS) {
            this.setState({twitterError: true});
        }
        else {
            this.timeout = setTimeout(() => this.props.dispatch(waitForTwitterCallback()), 1000);
            this.setState({pollCount: this.state.pollCount + 1})
        }
    }


    onTwitterButtonClick() {
        this.props.dispatch(getAuthUrl());
        this.startPoll();
        this.setState({polling: true});
    }

    render() {
        let facebook_button_class = "button button_wide ";
        let twitter_button_class = "button button_wide ";

        if (this.state.facebookSuccess) {
            facebook_button_class+="disabled"
        }

        if (this.state.twitterSuccess) {
            twitter_button_class+="disabled"
        }
        let facebook_button_text = this.state.facebookSuccess? "successfully logged in with Facebook" : "Login with Facebook";
        let twitter_button_text = this.state.twitterSuccess? "successfully logged in with Twitter" : "Login with Twitter";
        if (this.state.twitterError) {
            twitter_button_text = "Error authenticating twitter. Please try again "
        }
        const fbButton  = this.props.twitter_data.facebookAppId? <FacebookLogin
                appId={this.props.twitter_data.facebookAppId}
                autoLoad={false}
                fields="name,email,picture"
                scope="public_profile,user_friends,email,user_likes,user_posts"
                callback={this.responseFacebook}
                tag="button"
                cssClass={facebook_button_class}
                textButton={facebook_button_text}
                isDisabled={this.state.facebookSuccess}
            /> : <div></div>
        return (
            <div>
                <p>
                    Please Authenticate to your Facebook and Twitter
                    <br/>
                    accounts so we can show you your feed
                </p>


                {fbButton}
                <button onClick={this.onTwitterButtonClick} className={twitter_button_class} >{twitter_button_text}</button>
                <div style={{margin:'2em'}}>
                    <p onClick={()=>this.props.onFinish()}>
                        Click here to continue without authentication
                    </p>
                </div>
            </div>

        )
    }
}

SocialAuth.propTypes = propTypes;

export default connect(state => ({ twitter_data: state.twitterLogin }))(SocialAuth);