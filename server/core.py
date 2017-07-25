from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate

#: Flask-SQLAlchemy extension instance
db = SQLAlchemy()

#: Flask-Bcrypt extension instance
bcrypt = Bcrypt()

#: Flask-Login extension instance
login_manager = LoginManager()

migrate = Migrate()