import tweepy

__author__ = 'pvandepavoordt'

class RetrieveTwitter :


    def retrieveAccount(self, accountId, twitterConfig):
        consumerKey = twitterConfig['consumerkey']
        consumerSecret = twitterConfig['consumersecret']
        accessToken = twitterConfig['accesstoken']
        accessSecret = twitterConfig['accesssecret']
        auth = tweepy.OAuthHandler(consumerKey, consumerSecret)
        auth.set_access_token(accessToken, accessSecret)
        api = tweepy.API(auth)
        return api.get_user(accountId)

    def retrieveTweet(self, tweetId, twitterConfig):
        consumerKey = twitterConfig['consumerkey']
        consumerSecret = twitterConfig['consumersecret']
        accessToken = twitterConfig['accesstoken']
        accessSecret = twitterConfig['accesssecret']
        auth = tweepy.OAuthHandler(consumerKey, consumerSecret)
        auth.set_access_token(accessToken, accessSecret)
        api = tweepy.API(auth)
        return api.get_status(tweetId)