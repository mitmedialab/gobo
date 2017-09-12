import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import twemoji from 'twemoji'
import twitterText from 'twitter-text'



const propTypes = {
    post: PropTypes.object.isRequired,
};

class PostFooter extends Component {

    render() {
        const text = this.props.flipped? 'Back to post' : 'Why am I seeing this post?';
        const url = this.props.source=='twitter'? "https://twitter.com/": "https://www.facebook.com/";
        const iconClass = this.props.source=='twitter'? "source-icon icon-twitter-squared": "source-icon icon-facebook-squared";
        return (
            <div className="post-footer">
                <div className="footer-content">
                    <a href={url} target="_blank" className={iconClass}></a>
                    <a className="footer-text" onClick={this.props.onFlipClick}>{text}</a>
                </div>
            </div>
        )

    }
}

class LikesCommentsLine extends Component {

    format_num(num) {
        if (num==0) {
            return ''
        }
        else {
             return num > 999 ? (num/1000).toFixed(1) + 'k' : num
        }
    }
    render() {
        let post = this.props.post;
        let content = post.content;
        if (content.retweeted_status) {
            content = content.retweeted_status
        }
        let source = post.source;
        let isFB = source=='facebook';
        let likes = 0;
        let comments = 0;
        let shares = 0;
        let icons = {}
        let links = {}
        if (isFB) {
            likes = content.reactions.summary.total_count || 0
            comments = post.content.comments.summary.total_count || 0
            shares = post.content.shares? post.content.shares.count : 0
            icons = {
                likes: 'icon-thumbs-up',
                comments:'icon-comment-1',
                shares: ' icon-forward-outline'
            }
            links = {
                likes: content.permalink_url,
                comments:content.permalink_url,
                shares: content.permalink_url,
            }
        }
        else {
            likes = content.favorite_count || 0
            shares = post.content.retweet_count || 0

            links = {
                likes: 'https://twitter.com/intent/like?tweet_id='+content.id_str,
                comments:'https://twitter.com/intent/tweet?in_reply_to='+content.id_str,
                shares: 'https://twitter.com/intent/retweet?tweet_id='+content.id_str,
            }

            icons = {
                likes: 'icon-twitter-like',
                comments:'icon-twitter-comment',
                shares: 'icon-twitter_retweet'
            }
        }

        return (
            <div className="post-actions-list">
                <span className="action">
                    <a href={links.comments}>
                        <i className={icons.comments+" action-icon"}></i>
                        <span className="action-count">{this.format_num(comments)}</span>
                    </a>
                </span>
                <span className="action">
                    <a href={links.likes}>
                        <i className={icons.likes+" action-icon"}></i>
                        <span className="action-count">{this.format_num(likes)}</span>
                    </a>
                </span>
                <span className="action">
                    <a href={links.shares}>
                        <i className={icons.shares+" action-icon"}></i>
                        <span className="action-count">{this.format_num(shares)}</span>
                    </a>
                </span>

            </div>
        )
    }

}

class TweetText extends React.Component {
    render () {

        let data = this.props.data;
        let entities = data.entities;
        let text = data.full_text;


        // remove any embedded media links
        if (entities && entities.media) {
            entities.media.forEach( e => {
                text = text.replace(e.url, '')
            })
        }

        // remove any quote links
        if (entities && data.quoted_status) {
            entities.urls.forEach( u => {
                if (u.expanded_url.indexOf('/status/') > -1) {
                    text = text.replace(u.url, '')
                }
            })
        }

        // replace + style links and mentions
        text = twitterText.autoLinkWithJSON(text, (entities || {}), {'usernameIncludeSymbol': true})
        text = text.replace(/href=/g, 'style="text-decoration: none;color:#6CCCF9;" href=')

        // replace + style emoji
        text = twemoji.parse(text)
        text = text.replace(/<img class="emoji"/g, '<img class="emoji" style="height:14px;margin-right:5px;"')
        // browsers add http which causes isomorphic rendering probs
        text = text.replace(/src="\/\/twemoji/g, 'src="http://twemoji')


        const tweetProps = {
            'className': 'tweet-text',
            'dangerouslySetInnerHTML': {
                '__html': text
            }
        }

        return <p {... tweetProps} />
    }
}


class Tweet extends Component {

}

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

    makePostContent(content) {
        const post = this.props.post;

        var text = post.source=='twitter'? <TweetText data={content}/> : content.message || '';

        var postContent  = null;

        if (post.source=='facebook') {

            switch (content.type) {
                case 'link': {
                    break;
                }
                case  'status': {
                    break;
                }
                case 'photo': {
                    postContent = (
                        <div>
                            <img src={content.full_picture || content.picture}/>
                        </div>
                    )
                    break;
                }
                case 'video': {
                    postContent = (
                        <div>
                            <video controls poster={content.full_picture || content.picture}>
                                <source src={content.source} type="video/mp4"/>
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
            // postContent = <TweetText data={post.content}/>
            let MediaComponent = null
            // use Media component if media entities exist
            if (content.entities && content.entities.media) {
                MediaComponent = <Media media={content.entities.media} />
            }

            // extended_entities override, these are multi images, videos, gifs
            if (content.extended_entities && content.extended_entities.media) {
                MediaComponent = <Media media={content.extended_entities.media} />
            }
            postContent = MediaComponent
        }

        return (
            <div className="post-content-text">
                <div>
                    {content.story}
                </div>
                {text}
                <div className="post-inner-content">
                {postContent}
                </div>
            </div>
        )
    }

    getAuthorString(content) {
        const post = this.props.post;
        var from = post.source=='twitter'? content.user.name : post.content.from.name
        if (post.source=='facebook' && content.post_user && from!=content.post_user.name) {
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
        console.log(this.props.post)
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
        const source = post.source;
        let content = post.content;

        let isRT = false;


        if (content.retweeted_status) {
            content = post.content.retweeted_status
            isRT = true;
        }
        const link = source=='twitter'? 'https://twitter.com/statuses/'+content.id_str : content.permalink_url;

        if (!content) {
            return <div></div>
        }


        const from = this.getAuthorString(content);
        let pic_src = ''
        if (source=='twitter') {
            pic_src = content.user.profile_image_url_https
        }
        else {
            pic_src =  content.from.picture? content.from.picture.data.url : '';
        }

        const dateString = this.getDateString();

        const contentElement = this.makePostContent(content);
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
                                    {isRT &&
                                    <div className="rt-comment">
                                        <a href={'https://twitter.com/statuses/'+post.content.id_str}><i className="icon-twitter_retweet"></i>&nbsp;&nbsp;{post.content.user.name} Retweeted</a>
                                    </div>}
                                    <img className="img-circle" src={pic_src} />
                                    <div className="post-header-details">
                                        <div className="author">
                                            {from}
                                        </div>
                                        <div className="date">
                                            <a href={link}>
                                            {dateString}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                                {contentElement}
                                <LikesCommentsLine post={post}/>
                            </div>
                            <PostFooter flipped={false} source={source} onFlipClick={this.flip}/>
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
                                    <br/>
                                    Seriousness: {post.news_score}
                                    <br/>
                                    Contains link: {post.has_link.toString()}
                                </div>
                            </div>

                            <PostFooter flipped={true} source={source} onFlipClick={this.unFlip}/>

                        </div>
                </div>
            </div>
            </div>
        );
    }
}

Post.propTypes = propTypes;
export default Post;

let styles;

class Photos extends React.Component {
    constructor (props, context) {
        super(props, context)
    }

    onClick (idx) {
        //this.context.toggleModal(idx)
    }

    render () {
        let {media} = this.props

        let mediaElements = [], mediaStyle = cloneDeep(styles.AdaptiveMedia)
        if (media.length === 2) mediaStyle.height = '253px';
        if (media.length === 3) mediaStyle.height = '337px';
        if (media.length === 4) mediaStyle.height = '380px';

        // start media loop
        media.forEach( (m, i) => {
            // set initial sizes / styles
            let containStyle = {'width': '100%', 'position': 'relative', 'overflow': 'hidden'}
            let photoStyle = {'width': '100%', 'position': 'relative'}
            let mediaHeight = m.sizes.large.h, mediaWidth = m.sizes.large.w

            /*
             * format single photo
             */
            if (media.length === 1) {
                // 508 is the width of a tweet media wrapper
                // if image is wider than this, it's height will be reduced
                // proportionally, so we adjust our calculation
                if (mediaWidth > 508) {
                    const ratio = (100 / mediaWidth) * 508
                    mediaHeight = mediaHeight * (ratio / 100)
                }

                // check if image is taller than maxHeight, if so
                // center it with a negative top value
                const maxHeight = parseInt(mediaStyle.maxHeight.replace('px', ''))

                if (mediaHeight > maxHeight) {
                    photoStyle.top = `${(maxHeight - mediaHeight) / 2}px`
                }
            }

            /*
             * format two photos
             */
            if (media.length === 2) {
                const maxHeight = 253
                photoStyle.width = 'auto'
                photoStyle.height = '100%'
                containStyle.display = 'inline-block'
                containStyle.height = '100%'
                // give first image 1px margin right and calc width to adjust
                if (i === 0) containStyle.marginRight = '1px'
                containStyle.width = 'calc(50% - .5px)'

                const ratio = (100 / mediaWidth) * (508 /2)
                mediaHeight = mediaHeight * (ratio / 100)

                if (mediaHeight > maxHeight) {
                    photoStyle.top = `${(maxHeight - mediaHeight) / 2}px`
                    photoStyle.width = '100%'
                    photoStyle.height = 'auto'
                } else if (mediaWidth > (508 / 2)) {
                    const ratio = (100 / m.sizes.large.h) * 253
                    mediaWidth = mediaWidth * (ratio / 100)
                    photoStyle.left = `${((508 / 2) - mediaWidth) / 2}px`
                }
            }

            /*
             * format three photos
             */
            if (media.length === 3)  {
                if (i === 0) {
                    const maxHeight = 337
                    containStyle.width = `${100 * (2/3)}%`
                    containStyle.marginRight = '1px'
                    containStyle.height = '337px'
                    containStyle.float = 'left'
                    const firstWrapWidth = 508 * (2 / 3)

                    const ratio = (100 / mediaHeight) * 337
                    mediaWidth = mediaWidth * (ratio / 100)

                    const newRatio = (100 / m.sizes.medium.w) * firstWrapWidth
                    mediaHeight = mediaHeight * (newRatio / 100)

                    if (mediaHeight > maxHeight) {
                        photoStyle.top = `${(maxHeight - mediaHeight) / 2}px`
                    }

                    if (mediaWidth > firstWrapWidth) {
                        photoStyle.width = 'auto'
                        photoStyle.height = '100%'
                        photoStyle.left = `${((508 * (2/3)) - mediaWidth) / 2}px`
                    }
                }
                if (i !== 0) {
                    mediaHeight = m.sizes.medium.h
                    mediaWidth = m.sizes.medium.w
                    const maxHeight = 337 / 2
                    const maxWidth = 508 * 1/3

                    const ratio = (100 / mediaWidth) * maxWidth
                    mediaHeight = mediaHeight * (ratio / 100)

                    if (mediaHeight > maxHeight) {
                        photoStyle.top = `${(maxHeight - mediaHeight) / 2}px`
                    } else if (mediaWidth > maxWidth) {
                        photoStyle.width = 'auto'
                        photoStyle.height = '100%'
                        const newRatio = (100 / m.sizes.medium.h) * maxWidth
                        mediaWidth = mediaWidth * (newRatio / 100)
                        photoStyle.left = `${(maxWidth - mediaWidth) / 2}px`
                    }

                    containStyle.float = 'left'
                    containStyle.marginBottom = '1px'
                    containStyle.height = `calc(100% / 2 - 1px/2)`
                    containStyle.width = `calc(100% / 3 - 1px)`
                }
            }

            /*
             * format four photos
             */
            if (media.length === 4) {
                if (i === 0) {
                    containStyle.width = '75%'
                    containStyle.marginRight = '1px'
                    containStyle.height = '380px'
                    containStyle.float = 'left'
                    const firstWrapWidth = 508 * 0.75
                    const maxHeight = 380

                    const ratio = (100 / mediaHeight) * 380
                    mediaWidth = mediaWidth * (ratio / 100)

                    const newRatio = (100 / m.sizes.medium.w) * firstWrapWidth
                    mediaHeight = mediaHeight * (newRatio / 100)


                    if (mediaHeight > maxHeight) {
                        photoStyle.top = `${(maxHeight - mediaHeight) / 2}px`
                    }

                    if (mediaWidth > firstWrapWidth) {
                        photoStyle.width = 'auto'
                        photoStyle.height = '100%'
                        photoStyle.left = `${((508 * 0.75) - mediaWidth) / 2}px`
                    }
                }
                if (i !== 0) {
                    mediaHeight = m.sizes.medium.h
                    mediaWidth = m.sizes.medium.w
                    const maxHeight = 380 / 3
                    const maxWidth = 508 * 1/4

                    const ratio = (100 / mediaWidth) * maxWidth
                    mediaHeight = mediaHeight * (ratio / 100)

                    if (mediaHeight > maxHeight) {
                        photoStyle.top = `${(maxHeight - mediaHeight) / 2}px`
                    } else if (mediaWidth > maxWidth) {
                        photoStyle.width = 'auto'
                        photoStyle.height = '100%'
                        const newRatio = (100 / m.sizes.medium.h) * maxWidth
                        mediaWidth = mediaWidth * (newRatio / 100)
                        photoStyle.left = `${(maxWidth - mediaWidth) / 2}px`
                    }

                    containStyle.height = 'calc(100% / 3 - 2px/3)'
                    containStyle.marginBottom = '1px'
                    containStyle.float = 'left'
                    containStyle.width = 'calc(25% - 1px)'
                }
            }


            mediaElements.push(
                <div onClick={this.onClick.bind(this, i)} className="AdaptiveMedia-photoContainer" style={containStyle} key={i}>
                    <img src={m.media_url_https} style={photoStyle} />
                </div>
            )
        })
        // end media loop

        return (
            <div className="AdaptiveMedia" style={mediaStyle}>
                {mediaElements}
            </div>
        )
    }
}


class Video extends React.Component {
    render () {
        let {media, gif} = this.props, videoSrc = ''

        media[0].video_info.variants.forEach( v => {
            if (v.url.indexOf('.mp4') > -1) {
                videoSrc = v.url
            }
        })
        let VideoComponent = (
            <video src={videoSrc} controls={!gif} autoPlay={gif} loop={gif} style={styles.video}>
                {'Your browser does not support the '}<code>{'video '}</code>{'element.'}
            </video>
        )

        if (typeof window.videojs !== 'undefined') {
            VideoComponent = (
                <VideoJS src={videoSrc} controls={!gif} autoPlay={gif} loop={gif} style={styles.video}>
                    {'Your browser does not support the '}<code>{'video '}</code>{'element.'}
                </VideoJS>
            )
        }

        return (
            <div className="AdaptiveMedia" style={styles.AdaptiveMedia}>
                {VideoComponent}
                {gif ?
                    <div className="AdaptiveMedia-badge" style={styles.AdaptiveMediaBadge}>
                        GIF
                    </div> : null}
            </div>
        )
    }
}

styles = {
    'AdaptiveMedia': {
        'display': 'inline-block',
        'maxHeight': '506px',
        'margin': '10px 0 0 0',
        'position': 'relative',
        'overflow': 'hidden',
        'borderRadius': '5px',
        'verticalAlign': 'top',
        'width': '100%'
    },
    'AdaptiveMediaBadge': {
        'background': 'rgba(0, 0, 0, 0.3)',
        'borderRadius': '3px',
        'bottom': '8px',
        'boxSizing': 'border-box',
        'MozBoxSizing': 'border-box',
        'color': '#fff',
        'height': '20px',
        'lineHeight': '20px',
        'fontWeight': '700',
        'padding': '0 5px',
        'position': 'absolute',
        'zIndex': 1
    },
    'video': {
        'width': '100%'
    },
}


class Media extends React.Component {
    render () {
        switch (this.props.media[0].type) {
            case 'photo':
                return <Photos {... this.props} />
            // case 'video':
            //     return <Video {... this.props} />
            // case 'animated_gif':
            //     return <Video gif={true} {... this.props} />
            default:
                return <div />
        }
    }
}

const cloneDeep = obj => {
    var copy

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date()
        copy.setTime(obj.getTime())
        return copy
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = []
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = cloneDeep(obj[i])
        }
        return copy
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {}
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = cloneDeep(obj[attr])
        }
        return copy
    }

    throw new Error("Unable to copy obj! Its type isn't supported.")
}
