import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { logout, tryGetUser } from 'actions/auth';
import { getPosts, getSettings } from 'actions/feed';
import ReactList from 'react-list';

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
            showFiltered: false,
            processing: false,
            minimizedSettings: false,
        }
        this.toggleShowFiltered = this.toggleShowFiltered.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(tryGetUser());
        this.props.dispatch(getPosts());
        this.props.dispatch(getSettings());
    }


    toggleShowFiltered() {
        this.setState ({
            showFiltered: !this.state.showFiltered
        })
    }

    toggleSettings() {
        this.setState( {
            minimizedSettings: !this.state.minimizedSettings
        })
    }


    render() {
        if (!this.props.auth.isAuthenticated) {
            return <Redirect to="/"/>
        }
        const posts = this.props.feed.posts;
        const filtered_posts = this.props.feed.filtered_posts;
        const showing = this.state.showFiltered? 'filtered' : 'kept';

        const filtered_text = this.state.showFiltered? 'Showing filtered posts.' : filtered_posts.filtered.length +' posts filtered out of your feed.'
        const filtered_link_text = this.state.showFiltered? '  Back to my feed.' : '  Show me what was taken out.';

        // if (this.props.feed.sort_by) {
        //     filtered_posts[showing].sortOn(this.props.feed.sort_by);
        //     if (this.props.feed.sort_reverse) {
        //         filtered_posts[showing].reverse()
        //     }
        // }


        const postsHtml = filtered_posts[showing].map(post=><Post
            key={post.id} post={post} filtered={this.state.showFiltered} filtered_by={filtered_posts.reasons[post.id]}
            virality_max={this.props.feed.filtered_posts.virality_max} virality_avg={this.props.feed.filtered_posts.virality_avg}
        />)
        return (
            <div className="container-fluid">
                <div className={'row'}>
                    <div className={this.state.minimizedSettings? "feed wide": "feed"}>


                        {!this.props.feed.loading_posts && this.props.feed.posts.length==0 &&
                        <div>
                            We couldn't find any posts for your feed.
                            <br/>
                            Did you authenticate your secial media accounts?
                            <br/>
                            You can go to your profile page to add Facebook or Twitter
                            <br/>
                            If you did authenticate - try refreshing this page
                        </div>}

                        <div className="posts">

                            {this.props.feed.loading_posts &&
                            <div>
                                <div className="filtered-text">Hold on while we are fetching you feed</div>
                                <Loader/>
                            </div>}

                            {posts.length>0 &&
                            <div className="filtered-text">
                                <span className="filtered-count">{filtered_text}</span><a onClick={this.toggleShowFiltered} className="filtered-link">{filtered_link_text}</a>

                            </div>}
                            <ReactCSSTransitionGroup
                                transitionName="example"
                                transitionEnterTimeout={500}
                                transitionLeaveTimeout={300}>
                                {postsHtml}
                            </ReactCSSTransitionGroup>

                        </div>

                    </div>
                    <div className={this.state.minimizedSettings? "sidebar minimized": "sidebar"}>
                        <Settings neutralFB={filtered_posts.fb} onMinimize={this.toggleSettings} minimized={this.state.minimizedSettings}/>
                    </div>
                </div>
            </div>
        );
    }
}

Feed.propTypes = propTypes;
export default connect(mapStateToProps)(Feed);

//
// Array.prototype.sortOn = function(key){
//     this.sort(function(a, b){
//         if(b[key] < a[key]){
//             return -1;
//         }else if(b[key] > a[key]){
//             return 1;
//         }
//         return 0;
//     });
// }