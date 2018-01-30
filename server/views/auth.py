import logging
from flask import request, jsonify
from flask_login import login_required, login_user, logout_user, current_user
from sqlalchemy.exc import IntegrityError

from server.core import db, bcrypt
from server.models import *
from server.blueprints import api

logger = logging.getLogger(__name__)


@api.route('/register', methods=['POST'])
def register():
    json_data = request.json
    code = 403
    user = False
    status_text = ''
    try:
        user = User(
            email=json_data['email'].lower(),
            password=json_data['password']
        )
    except Exception as e:
        status_text = str(e)
    if user:
        try:
            db.session.add(user)
            db.session.commit()
            status_text = 'success'
            code = 200
            login_user(user, remember=True)
        except IntegrityError:
            status_text = 'A user with that e-mail already exist!'
        except Exception as e:
            status_text = """Sorry, but something went wrong..Please reload
                              the page and try again"""
            logger.exception(e)
        db.session.close()
    return jsonify({'statusText': status_text}), code


@api.route('/login', methods=['POST'])
def login():
    json_data = request.json
    user_result = False
    user = User.query.filter_by(email=json_data['email'].lower()).first()
    if user and bcrypt.check_password_hash(
            user.password, json_data['password']):
        login_user(user, remember=True)
        user_result = user.get_names()
        current_user.set_last_login()
        status = True
    else:
        status = False

    response = jsonify({'result': status, 'user': user_result})
    return response


@api.route('/delete_acct', methods=['GET'])
@login_required
def delete_account():
    user_id = current_user.id
    status = delete_user_by_id(user_id, db.session)
    logout_user()
    return jsonify({'result': status})


@api.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify('logout')


@api.route('/confirm_auth', methods=['GET'])
@login_required
def confirm_auth():
    return jsonify({'result': current_user.is_authenticated(),
                    'user': current_user.get_names()})


def delete_user_by_id(user_id, db_session):
    try:
        # delete posts with post_associations matching user_id
        post_assocs = (db_session.query(post_associations_table)
                       .filter(post_associations_table.c.user_id == user_id))
        post_ids = [post_id for (user_id, post_id) in post_assocs.all()]
        post_assocs.delete(synchronize_session=False)

        for pid in post_ids:
            db_session.query(Post).filter(Post.id == pid).delete()

        # delete user info from other tables
        # (db.session.query(FacebookAuth)
        #     .filter(FacebookAuth.user_id == user_id)
        #     .delete())
        # (db.session.query(TwitterAuth)
        #     .filter(TwitterAuth.user_id == user_id)
        #     .delete())
        (db_session.query(SettingsUpdate)
            .filter(SettingsUpdate.user_id == user_id)
            .delete())
        db_session.query(Settings).filter(Settings.user_id == user_id).delete()

        # delete user from users table
        acct = db_session.query(User).filter(User.id == user_id).first()
        db_session.delete(acct)
        db_session.commit()

        status = True
    except Exception as e:
        print e
        status = False
        logger.exception(e)

    db_session.close()

    return status
