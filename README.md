Gobo
====

Gobo is a responsive web-based social media aggregator with filters you can control. You can use Gobo to control what’s edited out of your feed, or configure it to include news and points of view from outside your usual orbit. Gobo aims to be completely transparent, showing you why each post was included in your feed and inviting you to explore what was filtered out by your current filter settings.

Try it out at [https://gobo.social](https://gobo.social).

Gobo is a project of the [MIT Center for Civic Media](https://civic.mit.edu), at the [MIT Media Lab](https://media.mit.edu).  It was created by Jasmin Rubinovitz, Alexis Hope, Rahul Bhargava and Ethan Zuckerman, with generous support from the Knight Foundation.


Installation
------------

Gobo is a [Flask](http://flask.pocoo.org)-based server side, which uses [React](http://reactjs.org) & [Redux](https://github.com/reactjs/react-redux) in the browser to rnder the UI.  

Edit `server/config.py` to hold the right api keys and database url.
  
Create a virtual environment and install all requirements
```shell
$ virtualenv venv
$ source venv/bin/activate
$ pip install -r requirements.txt
```

To set up the database run:
```shell
$ python manage.py db init
$ python manage.py create_db
$ python manage.py db upgrade
$ python manage.py db migrate
```


Running
-------

In development mode Gobo has multiple pieces you need to run:

1. The Flask server handles authentication and interactions between the client and the various APIs.
2. The Redis queue holds jobs for analyzing content with the plug-in algorithms, and requests to fetch posts.
3. Celery runs the workers to do things in the queue.
4. We use npm to run the front-end React code that drives the UI.

Run the Flask server locally:
```shell
$ ./run.sh
```

In order to fetch posts from FB and Twitter you need to run the redis-server and celery worker locally.  Open 2 new shell terminals, and activate the virtualenv. Then run:
```shell
$ redis-server
```

And in the other one:
```shell
$ celery -A server.scripts.tasks worker
```

In another terminal window open cd to `/client` and then:
```shell
$ npm install
#We need to run build once in order to create a dist folder with all static files (images etc.) for the server to access
$ npm run build 
$ npm start
```

After that you should be able to see Gobo at localhost:5000


### Recurring Tasks

You need to set up two recurring tasks. The first adds tasks to the queue:
```shell
$ python -m server.scripts.add_tasks_to_queue
```

The second removes old posts (Gobo only tracks the last 500 posts for each user):
```shell
$ python server/scripts/clean_old_posts.py
```

To refresh a specific user:
```shell
$ python -m server.scripts.add_user_tasks_to_queue [user_id]
```


Configuration
-------------

### Beta Password

You can choose to only allow signup to people that have a special password.  Add the following vars in `config.py`:
```python
    LOCK_WITH_PASSWORD = True
    BETA_PASSWORD = 'password_you_want'
```
To remove the password just set `LOCK_WITH_PASSWORD = False`.

### Set up Google Analytics:

Edit the GA ID in `client/app/index.js`


Deploying
---------

### Setup

Gobo is set up to deploy to containerized hosts like Heroku of Dokku.  Typically configuration is done with environment variables.  For now we've got a system that involves editing the config file on a local branch.  We'll get around to changing this eventually.

1. create a new local branch called "deploy": `git checkout -b deploy`
2. create a new app on the Heroku website, or with the command line in Dokku
3. add the heroku/dokku remote to the github repo
4. in "deploy" branch, edit `.gitignore` to not ignore config.py (make sure to also save a copy of config.py somewhere else on your computer)
5. On your host (Heroku/Dokku), add a database and a redis instance
6. Update `config.py` in the deploy branch to match the database and redis url
7. Push to that deploy remote: `git push deploy deploy:master`
    
**!!! - Make sure to __**not push this branch**__ anywhere else!! as this contains sensitive data! - !!!**

### Versioning

Edit `client/app/constants/index.js` and bump up the semantic version number before every release.  This shows up at the bottom fo the about page.

