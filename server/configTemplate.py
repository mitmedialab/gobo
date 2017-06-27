class BaseConfig(object):
    DEBUG = True
    SECRET_KEY = 'The quick brown fox jumps over the lazy dog'

    FACEBOOK_APP_ID = 'XXXX'
    FACEBOOK_APP_SECRET = 'XXXX'

    TWITTER_API_KEY = 'XXXXX'
    TWITTER_API_SECRET = 'XXXXX'

    DATABASE_URL = 'XXXXX'


class DevConfig(BaseConfig):
    DEBUG = True


class ProductionConfig(BaseConfig):
    DEBUG = False


config_map = {
    'dev': DevConfig,
    'prod': ProductionConfig,
}