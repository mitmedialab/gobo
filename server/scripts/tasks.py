import requests

from datetime import datetime, timedelta

from twython import Twython
from flask import current_app
from logging import getLogger
from googleapiclient import discovery
import urllib
import csv
from bs4 import BeautifulSoup
import os
from raven import Client
import analyze_modules

from ..models import User, FacebookAuth, TwitterAuth, Post
from ..enums import GenderEnum
from .celery import celery
from ..core import db
from server.enums import PoliticsEnum
from server.config.config import config_map

from .name_gender import NameGender
from .gender_classifier.NameClassifier_light import NameClassifier

logger = getLogger(__name__)

if config_map['prod'].SENTRY_DSN_WORKER:
    client = Client(config_map['prod'].SENTRY_DSN_WORKER)


FACEBOOK_POSTS_FIELDS = ['id','caption','created_time','description',
                         'from{picture,name,gender}','icon','link',
                         'message','message_tags','name', 'object_id',
                         'parent_id','permalink_url','picture','full_picture',
                         'place', 'properties', 'shares', 'source',
                         'status_type', 'story', 'story_tags' ,
                         'type','updated_time','likes.summary(true)',
                         'reactions.summary(true)','comments.summary(true)']
"""
    Add here for any new type of filter
    Add the processing to server.scripts.analyze_modules.analyze_<analysis_type>
"""
ANALYSIS_TYPES = ['toxicity','gender_corporate','virality','news_score']
FACEBOOK_URL = 'https://graph.facebook.com/v2.10/'

basedir = os.path.abspath(os.path.dirname(__file__))
MEDIA_SOURCES_FILE = os.path.join(basedir,'static_data', 'partisan_media_sources.csv')

name_gender_analyzer = NameGender()
name_classifier = NameClassifier()

@celery.task(serializer='json', bind=True)
def get_posts_data_for_all_users(self):
    for user in User.query.all():
        if user.twitter_authorized:
            get_tweets_per_user.delay(user.id)
        if user.facebook_authorized:
            get_facebook_posts_per_user.delay(user.id)


@celery.task(serializer='json', bind=True)
def get_tweets_per_user(self, user_id):
    user = User.query.get(user_id)
    if not user or not user.twitter_authorized:
        logger.info('User number {} did not authorize twitter (or does not exist) not fetching any tweets'.format(user_id))
        return
    tweets = []
    try:
        twitter_auth = TwitterAuth.query.filter_by(user_id=user_id).first()
        twitter = Twython(current_app.config['TWITTER_API_KEY'],current_app.config['TWITTER_API_SECRET'],
                          twitter_auth.oauth_token, twitter_auth.oauth_token_secret)
        tweets = twitter.get_home_timeline(count=200, tweet_mode='extended')
    except:
        logger.error('There was an error fetching  twitter timeline from user {}'.format(user_id))

    posts_added = 0
    commits_failed = 0
    commits_succeeded = 0
    for tweet in tweets:
        result = _add_post(user, tweet, 'twitter')
        posts_added += result['added_new']
        commits_succeeded += result['success']
        commits_failed += not result['success']

    if posts_added:
        user.update_last_post_fetch()

    logger.info('Done getting tweets for user {}, total {} tweets added to db. {} commits succeeded. '
               '{} commits failed.'.format(user_id, posts_added, commits_succeeded, commits_failed))

@celery.task(serializer='json', bind=True)
def get_facebook_posts_per_user(self, user_id):
    user = User.query.get(user_id)
    if not user or not user.facebook_authorized or not user.facebook_auth:
        logger.info('User number {} did not authorize facebook (or does not exist) not fetching any posts'.format(user_id))
        return
    posts = _get_facebook_posts(user)
    posts_added = 0
    commits_failed = 0
    commits_succeeded = 0
    for post in posts:
        result = _add_post(user, post, 'facebook')
        posts_added += result['added_new']
        commits_succeeded += result['success']
        commits_failed += not result['success']

    if posts_added:
        user.update_last_post_fetch()

    logger.info('Done getting facebook posts for user {}, total {} posts added to db. {} commits succeeded. '
               '{} commits failed.'.format(user_id, posts_added, commits_succeeded, commits_failed))

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
        'limit': MAX_POST
    }
    for key in friends_likes.keys():
        for object in friends_likes[key]:
            r = requests.get(FACEBOOK_URL + object['id'] + '/feed', payload)
            result = r.json()
            if 'data' in result:
                posts.extend([dict(p, **{'post_user':object}) for p in result["data"]])
            # while 'paging' in result and 'next' in result['paging']:
            #     r = requests.get(result['paging']['next'])
            #     result = r.json()
            #     if 'data' in result:
            #         posts.extend(result["data"])
    return posts

def _get_facebook_friends_and_likes(user):
    payload = {'fields':'friends.summary(true),likes.summary(true)',
               'access_token': user.facebook_auth.access_token}
    friends_likes = {'friends': [], 'likes': []}
    try:
        r = requests.get(FACEBOOK_URL+user.facebook_id, payload)
        initial_result = r.json()
    except:
        logger.error ('error getting friends and likes for user {}'.format(user.id))
        #client.captureMessage('error getting friends and likes for user {}'.format(user.id))
    for key in friends_likes.keys():
        if key in initial_result:
            friends_likes[key].extend(initial_result[key]['data'])
            result = initial_result[key]
            while 'paging' in result and 'next' in result['paging']:
                r = requests.get(result['paging']['next'])
                result = r.json()
                friends_likes[key].extend(result['data'])
    return friends_likes

def _add_post(user, post, source):
    added_new = False
    try:
        post_id = post['id_str']  if 'id_str' in post else str(post['id'])
        post_item = Post.query.filter_by(original_id=post_id, source=source).first()
        if not post_item:
            post_item = Post(post_id, source, post, False)
            db.session.add(post_item)
            added_new = True
        else:
            post_item.update_content(post)

        if not (post_item in user.posts):
            user.posts.append(post_item)
        db.session.commit()
        success = True
        if not post_item.has_already_been_analyzed():
            analyze_post.delay(post_item.id)
        else:
            logger.warning("post {} already has all analysis, skipping that step".format(post_id))
    except Exception as e:
        logger.error('An error adding post {} from twitter to user {} - {}'.format(post['id'], user.id, str(e)))

        success = False
    return {'success': success, 'added_new':added_new}

def _add_news_post(post, source, quintile):
    added_new = False
    try:
        post_id = post['id_str']  if 'id_str' in post else str(post['id'])
        post_item = Post.query.filter_by(original_id=post_id, source=source).first()
        if not post_item:
            post_item = Post(post_id, source, post, True)
            db.session.add(post_item)
            added_new = True
        else:
            post_item.update_content(post, is_news=True)

        post_item.political_quintile = quintile

        db.session.commit()
        success = True
        analyze_post.delay(post_item.id)
    except:
        logger.error('An error adding post {}'.format(post['id']))
        success = False
    return {'success': success, 'added_new':added_new}

@celery.task(serializer='json', bind=True)
def analyze_post(self, post_id):
    for analysis_type in ANALYSIS_TYPES:
        getattr(analyze_modules,"analyze_%s"%(analysis_type))(post_id)
    #analyze_toxicity(post_id)
    #analyze_gender_corporate(post_id)
    #analyze_virality(post_id)
    #analyze_news_score(post_id)


def get_news_posts(self):
    #facebook requests payload
    N = 2
    MAX_POST = 3
    date_N_days_ago = datetime.now() - timedelta(days=N)
    since_date = date_N_days_ago.strftime('%Y-%m-%d')
    facebook_payload = {
        'fields': ','.join(FACEBOOK_POSTS_FIELDS),
        'access_token': '{}|{}'.format(current_app.config['FACEBOOK_APP_ID'], current_app.config['FACEBOOK_APP_SECRET']),
        'since': since_date,
        'limit': MAX_POST
    }

    with open(MEDIA_SOURCES_FILE) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if (row['Enum_val']):
                quintile = PoliticsEnum(int(row['Enum_val']))
                if row['Twitter Handle']:
                    object = {'id': row['Twitter Handle'].replace('https://twitter.com/', '')}
                    try:
                        twitter = Twython(current_app.config['TWITTER_API_KEY'], current_app.config['TWITTER_API_SECRET'])
                        tweets = twitter.get_user_timeline(screen_name=object['id'], count=MAX_POST, tweet_mode='extended')
                    except:
                        tweets = []
                    for post in tweets:
                        _add_news_post(post, 'twitter', quintile)
                if row['Facebook Page']:
                    #get facebook feed
                    object = {'id': row['Facebook Page'].replace('https://www.facebook.com/', '')}
                    r = requests.get(FACEBOOK_URL + object['id'] + '/feed', facebook_payload)
                    result = r.json()
                    if 'data' in result:
                        for p in result["data"]:
                            post = dict(p, **{'post_user': object})
                            _add_news_post(post, 'facebook', quintile)
