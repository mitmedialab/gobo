# since Heroku only allows up to 10,000 rows in db
# this script could be run as a crone job, to remove all posts older than x days

import os
import psycopg2
import urlparse
import logging

from server.config.config import config_map

logger = logging.getLogger(__name__)


env = os.getenv('FLASK_ENV', 'dev')
config_type = env.lower()
config = config_map[config_type]

NUM_DAYS = 6

urlparse.uses_netloc.append("postgres")
url = urlparse.urlparse(config.SQLALCHEMY_DATABASE_URI)

conn = psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)
cur = conn.cursor()


q1 = "DELETE FROM posts_associations WHERE post_id in(SELECT id FROM posts WHERE  DATE_PART('day', NOW() - retrieved_at) > {});".format(NUM_DAYS)
q2 = "DELETE FROM posts WHERE DATE_PART('day', NOW() - retrieved_at) > {};".format(NUM_DAYS)
q3 = "DELETE FROM posts WHERE id IN (" \
     "SELECT posts.id " \
     "FROM posts LEFT JOIN posts_associations ON posts.id = posts_associations.post_id " \
     "GROUP BY posts.id " \
     "HAVING COUNT(posts_associations.user_id) = 0" \
     ")"

try:
    result = cur.execute(q1)
    logging.info("Deleted {} old posts_associations".format(result))
    result = cur.execute(q2)
    logging.info("Deleted {} old posts".format(result))
    result = cur.execute(q3)
    logging.info("Deleted {} orphaned posts".format(result))

    conn.commit()
except Exception as e:
    logger.exception(e)
    print "There was an error executing posts clean up"

cur.close()
conn.close()