#!/bin/bash
cd client
npm run build
cd ..
export FLASK_APP="server.factory:create_app"
flask create_db
flask db upgrade
