import os
import logging.config
import json
from ..factory import create_celery_app

celery = create_celery_app()

# base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
#
# # set up logging
# with open(os.path.join(base_dir, 'config', 'logging.json'), 'r') as f:
#     logging_config = json.load(f)
#     logging.config.dictConfig(logging_config)
#
# logging.info("Running from "+base_dir)