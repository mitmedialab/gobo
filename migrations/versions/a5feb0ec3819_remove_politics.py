"""Remove politics

Revision ID: a5feb0ec3819
Revises: d0717332cec6
Create Date: 2019-05-08 11:46:34.910657

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'a5feb0ec3819'
down_revision = 'd0717332cec6'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column('posts', 'political_quintile')
    op.drop_column('posts', 'is_news')
    op.drop_column('user_settings', 'politics_levels')


def downgrade():
    op.add_column('user_settings', sa.Column('politics_levels', postgresql.ARRAY(sa.INTEGER()), autoincrement=False, nullable=True))
    op.add_column('posts', sa.Column('political_quintile', postgresql.ENUM(u'left', u'center_left', u'center', u'center_right', u'right', name='politicsenum'), autoincrement=False, nullable=True))
    op.add_column('posts', sa.Column('is_news', sa.BOOLEAN(), autoincrement=False, nullable=True))
