import logging
from flask import request, jsonify
from flask import current_app as app
from flask_login import current_user

from server.blueprints import api

logger = logging.getLogger(__name__)


@api.route('/is_locked_with_password', methods=['GET'])
def is_locked_with_password():
    step = -1
    if current_user.is_authenticated:
        step = 3
    return jsonify({'locked': app.config['LOCK_WITH_PASSWORD'], 'step': step})


@api.route('/verify_beta_password', methods=['POST'])
def verify_beta_password():
    pw = request.json['password']
    success = pw == app.config['BETA_PASSWORD']
    return jsonify({'success': success})
