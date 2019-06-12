"""Adds control display name to keyword rules

Revision ID: b7bdfb8d5252
Revises: 580b1372edb5
Create Date: 2019-06-12 16:34:19.034578

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b7bdfb8d5252'
down_revision = '580b1372edb5'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('rules', sa.Column('control_display_name', sa.String(length=255), nullable=True))


def downgrade():
    op.drop_column('rules', 'control_display_name')
