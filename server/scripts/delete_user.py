import sys
import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from server.views.auth import delete_user_by_id
from server.config.config import config_map

logger = logging.getLogger(__name__)

env = os.getenv('FLASK_ENV', 'dev')
config_type = env.lower()
config = config_map[config_type]

engine = create_engine(config.SQLALCHEMY_DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()

if __name__ == '__main__':

    if len(sys.argv) != 2:
        logger.error("You have to provide a user_id to delete!")

    user_id = int(sys.argv[1])

    logger.info("Delete user ".format(user_id))
    deletion_worked = delete_user_by_id(user_id, session)
    logger.info("Success: {}".format(deletion_worked))
