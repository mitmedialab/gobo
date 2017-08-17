import requests
from datetime import datetime, timedelta

from twython import Twython
from flask import current_app
import logging
from logging import getLogger
from googleapiclient import discovery
import json

from ..models import User, FacebookAuth, TwitterAuth, Post
from .celery import celery
from ..core import db

logger = getLogger(__name__)


FACEBOOK_POSTS_FIELDS = ['id','caption','created_time','description','from{picture,name,gender,category}','icon','link','message','message_tags','name', 'object_id',
                         'parent_id','permalink_url','picture.type(large)','full_picture','place', 'properties', 'shares', 'source', 'status_type', 'story', 'story_tags' ,
                         'type','updated_time','likes.summary(true)','reactions.summary(true)','comments.summary(true)']

FACEBOOK_URL = 'https://graph.facebook.com/v2.10/'

@celery.task(serializer='json', bind=True)
def get_posts_data_for_all_users(self):
    for user in User.query.all():
        get_tweets_per_user.delay(user.id)
        get_facebook_posts_per_user.delay(user.id)

@celery.task(serializer='json', bind=True)
def get_tweets_per_user(self, user_id):
    db.session.rollback()
    user = User.query.get(user_id)
    if not user or not user.twitter_authorized:
        logger.info('User number {} did not authorize twitter (or does not exist) not fetching any tweets'.format(user_id))
        return
    tweets = []
    try:
        twitter_auth = TwitterAuth.query.filter_by(user_id=user_id).first()
        twitter = Twython(current_app.config['TWITTER_API_KEY'],current_app.config['TWITTER_API_SECRET'],
                          twitter_auth.oauth_token, twitter_auth.oauth_token_secret)
        tweets = twitter.get_home_timeline(count=200)
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
    logger.info('Done getting facebook posts for user {}, total {} posts added to db. {} commits succeeded. '
               '{} commits failed.'.format(user_id, posts_added, commits_succeeded, commits_failed))

def get_news():
    pass

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
    r = requests.get(FACEBOOK_URL+user.facebook_id, payload)
    initial_result = r.json()
    for key in friends_likes.keys():
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
        if not post_item.has_toxicity_rate():
            analyze_toxicity.delay(post_item.id)
    except:
        logger.error('An error adding post {} from tweeter to user {}'.format(post['id'], user.id))
        success = False
    return {'success': success, 'added_new':added_new}

@celery.task(serializer='json', bind=True)
def analyze_toxicity(self, post_id):
    post = Post.query.get(post_id)
    if not post or post.has_toxicity_rate():
        logger.warning("post {} doesn't exist or already has toxicity rate".format(post_id))
        return
    text = post.get_text()

    # Generates API client object dynamically based on service name and version.
    # cache_dicovery=False to silence google file_cache error https://github.com/google/google-api-python-client/issues/299
    service = discovery.build('commentanalyzer', 'v1alpha1', developerKey=current_app.config['GOOGLE_API_KEY'], cache_discovery=False)

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