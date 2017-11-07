from server.core import db, bcrypt, login_manager
from flask import request, jsonify, session, url_for
from flask import current_app as app
from flask_login import login_required, login_user, logout_user, current_user
import requests
from sqlalchemy import and_
from twython import Twython

from server.models import User, FacebookAuth, TwitterAuth, Post, SettingsUpdate
from server.scripts import tasks
from server.enums import PoliticsEnum

from server.blueprints import api


# -----login logout logic-----

@login_manager.user_loader
def load_user(userid):
    return User.query.get(userid)

@api.route('/register', methods=['POST'])
def register():
    json_data = request.json
    code = 403
    user = False
    try:
        user = User(
            email=json_data['email'],
            password=json_data['password']
        )
    except Exception as e:
        statusText = str(e)
    if user:
        try:
            db.session.add(user)
            db.session.commit()
            statusText = 'success'
            code=200
            login_user(user, remember=True)
        except Exception as e:
            statusText = 'user with that e-mail already exist'
        db.session.close()
    return jsonify({'statusText': statusText}), code

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

# -------beta password lock ----- #

@api.route('/is_locked_with_password', methods=['GET'])
def is_locked_with_password():
    step = -1
    if current_user.is_authenticated:
        step = 3
    return jsonify({'locked': app.config['LOCK_WITH_PASSWORD'], 'step':step})

@api.route('/verify_beta_password', methods=['POST'])
def verify_beta_password():
    pw = request.json['password']
    success = pw==app.config['BETA_PASSWORD']
    return jsonify({'success': success})


# -----social authentication logic-----
@api.route('/get_facebook_app_id', methods=['GET'])
def get_facebook_app_id():
    return str(app.config['FACEBOOK_APP_ID'])

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
        user_oauth_token = final_step['oauth_token']
        user_oauth_token_secret = final_step['oauth_token_secret']

        user_twitter = Twython(app.config['TWITTER_API_KEY'],app.config['TWITTER_API_SECRET'],
                               user_oauth_token, user_oauth_token_secret)
        twitter_user_show = user_twitter.show_user(user_id=final_step['user_id'])
        current_user.set_twitter_data(final_step['user_id'], final_step['screen_name'], twitter_user_show)

        new_twitter_auth = TwitterAuth(current_user.get_id(), user_oauth_token, user_oauth_token_secret)
        db.session.add(new_twitter_auth)
        db.session.commit()

        tasks.get_tweets_per_user.delay(current_user.get_id())
        # db.session.close()
    except:
        # print 'error in twitter auth'
        success = False




    return jsonify({'success': success})

@api.route('/set_political_affiliation', methods=['POST'])
@login_required
def set_political_affiliation():
    json_data = request.json
    current_user.set_political_affiliation(json_data['political_affiliation'])
    return 'success', 200


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
    PERSONAL_POSTS_MAX = 400 #how many personal posts to grab
    personal_posts = current_user.posts.order_by(Post.created_at.desc())[:PERSONAL_POSTS_MAX]

    NEWS_POSTS_COUNT = 50  # how many news posts to grab. this number should divide by 5.
    posts_from_quintile = NEWS_POSTS_COUNT / 5
    ignore_ids = [item.id for item in current_user.posts.all()]
    for quintile in PoliticsEnum:
        posts = Post.query.filter((
            Post.id.notin_(ignore_ids)) & (Post.political_quintile==quintile)).order_by(
            Post.created_at.desc())[:posts_from_quintile]
        personal_posts.extend(posts)

    return jsonify({'posts': [post.as_dict() for post in personal_posts]})

# ----- settings logic -----

@api.route('/get_settings', methods=['GET'])
@login_required
def get_settings():
    settings = current_user.settings.as_dict()
    settings['political_affiliation'] = current_user.political_affiliation.value
    return jsonify(settings)


@api.route('/update_settings', methods=['POST'])
@login_required
def update_settings():
    json_data = request.json

    update = SettingsUpdate(current_user.id, json_data['settings'])
    # try:
    db.session.add(update)
    current_user.settings.update(json_data['settings'])
    db.session.commit()
    success = True
    # except:
    #     print "error logging new settings for user {} to db".format(current_user.id)
    #     success = False
    return jsonify({'update_success': success})