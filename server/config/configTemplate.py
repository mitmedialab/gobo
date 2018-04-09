import os

class BaseConfig(object):
    # Controls lots of internal things.  Set to True locally; False on production.
    DEBUG = True
    
    # Used to generate secure cookies.  Set to some random string of your own.
    SECRET_KEY = 'The quick brown fox jumps over the lazy dog'

    # Get these from the Facebook developer dashboard for the application you create. These are needed to
    # let Gobo ingest data from Facebook. Set one up yourself on Facebook's developer portal.
    FACEBOOK_APP_ID = 'XXXX'
    FACEBOOK_APP_SECRET = 'XXXX'

    # Get these from the Twitter developer dashboard for the application you create. These are needed to
    # let Gobo ingest data from Twitter. Create an application for yourself on Twitter with your own account 
    # via Twitter's developer portal.
    TWITTER_API_KEY = 'XXXXX'
    TWITTER_API_SECRET = 'XXXXX'

    # Set to the URI for a database to store everythign in. We use Postgres in development and production.
    SQLALCHEMY_DATABASE_URI = 'postgresql:///db_name'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Set this to the URI for the queue engine you can Celery to use.  We have used Redis and RabbitMQ.
    CELERY_BROKER_URL = 'redis://localhost:6379/0'

    # Used to connect to the PerspectiveAPI from Google that gives us Toxicity scores for our "rudeness" filter.
    # We have a dev key for the development team to use.
    GOOGLE_API_KEY = 'XXXXX'

    # Set these to two Sentry DSNs for reporting errors.  One for the app and one for the Celery workers
    SENTRY_DSN = 'XXXXX'
    SENTRY_DSN_WORKER = 'XXXXXX'

    # The javsacript will be complied to here during the release process
    STATIC_FOLDER = '../client/dist/'
    STATIC_URL_PATH = '/static'

    # Use these if you want to require a magic password to be entered before people are allowed to signup
    # for new accounts.
    LOCK_WITH_PASSWORD = False
    BETA_PASSWORD = 'XXXXXX'

    # The url for an instance of our predict-news-labels engine that labels articles shared with themes; which we then
    # use to score whether somethign is news or not for our filter. We have an instance running for developers to use.
    NEWS_LABELLER_URL = 'http://my_predict_news_server'

    #Settings to control how users are prioritized in the queue
    NUMBER_OF_USERS_TO_UPDATE = 30
    HOURS_TO_WAIT = 6


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