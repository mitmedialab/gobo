# Gender Classifier

Determine anyone's gender automatically by filling in a Twitter 
username, first name or an image url.

This demo has been created as part of the UN Global Pulse project on 
gender classification of so2al media accounts together with Leiden
University's Centre for Innovation. The code behind this demo is used 
to classify the gender of more than 50 million Twitter users. 
The results of this project can be viewed on 
http://post2015.unglobalpulse.net.

Within this github there is a gender classifier which is in the folder 
`gender_classifier` and a demo page which is in the folder `demo_page`. 
See the subfolders for more information. A live version of the demo 
page can be found over here http://gender.peaceinformaticslab.org. 

This code makes use of the GenderComputer of University Eindhoven, see 
their Github repository: https://github.com/tue-mdse/genderComputer .


# Project Team

The core team behind this project includes: 

- Leiden University’s Centre for Innovation
- UN Global Pulse
- Data2X

As part of this project, valuable contributions have been made by:

- Leiden Centre of Data Science (Leiden University)
- Qualogy
- Risa-IT
- UN Volunteers
- Maral Dadvar 

# How it works

The algorithm has several input methods, which can be just the name,
url or Twitter user.

## By name
By just looking at the name, the algorithm verifies the name on a 
global scale and returns the most occurred gender based on that name.

## By url
By url it identifies if there is only one face in the image. If so, 
it returns the gender of that image.

## By Twitter user or Tweet id
It looks up the gender by just the name as in section `By name`.

If there is no result it looks up the gender by using the
profile picture as described in section `By url`.

# Prerequisites

	Python 2.7
	Virtualenv
	pip


# Installation

1. Get an Twitter consumer key, consumer secret, access token and access secret. 
2. Create an account and get an api key and secret from Face++ here: http://www.faceplusplus.com/
3. Execute: `cp config/example.config.cfg config.cfg`
4. Fill in the information in config.cfg. Do not change the structure.
5. Fill in the api key and secret in config.cfg, database settings
6. Create the tables in the schema.sql
7. Install BLAS and additional libraries. See the commands below for Ubuntu and CentOS
    1. Ubuntu: sudo apt-get install gfortran libopenblas-dev liblapack-dev libffi-dev
    2. CentOS: sudo yum install python-devel python-nose python-setuptools gcc gcc-gfortran gcc-c++ blas-devel lapack-devel atlas-devel libffi-devel
8. Execute the following commands:
    1. `virtualenv venv`
    2. `source venv/bin/activate`
    3. `pip install -r requirements.txt`


# Starting the code


	source venv/bin/activate
	python

```python
	# -*- coding: utf-8 -*-
	import classifier	
    c = classifier.Classifier(faceplusplus_apiKey, faceplusplus_secretKey, twitter_consumerKey, twitter_consumerSecret,
                        twitter_accessToken, twitter_accessSecret)

    print ''
    
    print 'Name'
    print c.predict_gender_by_name(firstname)
    
    print ''

    print 'Image'
    print c.predict_gender_from_image(picture_url)

    print ''

    print 'Twitter'
    print c.predict_gender_of_twitter_user(twitter_handle)

    print ''

    print 'Twitter'
    print c.predict_gender_of_twitter_user(twitter_user_id)

    print ''

    print 'Tweet'
    print c.predict_gender_by_tweet(tweet_id)
```

# Example output
	
Example output is a dict as can be seen in the code below.

    Image
    {'gender': u'Male', 'picture_url': 'http://img.timeinc.net/time/daily/2010/1011/poy_nomination_agassi.jpg'}
    
    Twitter
    {'gender': 'male', 'accountId': 'BarackObama'}
    
    Twitter
    {'gender': 'male', 'accountId': 3402607275}
    
    Tweet
    {'gender': 'female', 'tweetId': 512072664937418752}

    
# Adding a name dictionary
	
1. Add a new name dataset in "/genderComputer/nameLists/"
2. Rename your file to: `[characterSet]_[countryName][gender]UTF8.csv`, e.g. `Latin_UgandaMaleUTF8.csv`
3. Modify `"/genderComputer/nameLists/script_map.csv"` file by adding a map of script/country for new dataset.
4. If you are adding a name database for a new country, please make sure:
    1. the country name/abbreviation exists in `"/genderComputer/nameLists/acountryAbb.csv"`

		
