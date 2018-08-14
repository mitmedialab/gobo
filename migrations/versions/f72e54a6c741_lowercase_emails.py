"""lowercase emails

Revision ID: f72e54a6c741
Revises: 
Create Date: 2018-01-16 12:11:27.615204

"""
from alembic import op
import sqlalchemy as sa
import logging

# revision identifiers, used by Alembic.
revision = 'f72e54a6c741'
down_revision = None
branch_labels = None
depends_on = None

logger = logging.getLogger(__name__)


def upgrade():
    try:
        op.execute("UPDATE users SET email = LOWER(email)")
    except Exception as e:
        logger.warn("Couldn't lowercase all emails - {}".format(e))


def downgrade():
    pass
