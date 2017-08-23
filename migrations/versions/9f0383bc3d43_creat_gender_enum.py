"""creat gender enum

Revision ID: 9f0383bc3d43
Revises: ce8b95afb3f6
Create Date: 2017-08-23 09:47:08.738454

"""
from alembic import op
import sqlalchemy as sa

from server.enums import GenderEnum
from sqlalchemy.dialects.postgresql import ENUM


# revision identifiers, used by Alembic.
revision = '9f0383bc3d43'
down_revision = 'ce8b95afb3f6'
branch_labels = None
depends_on = None


def upgrade():
    enum = ENUM(GenderEnum)
    enum.create(op.get_bind(), checkfirst=True)


def downgrade():
    ENUM(name="genderenum").drop(op.get_bind(), checkfirst=False)
