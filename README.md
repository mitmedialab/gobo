# silica
Code for silica experimental project


#### Initial setup for running locally:

Edit `server/config.py` to hold the right api keys and database url


  
Create a virtual environment and install all requirements
```bazaar
$ virtualenv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
```

to set up the database run:
```bazaar
$ python manage.py db init
$ python manage.py create_db
$ python manage.py db upgrade
$ python manage.py db migrate
```

To run the app locally run:
```bazaar
$ ./run.sh
```

To run the redis-server and celery worker locally, open 2 new shell terminals, and activate the virtualenv. Then run:
```bazaar
redis-server
```
And in the other one:
```bazaar
celery -A server.scripts.tasks worker
```


To Deploy on Heroku:
 - create a new local branch called "heroku-deploy"
 `git checkout -b heroku-deploy`
 - create a new heroku app on the website.
 - add the heroku remote to the github repo
 - in "heroku-deploy" branch, 
 edit .gitignore to not ignore config.py (make sure to also save a copy of config.py somewhere else on your computer)
 - in the root directory, add a package.json file with the following content:
    ```
    { 
    "engines": { "node": "6.10.2", "npm": "4.4.4" }, 
    "scripts": { "postinstall": "cd client && npm --dev install && npm run build" } 
    }
     ```
 - In heroku website, add a database and a redis instance
 - Update config.py in the new brach to match the database and redis url
 - set up heroku buildpacks:
    ```bazaar
    heroku buildpacks:clear
    heroku buildpack:add heroku/nodejs
    heroku buildpack:add heroku/python
    ```
    run `heroku buildpacks` to make sure the correct buildpacks are set.
- Push to heroku: `git push heroku heroku-deploy:master`
**!!! - Make sure to noth push this anywhere else!! as this contains sensitive data! - !!!**

###### Edit:
We need to manually add the migration for generating enum types.
To do that, in your "heroku-deploy" bracnh, after the config.py is up to date with the right db address run:
```bazaar
source venv/bin/activate
python manage.py db revision -m "create_gender_enum"
```
This will create a file `migrations/versions/hash#_create_gender_enum`