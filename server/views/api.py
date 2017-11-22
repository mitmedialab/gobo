import logging

from server.core import login_manager
from server.models import User

logger = logging.getLogger(__name__)

import beta_password
import feed
import auth
import social_auth


@login_manager.user_loader
def load_user(userid):
    return User.query.get(userid)
