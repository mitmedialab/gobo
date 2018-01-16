"""lowercase emails

Revision ID: f72e54a6c741
Revises: 23914b0b9c22
Create Date: 2018-01-16 12:11:27.615204

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f72e54a6c741'
down_revision = '23914b0b9c22'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("UPDATE users SET email = LOWER(email)")

def downgrade():
    pass
