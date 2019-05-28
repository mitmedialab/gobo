"""Adds last_active column to user model

Revision ID: 580b1372edb5
Revises: fa9be3f0eb68
Create Date: 2019-05-28 14:22:25.697522

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '580b1372edb5'
down_revision = 'fa9be3f0eb68'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('users', sa.Column('last_active', sa.DateTime(), nullable=True))


def downgrade():
    op.drop_column('users', 'last_active')
