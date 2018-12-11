import os
import logging
import csv
from datetime import datetime, timedelta
import requests
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from twython import Twython

from server.models import Post
# pylint: disable=no-name-in-module,import-error
from server.config.config import config_map
import server.scripts.tasks as tasks
from server.enums import PoliticsEnum

logger = logging.getLogger(__name__)

env = os.getenv('FLASK_ENV', 'dev')
config_type = env.lower()
config = config_map[config_type]

engine = create_engine(config.SQLALCHEMY_DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()

basedir = os.path.abspath(os.path.dirname(__file__))
MEDIA_SOURCES_FILE = os.path.join(basedir, 'static_data', 'partisan_media_sources.csv')


def queue_one_news_post(post, source, quintile, db_session):
    added_new = False
    try:
        post_id = post['id_str'] if 'id_str' in post else str(post['id'])
        post_item = Post.query.filter_by(original_id=post_id, source=source).first()
        if not post_item:
            post_item = Post(post_id, source, post, True)
            db_session.add(post_item)
            added_new = True
        else:
            post_item.update_content(post, is_news=True)

        post_item.political_quintile = quintile

        db_session.commit()
        success = True
        tasks.analyze_post.delay(post_item.id)
    except:
        logger.error('An error adding post {}'.format(post['id']))
        success = False
    return {'success': success, 'added_new': added_new}


def queye_lastest_news_posts(db_session):
    REALLY_QUEUE = True
    # facebook requests payload
    N = 2
    MAX_POST = 3
    date_N_days_ago = datetime.now() - timedelta(days=N)
    since_date = date_N_days_ago.strftime('%Y-%m-%d')
    facebook_payload = {
        'fields': ','.join(tasks.FACEBOOK_POSTS_FIELDS),
        'access_token': '{}|{}'.format(config.FACEBOOK_APP_ID, config.FACEBOOK_APP_SECRET),
        'since': since_date,
        'limit': MAX_POST
    }

    with open(MEDIA_SOURCES_FILE) as csvfile:
        reader = csv.DictReader(csvfile)
        row_num = 0
        # TODO: refactor this
        # pylint: disable=too-many-nested-blocks
        for row in reader:
            logger.info("Row {}".format(row_num))
            if row['Enum_val']:
                quintile = PoliticsEnum(int(row['Enum_val']))
                if row['Twitter Handle']:
                    logger.info("  {}".format(row['Twitter Handle']))
                    obj = {'id': row['Twitter Handle'].replace('https://twitter.com/', '')}
                    try:
                        twitter = Twython(config.TWITTER_API_KEY, config.TWITTER_API_SECRET)
                        tweets = twitter.get_user_timeline(
                            screen_name=obj['id'], count=MAX_POST, tweet_mode='extended')
                    except:
                        tweets = []
                    logger.info("  adding {} tweets".format(len(tweets)))
                    if REALLY_QUEUE:
                        for post in tweets:
                            queue_one_news_post(post, 'twitter', quintile, db_session)
                if row['Facebook Page']:
                    logger.info("  {}".format(row['Facebook Page']))
                    # get facebook feed
                    data = {'id': row['Facebook Page'].replace('https://www.facebook.com/', '')}
                    r = requests.get(tasks.FACEBOOK_URL + data['id'] + '/feed', facebook_payload)
                    result = r.json()
                    if 'error' in result:
                        logger.warn("  unable to fetch FB data - error {} - {}".format(
                            result['error']['type'], result['error']['message']))
                    else:
                        logger.info("  adding {} facebook posts".format(len(result['data'])))
                        if REALLY_QUEUE:
                            if 'data' in result:
                                for p in result["data"]:
                                    post = dict(p, **{'post_user': data})
                                    queue_one_news_post(post, 'facebook', quintile, db_session)
            row_num = row_num + 1


if __name__ == '__main__':
    queye_lastest_news_posts(session)
