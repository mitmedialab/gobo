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
        current_user.update_last_login()
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
        post_assocs_count = (db_session.query(post_associations_table).
                             filter(post_associations_table.c.user_id == user_id)).count()
        logger.debug("  post_assocs: {}".format(post_assocs_count))
        post_assocs = (db_session.query(post_associations_table)
                       .filter(post_associations_table.c.user_id == user_id))
        post_ids = [post_id for (user_id, post_id) in post_assocs.all()]
        logger.debug("    = {} post ids".format(len(post_ids)))
        if post_assocs_count > 0:
            db_session.execute("DELETE FROM posts_associations WHERE user_id = :user_id", {'user_id': user_id})
        db_session.commit()

        # only delete the posts that no-one else is linking to
        post_ids_to_delete = []
        for pid in post_ids:
            this_posts_assocs_count = db_session.query(post_associations_table).filter(
                    post_associations_table.c.post_id == pid).count()
            logger.debug("  post {} has {} assocs".format(pid, this_posts_assocs_count))
            if this_posts_assocs_count < 2:
                post_ids_to_delete.append(pid)
        logger.debug("Need to delete {}/{} posts".format(len(post_ids_to_delete), len(post_ids)))
        for pid in post_ids_to_delete:
            db_session.query(Post).filter(Post.id == pid).delete()
        db_session.commit()

        # delete user info from other tables
        db_session.query(FacebookAuth).filter(FacebookAuth.user_id == user_id).delete()
        db_session.query(TwitterAuth).filter(TwitterAuth.user_id == user_id).delete()
        db_session.commit()

        settings_update_count = (db_session.query(SettingsUpdate).
                          filter(SettingsUpdate.user_id == user_id).
                          count())
        logger.debug("  settings_update_count: {}".format(settings_update_count))
        (db_session.query(SettingsUpdate).
         filter(SettingsUpdate.user_id == user_id).
         delete())

        settings_count = db_session.query(Settings).filter(Settings.user_id == user_id).count()
        logger.debug("  settings_count: {}".format(settings_count))
        db_session.query(Settings).filter(Settings.user_id == user_id).delete()

        # delete user from users table
        acct = db_session.query(User).filter(User.id == user_id).first()
        if acct is not None:
            db_session.delete(acct)
        else:
            logger.warning("Trying to delete user {}, but they don't exist :-(".format(user_id))
            return False
        db_session.commit()

        status = True
    except Exception as e:
        status = False
        logger.exception(e)

    db_session.close()

    return status
