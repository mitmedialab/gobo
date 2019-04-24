"""
Removes politics registration from user model and echo range from settings

Revision ID: 1266f69d6574
Revises: 8fe786843072
Create Date: 2019-04-24 11:12:10.724450

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1266f69d6574'
down_revision = '8fe786843072'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column('user_settings', 'echo_range')
    op.drop_column('users', 'political_affiliation')
    op.drop_column('users', 'completed_registration')


def downgrade():
    op.add_column('users', sa.Column('completed_registration', sa.BOOLEAN(), autoincrement=False, nullable=True))
    op.add_column('users', sa.Column('political_affiliation', postgresql.ENUM(u'left', u'center_left', u'center', u'center_right', u'right', name='politicsenum'), autoincrement=False, nullable=True))
    op.add_column('user_settings', sa.Column('echo_range', postgresql.ENUM(u'narrow', u'mid_narrow', u'mid', u'mid_wide', u'wide', name='echorangeenum'), autoincrement=False, nullable=True))
