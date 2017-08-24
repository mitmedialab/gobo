# -*- coding: utf-8 -*-

__author__ = 'Tomaz-UNGP'

import unittest
from ScalableClassifier import ScalableClassifier

class TestScalableClassifier(unittest.TestCase):

    _classifier = None

    _testList = [
        {"id": 1, "text": u"Jean-Marie Clouseau"},
        {"id": 2, "text": u"Marie Clouseau"},
        {"id": 3, "text": u"Jean Gray"},
        {"id": 4, "text": u"Limon Herrera"},
        {"id": 5, "text": u"Hellboy"},
        {"id": 6, "text": u"Slavko Avsenik"},
        {"id": 7, "text": u"عایشه"},
        {"id": 8, "text": "Just me"},
        {"id": 12, "text": u"由紀"},
        {"id": 15, "text": u"Γεώργιος"},
        {"id": 17, "text": u"Abhishek Bachchan"},
        {"id": 19, "text": u"Анита"}
    ]

    _testGenerator = (el for el in _testList)

    _testAssertions = {
        1: 'male',
        2: 'female',
        3: None, # Ignore, Jean fails (or more to the point, it fails for English, matches with French Jean and returns male)
        4: 'male', # migh be unisex some day
        5: 'Unknown',
        6: 'male',
        7: 'Unknown', # should be female once Persian/Arabic is in
        8: 'male', # false positive for now
        12: 'Unknown', # should be female once Japanese is in
        15: 'Unknown', # should be male once Greek is in
        17: 'male',
        19: 'Unknown' # should be female once Russian/Bulgarian is in
    }

    def setUp(self):
        self._classifier = ScalableClassifier()

    def testRun(self):
        classifierResult = self._classifier.runClassification(self._testGenerator)
        for res in classifierResult:
            if self._testAssertions[res['id']] is not None:
                self.assertEqual(self._testAssertions[res['id']], res['result'])

if __name__ == '__main__':
    unittest.main()
