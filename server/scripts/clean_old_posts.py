# since Heroku only allows up to 10,000 rows in db
# this script could be run as a crone job, to remove all posts older than x days

import os
import psycopg2
import urlparse

NUM_DAYS = 7

urlparse.uses_netloc.append("postgres")
url = urlparse.urlparse(os.environ["DATABASE_URL"])

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

cur.execute(q1)
cur.execute(q2)


conn.commit()

cur.clode()
conn.close()