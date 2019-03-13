"""empty message

Revision ID: 320fcc15decf
Revises: e1c458791003
Create Date: 2019-02-21 15:23:41.442824

"""
from alembic import op
import sqlalchemy as sa
import logging


# revision identifiers, used by Alembic.
revision = '320fcc15decf'
down_revision = 'e1c458791003'
branch_labels = None
depends_on = None

logger = logging.getLogger(__name__)


def upgrade():
    op.create_table('mastodon_apps',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('domain', sa.String(length=255), nullable=False),
    sa.Column('client_id', sa.String(length=255), nullable=False),
    sa.Column('client_secret', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )

    op.create_table('mastodon_auths',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('app_id', sa.Integer(), nullable=False),
    sa.Column('generated_on', sa.DateTime(), nullable=True),
    sa.Column('access_token', sa.String(length=255), nullable=True),
    sa.Column('mastodon_id', sa.Integer(), nullable=True),
    sa.Column('username', sa.String(length=255), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.ForeignKeyConstraint(['app_id'], ['mastodon_apps.id'], ),
    sa.PrimaryKeyConstraint('id')
    )

    op.add_column('users', sa.Column('mastodon_authorized', sa.Boolean(), server_default='f', nullable=False))


def downgrade():
    try:
        op.drop_column('users', 'mastodon_authorized')
    except Exception as e:
        logger.warn("Unable to drop add column: users.mastodon_authorized - {}".format(e))
    op.drop_table('mastodon_auths')
    op.drop_table('mastodon_apps')
