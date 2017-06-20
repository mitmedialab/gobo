import logging, os

from flask import Flask, request


basedir = os.path.dirname(os.path.realpath(__file__))

# set up logging
log_file_path = os.path.join(basedir,'logs','feddy.log')
logging.basicConfig(filename=log_file_path,level=logging.DEBUG)
logging.info("Starting the feddy api server")


app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, Silica!'

@app.route('/post', methods=['GET', 'POST'])
def post_request():
    return 'this is a post request'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return 'post login'
    else:
        return 'not login'