# This Python file uses the following encoding: utf-8

"""Copyright 2012-2013
Eindhoven University of Technology
Bogdan Vasilescu

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>."""


import re
import csv
import os
from dictUtils import MyDict
from unicodeMagic import UnicodeReader
from unidecode import unidecode
from nameUtils import only_greek_chars, only_cyrillic_chars
from nameUtils import leet2eng, inverseNameParts, extractFirstName
from filters import normaliseCountryName




def simplifiedGender(gender):
	if gender is not None:
		if (gender == 'mostly male') | (gender == "unisex-mm"):
			return 'male'
		elif (gender == 'mostly female') | (gender == "unisex-mf"):
			return 'female'
		# elif gender == 'unisex':
		# return ''
		else:
			return gender # male, female, unisex
	return None

def formatOutput(gender, simplified=True):
	if simplified:
		return simplifiedGender(gender)
	else:
		return gender


'''Load the male and female name lists for <country>'''
def loadData(country, dataPath, hasHeader=True, script="Latin"):
	def loadGenderList(gender, country, dataPath, hasHeader, script):
		fd = open(os.path.join(dataPath, '%s_%s%sUTF8.csv' % (script.strip(" \t\n\r"),country.strip(" \t\n\r"), gender)), 'rb')
		reader = UnicodeReader(fd)
		names = {}
		if hasHeader:
			unused_header = reader.next()
		'''Load names as-is, but lower cased'''
		for row in reader:
			name = row[0].lower()
			try:
				'''The second column should be the count
				(number of babies in some year with this name)'''
				count = row[1]
			except:
				'''If second column does not exist, default to count=1'''
				count = 1
				if names.has_key(name):
					'''If here then I've seen this name before, modulo case.
					Only count once (there is no frequency information anyway)'''
					count = 0
			if names.has_key(name):
				names[name] += count
			else:
				names[name] = count
		fd.close()
		
		'''Add versions without diacritics'''
		for name in names.keys():
			dname = unidecode(name)
			if not names.has_key(dname):
				names[dname] = names[name]

		return names

	males = loadGenderList('Male', country, dataPath, hasHeader, script)
	females = loadGenderList('Female', country, dataPath, hasHeader, script)
	return males, females

# returns the map of countries' datasets to scripts
def getScriptMap(dataPath):

	fd = open(os.path.join(dataPath, 'script_map.csv'), 'rb')
	reader = csv.reader(fd)

	scripts_dict = dict()

	for row in reader:
		if row[0] in scripts_dict:
			# append the new number to the existing array at this slot
			scripts_dict[row[0]].append(row[1].strip())
		else:
			# create a new array in this slot
			scripts_dict[row[0]] = [row[1].strip()]

		colnum = len(row)

		for i in xrange(2,colnum):
			scripts_dict[row[0]].append(row[i].strip())
	fd.close()
	return (scripts_dict)


class GenderComputer():
	def __init__(self, nameListsPath):
		'''Data path'''
		self.dataPath = os.path.abspath(nameListsPath)
		
		'''gender.c, already lowercase'''
		self.genderDict = MyDict(os.path.join(self.dataPath, 'gender.dict'))
		
		'''Order of countries (columns) in the 
		nam_dict.txt file shipped together with gender.c'''
		self.countriesOrder = {
			'UK':0,
			'Ireland':1,
			'USA':2,
			'Italy':3,
			'Malta':4,
			'Portugal':5,
			'Spain':6,
			'France':7,
			'Belgium':8,
			'Luxembourg':9,
			'The Netherlands':10,
			'East Frisia':11,
			'Germany':12,
			'Austria':13,
			'Switzerland':14,
			'Iceland':15,
			'Denmark':16,
			'Norway':17,
			'Sweden':18,
			'Finland':19,
			'Estonia':20,
			'Latvia':21,
			'Lithuania':22,
			'Poland':23,
			'Czech Republic':24,
			'Slovakia':25,
			'Hungary':26,
			'Romania':27,
			'Bulgaria':28,
			'Bosnia and Herzegovina':29,
			'Croatia':30,
			'Kosovo':31,
			'Macedonia (FYROM)':32,
			'Montenegro':33,
			'Serbia':34,
			'Slovenia':35,
			'Albania':36,
			'Greece':37,
			'Russia':38,
			'Belarus':39,
			'Moldova':40,
			'Ukraine':41,
			'Armenia':42,
			'Azerbaijan':43,
			'Georgia':44,
			'Kazakhstan':45,
			'Turkey':46,
			'Arabia/Persia':47,
			'Israel':48,
			'China':49,
			'India/Sri Lanka':50,
			'Japan':51,
			'Korea':52,
			'Vietnam':53,
			'other countries':54,
		}
		self.countriesOrderRev = {}
		for country, idx in self.countriesOrder.items():
			self.countriesOrderRev[idx] = country
		
		self.threshold = 0.5
		
		self.nameLists = {}
		
		'''Name lists per country'''
		listOfCountries = ['Afghanistan', 'Albania', 'Australia', 'Belgium', 'Brazil',
						'Canada', 'Czech', 'Finland', 'Greece', 'Hungary', 'India', 'Iran', 
						'Ireland', 'Israel', 'Italy', 'Latvia', 'Norway', 'Poland', 'Romania', 
						'Russia', 'Slovenia', 'Somalia', 'Spain', 'Sweden', 'Turkey', 'UK', 
						'Ukraine', 'USA']

		self.scripts_dict = getScriptMap(self.dataPath)
		for script,countries in self.scripts_dict.items():
			self.nameLists[script] = {}
			for country in countries:
				if country == '':
					continue
				self.nameLists[script][country] = {}
				self.nameLists[script][country]['male'], self.nameLists[script][country]['female'] = loadData(country, self.dataPath, hasHeader=False, script=script)


		#by Parisa
		# for country in listOfCountries:
		# 	self.nameLists[country] = {}
		# 	self.nameLists[country]['male'], self.nameLists[country]['female'] = loadData(country, self.dataPath, hasHeader=False, script=)
		#

		'''Exceptions (approximations)'''
		#malesFrance, femalesFrance = loadData('Wallonia', self.dataPath, False)
		#self.nameLists['France'] = {}
		#self.nameLists['France']['male'] 	= malesFrance
		#self.nameLists['France']['female'] 	= femalesFrance
		
		malesNL, femalesNL = loadData('Frisia', self.dataPath, False, script="Latin")
		self.nameLists['Latin']['The Netherlands'] = {}
		self.nameLists['Latin']['The Netherlands']['male'] 	= malesNL
		self.nameLists['Latin']['The Netherlands']['female'] = femalesNL
		
		'''Black list of first names'''
		self.blackList = ['The', 'the', 'nil', 'Nil', 'NULL', 'null', 
						'stack', 'cache', 'queue', 'core', 'linux', 'Net',
						'stillo', 'alfa', 'beta', 'testing', 'me']
		
		'''Gender-specific words'''
		self.maleWords = ['Mr.', 'mr.', 'Mr', 'mr', 'Sir', 'sir', 'Captain', 'captain', 'wizard', 
						'warrior', 'hillbilly', 'beer', 'Mister', 'Lord', 'Duke', 'Baron', 'coolguy','man']
		self.femaleWords = ['girl', 'grrl', 'grrrl', 'miss', 'Miss','Girl']
		
		'''Suffixes'''
		self.suffixes = {}
		
		self.suffixes['Russia'] = {}
		self.suffixes['Russia']['male'] = {}
		self.suffixes['Russia']['male']['include'] = ['ov','ev','sky','skiy','iy','uy','oy','skij','ij','uj','oj','off'] 
		'''in/yn excluded due to B-Rain and Earwin'''
		self.suffixes['Russia']['male']['exclude'] = ['Liubov','Ljubov','Lyubov','boy','Boy','toy','Toy','dev','Dev'] 
		'''['Iakov','Jakov','Yakov','dev','Dev','Lev','boy','Boy','toy','Toy']'''
		self.suffixes['Russia']['female'] = {}
		self.suffixes['Russia']['female']['include'] = ['ova','eva','skaya','aya','eya','oya','iaya' ]
		self.suffixes['Russia']['female']['exclude'] = {}
		
		self.suffixes['Belarus'] = self.suffixes['Russia']
		self.suffixes['Ukraine'] = self.suffixes['Russia']
		self.suffixes['Turkmenistan'] = self.suffixes['Russia']
		self.suffixes['Kyrgyzstan'] = self.suffixes['Russia']
		self.suffixes['Tajikistan'] = self.suffixes['Russia']
		self.suffixes['Kazakhstan'] = self.suffixes['Russia']
		self.suffixes['Uzbekistan'] = self.suffixes['Russia']
		self.suffixes['Azerbaijan'] = self.suffixes['Russia']
		self.suffixes['Uzbekistan'] = self.suffixes['Russia']
		self.suffixes['Bulgaria'] = self.suffixes['Russia']
		
		self.suffixes['Macedonia (FYROM)'] = {}
		self.suffixes['Macedonia (FYROM)']['male'] = {}
		self.suffixes['Macedonia (FYROM)']['male']['include'] = ['ov','ev','ski','evsk']
		self.suffixes['Macedonia (FYROM)']['male']['exclude'] = ['Iakov','Jakov','Yakov','dev','Dev','Lev','boy','Boy','toy','Toy']
		self.suffixes['Macedonia (FYROM)']['female'] = {}
		self.suffixes['Macedonia (FYROM)']['female']['include'] = ['ova','eva','ska','evska']
		self.suffixes['Macedonia (FYROM)']['female']['exclude'] = {}
		
		self.suffixes['Poland'] = {}
		self.suffixes['Poland']['male'] = {}
		self.suffixes['Poland']['male']['include'] = ['ski','sky','cki','cky']
		self.suffixes['Poland']['male']['exclude'] = {}
		self.suffixes['Poland']['female'] = {}
		self.suffixes['Poland']['female']['include'] = ['cka'] 
		'''-ska is not included because of Polska = Poland which might be confusing'''
		self.suffixes['Poland']['female']['exclude'] = {}
		
		self.suffixes['Czech Republic'] = {}
		self.suffixes['Czech Republic']['male'] = {}
		self.suffixes['Czech Republic']['male']['include'] = ['ov',u'ský','sky',u'ný','ny']
		self.suffixes['Czech Republic']['male']['include'] = ['ov','sky','ny']
		self.suffixes['Czech Republic']['male']['exclude'] = {}
		self.suffixes['Czech Republic']['female'] = {}
		self.suffixes['Czech Republic']['female']['include'] = ['ova','ska','na',u'ová',u'ská',u'ná']
		self.suffixes['Czech Republic']['female']['include'] = ['ova','ska','na']
		self.suffixes['Czech Republic']['female']['exclude'] = {}
		
		'''Male Latvian personal and family names typically end in  -s (-š). Some may be derived 
		from Russian names, with an -s ending: e.g. Vladislavs KAZANOVS
		Only Russian forms are included since we cannot distinguish between the regular Latvian -s and English plural -s'''
		
		self.suffixes['Latvia'] = {}
		self.suffixes['Latvia']['male'] = {}
		self.suffixes['Latvia']['male']['include'] = [u'š','ovs','ins']
		self.suffixes['Latvia']['male']['exclude'] = {}
		self.suffixes['Latvia']['female'] = {}
		self.suffixes['Latvia']['female']['include'] = ['ina']
		self.suffixes['Latvia']['female']['exclude'] = {}
		
		self.suffixes['Lithuania'] = {}
		self.suffixes['Lithuania']['male'] = {}
		self.suffixes['Lithuania']['male']['include'] = ['aitis', 'utis', 'ytis', 'enas', 'unas', 'inis', 'ynis', 'onis', 'ius', 'elis']
		self.suffixes['Lithuania']['male']['exclude'] = {}
		self.suffixes['Lithuania']['female'] = {}
		self.suffixes['Lithuania']['female']['include'] = ['iene', 'aite', 'yte', 'ute', 'te']
		self.suffixes['Lithuania']['female']['exclude'] = {}
		
		'''All inverse order countries should also be checked for direct order'''
		self.invOrder = ['Russia','Belarus','Ukraine','Turkmenistan','Kyrgyzstan','Tajikistan','Kazakhstan','Uzbekistan',
						 'Azerbaijan','Uzbekistan','Hungary','China','Bosnia', 'Serbia','Croatia','Sri Lanka','Vietnam',
						 'North Korea','South Korea']
		
		'''Diminutives list'''
		fd = open(os.path.join(self.dataPath, 'diminutives.csv'), 'rb')
		reader = UnicodeReader(fd)
		self.diminutives = {}
		for row in reader:
			mainName = row[0].strip().lower()
			for diminutive in row[1:]:
				try:
					self.diminutives[diminutive].add(mainName)
				except:
					self.diminutives[diminutive] = set()
					self.diminutives[diminutive].add(mainName)
					
		'''Distribution of twitter users per different countries'''
		'''If there is no statistics for the number of twitter users, we use the percentage of internet users per country '''
		#fd = open(os.path.join(self.dataPath, 'countryStats.csv'), 'rb')
		fd = open(os.path.join(self.dataPath, 'internetusers_stats.csv'), 'rb')

		reader = UnicodeReader(fd)
		self.countryStats = {}
		total = 0.0
		for row in reader:
			country = row[0]
			numUsers = float(row[2])
			#total += numUsers
			pinternetusers = float(row[1])
			self.countryStats[country] = [pinternetusers,numUsers]
		# for country in self.countryStats.keys():
		# 	self.countryStats[country] = self.countryStats[country] / total
		#
		print 'Finished initialization'
	
	
	'''Look <firstName> (and potentially its diminutives) up for <country>.
	Decide gender based on frequency.'''
	def frequencyBasedLookup(self, firstName, country, withDiminutives=False, script= 'Latin'):
		dims = set([firstName])
		if withDiminutives:
			try:
				dims = self.diminutives[firstName] # Includes firstName
				dims.add(firstName)
			except:
				pass
		
		countMale = 0.0
		countFemale = 0.0
		for name in dims:
			try:
				countMale += float(self.nameLists[script][country]['male'][name])
			except:
				pass
			try:
				countFemale += float(self.nameLists[script][country]['female'][name])
			except:
				pass

		conf = 0
		if countMale > 0:
			if countFemale > 0:
				if countMale != 1.0 or countFemale != 1.0:
					if countMale > countFemale:
						prob = countFemale / countMale
						conf = round(countMale / (countMale + countFemale),3)
						if prob < self.threshold:
							gender = "mostly male"

						else:
							gender = "unisex-mm"
					else:
						prob = countMale / countFemale
						conf = round(countFemale / (countMale + countFemale),3)
						if prob < self.threshold:
							gender = "mostly female"
						else:
							gender = "unisex-mf"
				else:
					gender = "unisex"
			else:
				conf = 1
				gender = "male"
		else:
			if countFemale > 0:
				conf = 1
				gender = "female"
			else:
				conf = 0
				gender = None
		
		return (gender , conf)
	
	def initialCheckName(self, name):
		'''Check if name is written in Cyrillic or Greek script, and transliterate'''
		if only_cyrillic_chars(name) or only_greek_chars(name):
			name = unidecode(name)

		'''Initial check for gender-specific words at the beginning of the name'''
		f = name.split()[0]
		if f in self.maleWords:
			conf = 1
			return ('male',conf)
		elif f in self.femaleWords:
			conf = 1
			return ('female', conf)

		'''Check for gender-specific words at the second part of the name'''
		if len(name.split())> 1:
			l = name.split()[1]
			if l in self.maleWords:
				conf = 1
				return ('male',conf)
			elif l in self.femaleWords:
				conf = 1
				return ('female', conf)
		return (None,0)



	'''Wrapper for <frequencyBasedLookup> that checks if data for the query <country>
	exists; can format the output.'''


	def countryLookup(self, firstName, country, withDiminutives, script='Latin', simplified=True):
		if script in self.scripts_dict.keys():
			if country in self.scripts_dict[script]:
				(gender,conf) = self.frequencyBasedLookup(firstName, country, withDiminutives, script)
				return (formatOutput(gender, simplified),conf)
		return (None, 0)
	
	'''Checks whether a given <fullName> for a given <country>
	is <gender> (male/female).'''
	def checkSuffix(self, fullName, country, gender):
		for suffix in self.suffixes[country][gender]['include']:
			if fullName.endswith(suffix):
				for badSuffix in self.suffixes[country][gender]['exclude']:
					if fullName.endswith(badSuffix):
						return None
				return gender
		return None
	
	'''Given <fullName>, checks both male and female 
	name suffixes and infers gender for <country>.'''
	def suffixLookup(self, fullName, country):
		conf = 1
		if self.suffixes.has_key(country):
			male = self.checkSuffix(fullName, country, 'male')
			if male is not None:
				return (male, conf)
			else:
				female = self.checkSuffix(fullName, country, 'female')
				return (female, conf)
		else:
			return (None ,0)
	
	
	'''Search for a given <firstName> in the gender.c database.
	strict=True 	: look only in <country>
	simplified=True : reduce 'mostly male' to 'male' and 'mostly female' to 'female' '''
	def genderDotCLookup(self, firstName, country, strict=True, simplified=True):
		gender = None
		conf = 0
		genderCountry = None
		country = normaliseCountryName(country)
		
		try: 
			'''Name in dictionary'''
			nameData = self.genderDict[firstName.lower()]
			
			def lab2key(lab):
				if lab in ['M', '1M', '?M']:
					return 'mmale'
				elif lab in ['F', '1F', '?F']:
					return 'mfemale'
				elif lab == '?':
					return 'uni'
			
			d = {}
			for lab in ['M', '1M', '?M', 'F', '1F', '?F', '?']:
				d[lab2key(lab)] = 0.0
			
			for [mf, frequencies] in nameData:
				for idx in range(len(frequencies)):
					hexFreq = frequencies[idx]
					if len(hexFreq.strip()) == 1:
						d[lab2key(mf)] += int(hexFreq, 16)
			
			thr = 256
			if d['mmale'] - d['mfemale'] > thr:
				conf = round(d['mmale']/ (d['mmale']+ d['mfemale']),3)
				gender = 'male'
			elif (thr >= d['mmale']-d['mfemale']) and (d['mmale'] > d['mfemale']):
				conf = round(d['mmale']/ (d['mmale']+ d['mfemale']),3)
				gender = 'mostly male'
			elif d['mfemale'] - d['mmale'] > thr:
				conf = round(d['mfemale']/ (d['mmale']+ d['mfemale']),3)
				gender = 'female'
			elif (thr >= d['mfemale']-d['mmale']) and (d['mfemale'] > d['mmale']):
				conf = round(d['mfemale']/ (d['mmale']+ d['mfemale']),3)
				gender = 'mostly female'
			else:
				conf = 0
				gender = 'unisex'
			
			'''Options:
			1. I query for an existing name in a known country
			2. I query for an existing name in a country other
			than the ones I have data for'''
			if country in self.countriesOrder.keys():
				'''Here I still don't know if I have frequency information
				for this name and this country'''
				countryData = []
				'''[mf, frequencies] mf = M,1M,?M, F,1F,?F, ?, ='''
				for [mf, frequencies] in nameData:
					f = frequencies[self.countriesOrder[country]]
					if len(f.strip()) == 1:
						'''The name exists for that country'''
						countryData.append([mf, int(f, 16)])
				
				if len(countryData) == 1:
					'''The name is known for this country, and so is its gender'''
					genderCode = countryData[0][0]
					if genderCode == 'M':
						genderCountry = "male"
					elif genderCode in ['1M', '?M']:
						genderCountry = "mostly male"
					elif genderCode == 'F':
						genderCountry = "female"
					elif genderCode in ['1F', '?F']:
						genderCountry = "mostly female"
					elif genderCode == '?':
						genderCountry = "unisex"
		except:
			gender = None

		
		if strict:
			gender = genderCountry
		return (formatOutput(gender, True),conf)
	
	
	'''Simple check for gender-specific words (e.g., girl)'''
	def initialCheck(self, firstName):
		conf = 0
		#if firstName in self.blackList or len(firstName) < 2:
		if firstName in self.blackList:
			return ('blacklist',conf)
		elif len(firstName) < 2:
			return (None,conf)
		elif firstName in self.maleWords:
			conf = 1
			return ('male',conf)
		elif firstName in self.femaleWords:
			conf = 1
			return ('female',conf)
		for word in ['girl']:
			if firstName.endswith(word) or firstName.startswith(word):
				conf = 1
				return ('female',conf)
		for word in ['guy', 'captain']:
			if firstName.endswith(word) or firstName.startswith(word):
				conf = 1
				return ('male',conf)
		return (None ,conf)
	
	
	''''Try to resolve gender based on <firstName>.
	Restrict search to a given <country>.'''
	def resolveFirstName(self, firstName, country, withDiminutives, script):
		'''Start with easy checks. If successful 
		then return gender directly, otherwise continue'''
		(gender, conf) = self.initialCheck(firstName)
		if gender is not None:
			return (gender, conf)
		
		'''If I have a list for that country, start with it'''
		#by Parisa if country in self.nameLists.keys():
		if script in self.scripts_dict.keys():
			if country in self.scripts_dict[script]:
				country = country.strip()
				(gender, conf) = self.countryLookup(firstName, country, withDiminutives, script, simplified=True)
				if gender is not None:
					return (gender, conf)
		
		'''Try gender.c next (strict mode = country-dependent)'''
		(gender, conf) = self.genderDotCLookup(firstName, country, strict=True, simplified=True)
		if gender is not None:
			return (gender, conf)
		
		return (None,0)
	
	
	''''Try to resolve gender based on <firstName>.
	Look in all countries and resort to arbitrage.'''
	def resolveFirstNameOverall(self, firstName, withDiminutives, script):

		if firstName == '':
			return (None, 0)

		'''Start with easy checks. If successful
		then return gender directly, otherwise continue'''
		(gender, conf) = self.initialCheck(firstName)
		if gender is not None:
			return (gender, conf)
		
		'''Try each available country list in turn,
		and record frequency information.'''
		countriesGenders = {}
		arbiter = {}



		#by Parisa for country in self.nameLists.keys():
		# Get the list of countries which has the name including the gender of the name in that country
		if script in self.scripts_dict.keys():
			for country in self.scripts_dict[script]:
				country = country.strip()
				(gender, conf) = self.countryLookup(firstName, country, withDiminutives, script, simplified=True)
				if gender is not None:
					countriesGenders[country] = gender
				else:
					'''I might have the name in gender.c, '''
					(gender, conf) = self.genderDotCLookup(firstName, country, strict=True, simplified=True)
					if gender is not None:
						countriesGenders[country] = gender


		#Check if all the countries extracted above, has statistics for number of twitter users
		hasStat = True
		for c in countriesGenders.keys():
			if self.countryStats[c][1]== 0:
				hasStat = False
				break

		#If all countries have twitter user stats, then use stats of twitter users, else use stats of internet users
		for cnt,gnd in countriesGenders.iteritems():
			userNum = self.countryStats[cnt][1] if hasStat else self.countryStats[cnt][0]
            #
			# try:
			# 	arbiter[gnd] += self.countryStats[cnt]
			# except:
			# 	arbiter[gnd] = self.countryStats[cnt]

			try:
				arbiter[gnd] += userNum
			except:
				arbiter[gnd] = userNum


		'''Keep the gender with the highest total count
		(frequency) aggregated across all countries.'''
		# l = [(g,c) for g, c in arbiter.items()]
		# if len(l):
			# ml = max(l, key=lambda pair:pair[1])
			# gender = ml[0]
			# return gender

		#Sum the statistics of the countries which agree on each gender
		stat = 0
		totalStat = 0
		for g, c in arbiter.items():
			gender = g if c> stat else gender
			totalStat += c
			if g == gender:
				stat = c



		confUser = round(stat / totalStat,3) if totalStat !=0 else 0

		# if gender is not None:
		# 	return gender
		# '''I might have the name in gender.c, but for a different country (or other)'''
		# gender = self.genderDotCLookup(firstName, country, strict=False, simplified=True)

		conf = confUser if len(countriesGenders)>1 else conf
		return (gender, conf)


	def resolveGenderOverall(self, name, script= 'Latin'):
		(gender,conf) = self.initialCheckName(name)
		if gender is not None:
			return (gender,conf)

		'''Extract first name from name string'''
		firstName = extractFirstName(name, 'direct')


		'''If everything failed, try cross-country'''
		(gender,conf) = self.resolveFirstNameOverall(firstName, True, script)
		if gender is not None:
			if gender == 'blacklist':
				return (None,0)
			return (gender,conf)

		'''Try also unidecoded version'''
		dname = unidecode(name)
		(gender,conf) = self.resolveFirstNameOverall(extractFirstName(dname, 'direct'), True, script)
		if gender is not None:
			if gender == 'blacklist':
				return (None,0)
			return (gender,conf)

		'''Try also inverse names: (i.e. family name)'''
		(gender,conf) = self.resolveFirstNameOverall(extractFirstName(name, 'inverse'), True, script)
		if gender is not None:
			if gender == 'blacklist':
				return (None,0)
			return (gender,conf)

		'''Try also middle names: (e.g. J. Marcos Nieto)'''
		if len(name.split()) == 3:
			mid = name.split()[1]
			(gender,conf) = self.resolveFirstNameOverall(mid, True, script)
			if gender is not None:
				if gender == 'blacklist':
					return (None,0)
				return (gender,conf)


		if len(name.split()) == 1:

			#bogdan
			(gender,conf) = self.resolveFirstNameOverall(name.lower(), True, script)
			if gender is not None:
				if gender == 'blacklist':
					return (None,0)
				return (gender,conf)

			'''- Try to guess first name from: bogdanv, vbogdan'''
			# bogdanv
			(gender,conf) = self.resolveFirstNameOverall(name[:-1].lower(), True, script)
			if gender is not None:
				if gender == 'blacklist':
					return (None,0)
				return (gender,conf)
			#vbogdan
			(gender,conf) = self.resolveFirstNameOverall(name[1:].lower(), True, script)
			if gender is not None:
				if gender == 'blacklist':
					return (None,0)
				return (gender,conf)


		return (gender,conf)



	'''Main gender resolution function. Process:
	- if name is written in Cyrillic or Greek, transliterate
	- if country in {Russia, Belarus, ...}, check suffix
		* name might be inversed, so also try inverse if direct fails
	- extract first name and try to resolve
		* name might be inversed, so also try inverse if direct fails
	- assume name is in fact username, and try different tricks:
		* if country in {The Netherlands, ..}, look for vd, van, ..
		* try to guess name from vbogdan and bogdanv
	- if still nothing, inverse and try first name again (maybe country was empty)'''


	def resolveGenderByCountry(self, name, country, script = 'Latin'):
		(gender,conf) = self.initialCheckName(name)
		if gender is not None:
			return (gender,conf)
		'''Extract first name from name string'''
		firstName = extractFirstName(name, 'direct')

		if country is not None:
			'''Start with suffixes
			Works well for Russians (can determine gender based on surname suffix)'''
			if country in self.suffixes.keys():
				(gender,conf) = self.suffixLookup(name, country)
				if gender is not None:
					return (gender,conf)
			'''If still no luck, extract first name and try to resolve'''
			(gender,conf) = self.resolveFirstName(firstName, country, True, script)
			if gender is not None:
				if gender == 'blacklist':
					return (None,0)
				return (gender, conf)

			'''Try to inverse if no luck
			Hungarians use reversed first/last names order'''
			if country in self.invOrder:
				(gender, conf) = self.suffixLookup(inverseNameParts(name), country)
				if gender is not None:
					return (gender, conf)

				(gender, conf) = self.resolveFirstName(extractFirstName(name, 'inverse'), country, True, script)
				if gender is not None:
					if gender == 'blacklist':
						return (None, 0)
					return (gender, conf)

			'''Starting to get desperate by now. Assume name is in fact username,
			and try different tricks:'''
			if len(name.split()) == 1:
				'''- Try the Dutch tricks'''
				if country in ['Belgium', 'The Netherlands', 'South Africa']:
					positions = [m.start() for m in re.finditer('v', name)]
					bestMatch = []
					if len(positions):
						for pos in positions:
							(gender, conf) = self.resolveFirstName(name[:pos], country, True, script)
							if gender is not None:
								if gender != 'blacklist':
									bestMatch.append(gender)
					gender = next((g for g in bestMatch if g != 'unisex'), None)
					if gender is not None:
						return (gender, conf)
					if 'unisex' in bestMatch:
						return ('unisex',0)

				'''- Try to guess first name from: bogdanv, vbogdan'''
				#bogdan
				(gender,conf) = self.resolveFirstNameOverall(name.lower(), True, script)
				if gender is not None:
					if gender == 'blacklist':
						return (None,0)
					return (gender,conf)

				# bogdanv
				(gender, conf) = self.resolveFirstName(name[:-1].lower(), country, True, script)
				if gender is not None:
					if gender == 'blacklist':
						return (None,0)
					return (gender, conf)
				# vbogdan
				(gender, conf) = self.resolveFirstName(name[1:].lower(), country, True, script)
				if gender is not None:
					if gender == 'blacklist':
						return (None, 0)
					return (gender, conf)


			'''I can't believe I'm trying leet'''
			nameL = leet2eng(name)
			(gender, conf) = self.resolveFirstName(extractFirstName(nameL, 'direct'), country, True, script)
			if gender is not None:
				if gender == 'blacklist':
					return (None,0)
				return (gender, conf)

			'''Try also the unidecoded version'''
			dname = unidecode(name)
			(gender, conf) = self.resolveFirstName(extractFirstName(dname, 'direct'), country, True, script)
			if gender is not None:
				if gender == 'blacklist':
					return (None, 0)
				return (gender, conf)
		return (None, 0)


if __name__=="__main__":
	import os
	from testSuites import testSuite1, testSuite2
	
	dataPath = os.path.abspath(".")
	gc = GenderComputer(os.path.join(dataPath, 'nameLists'))
	
	print 'Test suite 1'
	for (name, country) in testSuite1:
		print [unidecode(name), country], gc.render(name, country, None, "Latin")
		print [unidecode(name), country], gc.resolveGender(name, "Latin")
	
	print
	print 'Test suite 2'
	for (name, country) in testSuite2:
		print [unidecode(name), country], gc.resolveGender(name, country, None, "Latin")



