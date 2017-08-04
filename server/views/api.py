from server.core import db, bcrypt, login_manager
from flask import request, jsonify, session, url_for
from flask import current_app as app
from flask_login import login_required, login_user, logout_user, current_user
import requests
from twython import Twython

from server.models import User, FacebookAuth, TwitterAuth, Post
from server.scripts import tasks

from server.blueprints import api


# -----login logout logic-----

@login_manager.user_loader
def load_user(userid):
    return User.query.get(userid)

@api.route('/register', methods=['POST'])
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

@api.route ('/login', methods=['POST'])
def login():
    json_data = request.json
    user_result = False
    user = User.query.filter_by(email=json_data['email']).first()
    if user and bcrypt.check_password_hash(
            user.password, json_data['password']):
        login_user(user, remember=True)
        user_result = user.get_names()
        status = True
    else:
        status = False

    response = jsonify({'result': status, 'user':user_result})
    return response

@api.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify('logout')

@api.route ('/confirm_auth', methods=['GET'])
@login_required
def confirm_auth():
    return jsonify({'result':current_user.is_authenticated(), 'user':current_user.get_names()})


# -----social authentication logic-----
@api.route('/get_facebook_app_id', methods=['GET'])
def get_facebook_app_id():
    return jsonify({'app_id':app.config['FACEBOOK_APP_ID']})

@api.route('/handle_facebook_response', methods=['POST'])
@login_required
def handle_facebook_response():
    json_data = request.json
    current_user.set_facebook_data(json_data['facebook_response'])
    getFacebookLongAuth(json_data['facebook_response']['accessToken'])
    return 'success', 200


@api.route('/get_twitter_oauth_token', methods=['GET'])
@login_required
def get_twitter_oauth_token():
    twitter = Twython(app.config['TWITTER_API_KEY'],app.config['TWITTER_API_SECRET'])
    auth = twitter.get_authentication_tokens(callback_url=request.url_root+'twitter_callback')
    session['oauth_token'] = auth['oauth_token']
    session['oauth_token_secret'] = auth['oauth_token_secret']
    return jsonify({'url':auth['auth_url']})

@api.route('/wait_for_twitter_callback', methods=['GET'])
@login_required
def wait_for_twitter_callback():
    return jsonify({'isTwitterAuthorized': current_user.twitter_authorized})

@api.route('/handle_twitter_callback', methods=['POST'])
@login_required
def handle_twitter_callback():
    twitter = Twython(app.config['TWITTER_API_KEY'],app.config['TWITTER_API_SECRET'],
                      session['oauth_token'], session['oauth_token_secret'])
    success = True

    try:
        final_step = twitter.get_authorized_tokens(request.json['oauth_verifier'])
        current_user.set_twitter_data(final_step['user_id'], final_step['screen_name'])
        user_oauth_token = final_step['oauth_token']
        user_oauth_token_secret = final_step['oauth_token_secret']
        new_twitter_auth = TwitterAuth(current_user.get_id(), user_oauth_token, user_oauth_token_secret)
        db.session.add(new_twitter_auth)
        db.session.commit()

        tasks.get_tweets_per_user.delay(current_user.get_id())
        # db.session.close()
    except:
        print 'error in twitter auth'
        success = False



    return jsonify({'success': success})

def getFacebookLongAuth(token):
    payload = {'grant_type':'fb_exchange_token',
               'client_id':app.config['FACEBOOK_APP_ID'],
               'client_secret':app.config['FACEBOOK_APP_SECRET'],
               'fb_exchange_token':token }
    r = requests.get('https://graph.facebook.com/oauth/access_token', payload)
    if r.status_code==requests.codes.ok:
        try:
            new_facebook_auth = FacebookAuth(current_user.get_id(), r.json())
            db.session.add(new_facebook_auth)
            db.session.commit()
            # db.session.close()

            tasks.get_facebook_posts_per_user.delay(current_user.get_id())
        except:
            print 'error in facebook auth'

# ----- get feed logic -----

@api.route('/get_posts', methods=['GET'])
@login_required
def get_posts():
    return jsonify({'posts': [post.as_dict() for post in current_user.posts.order_by(Post.retrieved_at.desc())][:100]})