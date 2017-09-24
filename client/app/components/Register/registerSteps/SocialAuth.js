import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FacebookTwitterButtons from 'components/FacebookTwitterButtons/FacebookTwitterButtons'



const propTypes = {
    onFinish: PropTypes.func.isRequired,
};

class SocialAuth extends Component {
    render() {
        return (
            <div>
                <p>
                    Please Authenticate to your Facebook and Twitter
                    <br/>
                    accounts so we can show you your feed
                </p>

                <FacebookTwitterButtons onFinish={this.props.onFinish}/>

            </div>

        )
    }
}

SocialAuth.propTypes = propTypes;

export default connect(state => ({ twitter_data: state.twitterLogin }))(SocialAuth);