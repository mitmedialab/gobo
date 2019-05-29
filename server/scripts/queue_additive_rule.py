import os
import logging
from datetime import datetime, timedelta
from urllib.parse import urljoin

import requests
import click
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from twython import Twython

# pylint: disable=no-name-in-module,import-error
from server.config.config import config_map
from server.models import AdditiveRule, Post, PostAdditiveRule
import server.scripts.tasks as tasks

logger = logging.getLogger(__name__)
config = config_map[os.getenv('FLASK_ENV', 'dev').lower()]
engine = create_engine(config.SQLALCHEMY_DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()


def get_tweets(max_posts, link):
    obj = {'id': link.uri.replace('https://twitter.com/', '')}
    try:
        twitter = Twython(config.TWITTER_API_KEY, config.TWITTER_API_SECRET)
        tweets = twitter.get_user_timeline(screen_name=obj['id'], count=max_posts, tweet_mode='extended')
    except:
        tweets = []
    return tweets


def get_facebook_posts(max_posts, link):
    data = {'id': link.uri.replace('https://www.facebook.com/', '')}
    url = urljoin(tasks.FACEBOOK_URL, data['id'].strip('/') + '/feed')
    facebook_query = {
        'fields': ','.join(tasks.FACEBOOK_POSTS_FIELDS),
        'access_token': '{}|{}'.format(config.FACEBOOK_APP_ID, config.FACEBOOK_APP_SECRET),
        'since': (datetime.now() - timedelta(days=2)).strftime('%Y-%m-%d'),
        'limit': max_posts,
    }

    r = requests.get(url, facebook_query, timeout=config.DEFAULT_REQUEST_TIMEOUT)
    posts = []
    try:
        result = r.json()
    except ValueError:
        logger.warning("Unable to parse {}".format(url))
    if 'error' in result:
        logger.warning(" unable to fetch FB data - error {} - {}".format(
            result['error']['type'], result['error']['message']))
    else:
        logger.info(" adding {} facebook posts".format(len(result['data'])))
        if 'data' in result:
            posts = [dict(p, **{'post_user': data}) for p in result["data"]]
    return posts


@click.command()
@click.option('--rule-id', required=True, type=int, help='ID of rule to share')
@click.option('--level', required=False, type=int, default=None,
              help='Level of sources to queue (defaults to all if not set)')
def queue_additive_rule(rule_id, level):
    """Fetches posts for this rule to be analyzed. Only Facebook and Twitter are supported currently."""
    max_posts = 3

    if level is None:
        links = session.query(AdditiveRule).filter_by(id=rule_id).first().additive_links
    else:
        links = [link for link in session.query(AdditiveRule).filter_by(id=rule_id).first().additive_links
                 if link.level == level]

    for link in links:
        if link.source == 'twitter':
            posts = get_tweets(max_posts, link)
        elif link.source == 'facebook':
            posts = get_facebook_posts(max_posts, link)

        for post in posts:
            post_id = post['id_str'] if 'id_str' in post else str(post['id'])
            post_item = session.query(Post).filter_by(original_id=post_id, source=link.source).first()
            if not post_item:
                post_item = Post(post_id, link.source, post)
                session.add(post_item)
                session.commit()
                tasks.analyze_post.delay(post_item.id)

            association = session.query(PostAdditiveRule).filter_by(
                rule_id=link.rule_id, post_id=post_item.id).first()
            if not association:
                association = PostAdditiveRule(link.rule_id, post_item.id, link.level)
                session.add(association)
                session.commit()


if __name__ == '__main__':
    # pylint: disable=no-value-for-parameter
    queue_additive_rule()
