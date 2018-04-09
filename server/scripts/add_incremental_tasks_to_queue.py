import os
import logging
from sqlalchemy import create_engine
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


def get_posts_data_for_some_users(db_session):
    logger.info("Searching for users to priorize for updating")
    #filter for people who haven't updated in awhile but logged in recently
    prioritized_users = []

    env = os.getenv('FLASK_ENV', 'dev')

    #look for most recent logins (not null)
    recent_logins = db_session.query(User).filter(User.last_login is not None).order_by(User.last_login.desc())
    recent_logins_count = recent_logins.count()
    logger.debug("found {} with recent logins".format(recent_logins_count))

    time_window = (datetime.now() - User.last_post_fetch) > timedelta(hours=config_map[env].HOURS_TO_WAIT)

    #from most recent logins, grab users that haven't had their posts updated in the provided window
    oldest_post_fetches = recent_logins.filter(User.last_post_fetch is not None).filter(time_window).limit(
        config_map[env].NUMBER_OF_USERS_TO_UPDATE)
    prioritized_users.extend(oldest_post_fetches.all())
    oldest_post_fetches_count = oldest_post_fetches.count()
    logger.debug("found {} with old post fetches".format(oldest_post_fetches_count))

    #to fill up the queue, find users who perhaps haven't logged in recently but also haven't had their posts updated in awhile
    if oldest_post_fetches.all() < config_map[env].NUMBER_OF_USERS_TO_UPDATE:
        oldest_post_fetches_with_no_login = db_session.query(User).filter(User.last_login is None).filter(time_window).order_by(
            User.last_post_fetch).limit(config_map[env].NUMBER_OF_USERS_TO_UPDATE - len(oldest_post_fetches))
        oldest_post_fetches_with_no_login_count = oldest_post_fetches_with_no_login.count()
        logger.debug("found {} with oldest post fetches but no logins".format(oldest_post_fetches_count))
        prioritized_users.extend(oldest_post_fetches_with_no_login.all())

    logger.info("found {} to update".format(len(prioritized_users)))

    for user in prioritized_users:
        if user.twitter_authorized:
            tasks.get_tweets_per_user.delay(user.id)
        if user.facebook_authorized:
            tasks.get_facebook_posts_per_user.delay(user.id)


if __name__ == '__main__':
    get_posts_data_for_some_users(session)
