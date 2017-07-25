from twython import Twython
from flask import current_app
from logging import getLogger

from ..models import User, FacebookAuth, TwitterAuth
from .celery import celery

logger = getLogger(__name__)

@celery.task(serializer='json', bind=True)
def get_tweets_per_user(self, user_id):
    try:
        twitter_auth = TwitterAuth.query.filter_by(user_id=user_id).first()
        twitter = Twython(current_app.config['TWITTER_API_KEY'],current_app.config['TWITTER_API_SECRET'],
                          twitter_auth.oauth_token, twitter_auth.oauth_token_secret)
        print twitter.get_home_timeline()
    except:
        logger.error('An error occurred while getting tweets for user {}'.format(user_id))


def get_posts_per_user(self, user_id):
    pass

def get_news():
    pass