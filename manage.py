import os

from flask_migrate import MigrateCommand
from flask_script import Manager

from server.factory import create_app
from server.core import db


env = os.getenv('FLASK_ENV', 'dev')
app = create_app(env.lower())
manager = Manager(app)

# migrations
manager.add_command('db', MigrateCommand)

@manager.command
def create_db():
    """Creates the db tables."""
    db.create_all()


@manager.command
def drop_db():
    """Drops the db tables."""
    db.drop_all()


@manager.command
def create_data():
    """Creates sample data."""
    pass


if __name__ == '__main__':
    manager.run()
