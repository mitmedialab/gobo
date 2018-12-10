# -*- coding: utf-8 -*-
from ImageClassifier import ImageClassifier
from NameClassifier_light import *
from RetrieveTwitter import RetrieveTwitter

__author__ = 'pvandepavoordt'


class TwitterClassifier(object):
    def __init__(self, name_classifier):
        self.name_classifier = name_classifier

    def readConfig(self):
        from read_config import read_api_config
        config_files = os.path.join('./config.cfg')
        config = read_api_config(config_files)
        return config

    def classifyTwitterAccount(self, account, config, twitter_id=None, tweet_id=None):

        result = 'unknown'

        # classify name
        if result == 'unknown':
            try:
                result = self.name_classifier.classifyName(account.name)
                result = result.lower()
            except:
                raise Exception('Error in name recognition')

        # if name classification had no result try image classification
        if result == 'unknown':
            try:
                result = ImageClassifier().classifyImage(
                    account.profile_image_url.replace('normal', '400x400'), config['faceplusplus'])
                result = result.lower()
            except:
                raise Exception('Error in image recognition')

        if tweet_id is not None:
            result = {'tweetId': tweet_id, 'gender': result}
        else:
            if twitter_id is not None:
                result = {'accountId': twitter_id, 'gender': result}
            else:
                result = {'accountId': account['screen_name'], 'gender': result}
        return result

    # starts the classification based on a twitterUser object
    def classifyAccount(self, twitter_accountId, config):
        # retrieve twitter account
        try:
            account = RetrieveTwitter().retrieveAccount(twitter_accountId, config['twitter'])
        except:
            raise Exception('Account could not be retrieved')

        return self.classifyTwitterAccount(account, config, twitter_id=twitter_accountId)

    # starts the classification based on a tweet object
    def classifyTweet(self, twitter_tweetId, config):
        # retrieve tweet
        try:
            tweet = RetrieveTwitter().retrieveTweet(twitter_tweetId, config['twitter'])
        except:
            raise Exception('Tweet could not be retrieved')

        return self.classifyTwitterAccount(tweet.user, config, tweet_id=twitter_tweetId)
