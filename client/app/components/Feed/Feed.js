import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { logout, tryGetUser } from 'actions/auth';
import { getPosts } from 'actions/feed';

import Post from 'components/Post/Post';
import Settings from 'components/Settings/Settings'
import Loader from 'components/Loader/Loader'

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

    constructor(props) {
        super(props);
        this.state = {
            sortByToxicity: false
        }
    }

    componentWillMount() {
        this.props.dispatch(tryGetUser());
        this.props.dispatch(getPosts());
    }

    logout(e) {
        e.preventDefault();
        this.props.dispatch(logout());
    }


    render() {
        if (!this.props.auth.isAuthenticated) {
            return <Redirect to="/"/>
        }
        console.log(this.props.feed.posts);
        const user = this.props.auth.user;
        const posts = this.props.feed.posts;
        if (this.state.sortByToxicity) {
            posts.sort((a,b)=>b.toxicity - a.toxicity);
        }

        const postsHtml = posts.map(post=><Post key={post.id} post={post}/>)
        return (
            <div className={'page'}>



                <div>
                    <button  onClick={(e) => this.logout(e)}> Log Out </button>
                    <Link to="/settings">
                        <button> Settings </button>
                    </Link>
                </div>
                <div className= {'container-fluid'}>
                    <div className= {'row'}>
                        <div className= {'col-md-8'}>

                            <h3>Hi {user.facebook_name} {user.twitter_name && '@'}{user.twitter_name}</h3>
                            <h4>Here is your news feed:</h4>

                            {posts.length==0 && <Loader/>}

                            <div>
                                Feed
                                {postsHtml}
                            </div>
                        </div>

                        <div className= {'col-md-4'}>
                            <Settings/>

                        </div>
                    </div>

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