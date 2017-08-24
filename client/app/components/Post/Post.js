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
        const date = post.created_at || post.content.created_at || post.content.created_time;

        // try catch since Safari don't support Intl
        //todo: fix this with Intl.js or make sure date formatting looks good in safari
        try {
            return new Intl.DateTimeFormat('en-US', options).format(new Date(date));
        }
        catch (e) {
            //logMyErrors(e); // pass exception object to error handler
            return date
        }

        // return moment(date).fromNow();
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

function tweet_to_html(tweet){
    const use_display_url=true;
    const use_expanded_url=false;
    const expand_quoted_status=false;

    if (tweet.retweeted_status) {
        tweet = tweet.retweeted_status;
    }

    if (tweet.extended_tweet) {
        tweet = tweet.extended_tweet;
    }

    const orig_tweet_text = tweet.full_text || tweet.text;

    const display_text_range = tweet.display_text_range || [0, orig_tweet_text.length];
    const display_text_start = display_text_range[0];
    const display_text_end = display_text_range[1];
    const display_text = orig_tweet_text.slice(display_text_start,display_text_end);
    var prefix_text = orig_tweet_text.slice(0, display_text_start);
    var suffix_text = orig_tweet_text.slice(display_text_end, orig_tweet_text.length);

    if (tweet.entities) {
            //We'll put all the bits of replacement HTML and their starts/ends
            //in this list:
        entities = []

        //Mentions
        if (tweet.entities.user_mentions) {
            tweet.entities.user_mentions.forEach(entity=> {
                const temp = {};
                temp['start'] = entity['indices'][0]
                temp['end'] = entity['indices'][1]

                const mention_html = <a href={'https://twitter.com/' + entity.screen_name}
                                  class="tweet-mention">@{entity.screen_name}</a>

                if (display_text_start <= temp['start'] <= display_text_end) {
                    temp['replacement'] = mention_html
                    entities.push(temp)
                }
                else {
                    prefix_text = prefix_text.replace(sub_expr, mention_html)
                }
            })
        }

        //Hashtags
        if (tweet.entities.hashtags) {
            tweet.entities.hashtags.forEach(entity => {
                const temp = {}
                temp['start'] = entity['indices'][0];
                temp['end'] = entity['indices'][1];

                const url_html = <a href={'https://twitter.com/search?q=%%23' + entity.text}
                   class="tweet-hashtag">#{entity.text}</a>

                temp['replacement'] = url_html
                entities.push(temp)
            })
        }

        //Symbols
        if (tweet.entities.symbols) {
            tweet.entities.symbols.forEach(entity => {
                const temp = {}
                temp['start'] = entity['indices'][0]
                temp['end'] = entity['indices'][1]

                const url_html = <a href={'https://twitter.com/search?q=%%24' + entity.text}
                                    class="tweet-symbol">${entity.text}</a>

                temp['replacement'] = url_html
                entities.push(temp)
            })
        }

        //URLs
        if (tweet.entities.urls) {
            tweet.entities.urls.forEach(entity => {
                const temp = {};
                temp['start'] = entity['indices'][0];
                temp['end'] = entity['indices'][1];

                if (use_display_url&& entity.display_url && !use_expanded_url) {
                    const shown_url = entity['display_url']
                }
                else if (use_expanded_url && entity.expanded_url) {
                    const shown_url = entity['expanded_url']
                }
                else {
                    const shown_url = entity['url']
                }

                const url_html = <a href={entity.url} class="tweet-url">{shown_url}</a>

                if (display_text_start <= temp['start'] <= display_text_end) {
                    temp['replacement'] = url_html
                    entities.push(temp)
                }
            else{
                suffix_text = suffix_text.replace(orig_tweet_text.slice(temp['start'],temp['end']),url_html)

        }
        //Media
        if (tweet.entities.media) {
            tweet.entities.media.forEach(entity => {
                const temp = {}
                temp['start'] = entity['indices'][0]
                temp['end'] = entity['indices'][1]
                if (use_display_url && entity.display_url && !use_expanded_url) {
                    const shown_url = entity['display_url']
                }
                else if (use_expanded_url && entity.expanded_url) {
                    const shown_url = entity['expanded_url']
                }
                else {
                    const shown_url = entity['url']
                }

                const url_html = <a href={entity.url} class="url-media">shown_url</a>

                if (display_text_start <= temp['start'] <= display_text_end) {
                    temp['replacement'] = url_html
                    entities.push(temp)
                }
                else{
                    suffix_text = suffix_text.replace(orig_tweet_text.slice(temp['start'],temp['end']), url_html)

                }

            })
        }
// //Now do all the replacements, starting from the end, so that the start/end indices still work:
//         for entity in sorted(entities, key=lambda e: e['start'], reverse=True):
//     display_text = display_text[0:entity['start']] + entity['replacement'] + display_text[entity['end']:]
//
//     quote_text = ''
//     if expand_quoted_status and tweet.get('is_quote_status') and tweet.get('quoted_status'):
//     quoted_status = tweet['quoted_status']
//     quote_text += '<blockquote class="twython-quote">%(quote)s<cite><a href="%(quote_tweet_link)s">' \
//                     '<span class="twython-quote-user-name">%(quote_user_name)s</span>' \
//                     '<span class="twython-quote-user-screenname">@%(quote_user_screen_name)s</span></a>' \
//                     '</cite></blockquote>' % \
//                     {'quote': Twython.html_for_tweet(quoted_status, use_display_url, use_expanded_url, False),
//                         'quote_tweet_link': 'https://twitter.com/%s/status/%s' %
//                     (quoted_status['user']['screen_name'], quoted_status['id_str']),
//                         'quote_user_name': quoted_status['user']['name'],
//                         'quote_user_screen_name': quoted_status['user']['screen_name']}
//
//     return '%(prefix)s%(display)s%(suffix)s%(quote)s' % {
//             'prefix': '<span class="twython-tweet-prefix">%s</span>' % prefix_text if prefix_text else '',
//             'display': display_text,
//             'suffix': '<span class="twython-tweet-suffix">%s</span>' % suffix_text if suffix_text else '',
//             'quote': quote_text
//         }

}

Post.propTypes = propTypes;
export default Post;
