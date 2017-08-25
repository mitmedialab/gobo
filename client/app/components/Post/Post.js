import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';



const propTypes = {
    post: PropTypes.object.isRequired,
};

class Post extends Component {

    // Facebook post object reference https://developers.facebook.com/docs/graph-api/reference/v2.10/post
    // Facebook type is one of {link, status, photo, video, offer}
    // if type = status, status_type is one of {mobile_status_update, created_note, added_photos, added_video, shared_story, created_group, created_event, wall_post, app_created_story, published_story, tagged_in_photo, approved_friend}

    constructor(props) {
        super(props);
        this.state = {
            flipped:false
        }
        this.flip = this.flip.bind(this);
        this.unFlip = this.unFlip.bind(this);
    }

    makePostContent() {
        const post = this.props.post;
        var text = post.source=='twitter'? (post.content.text || post.content.full_text) : post.content.message || '';
        text = text.replace(new RegExp('↵', 'g'), '<br/>');

        var postContent  = null;

        if (post.source=='facebook') {

            switch (post.content.type) {
                case 'link': {
                    break;
                }
                case  'status': {
                    break;
                }
                case 'photo': {
                    postContent = (
                        <div>
                            <img src={post.content.full_picture || post.content.picture}/>
                        </div>
                    )
                    break;
                }
                case 'video': {
                    postContent = (
                        <div>
                            <video controls poster={post.content.full_picture || post.content.picture}>
                                <source src={post.content.source} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )
                break;
                }
                case 'offer': {

                }
            }
        }
        else {
            const tweet = 'https://twitter.com/intent/tweet?in_reply_to=897819616369573888';
            const retweet = 'https://twitter.com/intent/retweet?tweet_id=897819616369573888';
            const like = 'https://twitter.com/intent/like?tweet_id=897819616369573888';
            // return (<TweetFix tweetId={post.content.id_str} options={{width:'auto', dnt:true, link_color:'#ff3b3f'}}></TweetFix>)
        }

        return (
            <div className="post-content-text">
                <div>
                    {post.content.story}
                </div>
                {text}
                <div className="post-inner-content">
                {postContent}
                </div>
            </div>
        )
    }

    getFromString() {
        const post = this.props.post;
        var from = post.source=='twitter'? post.content.user.name : post.content.from.name
        if (post.source=='facebook' && post.content.post_user && from!=post.content.post_user.name) {
            from += ' ▶ '+ post.content.post_user.name
        }
        return from;
    }

    getDateString() {
        const post = this.props.post;

        const date = post.created_at || post.content.created_at || post.content.created_time;

        const date_moment = moment(date);
        const now = moment()

        if (date_moment.isAfter(now.subtract(24, 'hours'))) {
            return date_moment.fromNow();
        }
        else {
            return date_moment.format('MMM D [at] H:mma')
        }
    }

    flip() {
        this.setState({
            flipped:true
        })
    }

    unFlip() {
        this.setState({
            flipped: false
        })
    }

    render() {
        const post = this.props.post;

        if (!post.content) {
            return <div></div>
        }

        const source = post.source;
        const from = this.getFromString();
        const pic_src = source=='twitter'? post.content.user.profile_image_url_https : post.content.from.picture? post.content.from.picture.data.url : '';

        const dateString = this.getDateString();

        const content = this.makePostContent();
        const flippedClass = this.state.flipped? "flipped": "";

        const srcIconClass = source=='twitter'? "source-icon icon-twitter-squared": "source-icon icon-facebook-squared";
        const sourceLink = source=='twitter'? "https://twitter.com/": "https://www.facebook.com/";

        return (
            <div className="post-container">
            <div className={"flip-container "}>
                <div className={"post flipper "+flippedClass}>
                        <div className="front">
                            <div className="post-content">
                                {this.props.filtered &&
                                <div className="toxicity">
                                    Filtered because: {this.props.filtered_by.toString()}
                                </div>}
                                <div className="post-header">
                                    <img className="img-circle" src={pic_src} />
                                    <div className="post-header-details">
                                        <div className="author">
                                            {from}
                                        </div>
                                        <div className="date">
                                            {dateString}
                                        </div>
                                    </div>
                                </div>
                                {content}
                            </div>
                            <div className="post-footer">
                                <div className="footer-content">
                                <a href={sourceLink} target="_blank" className={srcIconClass}></a>
                                <a className="footer-text" onClick={this.flip}>Why am I seeing this post?</a>
                                </div>
                            </div>
                        </div>


                        <div className="back">
                            <div className="back-content">
                                <div className="toxicity">
                                    Rudeness: {post.toxicity}
                                    <br/>
                                    Gender: {post.gender && post.gender.split('.')[1]}
                                    <br/>
                                    Corporate / Organization: {post.is_corporate!=null && post.is_corporate.toString()}
                                    <br/>
                                    Virality: {post.virality_count}
                                </div>
                            </div>

                            <div className="post-footer">
                                <div className="footer-content">
                                    <i className={srcIconClass}></i>
                                    <a className="footer-text" onClick={this.unFlip}>Back to post</a>
                                </div>
                            </div>
                        </div>
                </div>
            </div>
            </div>
        );
    }
}

Post.propTypes = propTypes;
export default Post;
