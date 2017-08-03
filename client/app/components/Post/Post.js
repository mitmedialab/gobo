import React, { Component } from 'react';
import PropTypes from 'prop-types';


const propTypes = {
    post: PropTypes.object.isRequired,
};

class Post extends Component {

    render() {
        const post = this.props.post;
        const type = post.source;
        const text = type=='twitter'? post.content.text : post.content.message;
        const from = type=='twitter'? '@'+post.content.user.name : post.content.from.name
        const pic_src = type=='twitter'? post.content.user.profile_image_url_https : post.content.from.picture? post.content.from.picture.data.url : '';
        return (
            <div className="post">
                <div className="date">
                    {post.content.created_at || post.content.created_time} on {type}
                </div>
                <div className="author">
                    <img src={pic_src} />
                    {from}:
                </div>
                <div>
                    <div>
                        {post.content.story}
                    </div>
                    {text}
                </div>
            </div>
        );
    }
}

Post.propTypes = propTypes;
export default Post;
