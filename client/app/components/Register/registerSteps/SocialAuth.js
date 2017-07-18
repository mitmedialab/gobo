import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login';
import { postFacebookResponseToServer } from '../../../utils/apiRequests'

class SocialAuth extends Component {

    constructor(props) {
        super(props);
        this.state = {
            facebookSuccess: false,
        };
        this.responseFacebook = this.responseFacebook.bind(this);
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
        if (this.state.facebookSuccess) {
            this.props.onFinish()
        }
    }

    render() {
        let facebook_button_class = "button button_wide ";
        if (this.state.facebookSuccess) {
            facebook_button_class+="disabled"
        }
        let facebook_button_text = this.state.facebookSuccess? "successfully logged in with Facebook" : "Login with Facebook";
        return (
            <div>
                <p>
                    Please Authenticate to your Facebook and Twitter
                    <br/>
                    accounts so we can show you your feed
                </p>

                <FacebookLogin
                    appId="616243291915220"
                    autoLoad={false}
                    fields="name,email,picture"
                    scope="public_profile,user_friends,email,user_actions.news,user_actions.video,user_likes,user_posts,user_religion_politics,user_location"
                    callback={this.responseFacebook}
                    tag="button"
                    cssClass={facebook_button_class}
                    textButton={facebook_button_text}
                    isDisabled={this.state.facebookSuccess}
                />
            </div>

        )
    }
}

export default SocialAuth;