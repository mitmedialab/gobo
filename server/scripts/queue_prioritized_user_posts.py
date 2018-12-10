import os
import logging
from sqlalchemy import create_engine, or_, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta

from server.models import User
from server.config.config import config_map
import server.scripts.tasks as tasks

logger = logging.getLogger(__name__)

env = os.getenv('FLASK_ENV', 'dev')
config_type = env.lower()
config = config_map[config_type]

engine = create_engine(config.SQLALCHEMY_DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()


def queue_prioritized_users_posts(db_session):
    queue_size = config.NUMBER_OF_USERS_TO_UPDATE
    prioritized_users = []
    logger.info("Searching for {} users to prioritize for updating".format(queue_size))

    # helpers for filtering users
    connected_to_services = or_(User.twitter_authorized == True, User.facebook_authorized == True)
    not_fetched_recently = (datetime.now() - User.last_post_fetch) > timedelta(hours=config.HOURS_TO_WAIT)

    # 1. First find connected users that have logged in recently but we haven't updated recently
    if len(prioritized_users) < queue_size:
        matching_users = db_session.query(User).\
            filter(connected_to_services). \
            filter(User.last_login.isnot(None)). \
            filter(User.last_post_fetch.isnot(None)).filter(not_fetched_recently). \
            order_by(User.last_login.desc()). \
            limit(queue_size - len(prioritized_users))
        matching_user_count = matching_users.count()
        logger.debug("  adding {} users that haven't logged in but we haven't updated recently".format(matching_user_count))
        prioritized_users.extend(matching_users.all())

    # 2. Then add connected users that we've never updated and haven't logged in a while
    if len(prioritized_users) < queue_size:
        matching_users = db_session.query(User).\
            filter(connected_to_services).\
            filter(text("last_post_fetch is NULL")).\
            filter(User.last_login.isnot(None)). \
            order_by(User.last_login.desc()). \
            limit(queue_size - len(prioritized_users))
        matching_user_count = matching_users.count()
        logger.debug("  adding {} users that haven't logged in recently and we've never updated".format(matching_user_count))
        prioritized_users.extend(matching_users.all())

    # 3. And then connected users that we've never updated and haven't logged in
    if len(prioritized_users) < queue_size:
        matching_users = db_session.query(User).\
            filter(connected_to_services).\
            filter(text("last_login is NULL and last_post_fetch is NULL")).\
            limit(queue_size - len(prioritized_users))
        matching_user_count = matching_users.count()
        logger.debug("  adding {} users that haven't logged in ever and we've never updated".format(matching_user_count))
        prioritized_users.extend(matching_users.all())

    logger.info("found {} to update overall".format(len(prioritized_users)))

    tasks_queued = 0
    for user in prioritized_users:
        task_queued = False
        if user.twitter_authorized:
            tasks.get_tweets_per_user.delay(user.id)
            tasks_queued = tasks_queued + 1
            task_queued = True
        if user.facebook_authorized:
            tasks.get_facebook_posts_per_user.delay(user.id)
            tasks_queued = tasks_queued + 1
            task_queued = True
        # and mark that we tried to update them so they move to bottom of the priority list
        if task_queued:
            db_session.query(User).filter(User.id == user.id).\
                update({"last_post_fetch": datetime.now()})
            logger.info("  Updated user {}".format(user.id))
    db_session.commit()
    logger.info("queued {} tasks".format(tasks_queued))


if __name__ == '__main__':
    queue_prioritized_users_posts(session)
