import tasks as tasks

if __name__ == '__main__':
    tasks.get_posts_data_for_all_users.delay()

