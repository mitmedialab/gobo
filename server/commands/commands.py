import click
from flask.cli import with_appcontext

from server.core import db


@click.command()
@with_appcontext
def create_db():
    """Creates the db tables."""
    db.create_all()

    # load the Alembic configuration and generate the
    # version table, "stamping" it with the most recent rev
    from alembic.config import Config
    from alembic import command
    alembic_cfg = Config("./migrations/alembic.ini")
    command.stamp(alembic_cfg, "head")


@click.command()
@with_appcontext
def drop_db():
    """Drops the db tables."""
    db.drop_all()
