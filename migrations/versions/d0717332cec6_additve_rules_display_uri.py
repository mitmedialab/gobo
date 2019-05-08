"""Additive rules display URI

Revision ID: d0717332cec6
Revises: 8f8083a8ad61
Create Date: 2019-05-08 10:02:43.067332

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd0717332cec6'
down_revision = '8f8083a8ad61'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('additive_rule_links', sa.Column('display_uri', sa.String(length=255), nullable=True))


def downgrade():
    op.drop_column('additive_rule_links', 'display_uri')
