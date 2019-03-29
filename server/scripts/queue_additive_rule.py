import os
import logging

import click
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from twython import Twython

from server.config.config import config_map
from server.models import AdditiveRule, Post, PostAdditiveRule
import server.scripts.tasks as tasks

logger = logging.getLogger(__name__)
config = config_map[os.getenv('FLASK_ENV', 'dev').lower()]
engine = create_engine(config.SQLALCHEMY_DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()


@click.command()
@click.option('--rule-id', required=True, type=int, help='ID of user rule to share')
def queue_additive_rule(rule_id):
    """Fetches posts for this rule to be analyzed. Only Twitter is supported currently."""
    max_posts = 1

    for link in session.query(AdditiveRule).filter_by(id=rule_id).first().additive_links:
        if link.source == 'twitter':
            obj = {'id': link.uri.replace('https://twitter.com/', '')}
            try:
                twitter = Twython(config.TWITTER_API_KEY, config.TWITTER_API_SECRET)
                tweets = twitter.get_user_timeline(screen_name=obj['id'], count=max_posts, tweet_mode='extended')
            except:
                tweets = []

            for post in tweets:
                post_id = post['id_str'] if 'id_str' in post else str(post['id'])
                post_item = session.query(Post).filter_by(original_id=post_id, source=link.source).first()
                if not post_item:
                    post_item = Post(post_id, link.source, post, False)
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
