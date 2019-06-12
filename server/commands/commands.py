import click
from flask.cli import with_appcontext

from server.core import db
from server.models import AdditiveRule, AdditiveRuleLink, KeywordRule, Rule, User, UserRule


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
@click.option('--control-display-name', required=True, type=str, help='Text to display on the toggle.')
@click.option('--shareable', required=False, type=bool, default=True, help='Whether to share the rule publicly.')
@click.option('--source', required=False, type=str, default='gobo', help='Source for how this rule was generated')
@click.option('--link', required=False, type=str, help='URL to include in the rule.')
@with_appcontext
# pylint: disable=too-many-arguments
def create_keyword_rule(creator_id, creator_display_name, title, description, exclude_terms, control_display_name,
                        shareable, source, link):
    """Creates a new keyword rule."""
    split_terms = [term.strip() for term in exclude_terms.split(',')]
    rule = KeywordRule(creator_id, creator_display_name, title, description, shareable, source, link, split_terms,
                       control_display_name)
    db.session.add(rule)
    db.session.commit()
    print("Successfully added rule ID: {}".format(rule.id))
    db.session.close()


@click.command()
@click.option('--creator-id', required=True, type=int, help='ID of user to attribute creation of this rule')
@click.option('--creator-display-name', required=True, type=str, help='Name to display')
@click.option('--title', required=True, type=str, help='Rule title (short)')
@click.option('--description', required=True, type=str, help='Rule description (short for display under title)')
@click.option('--long-description', required=True, type=str, help='Detailed rule description')
@click.option('--level-names', required=True, type=str,
              help='Labels to display for each level (comma delimited and in order)')
@click.option('--shareable', required=False, type=bool, default=True, help='Whether to share the rule publicly.')
@click.option('--source', required=False, type=str, default='gobo', help='Source for how this rule was generated')
@click.option('--link', required=False, type=str, help='URL to include in the rule.')
@with_appcontext
# pylint: disable=too-many-arguments
def create_additive_rule(creator_id, creator_display_name, title, description, long_description, level_names,
                         shareable, source, link):
    """Creates a new keyword rule."""
    split_terms = [term.strip() for term in level_names.split(',')]
    rule = AdditiveRule(creator_id, creator_display_name, title, description, long_description, shareable, source, link,
                        split_terms)
    db.session.add(rule)
    db.session.commit()
    print("Successfully added rule ID: {}".format(rule.id))
    db.session.close()


@click.command()
@click.option('--rule-id', required=True, type=int, help='ID of user rule to delete')
@with_appcontext
def delete_rule(rule_id):
    db.session.delete(Rule.query.filter_by(id=rule_id).first())
    db.session.commit()
    print("Deleted rule ID: {}".format(rule_id))
    db.session.close()


@click.command()
@click.option('--user-id', required=True, type=int, help='ID of user to share role to')
@click.option('--rule-id', required=True, type=int, help='ID of user rule to share')
@click.option('--enabled', required=False, type=bool, default=False, help='Whether rule is enabled initially')
@with_appcontext
def share_rule_to_user(user_id, rule_id, enabled):
    """Share keyword rule with a specific user or modify enabled state"""
    setting = UserRule.query.filter_by(user_id=user_id, rule_id=rule_id).first()
    if setting:
        setting.enabled = enabled
        action = "updated"
    else:
        setting = UserRule(user_id, rule_id, enabled)
        db.session.add(setting)
        action = "added"
    db.session.commit()
    print("Successfully {} setting ID: {}".format(action, setting.id))
    db.session.close()


@click.command()
@click.option('--rule-id', required=True, type=int, help='ID of user rule to share')
@click.option('--enabled', required=False, type=bool, default=False, help='Whether rule is enabled initially')
@with_appcontext
def share_rule_all_users(rule_id, enabled):
    """Share rule with all users and/or modify enabled state"""
    for user in User.query.all():
        setting = UserRule.query.filter_by(user_id=user.id, rule_id=rule_id).first()
        if setting:
            setting.enabled = enabled
        else:
            setting = UserRule(user.id, rule_id, enabled)
            db.session.add(setting)
    db.session.commit()
    print("Successfully added settings")
    db.session.close()


@click.command()
@click.option('--rule-id', required=True, type=int, help='Rule ID')
@click.option('--level', required=True, type=int, help='Level to categorize this link for the additive rule')
@click.option('--source', required=True, type=str, help='Twitter and Facebook are supported only')
@click.option('--link', required=True, type=str, help='URI to pull from')
@click.option('--name', required=True, type=str, help='Label to display for the link in the UI')
@click.option('--display-uri', required=False, type=str, default=False, help='URI to link to in the UI')
@with_appcontext
# pylint: disable=too-many-arguments
def add_additive_rule_link(rule_id, level, source, link, name, display_uri):
    """Add link for an additive rule"""
    if source not in ['twitter', 'facebook']:
        print("Only Facebook and Twitter links are supported currently")
        return

    rule = AdditiveRule.query.filter_by(id=rule_id).first()
    if rule:
        rule_link = AdditiveRuleLink(rule_id, source, link, level, name, display_uri)
        db.session.add(rule_link)
        db.session.commit()
        print("Successfully added link")
        db.session.close()
    else:
        print("No rule ID '{}' found".format(rule_id))
