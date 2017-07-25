from twython import Twython
# from ..models import User, FacebookAuth, TwitterAuth
# from ...index import app

# def get_posts_per_user(user_id):
#     pass
#
# def get_tweets_per_user(user_id):
#     twitter_auth = TwitterAuth.query.filter_by(user_id=user_id).first()
#     twitter = Twython(app.config['TWITTER_API_KEY'],app.config['TWITTER_API_SECRET'],
#                       twitter_auth.oauth_token, twitter_auth.oauth_token_secret)
#     print twitter.get_home_timeline()
#
#
# def get_news():
#     pass
#
# if __name__ == "__main__":
#     get_tweets_per_user(74)