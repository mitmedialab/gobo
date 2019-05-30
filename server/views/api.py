# pylint: disable=unused-import
import logging

import server.views.social_auth
import server.views.auth
import server.views.feed
import server.views.beta_password

from server.core import login_manager
from server.models import User

logger = logging.getLogger(__name__)


@login_manager.user_loader
def load_user(userid):
    return User.query.get(userid)
