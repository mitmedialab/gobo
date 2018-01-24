import sys
import os
from ..views.auth import delete_user_by_id
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..config.config import config_map


env = os.getenv('FLASK_ENV', 'dev')
config_type = env.lower()
config = config_map[config_type]

engine = create_engine(config.SQLALCHEMY_DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()

print delete_user_by_id(sys.argv[1], session)
