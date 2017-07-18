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
$ cd client
$ npm run buid
$ cd ..
$ ./run.sh
```


To run client side locally (only for development!):
first change ``
```bazaar

```