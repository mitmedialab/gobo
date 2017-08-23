#!/bin/bash
cd client
npm run build
cd ..
python manage.py init_db
python manage.py create_db
python manage.py db migrate
python manage.py db upgrade