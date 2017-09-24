import os
basedir = os.path.abspath(os.path.dirname(__file__))

class BaseConfig(object):
    DEBUG = True
    SECRET_KEY = 'The quick brown fox jumps over the lazy dog'

    FACEBOOK_APP_ID = 'XXXX'
    FACEBOOK_APP_SECRET = 'XXXX'

    TWITTER_API_KEY = 'XXXXX'
    TWITTER_API_SECRET = 'XXXXX'

    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(basedir, 'dev.sqlite')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    CELERY_BROKER_URL = 'redis://localhost:6379/0'

    GOOGLE_API_KEY = 'XXXXX'

    SENTRY_DSN = 'XXXXX'
    SENTRY_DSN_WORKER = 'XXXXXX'

    STATIC_FOLDER = '../client/dist/'
    STATIC_URL_PATH = '/static'


class DevConfig(BaseConfig):
    DEBUG = True
    TEMPLATE_FOLDER = 'templates'


class ProductionConfig(BaseConfig):
    DEBUG = False
    TEMPLATE_FOLDER = '../client/dist/'


config_map = {
    'dev': DevConfig,
    'prod': ProductionConfig,
}