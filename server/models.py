import datetime
from server.core import db, bcrypt

post_associations_table = db.Table('posts_associations', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('post_id', db.Integer, db.ForeignKey('posts.id'))
)

class User(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    registered_on = db.Column(db.DateTime, nullable=False)

    facebook_name = db.Column(db.String(255))
    facebook_picture_url = db.Column(db.String(255))
    facebook_id = db.Column(db.String(255))
    facebook_email = db.Column(db.String(255))
    twitter_name = db.Column(db.String(255))
    twitter_id = db.Column(db.String(255))

    facebook_auth = db.relationship("FacebookAuth", uselist=False, back_populates="user")
    twitter_auth = db.relationship("TwitterAuth", uselist=False, back_populates="user")

    gender = db.Column(db.String(255))
    local = db.Column(db.String(255))
    total_facebook_friends = db.Column(db.Integer)

    twitter_authorized = db.Column(db.Boolean, nullable=False, default=False)
    facebook_authorized = db.Column(db.Boolean, nullable=False, default=False)

    posts = db.relationship("Post",
                    secondary=post_associations_table, lazy='dynamic')

    def __init__(self, email, password):
        self.email = email
        self.password = bcrypt.generate_password_hash(password)
        self.registered_on = datetime.datetime.now()

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

    def get_names(self):
        return {
            'email': self.email,
            'facebook_name':self.facebook_name,
            'twitter_name':self.twitter_name
        }

    def set_facebook_data(self, data):
        self.facebook_name = data['name']
        self.facebook_email = data['email']
        self.facebook_id = data['id']
        self.facebook_picture_url = data['picture']['data']['url']
        self.facebook_authorized = True
        db.session.commit()

    def set_twitter_data(self, id, name):
        self.twitter_name = name
        self.twitter_id = id
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

class Post(db.Model):
    __tablename__ = "posts"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    original_id = db.Column(db.String(40), nullable=False)
    content = db.Column(db.JSON, nullable=False)
    source = db.Column(db.String(255), nullable=False)
    retrieved_at = db.Column(db.DateTime, nullable=False)

    # filters
    is_news = db.Column(db.Boolean)
    toxicity = db.Column(db.Float)

    db.UniqueConstraint('source_id', 'source', name='post_id')


    def __init__(self, original_id, source, content, is_news):
        self.original_id = original_id
        self.source = source
        self.content = content
        self.is_news = is_news
        self.retrieved_at = datetime.datetime.now()

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    def get_text(self):
        # TODO: logic fore getting text - should we get text from link shared, etc?
        text = ""
        if self.source=="twitter":
            text = self.content['text']
        if self.source=="facebook":
            text = self.content['message'] if 'message' in self.content else ""
        return text

    def has_toxicity_rate(self):
        return self.toxicity is not None


