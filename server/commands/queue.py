import click
import os
from flask.cli import with_appcontext
from twython import Twython

from server.config.config import config_map
from server.core import db
from server.models import AdditiveRule, Post, PostAdditiveRule


@click.command()
@click.option('--rule-id', required=True, type=int, help='ID of user rule to share')
@with_appcontext
def queue_additive_rule(rule_id):
    """Fetches posts for this rule to be analyzed. Only Twitter is supported currently."""

    # scope this within this function only (runs into import problems elsewhere otherwise)
    import server.scripts.tasks as tasks

    config = config_map[os.getenv('FLASK_ENV', 'dev').lower()]
    max_posts = 1

    for link in AdditiveRule.query.filter_by(id=rule_id).first().additive_links:
        if link.source == 'twitter':
            obj = {'id': link.uri.replace('https://twitter.com/', '')}
            try:
                twitter = Twython(config.TWITTER_API_KEY, config.TWITTER_API_SECRET)
                tweets = twitter.get_user_timeline(screen_name=obj['id'], count=max_posts, tweet_mode='extended')
            except:
                tweets = []

            for post in tweets:
                post_id = post['id_str'] if 'id_str' in post else str(post['id'])
                post_item = db.session.query(Post).filter_by(original_id=post_id, source=link.source).first()
                if not post_item:
                    post_item = Post(post_id, link.source, post, False)
                    db.session.add(post_item)
                    db.session.commit()

                    association = PostAdditiveRule(link.rule_id, post_item.id, link.level)
                    db.session.add(association)
                    db.session.commit()

                    tasks.analyze_post.delay(post_item.id)
