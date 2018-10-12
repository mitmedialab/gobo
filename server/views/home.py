from flask import render_template
from server.blueprints import home


@home.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@home.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')


# hack for js routes
# todo: understand why any_root_path is not working correctly
@home.route('/login', methods=['GET'])
def login():
    return render_template('index.html')


@home.route('/register', methods=['GET'])
def register():
    return render_template('index.html')


@home.route('/feed', methods=['GET'])
def feed():
    return render_template('index.html')


@home.route('/profile', methods=['GET'])
def profile():
    return render_template('index.html')
