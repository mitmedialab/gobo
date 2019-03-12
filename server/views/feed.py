import logging

from flask import request, jsonify
from flask_login import login_required, current_user

from server.core import db
from server.models import Post, SettingsUpdate, KeywordRule, UserKeywordRule
from server.enums import PoliticsEnum
from server.blueprints import api

logger = logging.getLogger(__name__)

PERSONAL_POSTS_MAX = 400  # how many personal posts to grab
NEWS_POSTS_COUNT = 150  # how many news posts to grab. this number should divide by 5.


@api.route('/get_posts', methods=['GET'])
@login_required
def get_posts():
    personal_posts = current_user.posts.order_by(Post.created_at.desc())[:PERSONAL_POSTS_MAX]
    posts_from_quintile = NEWS_POSTS_COUNT / 5
    ignore_ids = [item.id for item in personal_posts]
    for quintile in PoliticsEnum:
        posts = Post.query.filter((
            Post.id.notin_(ignore_ids)) & (Post.political_quintile == quintile)).order_by(
                Post.created_at.desc())[:posts_from_quintile]
        personal_posts.extend(posts)

    personal_posts = sorted(personal_posts, key=lambda p: p.created_at, reverse=True)

    return jsonify({'posts': [post.as_dict() for post in personal_posts]})


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
    rules = [association.keyword_rule.serialize() for association in current_user.keyword_rule_associations]
    return jsonify({'rules': rules})


@api.route('/toggle_rules', methods=['POST'])
@login_required
def toggle_rules():
    rules_to_update = request.json['rules']
    updated = False
    for association in current_user.keyword_rule_associations:
        rule = filter(lambda r: r['id'] == association.keyword_rule_id, rules_to_update).pop()
        if rule:
            association.enabled = rule['enabled']
            updated = True
    if updated:
        db.session.commit()
    return 'success', 200
