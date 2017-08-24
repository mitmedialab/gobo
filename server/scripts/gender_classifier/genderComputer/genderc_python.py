# This Python file uses the following encoding: UTF-8

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

import os

'''char set = iso8859-1
"Non-iso" unicode chars are represented as follows'''

charMap = {
    '<A/>':unichr(256),
    '<a/>':unichr(257),
    '<¬>':unichr(258),
    '<‚>':unichr(259),
    '<A,>':unichr(260),
    '<a,>':unichr(261),
    '<C¥>':unichr(262),
    '<c¥>':unichr(263),
    '<C^>':unichr(268),
    '<CH>':unichr(268),
    '<c^>':unichr(269),
    '<ch>':unichr(269),
    '<d¥>':unichr(271),
    '<–>':unichr(272),
    '<DJ>':unichr(272),
    '<>':unichr(273),
    '':unichr(273),
    '<dj>':unichr(273),
    '<E/>':unichr(274),
    '<e/>':unichr(275),
    '<E∞>':unichr(278),
    '<e∞>':unichr(279),
    '<E,>':unichr(280),
    '<e,>':unichr(281),
    '< >':unichr(282),
    '<Í>':unichr(283),
    '<G^>':unichr(286),
    '<g^>':unichr(287),
    '<G,>':unichr(290),
    '<g¥>':unichr(291),
    '<I/>':unichr(298),
    '<i/>':unichr(299),
    '<I∞>':unichr(304),
    '<i>':unichr(305),
    '<IJ>':unichr(306),
    '<ij>':unichr(307),
    '<K,>':unichr(310),
    '<k,>':unichr(311),
    '<L,>':unichr(315),
    '<l,>':unichr(316),
    '<L¥>':unichr(317),
    '<l¥>':unichr(318),
    '<L/>':unichr(321),
    '<l/>':unichr(322),
    '<N,>':unichr(325),
    '<n,>':unichr(326),
    '<N^>':unichr(327),
    '<n^>':unichr(328),
    '<÷>':unichr(336),
    '<ˆ>':unichr(337),
#    'å':unichr(338),
    '<OE>':unichr(338),
#   'ú':unichr(339),
    '<oe>':unichr(339),
    '<R^>':unichr(344),
    '<r^>':unichr(345),
    '<S,>':unichr(350),
    '<s,>':unichr(351),
#    'ä':unichr(352),
    '<S^>':unichr(352),
    '<SCH>':unichr(352),
    '<SH>':unichr(352),
#    'ö':unichr(353),
    '<s^>':unichr(353),
    '<sch>':unichr(353),
    '<sh>':unichr(353),
    '<T,>':unichr(354),
    '<t,>':unichr(355),
    '<t¥>':unichr(357),
    '<U/>':unichr(362),
    '<u/>':unichr(363),
    '<U∞>':unichr(366),
    '<u∞>':unichr(367),
    '<U,>':unichr(370),
    '<u,>':unichr(371),
    '<Z∞>':unichr(379),
    '<z∞>':unichr(380),
    '<Z^>':unichr(381),
    '<z^>':unichr(382),
    '<ﬂ>':unichr(7838),
}

dataPath = os.path.abspath('.')

'''Replace HTML encoded unicode chars by the true unicode equivalent'''

f = open(os.path.abspath('./0717-182/nam_dict1.txt'), 'rb')
g = open(os.path.join(dataPath, 'nameLists', 'nam_dict2.txt'), 'wb')

def rewrite(s):
    suffix = s[-59:]
    prefix = s[:len(s)-len(suffix)].strip()
    for key in charMap.keys():
        prefix = prefix.replace(key, charMap[key])
    s = prefix + ' ' * (29-len(prefix)) + suffix  
    return s

idx = 0
for row in f.readlines():
    if idx >= 362:
        nrow = rewrite(row)
    else:
        nrow = row
    idx += 1
    g.write(nrow)

f.close()
g.close()

'''Read the data into a Python dictionary'''

from unicodeMagic import UnicodeReader
f = open(os.path.join(dataPath, 'nameLists', 'nam_dict2.txt'), 'rb')
reader = UnicodeReader(f)

genderDict = {}

idx = 0

shortNames = []    
for row in reader:
    if idx > 361:
        text = row[0]
        mf = text[:2].strip() # M,1M,?M, F,1F,?F, ?, =
        #  =  <short_name> <long_name> 
        name = text[2:29].lower().strip()
        sortingFlag = text[29] # +,-; ignore +
        frequencies = text[30:-2]
    
        if sortingFlag != '+':
            if mf == '=':
                shortNames.append([name, frequencies])
            else:
                '''"Jun+Wei" represents the names "Jun-Wei", "Jun Wei" and "Junwei"'''
                if name.find('+') != -1:
                    names = [name.replace('+','-'), name.replace('+',' '), name.replace('+','').capitalize()]
                else:
                    names = [name]
                for name in names:
                    if genderDict.has_key(name):
                        genderDict[name].append([mf, frequencies])
                    else:
                        genderDict[name] = [[mf, frequencies]]
    idx += 1
             
    
for [name, frequencies] in shortNames:
    shortName, longName = name.split()
    if genderDict.has_key(shortName) and not genderDict.has_key(longName):
        for nameList in genderDict[shortName]:
            if genderDict.has_key(longName):
                genderDict[longName].append(nameList)
            else:
                genderDict[longName] = [nameList]
            
    elif genderDict.has_key(longName) and not genderDict.has_key(shortName):
        for nameList in genderDict[longName]:
            if genderDict.has_key(shortName):
                genderDict[shortName].append(nameList)
            else:
                genderDict[shortName] = [nameList]
            
print len(genderDict.keys()), 'names in dictionary'


import pickle
fdict = open(os.path.join(dataPath, 'nameLists', 'gender.dict'), "wb")
pickle.dump(genderDict, fdict)
fdict.close()
