import os

from server.factory import create_app

app = create_app(os.getenv('FLASK_ENV', 'dev'))
