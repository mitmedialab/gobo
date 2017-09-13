import tasks as tasks

if __name__ == '__main__':
    # get post data for all users:
    tasks.get_posts_data_for_all_users.delay()
    tasks.get_news_posts.delay()

    # # get toxicity scores fo all posts in db:
    # for i in range (987, 2080):
    #     tasks.analyze_toxicity.delay(i)

