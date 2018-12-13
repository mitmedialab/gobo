release: ./release-tasks.sh
web: gunicorn "server.factory:create_app"
worker: celery -A server.scripts.tasks worker -l INFO
