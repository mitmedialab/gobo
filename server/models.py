import datetime
from server.core import db, bcrypt
from server.enums import GenderEnum, PoliticsEnum, EchoRangeEnum

post_associations_table = db.Table('posts_associations', db.metadata,
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('post_id', db.Integer, db.ForeignKey('posts.id')),
    db.PrimaryKeyConstraint('user_id', 'post_id'),
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

    twitter_authorized = db.Column(db.Boolean, nullable=False, default=False)
    facebook_authorized = db.Column(db.Boolean, nullable=False, default=False)

    twitter_data = db.Column(db.JSON)
    facebook_data = db.Column(db.JSON)

    political_affiliation = db.Column(db.Enum(PoliticsEnum), default=PoliticsEnum.center)

    posts = db.relationship("Post",
                    secondary=post_associations_table, lazy='dynamic', cascade="all")

    settings = db.relationship("Settings", uselist=False, back_populates="user")

    def __init__(self, email, password):
        self.email = email
        self.password = bcrypt.generate_password_hash(password)
        self.registered_on = datetime.datetime.now()
        settings = Settings()
        self.settings = settings

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
            'twitter_name':self.twitter_name,
            'avatar': self.twitter_data['profile_image_url_https'] if self.twitter_data else self.facebook_picture_url
        }

    def set_facebook_data(self, data):
        self.facebook_name = data['name']
        self.facebook_email = data['email']
        self.facebook_id = data['id']
        self.facebook_picture_url = data['picture']['data']['url']
        self.facebook_data = data
        self.facebook_authorized = True
        db.session.commit()

    def set_twitter_data(self, id, name, data):
        self.twitter_name = name
        self.twitter_id = id
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

class Settings(db.Model):
    __tablename__ = "user_settings"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship("User", back_populates="settings")
    rudeness_min = db.Column(db.Float, db.CheckConstraint('rudeness_min>=0'), default=0)
    rudeness_max = db.Column(db.Float, db.CheckConstraint('rudeness_max<=1'), default=1)
    gender_filter_on = db.Column(db.Boolean, default=False)
    gender_female_per = db.Column(db.Integer, db.CheckConstraint('gender_female_per>=0 AND gender_female_per<=100'), default=50)
    include_corporate = db.Column(db.Boolean, default=True)
    virality_min = db.Column(db.Float, db.CheckConstraint('virality_min>=0'), default=0)
    virality_max = db.Column(db.Float, db.CheckConstraint('virality_max<=1'), default=1)
    seriousness_min = db.Column(db.Float, db.CheckConstraint('seriousness_min>=0'), default=0)
    seriousness_max = db.Column(db.Float, db.CheckConstraint('seriousness_max<=1'), default=1)
    echo_range = db.Column(db.Enum(EchoRangeEnum), default=EchoRangeEnum.narrow)

    rudeness_ck = db.CheckConstraint('rudeness_max>rudeness_min')
    virality_ck = db.CheckConstraint('virality_max>virality_min')
    seriousness_ck = db.CheckConstraint('seriousness_max>seriousness_min')

    def as_dict(self):
        d = {c.name: getattr(self, c.name) for c in self.__table__.columns if c.name!='echo_range'}
        d['echo_range'] = self.echo_range.value
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
        self.echo_range = EchoRangeEnum(settings_dict['echo_range'])

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


    def __init__(self, original_id, source, content, is_news):
        self.original_id = original_id
        self.source = source
        self.content = content
        self.is_news = is_news
        self.retrieved_at = datetime.datetime.now()
        if source=='twitter':
            self.created_at = datetime.datetime.strptime(content['created_at'], '%a %b %d %H:%M:%S +0000 %Y')
            self.has_link = len(content['entities']['urls']) > 0 # 'possibly_sensitive' in content
        else:
            self.created_at = datetime.datetime.strptime(content['created_time'], '%Y-%m-%dT%H:%M:%S+0000')
            self.has_link = content['type']=='link'

    def as_dict(self):
        d = {c.name: getattr(self, c.name) for c in self.__table__.columns if c.name!='gender'}
        d['gender'] = str(self.gender)
        return d

    def get_text(self):
        # TODO: logic fore getting text - should we get text from link shared, etc?
        text = ""
        if self.source=="twitter":
            text = self.content['full_text'] if 'full_text' in self.content else self.content['text']
        if self.source=="facebook":
            text = self.content['message'] if 'message' in self.content else ""
        return text

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

    def update_replies_count(self, count):
        new_content = self.content.copy()
        prev_count = self.content['replies_count'] if 'replies_count' in self.content else 0
        new_content['replies_count'] = max(count, prev_count)
        self.content = new_content


    def get_author_name(self):
        if self.source=='facebook':
            return self.content['from']['name']
        else:
            if 'retweeted_status' in self.content:
                return self.content['retweeted_status']['user']['name']
            return self.content['user']['name']


