# -*- coding: utf-8 -*-

from NameClassifier_light import *

__author__ = 'Tomaz-UNGP'

# TODO: Add image face recognition (out for now because API calls are not scalable)


class ScalableClassifier:

    _nameClassifier = None

    class NameRecognitionError(Exception):
        pass

    def __init__(self):
        self._nameClassifier = NameClassifier()

    def simpleClassification(self, text):
        """Classifies a single piece of text.

            Args:
                text (str):  Text to classify.

            Returns:
                classification result (str) ['female'|'male'|'unisex'|'Unknown']

            Raises:
                NameRecognitionError
        """

        try:
            classificationResult = self._nameClassifier.classifyName(text)
        except Exception as e:
            raise NameRecognitionError(str(e))

        return classificationResult

    def runClassification(self, sourceGenerator):
        """Runs classification over a generator's elements.

            Args:
                sourceGenerator (generator):  Generator of objects to classify.
                Each object must be a dict with at least two elements:
                {
                    'text': text-to-classify,
                    'id': record-id
                }

            Returns:
                Generator of dictionary objects.
                Each object will be a dict with three elements:
                {
                    'text': text-to-classify,
                    'id': record-id,
                    'result': classification-result ['female'|'male'|'unisex'|'Unknown']
                }

            Raises:
                NameRecognitionError
        """

        for el in sourceGenerator:
            classificationResult = self.simpleClassification(el['text'])
            returnObj = {'id': el['id'], 'text': el['text'], 'result': classificationResult}
            yield returnObj
