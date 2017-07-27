
from flask import render_template
from server.blueprints import home

@home.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@home.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')
