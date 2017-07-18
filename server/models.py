import datetime
from app import db, bcrypt
from sqlalchemy.orm import relationship


class User(db.Model):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    registered_on = db.Column(db.DateTime, nullable=False)

    facebook_name = db.Column(db.String(255), nullable=True)
    facebook_picture_url = db.Column(db.String(255), nullable=True)
    facebook_id = db.Column(db.String(255), nullable=True)
    facebook_email = db.Column(db.String(255), nullable=True)
    facebook_auth = relationship("FacebookAuth", uselist=False, back_populates="user")

    gender = db.Column(db.String(255), nullable=True)
    local = db.Column(db.String(255), nullable=True)
    total_facebook_friends = db.Column(db.Integer, nullable=True)

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

    def set_facebook_data(self, data):
        self.facebook_name = data['name']
        self.facebook_email = data['email']
        self.facebook_id = data['id']
        self.facebook_picture_url = data['picture']['data']['url']
        db.session.commit()

    def __repr__(self):
        return '<User {0}>'.format(self.email)

class FacebookAuth(db.Model):
    __tablename__ = "facebook_auths"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = relationship("User", back_populates="facebook_auth")
    generated_on = db.Column(db.DateTime, nullable=False)
    access_token = db.Column(db.String(255), nullable=False)
    token_type = db.Column(db.String(255), nullable=False)
    expires_in = db.Column(db.DateTime, nullable=False)

    def __init__(self, user_id, facebook_auth_data):
        print facebook_auth_data
        print type(facebook_auth_data['expires_in'])
        self.user_id = user_id
        self.generated_on = datetime.datetime.now()
        self.access_token = facebook_auth_data['access_token']
        self.token_type = facebook_auth_data['token_type']
        self.expires_in = self.generated_on + datetime.timedelta(seconds=int(facebook_auth_data['expires_in']))