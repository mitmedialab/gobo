import logging
from flask import current_app as app, url_for, render_template, request, jsonify
from flask_login import login_required, login_user, logout_user, current_user
from itsdangerous import BadData, URLSafeTimedSerializer
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import BadRequest, InternalServerError

from server.core import db
from server.models import FacebookAuth, Post, post_associations_table, Settings, SettingsUpdate, TwitterAuth, User
from server.blueprints import api


logger = logging.getLogger(__name__)
RESET_PASSWORD_SALT = 'RESET_PASSWORD'


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
        finally:
            db.session.close()
    return jsonify({'statusText': status_text}), code


@api.route('/login', methods=['POST'])
def login():
    json_data = request.json
    user_result = False
    user = User.query.filter_by(email=json_data['email'].lower()).first()
    if user and user.check_password(json_data['password']):
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
        logging.debug("Trying to delete user {}".format(user_id))
        # delete post_associations the user has
        post_assocs = (db_session.query(post_associations_table)
                       .filter(post_associations_table.c.user_id == user_id))
        logging.debug("  found {} post_associations".format(len(post_assocs.all())))

        # delete only the posts the user is associated with that no one else is
        user_post_assocs = (db_session.query(post_associations_table.c.post_id)
                            .group_by(post_associations_table.c.post_id)
                            .having(db.func.count('*') == 1)
                            .filter(post_associations_table.c.user_id == user_id))

        post_ids = [post_id for (post_id,) in user_post_assocs.all()]
        logging.debug("  found {} posts belonging to only them".format(len(post_ids)))

        # TODO: fix this eventually
        # pylint: disable=len-as-condition
        if len(post_assocs.all()) > 0:
            post_assocs.delete(synchronize_session=False)
        db_session.commit()

        # TODO: fix this eventually
        # pylint: disable=len-as-condition
        if len(post_ids) > 0:
            db_session.query(Post).filter(Post.id.in_(post_ids)).delete(synchronize_session=False)

        # delete user info from other tables
        (db_session.query(FacebookAuth)
         .filter(FacebookAuth.user_id == user_id)
         .delete())
        (db_session.query(TwitterAuth)
         .filter(TwitterAuth.user_id == user_id)
         .delete())
        (db_session.query(SettingsUpdate)
         .filter(SettingsUpdate.user_id == user_id)
         .delete())
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


@api.route('/email_reset_password', methods=["POST"])
def email_reset_password():
    json_data = request.json
    email = json_data['email']
    user = User.query.filter_by(email=email).first_or_404()
    token = URLSafeTimedSerializer(app.config["SECRET_KEY"]).dumps(user.email, salt=RESET_PASSWORD_SALT)
    password_reset_url = url_for('home.reset_password', token=token)

    html = render_template(
        'email/forgot-password.html',
        password_reset_url=password_reset_url)

    subject = password_reset_url
    return send_email(user.email, subject, html)


# TODO: send an email and do it from utils?
def send_email(email, subject, html):
    logger.debug(subject)
    return jsonify({'statusText': 'Email sent'})


@api.route('/reset_password', methods=["POST"])
def reset_with_token():
    json_data = request.json
    token = json_data['token']
    password = json_data['password']
    ts = URLSafeTimedSerializer(app.config["SECRET_KEY"])

    try:
        hour = 86400
        email = ts.loads(token, salt=RESET_PASSWORD_SALT, max_age=hour)
        user = User.query.filter_by(email=email).first_or_404()
        user.password = password
        db.session.add(user)
        db.session.commit()
    except BadData as e:
        logger.exception(e)
        raise BadRequest('Token invalid')
    except Exception as e:
        logger.exception(e)
        raise InternalServerError()
    finally:
        db.session.close()

    return jsonify({'statusText': 'Password updated'})
