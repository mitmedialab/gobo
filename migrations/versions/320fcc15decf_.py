"""empty message

Revision ID: 320fcc15decf
Revises: e1c458791003
Create Date: 2019-02-21 15:23:41.442824

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '320fcc15decf'
down_revision = 'e1c458791003'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('mastodon_auths',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('domain', sa.String(length=255), nullable=False),
    sa.Column('generated_on', sa.DateTime(), nullable=True),
    sa.Column('access_token', sa.String(length=255), nullable=True),
    sa.Column('mastodon_id', sa.Integer(), nullable=True),
    sa.Column('username', sa.String(length=255), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.add_column('users', sa.Column('mastodon_authorized', sa.Boolean(), nullable=False, default=False, server_default='f'))


def downgrade():
    op.drop_column('users', 'mastodon_authorized')
    op.drop_table('mastodon_auths')
