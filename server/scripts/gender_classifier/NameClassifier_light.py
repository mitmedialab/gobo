# -*- coding: utf-8 -*-
__author__ = 'parisazahedi'

import os, unicodedata

from genderComputer.genderComputer import GenderComputer
from utils import *


class NameClassifier:
    def __init__(self):
        package_directory = os.path.dirname(os.path.abspath(__file__))
        self.nameDataPath = os.path.join(package_directory, './genderComputer/nameLists')
        #        self.nameDataPath = os.path.abspath('./genderComputer/nameLists')
        self.genderComputer = GenderComputer(self.nameDataPath)

    def getScript(self, name):

        lst = []

        for i, c in enumerate(name):
            try:
                characterset = unicodedata.name(c).split()[0]
                lst.append(characterset)
            except:
                lst.append("unknown")

        commonCharacter = max(set(lst), key=lst.count)

        commonCharacter = commonCharacter.capitalize()
        return (commonCharacter)

    def cleanName(self, name):

        '''clean account name'''
        name = name.strip()
        name = toUnicode(name)

        '''remove more than one spaces and \n \t in a name'''
        ns = name.split()
        name = ' '.join(ns)
        return name

    ''' identify script of name '''
    ''' clean name initially '''
    ''' call genderComputer to resolve gender'''

    def predictGenderbyName(self, name):

        gender = None
        conf = 0

        if name is None:
            return gender, conf

        name = self.cleanName(name)

        if name != "":
            script = self.getScript(name)
            (gender, conf) = self.genderComputer.resolveGenderOverall(name, script)

        if gender is None:
            gender = 'unknown'

        return (gender, conf)

    def predictGenderByNameCountry(self, name, location):
        gender = None
        conf = 0

        if (name is None) | (location is None):
            return gender, conf

        name = self.cleanName(name)

        location = location.strip()
        location = toUnicode(location)

        if name != "" and location != "":
            cntName = getCountryAbb(location)
            script = self.getScript(name)
            if cntName is None:
                # Assume it is the full country name
                (gender, conf) = self.genderComputer.resolveGenderByCountry(name, location, script)
            else:
                #Country is a two letter code
                countryName = cntName[0]
                (gender, conf) = self.genderComputer.resolveGenderByCountry(name, countryName, script)

        if gender is None:
            gender = 'unknown'

        return gender, conf

    ''' Public method which is called via API '''

    def classifyName(self, name):
        (genderByName, confByName) = self.predictGenderbyName(name)
        genderByName = "unknown" if genderByName is None else genderByName

        return genderByName

    def classifyNameByCountry(self, name, country):
        (genderByName, confByName) = self.predictGenderByNameCountry(name, country)
        genderByName = "unknown" if genderByName is None else genderByName

        return genderByName