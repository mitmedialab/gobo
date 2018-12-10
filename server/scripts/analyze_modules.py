"""
    Modules that analyze tweets and Facebook posts
    methods should be of nomenclature: analyze_<type>
    Add type to ANALYSIS_TYPE list in tasks.py

    All methods update and commit to db directly and do not return anything
"""
from logging import getLogger
import urllib

from bs4 import BeautifulSoup
from googleapiclient import discovery
from flask import current_app
import requests

from server.core import db
from server.enums import GenderEnum

from .gender_classifier.NameClassifier_light import NameClassifier
from ..models import Post


logger = getLogger(__name__)
name_classifier = NameClassifier()


def analyze_toxicity(post_id):
    post = Post.query.get(post_id)
    if not post or post.has_toxicity_rate():
        logger.warning("post {} doesn't exist or already has toxicity rate".format(post_id))
        return
    text = post.get_text()

    # Generates API client object dynamically based on service name and version.
    # cache_dicovery=False to silence google file_cache
    # error https://github.com/google/google-api-python-client/issues/299
    service = discovery.build('commentanalyzer', 'v1alpha1',
                              developerKey=current_app.config['GOOGLE_API_KEY'], cache_discovery=False)

    analyze_request = {
        'comment': {'text': text},
        'requestedAttributes': {'TOXICITY': {}},
        'doNotStore': True
    }

    try:
        response = service.comments().analyze(body=analyze_request).execute()
        score = response["attributeScores"]["TOXICITY"]["summaryScore"]["value"]
    except:
        logger.info('could not get toxicity score for post {}'.format(post_id))
        score = -1
    post.update_toxicity(score)


def analyze_gender_corporate(post_id):
    post = Post.query.get(post_id)
    if not post or post.has_gender_corporate():
        logger.warning("post {} doesn't exist or already has gender/corporate".format(post_id))
        return
    is_facebook = post.source == 'facebook'
    gender = GenderEnum.unknown
    corporate = False
    if is_facebook and 'gender' in post.content['from']:
        gender = GenderEnum.fromString(post.content['from']['gender'])
    else:
        result, _conf = name_classifier.predictGenderbyName(post.get_author_name())
        #score = name_gender_analyzer.process(post.get_author_name())
        gender = GenderEnum.fromString(result)
    if post.is_news:
        gender = GenderEnum.unknown
    if gender == GenderEnum.unknown or (is_facebook and 'category' in post.content['from']):
        corporate = True
    post.update_gender_corporate(gender, corporate)


def analyze_virality(post_id):
    post = Post.query.get(post_id)
    if not post or post.has_virality():
        logger.warning("post {} doesn't exist or already has virality".format(post_id))
        return
    is_facebook = post.source == 'facebook'

    likes = post.content['reactions']['summary']['total_count'] if is_facebook else post.content['favorite_count']
    if is_facebook:
        comments = post.content['comments']['summary']['total_count']
    else:
        comments = count_tweet_replies(post.content)
        post.update_replies_count(comments)
    shares = 0
    if is_facebook:
        if 'shares' in post.content:
            shares = post.content['shares']['count']
    else:
        shares = post.content['retweet_count']

    total_reaction = likes+shares+comments
    post.virality_count = max(post.virality_count, total_reaction)
    db.session.commit()


def analyze_news_score(post_id):
    post = Post.query.get(post_id)
    if not post or post.has_news_score():
        logger.warning("post {} doesn't exist or already has news score".format(post_id))
        return

    is_facebook = post.source == 'facebook'
    score = 0
    if post.has_link:
        urls = [post.content['link']] if is_facebook else [x['expanded_url'] for x in post.content['entities']['urls']]
        for url in urls:
            try:
                html = urllib.urlopen(url).read()
            except:
                html = ""
            soup = BeautifulSoup(html, "html.parser")
            # kill all script and style elements
            for script in soup(["script", "style"]):
                script.extract()  # rip it out
            # get text
            text = soup.get_text()
            r = requests.post(current_app.config['NEWS_LABELLER_URL']+'/predict.json', json={'text': text})
            result = r.json()
            if 'taxonomies' in result:
                scores = [float(x['score']) for x in result['taxonomies'] if '/news' in x['label'].lower()]
                scores.append(score)
                score = max(scores)
    else:
        text = post.get_text()
        r = requests.post(current_app.config['NEWS_LABELLER_URL']+'/predict.json', json={'text': text})
        result = r.json()
        if 'taxonomies' in result:
            scores = [float(x['score'])for x in result['taxonomies'] if '/news' in x['label'].lower()]
            score = max(scores) if len(scores) > 0 else 0
    if post.is_news:
        score = min(1, score+0.6)
    post.news_score = score
    db.session.commit()


def count_tweet_replies(tweet): # pylint: disable=unused-argument
    # todo: this is getting to the API rate limit very quickly, find a better way to get replies count
    # twitter_auth = TwitterAuth.query.filter_by(user_id=user_id).first()
    # twitter = Twython(current_app.config['TWITTER_API_KEY'], current_app.config['TWITTER_API_SECRET'],
    #                   twitter_auth.oauth_token, twitter_auth.oauth_token_secret)
    # tweet_user_name = tweet['user']['screen_name']
    # tweet_id = tweet['id_str']
    # try:
    #     results = twitter.cursor(twitter.search, q='to:{}'.format(tweet_user_name), sinceId=tweet_id)
    #     count = len([1 for result in results if result['in_reply_to_status_id_str']==tweet_id])
    # except:
    #     print 'error while counting tweet {} replies'.format(tweet_id)
    #     count = 0
    count = 0
    return count
