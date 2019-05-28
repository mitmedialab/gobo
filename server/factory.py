from __future__ import absolute_import
import os
from importlib import import_module

from celery import Celery
from flask import Flask
from raven.contrib.flask import Sentry

from .commands.commands import add_additive_rule_link, create_additive_rule, create_db, create_keyword_rule, \
    delete_rule, drop_db, share_rule_to_user, share_rule_all_users

from .core import db, bcrypt, login_manager, mail, migrate
# pylint: disable=no-name-in-module,import-error
from .config.config import config_map
from .blueprints import all_blueprints


def create_app(env=None):
    env = env or os.getenv('FLASK_ENV', 'dev')
    config = config_map[env]

    app = Flask(__name__, template_folder=config.TEMPLATE_FOLDER, static_url_path=config.STATIC_URL_PATH,
                static_folder=config.STATIC_FOLDER)

    app.config.from_object(config)

    if config.SENTRY_DSN:
        Sentry(app, dsn=config.SENTRY_DSN)

    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

    if config.ENABLE_MAIL:
        mail.init_app(app)

    # register_blueprints
    for bp in all_blueprints:
        import_module(bp.import_name)
        app.register_blueprint(bp)

    # register commands
    app.cli.add_command(create_db)
    app.cli.add_command(drop_db)
    app.cli.add_command(add_additive_rule_link)
    app.cli.add_command(create_additive_rule)
    app.cli.add_command(create_keyword_rule)
    app.cli.add_command(share_rule_to_user)
    app.cli.add_command(share_rule_all_users)
    app.cli.add_command(delete_rule)

    # app.wsgi_app = HTTPMethodOverrideMiddleware(app.wsgi_app)
    return app


def create_celery_app(app=None):
    env = os.getenv('FLASK_ENV', 'dev')
    app = app or create_app(env.lower())
    celery = Celery(__name__, broker=app.config['CELERY_BROKER_URL'])
    celery.conf.update(app.config)

    thirty_minutes = 1800
    celery.conf.update({
        'worker_max_tasks_per_child': 10,
        'task_soft_time_limit': thirty_minutes,
        'worker_max_memory_per_child': 400000  # 400MB
    })

    TaskBase = celery.Task

    class ContextTask(TaskBase):
        abstract = True

        def __call__(self, *args, **kwargs):
            with app.app_context():
                return TaskBase.__call__(self, *args, **kwargs)

    celery.Task = ContextTask
    return celery
