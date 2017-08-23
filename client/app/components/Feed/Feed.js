import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { logout, tryGetUser } from 'actions/auth';
import { getPosts, getSettings } from 'actions/feed';

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
            showFiltered: false
        }
        this.toggleShowFiltered = this.toggleShowFiltered.bind(this);
    }

    componentWillMount() {
        this.props.dispatch(tryGetUser());
        this.props.dispatch(getPosts());
        this.props.dispatch(getSettings());
    }

    logout(e) {
        e.preventDefault();
        this.props.dispatch(logout());
    }


    filterPosts(settings) {
        var filtered_posts = []
        var kept_posts = []
        const virality_scores = this.props.feed.posts.map(post=>post.virality_count)
        const max_virality = virality_scores.reduce(function(a, b) {
            return Math.max(a, b);
        }, 0);

        this.props.feed.posts.forEach(post=>{
            var keep = true;
            if (post.is_corporate && !settings.include_corporate) {
                keep = false;
            }

            if (post.toxicity!=null && post.toxicity!=-1 && (post.toxicity>settings.rudeness_max || post.toxicity<settings.rudeness_min)) {
                keep=false;
            }
            // const virality_zScore = (post.virality_count - v_mean) / v_standardDeviation;
            // const n_z_score = (virality_zScore - min_z_score)/ (max_z_score - min_z_score)
            const virality_score = post.virality_count *1.0 / max_virality;
            if (virality_score>settings.virality_max || virality_score<settings.virality_min) {
                keep = false;
            }
            if (keep) {
                kept_posts.push(post)
            }
            else {
                filtered_posts.push(post)
            }
        })
        if (settings.gender_filter_on) {
            const kept_female_posts = kept_posts.filter(post => post.gender == 'GenderEnum.female');
            const kept_male_posts = kept_posts.filter(post => post.gender == 'GenderEnum.male');
            const num_posts_to_keep = get_nums_males_females(kept_female_posts.length, kept_male_posts.length ,settings.gender_female_per/100.0)
            // remove female posts
            if (num_posts_to_keep['f']<kept_female_posts.length){
                //remove kept_female_posts.length - num_posts_to_keep['f'] from kept to filtered
                const f_posts_to_remove = kept_female_posts.slice(0,kept_female_posts.length - num_posts_to_keep['f']);
                kept_posts = kept_posts.filter(function (post) {
                    return f_posts_to_remove.indexOf(post) === -1;
                });
                filtered_posts.push(...f_posts_to_remove)
            }
            // remove male posts
            if (num_posts_to_keep['m']<kept_male_posts.length){
                //remove kept_male_posts.length - num_posts_to_keep['m'] from kept to filtered
                const m_posts_to_remove = kept_male_posts.slice(0,kept_male_posts.length - num_posts_to_keep['m']);
                kept_posts = kept_posts.filter(function (post) {
                    return m_posts_to_remove.indexOf(post) === -1;
                });
                filtered_posts.push(...m_posts_to_remove)
            }
        }
        return {kept:kept_posts, filtered:filtered_posts}
    }

    toggleShowFiltered() {
        this.setState ({
            showFiltered: !this.state.showFiltered
        })
    }


    render() {
        if (!this.props.auth.isAuthenticated) {
            return <Redirect to="/"/>
        }
        const posts = this.props.feed.posts;
        const filtered_posts = this.filterPosts(this.props.feed.settings)
        const showing = this.state.showFiltered? 'filtered' : 'kept';

        const filtered_text = this.state.showFiltered? 'Showing filtered posts.' : filtered_posts.filtered.length +' posts filtered out of your feed.'
        const filtered_link_text = this.state.showFiltered? '  Back to my feed.' : '  Show me what was taken out.';

        if (this.props.feed.sort_by) {
            filtered_posts[showing].sortOn(this.props.feed.sort_by);
            if (this.props.feed.sort_reverse) {
                filtered_posts[showing].reverse()
            }
        }


        const postsHtml = filtered_posts[showing].map(post=><Post key={post.id} post={post}/>)
        return (
            <div className="container-fluid">
                <div className={'row'}>
                    <div className="col-sm-9 col-md-9 feed">
                        {posts.length==0 && <Loader/>}


                        <div className="posts">
                            {posts.length>0 &&
                            <div className="filtered-text">
                                <span className="filtered-count">{filtered_text}</span><a onClick={this.toggleShowFiltered} className="filtered-link">{filtered_link_text}</a>

                            </div>}
                            {postsHtml}
                        </div>

                    </div>
                    <div className={"col-sm-3 col-md-3 sidebar"}>
                        <Settings/>
                    </div>
                </div>
            </div>
        );
    }
}

function get_nums_males_females(f, m ,r){
    if (m == 0) {
        if (f == 0){
            // m = 0, f = 0
            return {'f': 0, 'm': 0}
        }
        else {
            //m = 0 f > 0
            return {'f': r*f, 'm':0}
        }
    }
    else if (f == 0) {
        return {'f': 0, 'm':m*r}
    }
    else if (m >= f) {
        if (r==0) {
            return {'f': 0, 'm': m}
        }
        else {
            return {'f': f, 'm':Math.min(((1-r)/r * f), m)}
        }
    }
    else {
        if (r==1) {
            return {'f': f, 'm': 0}
        }
        // m < f
        return {'f': Math.min((r/(1-r) * m), f), 'm':m}
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


Array.prototype.sortOn = function(key){
    this.sort(function(a, b){
        if(a[key] < b[key]){
            return -1;
        }else if(a[key] > b[key]){
            return 1;
        }
        return 0;
    });
}