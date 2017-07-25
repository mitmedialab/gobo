from .tasks import get_tweets_per_user

if __name__ == '__main__':
    get_tweets_per_user.delay(90)

