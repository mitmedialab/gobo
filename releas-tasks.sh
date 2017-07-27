#!/bin/bash
cd client
npm run build
cd ..
python manage.py db migrate
python manage.py db upgrade