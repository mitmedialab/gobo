from twython import Twython
from flask import current_app
from logging import getLogger

from ..models import User, FacebookAuth, TwitterAuth, Post
from .celery import celery
from ..core import db

logger = getLogger(__name__)

@celery.task(serializer='json', bind=True)
def get_tweets_per_user(self, user_id):
    try:
        twitter_auth = TwitterAuth.query.filter_by(user_id=user_id).first()
        twitter = Twython(current_app.config['TWITTER_API_KEY'],current_app.config['TWITTER_API_SECRET'],
                          twitter_auth.oauth_token, twitter_auth.oauth_token_secret)
        tweets = twitter.get_home_timeline()
        user = User.query.get(user_id)
        posts_added = 0
        for tweet in tweets:
            try:
                tweet_id = str(tweet['id'])
                post = Post.query.filter_by(original_id=tweet_id, source='twitter').first()
                if not post:
                    post = Post(tweet_id, 'twitter', tweet, False)
                    db.session.add(post)
                    posts_added+=1
                user.posts.append(post)
            except:
                logger.error('An error adding post {} from tweeter to user {}'. format(tweet['id'], user_id))
        db.session.commit()
    except:
        logger.error('An error occurred while getting tweets for user {}, no tweets added to db'.format(user_id))


def get_posts_per_user(self, user_id):
    pass

def get_news():
    pass