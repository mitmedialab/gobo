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
BATCH_DELETE_LIMIT = 100

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

total_post_assoc_query = "select count(*) from posts_associations"
total_posts_query = "select count(*) from posts"

q1 = "DELETE FROM posts_associations WHERE post_id in(SELECT id FROM posts " \
     "WHERE retrieved_at < CURRENT_DATE - interval '{}' day " \
     "ORDER BY retrieved_at ASC LIMIT {}) RETURNING *;".format(NUM_DAYS, BATCH_DELETE_LIMIT)

q2 = "DELETE FROM posts " \
     "WHERE retrieved_at < CURRENT_DATE - interval '{}' day " \
     "ORDER BY retrieved_at ASC LIMIT {} RETURNING *;".format(NUM_DAYS, BATCH_DELETE_LIMIT)

q3 = "DELETE FROM posts WHERE id IN (" \
     "SELECT posts.id " \
     "FROM posts LEFT JOIN posts_associations ON posts.id = posts_associations.post_id " \
     "GROUP BY posts.id " \
     "HAVING COUNT(posts_associations.user_id) = 0 LIMIT {}" \
     ") RETURNING *;".format(BATCH_DELETE_LIMIT)


def run_and_return_result(sql):
    global cur
    cur.execute(sql)
    rows = cur.fetchall()
    return rows

try:
    result = run_and_return_result(total_post_assoc_query)
    logging.info("Starting with {} posts_associations".format(result[0][0]))
    result = run_and_return_result(total_posts_query)
    logging.info("Starting with {} posts".format(result[0][0]))

    logging.info("Deleting old things (older than {} days, up to {} records):".format(NUM_DAYS, BATCH_DELETE_LIMIT))
    result = run_and_return_result(q1)
    logging.info("  Deleted {} old posts_associations".format(len(result)))
    result = run_and_return_result(q2)
    logging.info("  Deleted {} old posts".format(len(result)))
    result = run_and_return_result(q3)
    logging.info("  Deleted {} orphaned posts".format(len(result)))

    result = run_and_return_result(total_post_assoc_query)
    logging.info("Finished with {} posts_associations".format(result[0][0]))
    result = run_and_return_result(total_posts_query)
    logging.info("Finished with {} posts".format(result[0][0]))
    conn.commit()
except Exception as e:
    logger.exception(e)
    print "There was an error executing posts clean up"

cur.close()
conn.close()
