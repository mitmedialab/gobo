release: ./release-tasks.sh
web: gunicorn manage:app
worker: celery -A server.scripts.tasks worker -l INFO