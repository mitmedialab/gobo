Gobo [![Build Status](https://travis-ci.com/mitmedialab/gobo.svg?branch=master)](https://travis-ci.com/mitmedialab/gobo)
====

Gobo is a responsive web-based social media aggregator with filters you can control. You can use Gobo to control what’s edited out of your feed, or configure it to include news and points of view from outside your usual orbit. Gobo aims to be completely transparent, showing you why each post was included in your feed and inviting you to explore what was filtered out by your current filter settings.

Try it out at [https://gobo.social](https://gobo.social).

Gobo is a project of the [MIT Center for Civic Media](https://civic.mit.edu), at the [MIT Media Lab](https://media.mit.edu).  It was created by Jasmin Rubinovitz, Alexis Hope, Rahul Bhargava and Ethan Zuckerman, with generous support from the Knight Foundation.


Installation
------------

Gobo is a [Flask](http://flask.pocoo.org)-based server side, which uses [React](http://reactjs.org) & [Redux](https://github.com/reactjs/react-redux) in the browser to render the UI.

### Backend

Gobo uses Python 2.7.x.

Create `config.py` in `server/config/` using the provided template to hold the right api keys and database url.

#### PyEnv

We manage different versions with [pyenv](https://github.com/pyenv/pyenv). Install this with HomeBrew:
```
brew update
brew install pyenv
```

Then install the versions of Python we need:
```
pyenv install 3.7.3
```

#### PyEnv-VirtualEnv

For managing a virtual enviromnent with a specific version of python for our project, we use 
[pyenv-virtualenv](https://github.com/pyenv/pyenv-virtualenv). Install this with homebrew as well
```
brew install pyenv-virtualenv
```
As noted in their readme, you'll need to add these two lines to your `.bash_profile` file (or you `.profile` file). Then open a new terminal session:
```
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```

And then create a virtualenv for this project.  The name is important, because the `.python-version` file
refers to it so it loads automatically when you enter the directory (if `eval "$(pyenv virtualenv-init -)"` 
is in your `.profile`):
```
pyenv virtualenv 3.7.3 gobo-3.7.3
```

#### Requirements and Database

Install all requirements:
```shell
$ make requirements-local.py
```

To set up the database run:
```shell
$ export FLASK_ENV=dev
$ make db-setup
```

### Front-end
In another terminal window, cd to `/client`.

If you haven't already, install [Node Version Manager](https://github.com/creationix/nvm).

Install and use version node version 10.13.0:
```shell
$ nvm install 10.13.0
$ nvm use 10.13.0
```

Install requirements and build static assets:
```shell
$ npm install
$ npm run build 
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
$ source venv/bin/activate
$ celery -A server.scripts.tasks worker
```

In another terminal window open cd to `/client` and then:
```shell
$ nvm use 10.13.0
$ npm start
```

After that you should be able to see Gobo at localhost:5000


### Recurring Tasks

You need to set up three recurring tasks. The first adds tasks to the queue to fetch FB and Twitter posts for users that
have been using the system recently.  Run this every hour or so:
```shell
$ python -m server.scripts.queue_prioritized_user_posts
```

The second updates the posts from news organizations (used for the "perspectives" filter). Run this every 6 hours or so:
```shell
$ python -m server.scripts.queue_latest_news_posts
```

The third removes old posts (Gobo only tracks the posts within the last two weeks). Run this once a night:
```shell
$ python -m server.scripts.delete_old_posts
```

### Manual Tasks

To delete a specific user:
```shell
$ python -m server.scripts.delete_user [user_id]
```

Documentation and tasks for creating and sharing rules found via the flask CLI:
```shell
$ flask 
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


Development
-----------

When updating models that result in a table change (e.g. column added/removed), generate migrations with:

```shell
$ flask db migrate
```

This will generate a new migration file in `migrations/versions` that should be added to version control.

Deploying
---------

### Setup

Gobo is set up to deploy to containerized hosts like Heroku or Dokku.  Typically configuration is done with environment variables.  For now we've got a system that involves editing the config file on a local branch.  We'll get around to changing this eventually.

1. Create a new local branch called "deploy": `git checkout -b deploy`
2. Create a new app on the Heroku website, or with the command line in Dokku
3. Add the heroku/dokku remote to the GitHub repo
4. In "deploy" branch, edit `.gitignore` to not ignore config.py (make sure to also save a copy of config.py somewhere else on your computer)
5. On your host (Heroku/Dokku), add a database and a redis instance
6. Update `config.py` in the deploy branch to match the database and redis url
7. Push to that deploy remote: `git push deploy deploy:master`
    
**!!! - Make sure to __**not push this branch**__ anywhere else!! as this contains sensitive data! - !!!**

### Versioning

Edit `client/app/constants/index.js` and bump up the semantic version number before every release.  This shows up at the bottom of the About page.

Contributing
------------

A pre-commit hooks will run JavaScript linting (e.g. when you commit, linting will be run). You can try to automatically fix JavaScript linting errors by running:

```shell
$ npm run lint_fix
```

Not all errors can be fixed this way and for more details about the linting error see [eslint](https://eslint.org).

