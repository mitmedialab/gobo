from logging import getLogger
import sys

import tasks as tasks

logger = getLogger(__name__)

if __name__ == '__main__':
    # get post data for all one user
    if len(sys.argv) is not 2:
        logger.error("You must provide a user_id to add fetch and queue tasks for!")
    else:
        user_id = sys.argv[1]
        logger.info("Refreshing and queueing data for {}".format(user_id))
        tasks.get_tweets_per_user.delay(user_id)
        tasks.get_facebook_posts_per_user.delay(user_id)
