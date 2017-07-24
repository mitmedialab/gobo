import React, { Component }  from 'react';
import { withRouter } from 'react-router'
import { connect } from 'react-redux';
import queryString from 'query-string';
import { startPostTwitterCallback } from 'actions/twitterLogin';
import Loader from 'components/Loader/Loader';
import Helmet from 'react-helmet';

class TwitterCallback extends Component {
    componentDidMount(){
        const parsed = queryString.parse(this.props.location.search);
        this.props.dispatch(startPostTwitterCallback(parsed));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.callbackLoading && !nextProps.callbackLoading) {
            window.close()
        }
    }

    render() {
        return (
            <div>
                <div> Thanks for authenticating your twitter account!</div>
                <Loader/>
            </div>
        );
    }
};
export default withRouter(connect(state=> ({ callbackLoading: state.twitterLogin.callbackLoading }))(TwitterCallback));