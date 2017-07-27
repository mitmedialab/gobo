import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { logout } from 'actions/auth';
import { getPosts } from 'actions/feed';

import Post from 'components/Post/Post';

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
        this.props.dispatch(logout());
    }

    render() {
        if (!this.props.auth.isAuthenticated) {
            return <Redirect to="/"/>
        }
        console.log(this.props.feed.posts)
        const user = this.props.auth.user
        const posts = shuffle(this.props.feed.posts).map(post=><Post key={post.id} post={post}/>)
        return (
            <div className={'page'}>

                <div>
                    <button  onClick={(e) => this.logout(e)}> Log Out </button>
                    <Link to="/settings">
                        <button> Settings </button>
                    </Link>
                </div>

                <h3>Hi {user.facebook_name} {user.twitter_name && '@'}{user.twitter_name}</h3>
                <h4>Here is your news feed:</h4>

                <div>
                    {posts}
                </div>

            </div>
        );
    }
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    for (let i = a.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
}

Feed.propTypes = propTypes;
export default connect(mapStateToProps)(Feed);