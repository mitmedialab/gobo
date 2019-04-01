"""Adds additive rules and consolidates keyword rule into it.

Revision ID: 3517ac55b471
Revises: 5e47480e9575
Create Date: 2019-03-27 12:56:21.133148

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '3517ac55b471'
down_revision = '5e47480e9575'
branch_labels = None
depends_on = None


def upgrade():
    op.create_table('rules',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('creator_user_id', sa.Integer(), nullable=False),
    sa.Column('creator_display_name', sa.String(length=255), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('description', sa.String(length=255), nullable=False),
    sa.Column('long_description', sa.String(length=255), nullable=True),
    sa.Column('shareable', sa.Boolean(), nullable=False),
    sa.Column('source', sa.String(length=255), nullable=False),
    sa.Column('link', sa.String(length=255), nullable=True),
    sa.Column('exclude_terms', sa.ARRAY(sa.String(length=255)), nullable=True),
    sa.Column('level_min', sa.Integer(), nullable=True),
    sa.Column('level_min_name', sa.String(length=255), nullable=True),
    sa.Column('level_max', sa.Integer(), nullable=True),
    sa.Column('level_max_name', sa.String(length=255), nullable=True),
    sa.Column('type', sa.String(length=255), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('last_modified', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['creator_user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('additive_rule_links',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('rule_id', sa.Integer(), nullable=False),
    sa.Column('source', sa.String(length=255), nullable=False),
    sa.Column('uri', sa.String(length=255), nullable=False),
    sa.Column('level', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('last_modified', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['rule_id'], ['rules.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('posts_additive_rules',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('rule_id', sa.Integer(), nullable=False),
    sa.Column('post_id', sa.Integer(), nullable=False),
    sa.Column('level', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('last_modified', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['post_id'], ['posts.id'], ondelete='CASCADE'),
    sa.ForeignKeyConstraint(['rule_id'], ['rules.id'], ondelete='CASCADE'),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users_rules',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('rule_id', sa.Integer(), nullable=False),
    sa.Column('enabled', sa.Boolean(), nullable=False),
    sa.Column('level', sa.Integer(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=False),
    sa.Column('last_modified', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['rule_id'], ['rules.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_table('users_keyword_rules')
    op.drop_table('keyword_rules')


def downgrade():
    op.create_table('keyword_rules',
    sa.Column('id', sa.INTEGER(), server_default=sa.text(u"nextval('keyword_rules_id_seq'::regclass)"), nullable=False),
    sa.Column('creator_user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('creator_display_name', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('link', sa.VARCHAR(length=255), autoincrement=False, nullable=True),
    sa.Column('title', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('description', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('exclude_terms', postgresql.ARRAY(sa.VARCHAR(length=255)), autoincrement=False, nullable=False),
    sa.Column('shareable', sa.BOOLEAN(), autoincrement=False, nullable=False),
    sa.Column('source', sa.VARCHAR(length=255), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('last_modified', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['creator_user_id'], [u'users.id'], name=u'keyword_rules_creator_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name=u'keyword_rules_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_table('users_keyword_rules',
    sa.Column('id', sa.INTEGER(), nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('keyword_rule_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('enabled', sa.BOOLEAN(), autoincrement=False, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.Column('last_modified', postgresql.TIMESTAMP(), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['keyword_rule_id'], [u'keyword_rules.id'], name=u'users_keyword_rules_keyword_rule_id_fkey'),
    sa.ForeignKeyConstraint(['user_id'], [u'users.id'], name=u'users_keyword_rules_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name=u'users_keyword_rules_pkey')
    )
    op.drop_table('users_rules')
    op.drop_table('posts_additive_rules')
    op.drop_table('additive_rule_links')
    op.drop_table('rules')
