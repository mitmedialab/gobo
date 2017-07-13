from index import app, db, bcrypt
from flask import request, render_template, jsonify, url_for, redirect, g
from flask_login import LoginManager, login_required, login_user, logout_user, current_user
from flask_cors import CORS

from models import User

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
    user = User(
        email=json_data['email'],
        password=json_data['password']
    )
    try:
        db.session.add(user)
        db.session.commit()
        status = 'success'
    except:
        status = 'this user is already registered'
    db.session.close()
    return jsonify({'result': status})

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
    print current_user
    return jsonify({'result':current_user.is_authenticated()})


@app.route('/api/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify('logout')



# import ConfigParser, logging, os
#
# from flask import Flask, redirect, url_for, session, request, flash, jsonify
# from flask_oauthlib.client import OAuth, OAuthException
#
#
#
# basedir = os.path.dirname(os.path.realpath(__file__))
#
# # # set up logging
# # log_file_path = os.path.join(basedir,'logs','silica.log')
# # logging.basicConfig(filename=log_file_path,level=logging.DEBUG)
# # logging.info("Starting the feddy api server")
#
#
# # load the settings file
# config = ConfigParser.ConfigParser()
# config.read(os.path.join(basedir, 'settings.config'))
#
# FACEBOOK_APP_ID = config.get('facebook','app_id')
# FACEBOOK_APP_SECRET = config.get('facebook','app_secret')
#
# TWITTER_API_KEY = config.get('twitter','api_key')
# TWITTER_API_SECRET = config.get('twitter','api_secret')
#
# app = Flask(__name__)
# app.debug = True
# app.secret_key = config.get('app', 'secret_key')
# oauth = OAuth(app)
#
# facebook = oauth.remote_app(
#     'facebook',
#     consumer_key=FACEBOOK_APP_ID,
#     consumer_secret=FACEBOOK_APP_SECRET,
#     request_token_params={'scope': 'email'},
#     base_url='https://graph.facebook.com',
#     request_token_url=None,
#     access_token_url='/oauth/access_token',
#     access_token_method='GET',
#     authorize_url='https://www.facebook.com/dialog/oauth'
# )
#
# twitter = oauth.remote_app(
#     'twitter',
#     consumer_key=TWITTER_API_KEY,
#     consumer_secret=TWITTER_API_SECRET,
#     base_url='https://api.twitter.com/1.1/',
#     request_token_url='https://api.twitter.com/oauth/request_token',
#     access_token_url='https://api.twitter.com/oauth/access_token',
#     authorize_url='https://api.twitter.com/oauth/authorize'
# )
#
#
# @app.route('/')
# def index():
#     return "hello silica"
#
#
# @app.route('/facebook_login')
# def login_facebook():
#     callback = url_for(
#         'facebook_authorized',
#         next=request.args.get('next') or request.referrer or None,
#         _external=True
#     )
#     return facebook.authorize(callback=callback)
#
#
# @app.route('/login/authorized')
# def facebook_authorized():
#     resp = facebook.authorized_response()
#     if resp is None:
#         return 'Access denied: reason=%s error=%s' % (
#             request.args['error_reason'],
#             request.args['error_description']
#         )
#     if isinstance(resp, OAuthException):
#         return 'Access denied: %s' % resp.message
#
#     session['facebook_oauth_token'] = (resp['access_token'], '')
#     me = facebook.get('/me')
#     return 'Logged in as id=%s name=%s redirect=%s' % \
#         (me.data['id'], me.data['name'], request.args.get('next'))
#
#
#
#
# @twitter.tokengetter
# def get_twitter_token():
#     if 'twitter_oauth' in session:
#         resp = session['twitter_oauth']
#         return resp['oauth_token'], resp['oauth_token_secret']
#
#
# # @app.before_request
# # def before_request():
# #     g.user = None
# #     if 'twitter_oauth' in session:
# #         g.user = session['twitter_oauth']
#
#
# @app.route('/twitter')
# def tweets():
#     tweets = None
#     if g.user is not None:
#         resp = twitter.request('statuses/home_timeline.json')
#         if resp.status == 200:
#             tweets = resp.data
#         else:
#             flash('Unable to load tweets from Twitter.')
#     return jsonify(tweets)
#
#
# @app.route('/tweet', methods=['POST'])
# def tweet():
#     if g.user is None:
#         return redirect(url_for('login', next=request.url))
#     status = request.form['tweet']
#     if not status:
#         return redirect(url_for('index'))
#     resp = twitter.post('statuses/update.json', data={
#         'status': status
#     })
#
#     if resp.status == 403:
#         flash("Error: #%d, %s " % (
#             resp.data.get('errors')[0].get('code'),
#             resp.data.get('errors')[0].get('message'))
#         )
#     elif resp.status == 401:
#         flash('Authorization error with Twitter.')
#     else:
#         flash('Successfully tweeted your tweet (ID: #%s)' % resp.data['id'])
#     return redirect(url_for('index'))
#
#
# @app.route('/login_twitter')
# def login_twitter():
#     callback_url = url_for('twitter_oauthorized', next=request.args.get('next'))
#     return twitter.authorize(callback=callback_url or request.referrer or None)
#
#
# @app.route('/logout')
# def logout():
#     session.pop('twitter_oauth', None)
#     return redirect(url_for('index'))
#
#
# @app.route('/oauthorized')
# def twitter_oauthorized():
#     resp = twitter.authorized_response()
#     if resp is None:
#         flash('You denied the request to sign in.')
#     else:
#         session['twitter_oauth'] = resp
#     return redirect(url_for('index'))
#
#
# @facebook.tokengetter
# def get_facebook_oauth_token():
#     return session.get('facebook_oauth_token')
#
#
# if __name__ == '__main__':
#     app.run()