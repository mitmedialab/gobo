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

class DevConfig(BaseConfig):
    DEBUG = True
    STATIC_FOLDER = 'client/dist'
    TEMPLATE_FOLDER = 'templates'
    STATIC_URL_PATH = ''


class ProductionConfig(BaseConfig):
    DEBUG = False
    STATIC_FOLDER = 'client/dist'
    TEMPLATE_FOLDER = 'client/dist'
    STATIC_URL_PATH = ''


config_map = {
    'dev': DevConfig,
    'prod': ProductionConfig,
}