import tasks as tasks

if __name__ == '__main__':
    tasks.get_tweets_per_user.delay(90)
    tasks.get_facebook_posts_per_user.delay(90)

