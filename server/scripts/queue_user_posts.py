#  pylint: disable=singleton-comparison

import os
import logging
import sys

from datetime import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.models import User
# pylint: disable=no-name-in-module,import-error
from server.config.config import config_map
import server.scripts.tasks as tasks

logger = logging.getLogger(__name__)

env = os.getenv('FLASK_ENV', 'dev')
config_type = env.lower()
config = config_map[config_type]

engine = create_engine(config.SQLALCHEMY_DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()


def queue_user_posts(db_session, user_id, platforms_to_fetch):
    logger.info("Queueing posts for user {}".format(user_id))

    users = db_session.query(User).filter(User.id == user_id)

    tasks_queued = 0
    for user in users:
        task_queued = False
        if 'twitter' in platforms_to_fetch and user.twitter_authorized:
            tasks.get_tweets_per_user.delay(user.id)
            tasks_queued = tasks_queued + 1
            task_queued = True
        if 'facebook' in platforms_to_fetch and user.facebook_authorized:
            tasks.get_facebook_posts_per_user.delay(user.id)
            tasks_queued = tasks_queued + 1
            task_queued = True
        if 'mastodon' in platforms_to_fetch and user.mastodon_authorized:
            tasks.get_mastodon_posts_per_user.delay(user.id)
            tasks_queued = tasks_queued + 1
            task_queued = True
        # and mark that we tried to update them so they move to bottom of the priority list
        if task_queued:
            db_session.query(User).filter(User.id == user.id).\
                update({"last_post_fetch": datetime.now()})
            logger.info("  Updated user {}".format(user.id))
    db_session.commit()
    db_session.close()
    logger.info("queued {} tasks".format(tasks_queued))


if __name__ == '__main__':

    if len(sys.argv) != 2:
        logger.error("You have to provide a user_id to fetch posts for")

    user_id_arg = int(sys.argv[1])
    platforms = ['twitter', 'facebook', 'mastodon']
    if len(sys.argv) > 2:
        platforms = [sys.argv[2]]

    queue_user_posts(session, user_id_arg, platforms)
