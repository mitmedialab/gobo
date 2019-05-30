# -*- coding: utf-8 -*-
__author__ = 'parisazahedi'

import csv


def toUnicode(obj, encoding='utf-8'):
    # if isinstance(obj, str):
    #     if not isinstance(obj, unicode):
    #         obj = unicode(obj, encoding)
    return obj


def mapCountryAbb():
    cf = open('./genderComputer/nameLists/countryAbb.csv')
    reader = csv.reader(cf)

    countries_dict = dict()

    for row in reader:
        if row[1] not in countries_dict:
            countries_dict[row[1]] = [row[0].strip()]

    cf.close()
    return (countries_dict)


def getCountryAbb(country):
    countryAbb = mapCountryAbb()
    if country in countryAbb.keys():
        return countryAbb[country]
    else:
        return None
