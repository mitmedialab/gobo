from datetime import datetime, timedelta
from logging import getLogger
import os

import json
import requests

from twython import Twython
from flask import current_app
from raven import Client
from mastodon import Mastodon, MastodonAPIError

import analyze_modules

# pylint: disable=no-name-in-module,import-error
from server.config.config import config_map
from ..models import User, TwitterAuth, Post, MastodonAuth
from .celery import celery
from ..core import db

from .name_gender import NameGender
from .gender_classifier.NameClassifier_light import NameClassifier

logger = getLogger(__name__)

if config_map['prod'].SENTRY_DSN_WORKER:
    client = Client(config_map['prod'].SENTRY_DSN_WORKER)

env = os.getenv('FLASK_ENV', 'dev')
config_type = env.lower()
config = config_map[config_type]


FACEBOOK_POSTS_FIELDS = ['id', 'caption', 'created_time', 'description',
                         'from{picture,name,gender}', 'icon', 'link',
                         'message', 'message_tags', 'name', 'object_id',
                         'parent_id', 'permalink_url', 'picture', 'full_picture',
                         'place', 'properties', 'shares', 'source',
                         'status_type', 'story', 'story_tags',
                         'type', 'updated_time', 'likes.summary(true)',
                         'reactions.summary(true)', 'comments.summary(true)']

"""
    Add here for any new type of filter
    Add the processing to server.scripts.analyze_modules.analyze_<analysis_type>
"""
ANALYSIS_TYPES = ['toxicity', 'gender_corporate', 'virality', 'news_score']
FACEBOOK_URL = 'https://graph.facebook.com/v2.10/'


name_gender_analyzer = NameGender()
name_classifier = NameClassifier()


@celery.task(serializer='json', bind=True)
def get_posts_data_for_all_users(self):  # pylint: disable=unused-argument
    for user in User.query.all():
        if user.twitter_authorized:
            get_tweets_per_user.delay(user.id)
        if user.facebook_authorized:
            get_facebook_posts_per_user.delay(user.id)
        if user.mastodon_authorized:
            get_mastodon_posts_per_user.delay(user.id)


@celery.task(serializer='json', bind=True)
def get_mastodon_posts_per_user(self, user_id): # pylint: disable=unused-argument
    current_auth = db.session.query(MastodonAuth).filter(MastodonAuth.user_id == user_id).first()
    mastodon_app = current_auth.app
    posts = []
    try:
        mastodon = Mastodon(
            access_token=current_auth.access_token,
            api_base_url=mastodon_app.base_url(),
        )
        max_limit = 40  # mastodon default limit is 40
        posts = mastodon.timeline_home(limit=max_limit)
    except MastodonAPIError:
        logger.error('Error fetching Mastodon timeline from user {}'.format(user_id))

    # only bring in publicly accessible posts
    posts = [post for post in posts if post['visibility'] in ['public', 'unlisted']]

    # the mastodon posts contain serialized datetime objects (which can't be saved as JSON)
    posts = [json.loads(json.dumps(post, default=str)) for post in posts]

    _add_posts(user_id, posts, 'mastodon')


@celery.task(serializer='json', bind=True)
def get_tweets_per_user(self, user_id): # pylint: disable=unused-argument
    user = User.query.get(user_id)
    if not user or not user.twitter_authorized:
        # pylint: disable=line-too-long
        logger.info('User number {} did not authorize twitter (or does not exist) not fetching any tweets'.format(user_id))
        return
    tweets = []
    try:
        twitter_auth = TwitterAuth.query.filter_by(user_id=user_id).first()
        twitter = Twython(current_app.config['TWITTER_API_KEY'], current_app.config['TWITTER_API_SECRET'],
                          twitter_auth.oauth_token, twitter_auth.oauth_token_secret)
        tweets = twitter.get_home_timeline(count=200, tweet_mode='extended')
    except:
        logger.error('There was an error fetching twitter timeline from user {}'.format(user_id))

    # filter out protected posts
    tweets = [tweet for tweet in tweets if not tweet['user']['protected']]
    _add_posts(user_id, tweets, 'twitter')


@celery.task(serializer='json', bind=True)
def get_facebook_posts_per_user(self, user_id): # pylint: disable=unused-argument
    user = User.query.get(user_id)
    if not user or not user.facebook_authorized or not user.facebook_auth:
        # pylint: disable=line-too-long
        logger.info('User number {} did not authorize facebook (or does not exist) not fetching any posts'.format(user_id))
        return
    posts = _get_facebook_posts(user)
    _add_posts(user_id, posts, 'facebook')


def _get_facebook_posts(user):
    friends_likes = _get_facebook_friends_and_likes(user)
    N = 2
    MAX_POST = 5
    date_N_days_ago = datetime.now() - timedelta(days=N)
    since_date = date_N_days_ago.strftime('%Y-%m-%d')
    posts = []
    payload = {
        'fields': ','.join(FACEBOOK_POSTS_FIELDS),
        'access_token': user.facebook_auth.access_token,
        'since': since_date,
        'limit': MAX_POST,
    }
    # pylint: disable=consider-iterating-dictionary
    for key in friends_likes.keys():
        for obj in friends_likes[key]:
            r = requests.get(FACEBOOK_URL + obj['id'] + '/feed', payload, timeout=config.DEFAULT_REQUEST_TIMEOUT)
            result = r.json()
            if 'data' in result:
                posts.extend([dict(p, **{'post_user': obj}) for p in result["data"]])
            # while 'paging' in result and 'next' in result['paging']:
            #     r = requests.get(result['paging']['next'])
            #     result = r.json()
            #     if 'data' in result:
            #         posts.extend(result["data"])
    return posts


def _get_facebook_friends_and_likes(user):
    payload = {'fields': 'friends.summary(true),likes.summary(true)',
               'access_token': user.facebook_auth.access_token}
    friends_likes = {'friends': [], 'likes': []}
    try:
        r = requests.get(FACEBOOK_URL+user.facebook_id, payload, timeout=config.DEFAULT_REQUEST_TIMEOUT)
        initial_result = r.json()
    except:
        logger.error('error getting friends and likes for user {}'.format(user.id))
        # client.captureMessage('error getting friends and likes for user {}'.format(user.id))
    # pylint: disable=consider-iterating-dictionary
    for key in friends_likes.keys():
        if key in initial_result:
            friends_likes[key].extend(initial_result[key]['data'])
            result = initial_result[key]
            while 'paging' in result and 'next' in result['paging']:
                r = requests.get(result['paging']['next'], timeout=config.DEFAULT_REQUEST_TIMEOUT)
                result = r.json()
                friends_likes[key].extend(result['data'])
    return friends_likes


def _add_posts(user_id, posts, source):
    user = User.query.get(user_id)
    posts_added = 0
    commits_failed = 0
    commits_succeeded = 0
    for post in posts:
        result = _add_post(user, post, source)
        posts_added += result['added_new']
        commits_succeeded += result['success']
        commits_failed += not result['success']

    if posts_added:
        user.update_last_post_fetch()

    logger.info('Done getting {} posts for user {}, total {} posts added to db. {} commits succeeded. '
                '{} commits failed.'.format(source, user_id, posts_added, commits_succeeded, commits_failed))


def _add_post(user, post, source):
    added_new = False
    success = False

    try:
        post_id = post['id_str'] if 'id_str' in post else str(post['id'])
        post_item = Post.query.filter_by(original_id=post_id, source=source).first()
        if post_item:
            post_item.update_content(post)
        else:
            post_item = Post(post_id, source, post)
            db.session.add(post_item)
            added_new = True

        if post_item not in user.posts:
            user.posts.append(post_item)
        db.session.commit()
        success = True
        if post_item.has_already_been_analyzed():
            logger.warning("post {} already has all analysis, skipping that step".format(post_id))
        else:
            analyze_post.delay(post_item.id)
    except Exception as e:
        logger.error('An error adding post {} from posts to user {} - {}'.format(post['id'], user.id, str(e)))

    return {'success': success, 'added_new': added_new}


@celery.task(serializer='json', bind=True)
def analyze_post(self, post_id): # pylint: disable=unused-argument
    for analysis_type in ANALYSIS_TYPES:
        getattr(analyze_modules, "analyze_%s" % (analysis_type))(post_id)
    # analyze_toxicity(post_id)
    # analyze_gender_corporate(post_id)
    # analyze_virality(post_id)
    # analyze_news_score(post_id)
