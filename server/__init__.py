import os
import logging.config
import json

base_dir = os.path.dirname(os.path.abspath(__file__))

# set up logging
with open(os.path.join(base_dir, 'config', 'logging.json'), 'r') as f:
    logging_config = json.load(f)
    logging.config.dictConfig(logging_config)

logging.debug("Running from " + base_dir)
