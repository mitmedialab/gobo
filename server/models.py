# pylint: disable=too-many-instance-attributes,no-self-use,too-many-arguments

import datetime

from sqlalchemy import event
from sqlalchemy.types import ARRAY
from sqlalchemy.ext.hybrid import hybrid_property

from server.core import db, bcrypt
from server.enums import GenderEnum, PoliticsEnum

post_associations_table = db.Table('posts_associations', db.metadata,
                                   db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
                                   db.Column('post_id', db.Integer, db.ForeignKey('posts.id')),
                                   db.PrimaryKeyConstraint('user_id', 'post_id'))


class User(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    _password = db.Column('password', db.String(255), nullable=False)
    registered_on = db.Column(db.DateTime, nullable=False)

    last_login = db.Column(db.DateTime, nullable=True)
    last_post_fetch = db.Column(db.DateTime, nullable=True)

    facebook_name = db.Column(db.String(255))
    facebook_picture_url = db.Column(db.String(255))
    facebook_id = db.Column(db.String(255))
    facebook_email = db.Column(db.String(255))
    twitter_name = db.Column(db.String(255))
    twitter_id = db.Column(db.String(255))

    facebook_auth = db.relationship("FacebookAuth", uselist=False, back_populates="user",
                                    cascade="delete, delete-orphan")
    twitter_auth = db.relationship("TwitterAuth", uselist=False, back_populates="user",
                                   cascade="delete, delete-orphan")
    mastodon_auth = db.relationship("MastodonAuth", uselist=False, back_populates="user",
                                    cascade="delete, delete-orphan")

    twitter_authorized = db.Column(db.Boolean, nullable=False, default=False)
    facebook_authorized = db.Column(db.Boolean, nullable=False, default=False)
    mastodon_authorized = db.Column(db.Boolean, nullable=False, default=False, server_default='f')

    twitter_data = db.Column(db.JSON)
    facebook_data = db.Column(db.JSON)

    posts = db.relationship("Post", secondary=post_associations_table, lazy='dynamic')
    settings = db.relationship("Settings", uselist=False, back_populates="user")
    rule_associations = db.relationship("UserRule", back_populates="user", cascade="delete, delete-orphan")


    def __init__(self, email, password):
        self.email = email
        self.password = password
        self.registered_on = datetime.datetime.now()
        self.last_login = datetime.datetime.now()
        settings = Settings()
        self.settings = settings

    @hybrid_property
    def password(self):  # pylint: disable=method-hidden
        return self._password

    @password.setter
    def password(self, plaintext):
        self._password = bcrypt.generate_password_hash(plaintext)

    def check_password(self, plaintext):
        return bcrypt.check_password_hash(self.password, plaintext)

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

    def get_last_login(self):
        return self.last_login

    def get_last_post_fetch(self):
        return self.last_post_fetch

    def get_names(self):
        d = {c.name: getattr(self, c.name) for c in self.__table__.columns if c.name not in [
            'password', 'id', 'posts', 'settings', 'facebook_data']}
        d['mastodon_name'] = ''
        d['mastodon_domain'] = ''
        if self.mastodon_auth:
            d['mastodon_name'] = self.mastodon_auth.username
            d['mastodon_domain'] = self.mastodon_auth.app.domain
        d['avatar'] = self.twitter_data['profile_image_url_https'] if self.twitter_data else self.facebook_picture_url
        return d

    def update_last_login(self):
        self.last_login = datetime.datetime.now()
        db.session.commit()

    def update_last_post_fetch(self):
        self.last_post_fetch = datetime.datetime.now()
        db.session.commit()

    def set_facebook_data(self, data):
        self.facebook_name = data['name'] if 'name' in data else ''
        self.facebook_email = data['email'] if 'email' in data else ''
        self.facebook_id = data['id']
        if 'picture' in data:
            if 'data' in data['picture']:
                if 'url' in data['picture']['data']:
                    self.facebook_picture_url = data['picture']['data']['url']
        self.facebook_data = data
        self.facebook_authorized = True
        db.session.commit()

    def set_twitter_data(self, twitter_id, name, data):
        self.twitter_name = name
        self.twitter_id = twitter_id
        self.twitter_data = data
        self.twitter_authorized = True
        db.session.commit()

    def __repr__(self):
        return '<User {0}>'.format(self.email)


class FacebookAuth(db.Model):
    __tablename__ = "facebook_auths"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship("User", back_populates="facebook_auth")
    generated_on = db.Column(db.DateTime, nullable=False)
    access_token = db.Column(db.String(255), nullable=False)
    token_type = db.Column(db.String(255), nullable=False)
    expires_in = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, facebook_auth_data):
        self.user_id = user_id
        self.generated_on = datetime.datetime.now()
        self.access_token = facebook_auth_data['access_token']
        self.token_type = facebook_auth_data['token_type']
        self.expires_in = self.generated_on + datetime.timedelta(seconds=int(facebook_auth_data['expires_in']))


class TwitterAuth(db.Model):
    __tablename__ = "twitter_auths"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship("User", back_populates="twitter_auth")
    generated_on = db.Column(db.DateTime, nullable=False)
    oauth_token = db.Column(db.String(255), nullable=False)
    oauth_token_secret = db.Column(db.String(255), nullable=False)

    def __init__(self, user_id, oauth_token, oauth_token_secret):
        self.user_id = user_id
        self.generated_on = datetime.datetime.now()
        self.oauth_token = oauth_token
        self.oauth_token_secret = oauth_token_secret


class MastodonAuth(db.Model):
    __tablename__ = "mastodon_auths"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship("User", back_populates="mastodon_auth")
    created_at = db.Column(db.DateTime, nullable=False)
    app_id = db.Column(db.Integer, db.ForeignKey('mastodon_apps.id'), nullable=False)
    app = db.relationship("MastodonApp", back_populates="auths")
    generated_on = db.Column(db.DateTime, nullable=True)
    access_token = db.Column(db.String(255), nullable=True)
    mastodon_id = db.Column(db.Integer, nullable=True)
    username = db.Column(db.String(255), nullable=True)

    def __init__(self, user_id, app_id):
        self.user_id = user_id
        self.app_id = app_id
        self.created_at = datetime.datetime.now()

    def update_account(self, access_token, mastodon_id, username):
        self.access_token = access_token
        self.generated_on = datetime.datetime.now()
        self.mastodon_id = mastodon_id
        self.username = username


class MastodonApp(db.Model):
    __tablename__ = "mastodon_apps"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    domain = db.Column(db.String(255), nullable=False)
    client_id = db.Column(db.String(255), nullable=False)
    client_secret = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    auths = db.relationship("MastodonAuth", back_populates="app")

    def __init__(self, domain, client_id, client_secret):
        self.domain = domain
        self.client_id = client_id
        self.client_secret = client_secret
        self.created_at = datetime.datetime.now()

    def base_url(self):
        return 'https://{domain}'.format(domain=self.domain)


class Settings(db.Model):
    __tablename__ = "user_settings"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship("User", back_populates="settings")
    rudeness_min = db.Column(db.Float, db.CheckConstraint('rudeness_min>=0'), default=0)
    rudeness_max = db.Column(db.Float, db.CheckConstraint('rudeness_max<=1'), default=1)
    gender_filter_on = db.Column(db.Boolean, default=False)
    gender_female_per = db.Column(db.Integer, db.CheckConstraint('gender_female_per>=0 AND gender_female_per<=100'),
                                  default=50)
    include_corporate = db.Column(db.Boolean, default=True)
    virality_min = db.Column(db.Float, db.CheckConstraint('virality_min>=0'), default=0)
    virality_max = db.Column(db.Float, db.CheckConstraint('virality_max<=1'), default=1)
    seriousness_min = db.Column(db.Float, db.CheckConstraint('seriousness_min>=0'), default=0)
    seriousness_max = db.Column(db.Float, db.CheckConstraint('seriousness_max<=1'), default=1)
    politics_levels = db.Column(ARRAY(db.Integer))

    rudeness_ck = db.CheckConstraint('rudeness_max>rudeness_min')
    virality_ck = db.CheckConstraint('virality_max>virality_min')
    seriousness_ck = db.CheckConstraint('seriousness_max>seriousness_min')

    def as_dict(self):
        d = {c.name: getattr(self, c.name) for c in self.__table__.columns}
        return d

    def update(self, settings_dict):
        self.rudeness_min = settings_dict['rudeness_min']
        self.rudeness_max = settings_dict['rudeness_max']
        self.gender_filter_on = settings_dict['gender_filter_on']
        self.gender_female_per = settings_dict['gender_female_per']
        self.include_corporate = settings_dict['include_corporate']
        self.virality_min = settings_dict['virality_min']
        self.virality_max = settings_dict['virality_max']
        self.seriousness_min = settings_dict['seriousness_min']
        self.seriousness_max = settings_dict['seriousness_max']
        self.politics_levels = settings_dict['politics_levels']


class SettingsUpdate(db.Model):
    __tablename__ = "settings_updates"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    update_time = db.Column(db.DateTime, nullable=False)
    new_settings = db.Column(db.JSON, nullable=False)

    def __init__(self, user_id, new_settings):
        self.user_id = user_id
        self.update_time = datetime.datetime.now()
        self.new_settings = new_settings


class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    original_id = db.Column(db.String(40), nullable=False)
    content = db.Column(db.JSON, nullable=False)
    source = db.Column(db.String(255), nullable=False)
    retrieved_at = db.Column(db.DateTime, nullable=False)
    created_at = db.Column(db.DateTime)

    # filters
    is_news = db.Column(db.Boolean)
    toxicity = db.Column(db.Float)
    gender = db.Column(db.Enum(GenderEnum))
    is_corporate = db.Column(db.Boolean)
    virality_count = db.Column(db.Integer)
    has_link = db.Column(db.Boolean)
    news_score = db.Column(db.Float)
    political_quintile = db.Column(db.Enum(PoliticsEnum))

    db.UniqueConstraint('source_id', 'source', name='post_id')
    rule_associations = db.relationship("PostAdditiveRule", back_populates="post", cascade="delete, delete-orphan")

    rules = None

    __mapper_args__ = {
        'polymorphic_on': source,
    }

    def __init__(self, original_id, source, content, is_news):
        self.original_id = original_id
        self.source = source
        self.content = content
        self.is_news = is_news
        self.retrieved_at = datetime.datetime.now()
        self.rules = None
        if source == 'twitter':
            self.created_at = datetime.datetime.strptime(content['created_at'], '%a %b %d %H:%M:%S +0000 %Y')
            # TODO: fix this eventually
            # pylint: disable=len-as-condition
            self.has_link = len(content['entities']['urls']) > 0  # 'possibly_sensitive' in content
        elif source == 'facebook':
            self.created_at = datetime.datetime.strptime(content['created_time'], '%Y-%m-%dT%H:%M:%S+0000')
            self.has_link = content['type'] == 'link'
        elif source == 'mastodon':
            self.created_at = content['created_at']
            if content['card'] and content['card']['type']:
                self.has_link = content['card']['type'].lower() == 'link'
            else:
                self.has_link = False

    def as_dict(self):
        d = {c.name: getattr(self, c.name) for c in self.__table__.columns
             if c.name not in ['gender', 'political_quintile']}
        d['gender'] = str(self.gender)
        d['political_quintile'] = self.political_quintile.value if self.political_quintile else None

        # using the cache saves time over db lookups
        if self.rules:
            d['rules'] = self.rules
        return d

    def cache_rule(self, rule):
        """Cache a list of rule dicts that this post has associated with it for serializing later."""
        if self.rules is None:
            self.rules = []
        self.rules.append(rule)

    def get_text(self):
        raise NotImplementedError

    def has_toxicity_rate(self):
        return self.toxicity is not None

    def update_content(self, content, is_news=False):
        self.content.update(content)
        if is_news:
            self.is_news = True

    def update_toxicity(self, score):
        self.toxicity = score
        db.session.commit()

    def update_gender_corporate(self, gender, corporate):
        self.gender = gender
        self.is_corporate = corporate
        db.session.commit()

    def has_gender_corporate(self):
        return (self.gender is not None) and (self.is_corporate is not None)

    def get_precomputed_gender(self):
        return None

    def has_precomputed_corporate(self):
        return None

    def has_virality(self):
        return self.virality_count is not None

    def has_news_score(self):
        return self.news_score is not None

    def has_already_been_analyzed(self):
        return self.has_virality() and self.has_news_score() and self.has_gender_corporate()\
            and self.has_toxicity_rate()

    def get_urls(self):
        raise NotImplementedError

    def get_author_name(self):
        raise NotImplementedError

    def get_likes_count(self):
        raise NotImplementedError

    def get_comments_count(self):
        raise NotImplementedError

    def get_shares_count(self):
        raise NotImplementedError


class TwitterPost(Post):
    __mapper_args__ = {
        'polymorphic_identity': 'twitter'
    }

    def get_author_name(self):
        if 'retweeted_status' in self.content:
            return self.content['retweeted_status']['user']['name']
        return self.content['user']['name']

    def get_text(self):
        return self.content['full_text'] if 'full_text' in self.content else self.content['text']

    def get_urls(self):
        return [x['expanded_url'] for x in self.content['entities']['urls']]

    def get_likes_count(self):
        return self.content['favorite_count']

    def get_comments_count(self):
        # getting comments count via API bumps up against rate limit very quickly
        return 0

    def get_shares_count(self):
        return self.content['retweet_count']


class FacebookPost(Post):
    __mapper_args__ = {
        'polymorphic_identity': 'facebook'
    }

    def get_author_name(self):
        author = ''
        if 'from' in self.content and 'name' in self.content['from']:
            author = self.content['from']['name']
        return author

    def get_text(self):
        return self.content['message'] if 'message' in self.content else ""

    def get_urls(self):
        return [self.content['link']] if 'link' in self.content else []

    def get_likes_count(self):
        return self.content['reactions']['summary']['total_count']

    def get_comments_count(self):
        return self.content['comments']['summary']['total_count']

    def get_shares_count(self):
        if 'shares' in self.content:
            return self.content['shares']['count']
        return 0

    def get_precomputed_gender(self):
        if 'from' in self.content and 'gender' in self.content['from']:
            return self.content['from']['gender']
        return None

    def has_precomputed_corporate(self):
        if 'from' in self.content and 'category' in self.content['from']:
            return True
        return False


class MastodonPost(Post):
    __mapper_args__ = {
        'polymorphic_identity': 'mastodon'
    }

    def get_author_name(self):
        return self.content['account']['display_name'] or self.content['account']['username']

    def get_text(self):
        return self.content['content']

    def get_urls(self):
        return [self.content['card']['url']]

    def get_likes_count(self):
        return self.content['favourites_count']

    def get_comments_count(self):
        return self.content['replies_count']

    def get_shares_count(self):
        return self.content['reblogs_count']


class Rule(db.Model):
    __tablename__ = "rules"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    creator_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    creator_display_name = db.Column(db.String(255), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255), nullable=False)
    long_description = db.Column(db.String(510))
    source = db.Column(db.String(255), nullable=False)
    shareable = db.Column(db.Boolean, nullable=False)
    link = db.Column(db.String(255))
    exclude_terms = db.Column(ARRAY(db.String(255)))
    level_display_names = db.Column(ARRAY(db.String(255)))
    type = db.Column(db.String(255), nullable=False)  # e.g. additive, keyword
    created_at = db.Column(db.DateTime, nullable=False)
    last_modified = db.Column(db.DateTime, nullable=False)

    user_associations = db.relationship("UserRule", back_populates="rule", cascade="delete, delete-orphan")

    __mapper_args__ = {
        'polymorphic_on': type,
    }

    def __init__(self, creator_user_id, creator_display_name, title, description, shareable, source, link, rule_type):
        self.creator_user_id = creator_user_id
        self.creator_display_name = creator_display_name
        self.title = title
        self.description = description
        self.shareable = shareable
        self.source = source
        self.link = link
        self.created_at = datetime.datetime.now()
        self.last_modified = datetime.datetime.now()
        self.type = rule_type

    def serialize(self):
        return {
            'id': self.id,
            'creator_display_name': self.creator_display_name,
            'title': self.title,
            'description': self.description,
            'link': self.link,
            'type': self.type,
        }


class AdditiveRule(Rule):
    __mapper_args__ = {
        'polymorphic_identity': 'additive'
    }

    additive_links = db.relationship("AdditiveRuleLink", back_populates="rule", cascade="delete, delete-orphan")
    post_associations = db.relationship("PostAdditiveRule", back_populates="rule", cascade="delete, delete-orphan")

    def __init__(self, creator_user_id, creator_display_name, title, description, long_description, shareable, source,
                 link, level_names):
        super(AdditiveRule, self).__init__(creator_user_id, creator_display_name, title, description, shareable, source,
                                           link, 'additive')
        self.long_description = long_description
        self.level_display_names = level_names

    def serialize(self):
        rule_dict = super(AdditiveRule, self).serialize()
        rule_dict.update({
            'level_display_names': self.level_display_names,
            'long_description': self.long_description,
        })

        if self.additive_links:
            links = []
            for link in self.additive_links:
                links.append(link.serialize())
            rule_dict.update({
                'links': links
            })
        return rule_dict


class KeywordRule(Rule):
    __mapper_args__ = {
        'polymorphic_identity': 'keyword'
    }

    def __init__(self, creator_user_id, creator_display_name, title, description, shareable, source, link,
                 exclude_terms):
        super(KeywordRule, self).__init__(creator_user_id, creator_display_name, title, description, shareable,
                                          source, link, 'keyword')
        self.exclude_terms = exclude_terms

    def serialize(self):
        rule_dict = super(KeywordRule, self).serialize()
        rule_dict.update({
            'exclude_terms': self.exclude_terms,
        })
        return rule_dict


class UserRule(db.Model):
    __tablename__ = "users_rules"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    rule_id = db.Column(db.Integer, db.ForeignKey('rules.id'), nullable=False)
    enabled = db.Column(db.Boolean, nullable=False)
    levels = db.Column(ARRAY(db.Integer))
    created_at = db.Column(db.DateTime, nullable=False)
    last_modified = db.Column(db.DateTime, nullable=False)

    rule = db.relationship("Rule", back_populates="user_associations")
    user = db.relationship("User", back_populates="rule_associations")

    db.UniqueConstraint('user_id', 'rule_id')

    def __init__(self, user_id, rule_id, enabled=False, levels=None):
        self.user_id = user_id
        self.rule_id = rule_id
        self.levels = levels
        self.enabled = enabled
        self.created_at = datetime.datetime.now()
        self.last_modified = datetime.datetime.now()


class PostAdditiveRule(db.Model):
    __tablename__ = "posts_additive_rules"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rule_id = db.Column(db.Integer, db.ForeignKey('rules.id', ondelete='CASCADE'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id', ondelete='CASCADE'), nullable=False)
    level = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    last_modified = db.Column(db.DateTime, nullable=False)

    db.PrimaryKeyConstraint('rule_id', 'post_id')

    post = db.relationship("Post", back_populates="rule_associations")
    rule = db.relationship("AdditiveRule", back_populates="post_associations")

    def __init__(self, rule_id, post_id, level):
        self.rule_id = rule_id
        self.post_id = post_id
        self.level = level
        self.created_at = datetime.datetime.now()
        self.last_modified = datetime.datetime.now()


class AdditiveRuleLink(db.Model):
    __tablename__ = "additive_rule_links"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rule_id = db.Column(db.Integer, db.ForeignKey('rules.id'), nullable=False)
    source = db.Column(db.String(255), nullable=False)
    uri = db.Column(db.String(255), nullable=False)
    display_name = db.Column(db.String(255), nullable=False)
    level = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    last_modified = db.Column(db.DateTime, nullable=False)

    rule = db.relationship("AdditiveRule", back_populates="additive_links")
    db.PrimaryKeyConstraint('rule_id', 'uri')

    def __init__(self, rule_id, source, uri, level, name):
        self.rule_id = rule_id
        self.source = source
        self.uri = uri
        self.display_name = name
        self.level = level
        self.created_at = datetime.datetime.now()
        self.last_modified = datetime.datetime.now()

    def serialize(self):
        return {
            'id': self.id,
            'uri': self.uri,
            'name': self.display_name,
            'level': self.level,
        }


@event.listens_for(UserRule, 'before_update')
@event.listens_for(Rule, 'before_update')
@event.listens_for(PostAdditiveRule, 'before_update')
@event.listens_for(AdditiveRuleLink, 'before_update')
def receive_after_update(_mapper, _connection, target):
    target.last_modified = datetime.datetime.now()
