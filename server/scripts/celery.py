from server.factory import create_celery_app

celery = create_celery_app()

if __name__ == '__main__':
    celery.start()
