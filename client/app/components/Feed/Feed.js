import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { logout } from 'actions/auth';
import { getPosts } from 'actions/feed';

const propTypes = {
    auth: PropTypes.object.isRequired,
    logout: PropTypes.func,
    dispatch: PropTypes.func,
    feed: PropTypes.object
};

function mapStateToProps(state) {
    return {
        auth: state.auth,
        feed: state.feed,
    };
}

class Feed extends Component {

    componentWillMount() {
        this.props.dispatch(getPosts())
    }

    logout(e) {
        e.preventDefault();
        this.props.logout();
    }

    render() {
        if (!this.props.auth.isAuthenticated) {
            return <Redirect to="/"/>
        }
        console.log(this.props.feed.posts)
        const posts = this.props.feed.posts.map(post=>(
            <div key={post.id}>
                {post.content.text}
            </div>))
        return (
            <div className={'page'}>

                <h1>News Feed</h1>
                <div>
                    {posts}
                </div>
                <button  onClick={(e) => this.logout(e)}> Log Out </button>
                <Link to="/settings">
                    <button> Settings </button>
                </Link>
            </div>
        );
    }
}

Feed.propTypes = propTypes;
export default connect(mapStateToProps)(Feed);