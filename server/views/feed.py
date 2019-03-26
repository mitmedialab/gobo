import logging

from flask import request, jsonify
from flask_login import login_required, current_user

from server.core import db
from server.models import Post, SettingsUpdate
from server.enums import PoliticsEnum
from server.blueprints import api

logger = logging.getLogger(__name__)

PERSONAL_POSTS_MAX = 400  # how many personal posts to grab
NEWS_POSTS_COUNT = 150  # how many news posts to grab. this number should divide by 5.


@api.route('/get_posts', methods=['GET'])
@login_required
def get_posts():
    personalized_posts = current_user.posts.order_by(Post.created_at.desc())[:PERSONAL_POSTS_MAX]
    posts_from_quintile = NEWS_POSTS_COUNT / 5
    ignore_ids = [item.id for item in personalized_posts]
    for quintile in PoliticsEnum:
        posts = Post.query.filter((
            Post.id.notin_(ignore_ids)) & (Post.political_quintile == quintile)).order_by(
                Post.created_at.desc())[:posts_from_quintile]
        personalized_posts.extend(posts)

    # TODO: iterate through the rules to find any that have links
    # 1. Iterate through users_additive_rules to get rules associated with this user
    # 2. Get array of post_additive_rules
    # 3. Get posts associated with post_additive_rules
    # 4. Decorate post with rules (could have multiple rules) metadata: rules: [ {rule_id, level}]

    personalized_posts = sorted(personalized_posts, key=lambda p: p.created_at, reverse=True)
    posts_dicts = [post.as_dict() for post in personalized_posts]

    for i in range(15):
        posts_dicts[i].update({
            'rules': [{
                'id': 100,
                'level': i % 3,
            }]
        })

    return jsonify({'posts': posts_dicts})


@api.route('/get_settings', methods=['GET'])
@login_required
def get_settings():
    settings = current_user.settings.as_dict()
    settings['political_affiliation'] = current_user.political_affiliation.value
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
    success = True
    # except:
    #     print "error logging new settings for user {} to db".format(current_user.id)
    #     success = False
    return jsonify({'update_success': success})


@api.route('/get_rules', methods=['GET'])
@login_required
def get_rules():
    rules = []
    for association in current_user.keyword_rule_associations:
        serialized = association.keyword_rule.serialize()
        serialized.update(enabled=association.enabled)
        rules.append(serialized)

    # TODO: just for testing
    rules.append({
        'id': 100,
        'creator_user_id': 1,
        'creator_display_name': 'Cats',
        'link': None,
        'title': 'Turn up your cats!',
        'description': 'Why not add some cats to your days?',
        'shareable': True,
        'source': 'gobo',
        'level_min': 0,
        'level_max': 2,
        'level_display_names': ['Kittens', 'Kitties', 'Cats'],
        'level': 0,
        'enabled': False,
    })

    return jsonify({'rules': rules})


@api.route('/toggle_rules', methods=['POST'])
@login_required
def toggle_rules():
    rules_to_update = request.json['rules']
    updated = False
    for association in current_user.keyword_rule_associations:
        rule = [r for r in rules_to_update if r['id'] == association.keyword_rule_id].pop()
        if rule:
            if association.enabled is not rule['enabled']:
                association.enabled = rule['enabled']
                updated = True
            # TODO: toggle rule and set level here

    if updated:
        db.session.commit()
        db.session.close()
    return 'success', 200
