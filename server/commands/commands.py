import click
from flask.cli import with_appcontext

from server.core import db
from server.models import KeywordRule, User, UserKeywordRule


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


@click.command()
@click.option('--creator-id', required=True, type=int, help='ID of user to attribute creation of this rule')
@click.option('--creator-display-name', required=True, type=str, help='Name to display')
@click.option('--title', required=True, type=str, help='Rule title (short)')
@click.option('--description', required=True, type=str, help='Rule description (long)')
@click.option('--exclude-terms', required=True, type=str, help='Terms to exclude--separate by commas.')
@click.option('--shareable', required=False, type=bool, default=True, help='Whether to share the rule publicly.')
@click.option('--source', required=False, type=str, default='gobo', help='Source for how this rule was generated')
@click.option('--link', required=False, type=str, help='URL to include in the rule.')
@with_appcontext
# pylint: disable=too-many-arguments
def create_keyword_rule(creator_id, creator_display_name, title, description, exclude_terms, shareable, source, link):
    """Creates a new keyword rule."""
    split_terms = [term.strip() for term in exclude_terms.split(',')]
    rule = KeywordRule(creator_id, creator_display_name, title, description, split_terms, shareable, source, link)
    db.session.add(rule)
    db.session.commit()
    print "Successfully added rule ID: {}".format(rule.id)
    db.session.close()


@click.command()
@click.option('--user-id', required=True, type=int, help='ID of user to share role to')
@click.option('--rule-id', required=True, type=int, help='ID of user rule to share')
@click.option('--enabled', required=False, type=bool, default=False, help='Whether rule is enabled initially')
@with_appcontext
def share_rule_to_user(user_id, rule_id, enabled):
    """Share keyword rule with a specific user or modify enabled state"""
    setting = UserKeywordRule.query.filter_by(user_id=user_id, keyword_rule_id=rule_id).first()
    if setting:
        setting.enabled = enabled
        action = "updated"
    else:
        setting = UserKeywordRule(user_id, rule_id, enabled)
        db.session.add(setting)
        action = "added"
    db.session.commit()
    print "Successfully {} setting ID: {}".format(action, setting.id)
    db.session.close()


@click.command()
@click.option('--rule-id', required=True, type=int, help='ID of user rule to share')
@click.option('--enabled', required=False, type=bool, default=False, help='Whether rule is enabled initially')
@with_appcontext
def share_rule_all_users(rule_id, enabled):
    """Share keyword rule with all users and/or modify enabled state"""
    for user in User.query.all():
        setting = UserKeywordRule.query.filter_by(user_id=user.id, keyword_rule_id=rule_id).first()
        if setting:
            setting.enabled = enabled
        else:
            setting = UserKeywordRule(user.id, rule_id, enabled)
            db.session.add(setting)
    db.session.commit()
    print "Successfully added '{}' settings".format(setting.id)
    db.session.close()
