# -*- coding: utf-8 -*-
import ImageClassifier
import NameClassifier_light
import TwitterClassifier


class Classifier(object):
    def __init__(self, faceplusplus_apiKey, faceplusplus_secretKey, twitter_consumerKey, twitter_consumerSecret,
                 twitter_accessToken, twitter_accessSecret):
        self.config = self.get_config(faceplusplus_apiKey, faceplusplus_secretKey, twitter_consumerKey, twitter_consumerSecret,
                                      twitter_accessToken, twitter_accessSecret)
        self.name_classifier = NameClassifier_light.NameClassifier()
        self.image_classifier = ImageClassifier.ImageClassifier()

        self.twitter_classifier = TwitterClassifier.TwitterClassifier(self.name_classifier)

    def predict_gender_by_name(self, name):
        result, conf = self.name_classifier.predictGenderbyName(name)
        return {'name': name, 'gender': result}

    def predict_gender_from_image(self, picture_url):
        result = self.image_classifier.classifyImage(picture_url, self.config['faceplusplus'])
        return {'picture_url': picture_url, 'gender': result}

    def predict_gender_of_twitter_user(self, twitter_accountId):
        # TODO add country check
        return self.twitter_classifier.classifyAccount(twitter_accountId, self.config)

    def predict_gender_by_tweet(self, twitter_tweetId):
        # TODO add country check
        return self.twitter_classifier.classifyTweet(twitter_tweetId, self.config)

    def get_config(self, faceplusplus_apiKey, faceplusplus_secretKey, twitter_consumerKey, twitter_consumerSecret,
                   twitter_accessToken, twitter_accessSecret):
        config = dict()
        twitter = dict()
        twitter['consumerkey'] = twitter_consumerKey
        twitter['consumersecret'] = twitter_consumerSecret
        twitter['accesstoken'] = twitter_accessToken
        twitter['accesssecret'] = twitter_accessSecret
        faceplusplus = dict()
        faceplusplus['apikey'] = faceplusplus_apiKey
        faceplusplus['apisecret'] = faceplusplus_secretKey
        config['twitter'] = twitter
        config['faceplusplus'] = faceplusplus
        return config
