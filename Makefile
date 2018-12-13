VENV := venv
PYLINT := env PYTHONPATH=$(PYTHONPATH) $(VENV)/bin/pylint

lint.py:
	$(PYLINT) server

requirements-local.py:
	pip install -q -r requirements/local.txt --exists-action w

db-setup:
	flask create_db
	flask db upgrade
