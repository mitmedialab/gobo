"""
    Modules that analyze tweets and Facebook posts
    methods should be of nomenclature: analyze_<type>
    Add type to ANALYSIS_TYPE list in tasks.py

    All methods update and commit to db directly and do not return anything
"""
import os
from logging import getLogger
import urllib

from bs4 import BeautifulSoup
from googleapiclient import discovery
from flask import current_app
import requests

# pylint: disable=no-name-in-module,import-error
from server.config.config import config_map
from server.core import db
from server.enums import GenderEnum

from .gender_classifier.NameClassifier_light import NameClassifier
from ..models import Post


logger = getLogger(__name__)
name_classifier = NameClassifier()

env = os.getenv('FLASK_ENV', 'dev')
config_type = env.lower()
config = config_map[config_type]


def analyze_toxicity(post_id):
    post = Post.query.get(post_id)
    if not post or post.has_toxicity_rate():
        logger.warning("post {} doesn't exist or already has toxicity rate".format(post_id))
        return
    text = post.get_text()

    # Generates API client object dynamically based on service name and version.
    # cache_dicovery=False to silence google file_cache
    # error https://github.com/google/google-api-python-client/issues/299
    service = discovery.build('commentanalyzer', 'v1alpha1',
                              developerKey=current_app.config['GOOGLE_API_KEY'], cache_discovery=False)

    analyze_request = {
        'comment': {'text': text},
        'requestedAttributes': {'TOXICITY': {}},
        'doNotStore': True
    }

    try:
        response = service.comments().analyze(body=analyze_request).execute()
        score = response["attributeScores"]["TOXICITY"]["summaryScore"]["value"]
    except:
        logger.info('could not get toxicity score for post {}'.format(post_id))
        score = -1
    post.update_toxicity(score)


def analyze_gender_corporate(post_id):
    post = Post.query.get(post_id)
    if not post or post.has_gender_corporate():
        logger.warning("post {} doesn't exist or already has gender and corporate".format(post_id))
        return

    corporate = False
    if post.get_precomputed_gender():
        gender = GenderEnum.fromString(post.get_precomputed_gender())
    else:
        author_name = post.get_author_name()
        if author_name:
            result, _conf = name_classifier.predictGenderbyName(author_name)
            #score = name_gender_analyzer.process(post.get_author_name())
            gender = GenderEnum.fromString(result)
        else:
            gender = GenderEnum.unknown
    if post.is_news:
        gender = GenderEnum.unknown
    if gender == GenderEnum.unknown or post.has_precomputed_corporate():
        corporate = True
    post.update_gender_corporate(gender, corporate)


def analyze_virality(post_id):
    post = Post.query.get(post_id)
    if not post or post.has_virality():
        logger.warning("post {} doesn't exist or already has virality".format(post_id))
        return

    likes = post.get_likes_count()
    comments = post.get_comments_count()
    shares = post.get_shares_count()
    total_reaction = likes+shares+comments
    post.virality_count = max(post.virality_count, total_reaction)
    db.session.commit()


def analyze_news_score(post_id):
    post = Post.query.get(post_id)
    if not post or post.has_news_score():
        logger.warning("post {} doesn't exist or already has news score".format(post_id))
        return

    score = 0.0
    if post.has_link:
        urls = post.get_urls()
        for url in urls:
            try:
                html = urllib.urlopen(url).read()
            except:
                html = ""
            soup = BeautifulSoup(html, "html.parser")
            # kill all script and style elements
            for script in soup(["script", "style"]):
                script.extract()  # rip it out
            # get text
            text = soup.get_text()
            r = requests.post(current_app.config['NEWS_LABELLER_URL']+'/predict.json',
                              json={'text': text}, timeout=config.DEFAULT_REQUEST_TIMEOUT)
            result = r.json()
            if 'taxonomies' in result:
                scores = [float(x['score']) for x in result['taxonomies'] if '/news' in x['label'].lower()]
                scores.append(score)
                score = max(scores)
    else:
        text = post.get_text()
        r = requests.post(current_app.config['NEWS_LABELLER_URL']+'/predict.json',
                          json={'text': text}, timeout=config.DEFAULT_REQUEST_TIMEOUT)
        result = r.json()
        if 'taxonomies' in result:
            scores = [float(x['score'])for x in result['taxonomies'] if '/news' in x['label'].lower()]
            score = max(scores) if scores else 0.0
    if post.is_news:
        score = min(1.0, score+0.6)
    post.news_score = score
    db.session.commit()
