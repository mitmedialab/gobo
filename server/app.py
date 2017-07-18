from index import app, db, bcrypt
from flask import request, render_template, jsonify, url_for, redirect, g
from flask_login import LoginManager, login_required, login_user, logout_user, current_user
from flask_cors import CORS
import requests

from models import User, FacebookAuth

CORS(app) #TODO remove on production!



# flask-login
login_manager = LoginManager()
login_manager.init_app(app)


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/<path:path>', methods=['GET'])
def any_root_path(path):
    return render_template('index.html')

@login_manager.user_loader
def load_user(userid):
    return User.query.get(userid)

@app.route('/api/register', methods=['POST'])
def register():
    json_data = request.json
    code = 403
    user = User(
        email=json_data['email'],
        password=json_data['password']
    )
    try:
        db.session.add(user)
        db.session.commit()
        status = 'success'
        code=200
        login_user(user, remember=True)
    except:
        status = 'this user is already registered'
    db.session.close()
    return jsonify({'result': status}), code

@app.route ('/api/login', methods=['POST'])
def login():
    json_data = request.json
    user_result = False
    user = User.query.filter_by(email=json_data['email']).first()
    if user and bcrypt.check_password_hash(
            user.password, json_data['password']):
        login_user(user, remember=True)
        user_result = {'email': user.email}
        status = True
    else:
        status = False

    response = jsonify({'result': status, 'user':user_result})
    return response

@app.route ('/api/confirm_auth', methods=['GET'])
@login_required
def confirm_auth():
    return jsonify({'result':current_user.is_authenticated()})

@app.route('/api/handle_facebook_response', methods=['POST'])
@login_required
def handle_facebook_response():
    json_data = request.json
    current_user.set_facebook_data(json_data['facebook_response'])
    getFacebookLongAuth(json_data['facebook_response']['accessToken'])
    return 'success', 200

@app.route('/api/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify('logout')


def getFacebookLongAuth(token):
    '''
    GET /oauth/access_token?
    grant_type=fb_exchange_token&amp;
    client_id={app-id}&amp;
    client_secret={app-secret}&amp;
    fb_exchange_token={short-lived-token}
    :param token:
    :return:
    '''
    payload = {'grant_type':'fb_exchange_token',
               'client_id':app.config['FACEBOOK_APP_ID'],
               'client_secret':app.config['FACEBOOK_APP_SECRET'],
               'fb_exchange_token':token }
    r = requests.get('https://graph.facebook.com/oauth/access_token', payload)
    if r.status_code==requests.codes.ok:
        new_facebook_auth = FacebookAuth(current_user.get_id(), r.json())
        print new_facebook_auth
        db.session.add(new_facebook_auth)
        db.session.commit()