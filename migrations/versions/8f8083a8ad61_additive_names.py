"""Update additive rules and links to include display names

Revision ID: 8f8083a8ad61
Revises: 1266f69d6574
Create Date: 2019-05-01 16:10:45.212412

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '8f8083a8ad61'
down_revision = '1266f69d6574'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('additive_rule_links', sa.Column('display_name', sa.String(length=255), nullable=False,
                                                   server_default=''))
    op.add_column('rules', sa.Column('level_display_names', sa.ARRAY(sa.String(length=255)), nullable=True))
    op.alter_column('rules', 'long_description', existing_type=sa.VARCHAR(length=255), type_=sa.String(length=510),
                    existing_nullable=True)
    op.drop_column('rules', 'level_max')
    op.drop_column('rules', 'level_min_name')
    op.drop_column('rules', 'level_max_name')
    op.drop_column('rules', 'level_min')


def downgrade():
    op.add_column('rules', sa.Column('level_min', sa.INTEGER(), autoincrement=False, nullable=True))
    op.add_column('rules', sa.Column('level_max_name', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
    op.add_column('rules', sa.Column('level_min_name', sa.VARCHAR(length=255), autoincrement=False, nullable=True))
    op.add_column('rules', sa.Column('level_max', sa.INTEGER(), autoincrement=False, nullable=True))
    op.alter_column('rules', 'long_description', existing_type=sa.String(length=510), type_=sa.VARCHAR(length=255),
                    existing_nullable=True)
    op.drop_column('rules', 'level_display_names')
    op.drop_column('additive_rule_links', 'display_name')
