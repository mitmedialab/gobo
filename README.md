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

###### Run the client:
In another terminal window open cd to `/client` and then:
```bazaar
npm install
#We need to run build once in order to create a dist folder with all static files (images etc.) for the server to access
npm run build 
npm start
```

After that you should be able to see Gobo at localhost:5000


### Locked beta version:
To set the app to be locked in beta version set the following var in `config.py`:
```bazaar
    LOCK_WITH_PASSWORD = True
    BETA_PASSWORD = 'password_you_want'
```
To unlock just set `LOCK_WITH_PASSWORD = False`


###Deploying on Heroku:
 - create a new local branch called "heroku-deploy"
 `git checkout -b heroku-deploy`
 - create a new heroku app on the website.
 - add the heroku remote to the github repo
 - in "heroku-deploy" branch, 
 edit .gitignore to not ignore config.py (make sure to also save a copy of config.py somewhere else on your computer)
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
    
**!!! - Make sure to __**not push this**__ anywhere else!! as this contains sensitive data! - !!!**


##### Set up Google Analytics:
Edit the GA ID in `client/app/index.js`