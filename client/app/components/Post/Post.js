import React, { Component } from 'react';
import PropTypes from 'prop-types';


const propTypes = {
    post: PropTypes.object.isRequired,
};

class Post extends Component {

    // Facebook post object reference https://developers.facebook.com/docs/graph-api/reference/v2.10/post
    // Facebook type is one of {link, status, photo, video, offer}
    // if type = status, status_type is one of {mobile_status_update, created_note, added_photos, added_video, shared_story, created_group, created_event, wall_post, app_created_story, published_story, tagged_in_photo, approved_friend}

    makePostContent() {
        const post = this.props.post;
        var text = post.source=='twitter'? post.content.text : post.content.message || '';
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
                            <img width="100%" src={post.content.full_picture || post.content.picture}/>
                        </div>
                    )
                    break;
                }
                case 'video': {
                    postContent = (
                        <div>
                            <video controls poster={post.content.full_picture || post.content.picture}>
                                <source src={post.content.source} />
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

        return (
            <div>
                <div>
                    {post.content.story}
                </div>
                {text}
                <div className="post-inner-content">
                {postContent}
                </div>
                <div className="toxicity">
                    Toxicity: {post.toxicity}
                </div>
            </div>
        )
    }

    getFromString() {
        const post = this.props.post;
        var from = post.source=='twitter'? '@'+post.content.user.name : post.content.from.name
        if (post.source=='facebook' && post.content.post_user &&  post.content.status_type=='wall_post' && post.content.from.name!=post.content.post_user.name) {
            from += ' ▶ '+ post.content.post_user.name
        }
        return from;
    }

    getDateString() {
        const post = this.props.post;
        const options = {
            weekday: "long", year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        };
        const date = post.content.created_at || post.content.created_time
        return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
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

        return (
            <div className="post">
                <div className="post-header">
                    <div className="avatar">
                        <img src={pic_src} />
                    </div>
                    <div className="post-header-details">
                        <div className="author">
                            {from}
                        </div>
                        <div className="date">
                            {dateString} <span className="badge">{source}</span>
                        </div>
                    </div>
                </div>

                {content}
            </div>
        );
    }
}

Post.propTypes = propTypes;
export default Post;
