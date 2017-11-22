import logging
from flask import request, jsonify
from flask_login import login_required, login_user, logout_user, current_user
from sqlalchemy.exc import IntegrityError

from server.core import db, bcrypt
from server.models import User
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
            email=json_data['email'],
            password=json_data['password']
        )
    except Exception as e:
        status_text = str(e)
    if user:
        try:
            db.session.add(user)
            db.session.commit()
            status_text = 'success'
            code=200
            login_user(user, remember=True)
        except IntegrityError:
            status_text = 'A user with that e-mail already exist!'
        except Exception as e:
            status_text = 'Sorry, but something went wrong.  Please reload the page and try again.'
            logger.exception(e)
        db.session.close()
    return jsonify({'statusText': status_text}), code


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
    return jsonify({'result': current_user.is_authenticated(), 'user': current_user.get_names()})
