import logging
from urllib.parse import urljoin

from flask import abort, request, jsonify, session
from flask import current_app as app
from flask_login import login_required, current_user
import requests
from twython import Twython
from mastodon import Mastodon, MastodonAPIError

from server.core import db
from server.models import FacebookAuth, MastodonApp, MastodonAuth, TwitterAuth
from server.scripts import tasks
from server.blueprints import api

logger = logging.getLogger(__name__)


@api.route('/get_facebook_app_id', methods=['GET'])
@login_required
def get_facebook_app_id():
    return jsonify({
        'facebookAppId': str(app.config['FACEBOOK_APP_ID']),
        'isFacebookEnabled': app.config['ENABLE_FACEBOOK'],
    })


@api.route('/handle_facebook_response', methods=['POST'])
@login_required
def handle_facebook_response():
    json_data = request.json
    current_user.set_facebook_data(json_data['facebook_response'])
    get_facebook_long_auth(json_data['facebook_response']['accessToken'])
    return 'success', 200


@api.route('/verify_mastodon', methods=['GET'])
@login_required
def verify_mastodon():
    return jsonify({
        'isMastodonEnabled': app.config['ENABLE_MASTODON'],
        'isMastodonAuthorized': current_user.mastodon_authorized,
    })


@api.route('/mastodon_domain', methods=['POST'])
@login_required
def mastodon_domain():
    if not app.config['ENABLE_MASTODON']:
        return abort(requests.codes.not_found)

    domain = request.json['domain'].lower()
    mastodon_app = db.session.query(MastodonApp).filter(MastodonApp.domain == domain).first()
    if mastodon_app is None:
        client_id, client_secret = Mastodon.create_app(
            'gobo',
            api_base_url='https://{domain}'.format(domain=domain),
            scopes=['read'],
            redirect_uris=urljoin(app.config['MASTODON_REDIRECT_BASE_URL'], 'mastodon_auth_complete'),
        )
        mastodon_app = MastodonApp(domain, client_id, client_secret)
        db.session.add(mastodon_app)

    current_auth = db.session.query(MastodonAuth).filter(MastodonAuth.user_id == current_user.get_id()).first()
    if current_auth:
        current_auth.app_id = mastodon_app.id
    else:
        db.session.add(MastodonAuth(current_user.get_id(), mastodon_app.id))
    db.session.commit()

    return jsonify({
        'mastodon_auth_url': mastodon_app.base_url() + '/oauth/authorize'.format(domain=domain),
        'mastodon_client_id': mastodon_app.client_id,
    })


@api.route('/mastodon_token', methods=['POST'])
@login_required
def mastodon_token():
    if not app.config['ENABLE_MASTODON']:
        return abort(requests.codes.not_found)

    current_auth = db.session.query(MastodonAuth).filter(MastodonAuth.user_id == current_user.get_id()).first()
    mastodon_app = current_auth.app
    mastodon = Mastodon(
        client_id=mastodon_app.client_id,
        client_secret=mastodon_app.client_secret,
        api_base_url=mastodon_app.base_url(),
    )

    try:
        access_token = mastodon.log_in(
            code=request.json['authorization_code'],
            scopes=['read'],
            redirect_uri=urljoin(app.config['MASTODON_REDIRECT_BASE_URL'], 'mastodon_auth_complete'),
        )
        account = mastodon.account_verify_credentials()
    except MastodonAPIError:
        return abort(requests.codes.server_error)

    current_auth.update_account(access_token, account['id'], account['username'])
    current_user.mastodon_authorized = True
    db.session.commit()

    tasks.get_mastodon_posts_per_user.delay(current_user.get_id())

    return 'success', 200


@api.route('/get_twitter_oauth_token', methods=['GET'])
@login_required
def get_twitter_oauth_token():
    twitter = Twython(app.config['TWITTER_API_KEY'], app.config['TWITTER_API_SECRET'])
    auth = twitter.get_authentication_tokens(callback_url=request.url_root+'twitter_callback')
    session['oauth_token'] = auth['oauth_token']
    session['oauth_token_secret'] = auth['oauth_token_secret']
    return jsonify({'url': auth['auth_url']})


@api.route('/wait_for_twitter_callback', methods=['GET'])
@login_required
def wait_for_twitter_callback():
    return jsonify({'isTwitterAuthorized': current_user.twitter_authorized})


@api.route('/handle_twitter_callback', methods=['POST'])
@login_required
def handle_twitter_callback():
    twitter = Twython(app.config['TWITTER_API_KEY'], app.config['TWITTER_API_SECRET'],
                      session['oauth_token'], session['oauth_token_secret'])
    success = True

    try:
        final_step = twitter.get_authorized_tokens(request.json['oauth_verifier'])
        user_oauth_token = final_step['oauth_token']
        user_oauth_token_secret = final_step['oauth_token_secret']

        user_twitter = Twython(app.config['TWITTER_API_KEY'], app.config['TWITTER_API_SECRET'],
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


def get_facebook_long_auth(token):
    payload = {'grant_type': 'fb_exchange_token',
               'client_id': app.config['FACEBOOK_APP_ID'],
               'client_secret': app.config['FACEBOOK_APP_SECRET'],
               'fb_exchange_token': token
              }
    r = requests.get('https://graph.facebook.com/oauth/access_token', payload)
    if r.status_code == requests.codes.ok:
        try:
            new_facebook_auth = FacebookAuth(current_user.get_id(), r.json())
            db.session.add(new_facebook_auth)
            db.session.commit()
            # db.session.close()

            tasks.get_facebook_posts_per_user.delay(current_user.get_id())
        except:
            print('error in facebook auth')
