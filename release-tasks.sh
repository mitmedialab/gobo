#!/bin/bash
cd client
npm run build
cd ..
flask create_db
flask db upgrade
