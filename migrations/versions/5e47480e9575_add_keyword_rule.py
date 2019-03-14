"""Add rules keyword

Revision ID: 5e47480e9575
Revises: 320fcc15decf
Create Date: 2019-03-11 13:10:21.669552

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5e47480e9575'
down_revision = '320fcc15decf'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('keyword_rules',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('creator_user_id', sa.Integer(), nullable=False),
    sa.Column('creator_display_name', sa.String(length=255), nullable=False),
    sa.Column('link', sa.String(length=255)),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=False),
    sa.Column('exclude_terms', sa.ARRAY(sa.String(length=255)), nullable=False),
    sa.Column('shareable', sa.Boolean(), nullable=False),
    sa.Column('source', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('last_modified', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['creator_user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users_keyword_rules',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('keyword_rule_id', sa.Integer(), nullable=False),
    sa.Column('enabled', sa.Boolean(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('last_modified', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['keyword_rule_id'], ['keyword_rules.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )


def downgrade():
    op.drop_table('users_keyword_rules')
    op.drop_table('keyword_rules')
