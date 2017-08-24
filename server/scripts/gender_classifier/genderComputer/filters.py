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



'''Normalise country names to match those used in the gender.c database'''
def normaliseCountryName(country):
    if country in ['Algeria', 'Bahrain', 'Comoros', 'Djibouti',
                   'Egypt', 'Irak', 'Iran', 'Jordan', 'Kuwait',
                   'Lebanon', 'Libya', 'Mauritania', 'Morocco',
                   'Oman', 'Palestine', 'Qatar', 'Saudi Arabia',
                   'Somalia', 'Sudan', 'Syria', 'Tunisia',
                   'United Arab Emirates', 'Yemen']:
        return 'Arabia/Persia'
    elif country in ['Bangladesh', 'India', 'Pakistan', 'Sri Lanka']:
        return 'India/Sri Lanka'
    elif country in ['North Korea', 'South Korea']:
        return 'Korea'
    return country



