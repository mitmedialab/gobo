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
            sortByToxicity: false,
            // FBInit: false
        }
        this.sortByToxicityClick = this.sortByToxicityClick.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(tryGetUser());
        this.props.dispatch(getPosts());
    }

//     componentDidMount() {
//     window.fbAsyncInit = function() {
//         FB.init({
//             appId      : '<YOUR_APP_ID>',
//             cookie     : true,  // enable cookies to allow the server to access
//             // the session
//             xfbml      : true,  // parse social plugins on this page
//             version    : 'v2.1' // use version 2.1
//         });
//
//         // Now that we've initialized the JavaScript SDK, we call
//         // FB.getLoginStatus().  This function gets the state of the
//         // person visiting this page and can return one of three states to
//         // the callback you provide.  They can be:
//         //
//         // 1. Logged into your app ('connected')
//         // 2. Logged into Facebook, but not your app ('not_authorized')
//         // 3. Not logged into Facebook and can't tell if they are logged into
//         //    your app or not.
//         //
//         // These three cases are handled in the callback function.
//         // FB.getLoginStatus(function(response) {
//         //     this.statusChangeCallback(response);
//         // }.bind(this));
//         this.setState({
//             FBInit: true
//         })
//     }.bind(this);
//
//     // Load the SDK asynchronously
//     (function(d, s, id) {
//         var js, fjs = d.getElementsByTagName(s)[0];
//         if (d.getElementById(id)) return;
//         js = d.createElement(s); js.id = id;
//         js.src = "//connect.facebook.net/en_US/sdk.js";
//         fjs.parentNode.insertBefore(js, fjs);
//     }(document, 'script', 'facebook-jssdk'));
// }

    logout(e) {
        e.preventDefault();
        this.props.dispatch(logout());
    }

    sortByToxicityClick() {
        this.setState({
            sortByToxicity: !this.state.sortByToxicity
        })
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
            <div className="container-fluid">
                <div className={'row'}>
                    <div className="col-sm-9 col-md-9 feed">
                        {posts.length==0 && <Loader/>}

                        <div className="posts">
                            {postsHtml}
                        </div>

                    </div>
                    <div className={"col-sm-3 col-md-3 sidebar"}>
                        <Settings sortByToxicity={this.state.sortByToxicity} onButtonClick={this.sortByToxicityClick}/>
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