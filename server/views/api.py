import logging

import social_auth
import auth
import feed
import beta_password

from server.core import login_manager
from server.models import User

logger = logging.getLogger(__name__)


@login_manager.user_loader
def load_user(userid):
    return User.query.get(userid)
