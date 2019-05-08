import logging

from flask import request, jsonify
from flask_login import login_required, current_user

from server.core import db
from server.models import Post, SettingsUpdate
from server.blueprints import api
from server.utils import are_int_arrays_same

logger = logging.getLogger(__name__)

PERSONAL_POSTS_MAX = 300  # how many personal posts to grab
POSTS_QUINTILE_COUNT = 20  # how many news posts to grab. this number should divide by 5.


@api.route('/get_posts', methods=['GET'])
@login_required
def get_posts():
    personalized_posts = current_user.posts.order_by(Post.created_at.desc())[:PERSONAL_POSTS_MAX]
    ignore_ids = [item.id for item in personalized_posts]

    rule_associations = [r for r in current_user.rule_associations if r.rule.type == 'additive']
    for rule_association in rule_associations:
        posts = []
        for pa in rule_association.rule.post_associations:
            if pa.post_id not in ignore_ids:
                post = pa.post
                # save the rule metadata for returning later when serializing -- faster to cache it than join
                post.cache_rule({
                    'id': pa.rule_id,
                    'level': pa.level,
                })
                posts.append(post)

        # Future work: you may want to limit posts per quintile one quintile is dominating the feed
        posts = sorted(posts, key=lambda p: p.created_at, reverse=True)[:(POSTS_QUINTILE_COUNT*5)]
        personalized_posts.extend(posts)

    personalized_posts = sorted(personalized_posts, key=lambda p: p.created_at, reverse=True)
    posts_dicts = [post.as_dict() for post in personalized_posts]

    return jsonify({'posts': posts_dicts})


@api.route('/get_settings', methods=['GET'])
@login_required
def get_settings():
    settings = current_user.settings.as_dict()
    return jsonify(settings)


@api.route('/update_settings', methods=['POST'])
@login_required
def update_settings():
    json_data = request.json

    update = SettingsUpdate(current_user.id, json_data['settings'])
    # try:
    db.session.add(update)
    current_user.settings.update(json_data['settings'])
    db.session.commit()
    db.session.close()
    success = True
    # except:
    #     print "error logging new settings for user {} to db".format(current_user.id)
    #     success = False
    return jsonify({'update_success': success})


@api.route('/get_rules', methods=['GET'])
@login_required
def get_rules():
    rules = []
    for association in current_user.rule_associations:
        serialized = association.rule.serialize()
        serialized.update(enabled=association.enabled, levels=association.levels)
        rules.append(serialized)
    return jsonify({'rules': rules})


@api.route('/toggle_rules', methods=['POST'])
@login_required
def toggle_rules():
    rules_to_update = request.json['rules']
    updated = False
    for association in current_user.rule_associations:
        rule = [r for r in rules_to_update if r['id'] == association.rule_id].pop()
        if rule:
            if association.enabled is not rule['enabled']:
                association.enabled = rule['enabled']
                updated = True
            if not are_int_arrays_same(association.levels, rule['levels']):
                association.levels = rule['levels']
                updated = True

    if updated:
        db.session.commit()
        db.session.close()
    return 'success', 200
