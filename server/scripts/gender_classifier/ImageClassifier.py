import requests

__author__ = 'pvandepavoordt'

class ImageClassifier:

    def classifyImage(self, pictureUrl, faceplusplusConfig, confidenceThreshold = 0, countThreshold = 1):
        # Check if default image is used
        if "/default_profile_images/" in pictureUrl:
            return 'unknown'
        apiSecret = faceplusplusConfig['apisecret']
        apiKey = faceplusplusConfig['apikey']
        url = 'https://apius.faceplusplus.com/v2/detection/detect?url=' + pictureUrl + '&api_secret=' + apiSecret + '&api_key=' + apiKey + '&attribute=gender'

        response = requests.get(url)

        # Loop until status code is satisfactory
        retries = 0
        while response.status_code != 200:
            if response.status_code == 432:
                return 'unknown'
            response = requests.get(url)
            retries += 1
            if retries == 3:
                return 'unknown'

        faces = None
        try:
            faces = response.json()['face']
        except KeyError:
            return 'unknown'

        # Check if more or less than one face is detected
        if len(faces) < 1:
            return 'unknown'
        if countThreshold is not None and len(faces) > countThreshold:
            return 'unknown'

        try:
            sortedByConfidence = sorted(faces, key=lambda k:k['attribute']['gender']['confidence'], reverse=True)
            topDetection = sortedByConfidence[0]
            if topDetection['attribute']['gender']['confidence'] >= confidenceThreshold:
                return topDetection['attribute']['gender']['value']
        except:
            pass

        return 'unknown'
