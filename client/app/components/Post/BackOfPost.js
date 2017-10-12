import React, { Component } from 'react';

const political_enums = {
    1 :'left',
    2: 'center left',
    3: 'center',
    4: 'center right',
    5: 'right'
}

const gender_strings = {
    'male': ' man',
    'female': ' woman',
    'unknown': 'n unknown gender'
}


export default class BackOfPost extends Component {
    rudness_score_to_string(score) {
        if (score<0.3) {
            return 'not rude'
        }
        else if (score<0.65) {
            return 'kind of rude'
        }
        else {
            return 'very rude'
        }
    }

    serious_score_to_string(score) {
        if (score<0.1) {
            return 'not serious'
        }
        else if (score<0.3) {
            return 'not too serious'
        }
        else if (score<0.6) {
            return 'a little serious'
        }
        else if (score<0.7) {
            return 'pretty serious'
        }
        else {
            return 'very serious'
        }
    }
    virality_score_to_string(score) {
        let log_score = Math.log(score+1);
        let virality_avg = this.props.virality_avg;
        let virality_max = this.props.virality_max;
        if (log_score<virality_avg/2){
            return "in the bottom 25% of popular posts"
        }
        else if (log_score<virality_avg){
            return "in the lower middle 25% of popular posts"

        }
        else if (log_score<virality_avg+((virality_max-virality_avg)/2)){
            return "in the upper middle 25% of popular posts"

        }
        else {
            return "in the top 25% of popular posts"

        }

    }
    render() {
        const post = this.props.post;
        const no_content = post.gender=="None" && !post.political_quintile && (post.toxicity==null || post.toxicity==-1) && post.is_corporate==null && post.news_score==null && post.virality_count==null;
        const descriptions = (
            <div>

                {post.gender!="None" &&
                <div className="explanation">
                    <span> <i className="icon icon-gender"/> Posted by a{gender_strings[post.gender.split('.')[1]]}</span>

                </div>
                }
                {post.political_quintile &&
                <div className="explanation">
                    <span> <i className="icon icon-echo"/> From a {political_enums[post.political_quintile]} political view</span>

                </div>
                }
                {post.toxicity!=null && post.toxicity!=-1 &&
                <div className="explanation">
                    <span> <i className="icon icon-toxicity"/> This post is {this.rudness_score_to_string(post.toxicity)}</span>

                </div>
                }
                {post.is_corporate!=null &&
                <div className="explanation">
                    <span> <i className="icon icon-corporate"/> {(post.is_corporate) ? 'Not posted' : 'Posted'} by a brand</span>

                </div>
                }
                {post.news_score!=null &&
                <div className="explanation">
                    <span> <i className="icon icon-seriousness"/> This post is {this.serious_score_to_string(post.news_score)}</span>

                </div>
                }
                {post.virality_count!=null &&
                <div className="explanation">
                    <span> <i className="icon icon-virality"/> This post is {this.virality_score_to_string(post.virality_count)}</span>
                </div>
                }

            </div>
        )
        return (
            <div className="back-content">
                {descriptions}
                {no_content &&
                <div> We are still analyzing this post. You will see information about it shortly</div>}
            </div>
        )
    }

}
