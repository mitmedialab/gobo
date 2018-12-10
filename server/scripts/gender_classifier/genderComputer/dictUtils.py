import types
import pickle
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

"""Some useful utilities for working with dictionaries"""


def isList(obj):
    """isList(obj) -> Returns true if obj is a Python list.

    This function does not return true if the object supplied
    is a UserList object.
    """
    return type(obj) == types.ListType


def isTuple(obj):
    "isTuple(obj) -> Returns true if obj is a Python tuple."
    return type(obj) == types.TupleType


def isPySeq(obj):
    """isPySeq(obj) -> Returns true if obj is a Python list or a Python tuple.

    This function does not return true if the object supplied is
    a UserList object.
    """
    return isList(obj) or isTuple(obj)


def isLongString(obj):
    """isLongString(obj) -> Returns true if obj is a string of a size larger than 1.

    This function does not return true if the object supplied is
    a UserString object.
    """
    return type(obj) == types.StringType and len(obj) > 1


class MyDict:

    def __init__(self, path=None, encod=None):
        self.data = {}
        if path is not None:
            fdict = open(path, "r")
            if encod is not None:
                dict1 = pickle.load(fdict, encoding=encod)
            else:
                dict1 = pickle.load(fdict)
            # print "Loaded dictionary from %s" % path
            fdict.close()
            self.data = dict1

    def update(self, dictionary=None):
        if dictionary is not None:
            for k, v in dictionary.items():
                self.data[k] = v

    def keys(self):
        return self.data.keys()

    def items(self):
        return self.data.items()

    def values(self):
        return self.data.values()

    def append(self, key, value):
        try:
            self.data[key].append(value)
        except:
            self.data[key] = []
            self.data[key].append(value)

    def save(self, path):
        fdict = open(path, "w")
        pickle.dump(self.data, fdict)
        # print "Wrote dictionary to %s" % path
        fdict.close()

    def saveAsCSV(self, path):
        f = open(path, 'w')

        for key in self.keys():
            row = []
            rs = ''
            vs = ''

            if isTuple(key):
                for item in list(key):
                    row.append(item)
            else:
                row.append(key)

            values = []
            if isList(self.data[key]):
                for v in self.data[key]:
                    values.append(str(v))
            else:
                values.append(str(self.data[key]))

            vs = ', '.join(values)

            rs = '; '.join(row)
            rs += '; '
            rs += vs

            f.write('%s\n' % rs)

        f.close()
        print "Wrote dictionary to %s" % path

    def __getitem__(self, key):
        if key in self.data:
            return self.data[key]
        if hasattr(self.__class__, "__missing__"):
            return self.__class__.__missing__(self, key)
        raise KeyError(key)

    def __setitem__(self, key, item):
        self.data[key] = item

    def get_key(self, value):
        """find the key(s) as a list given a value"""
        return [item[0] for item in self.items() if value in item[1]][0]

    def get_value(self, key):
        """find the value given a key"""
        return self[key]
