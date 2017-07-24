from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from server.config import BaseConfig, config_map
from flask_bcrypt import Bcrypt
import os

#set to DevConfig / ProductionConfig according to current mode
env = os.environ.get('FLASK_ENV','dev')
config = config_map[env.lower()]

app = Flask(__name__, template_folder=config.TEMPLATE_FOLDER, static_url_path=config.STATIC_URL_PATH, static_folder=config.STATIC_FOLDER)
app.config.from_object(config)
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
