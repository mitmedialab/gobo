#!/bin/bash
cd client
npm run build
cd ..
python manage.py create_db
python manage.py db upgrade