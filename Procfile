release: ./release-tasks.sh
web: gunicorn server.wsgi:app
worker: celery -A server.scripts.tasks worker -l INFO
