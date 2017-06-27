from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
from server.config import BaseConfig
# from flask_bcrypt import Bcrypt

app = Flask(__name__, static_folder="client/build", static_url_path='', template_folder="client/build")
app.config.from_object(BaseConfig)
# db = SQLAlchemy(app)
# bcrypt = Bcrypt(app)