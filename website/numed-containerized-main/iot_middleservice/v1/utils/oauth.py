import requests
from time import time
from urllib.parse import (quote, urlencode, parse_qsl, urlsplit,
                              urlunsplit, urljoin)

import base64
import hmac
from hashlib import sha1

from random import SystemRandom
random = SystemRandom().random

# copy from https://github.com/litl/rauth/blob/a6d887d7737cf21ec896a8104f25c2754c694011/rauth/service.py#L18
def process_token_request(r, decoder, *args):
    try:
        data = decoder(r.content)
        return tuple(data[key] for key in args)
    except KeyError as e:  # pragma: no cover
        bad_key = e.args[0]
        PROCESS_TOKEN_ERROR = ('Decoder failed to handle {key} with data as returned '
                    'by provider. A different decoder may be needed. '
                    'Provider returned: {raw}')
        raise KeyError(PROCESS_TOKEN_ERROR.format(key=bad_key, raw=r.content))

# copy from https://github.com/litl/rauth/blob/a6d887d7737cf21ec896a8104f25c2754c694011/rauth/utils.py
def parse_utf8_qsl(s):
    d = dict(parse_qsl(s))
    result = {} # !!!!! use this instead

    for k, v in d.items():  # pragma: no cover
        if not isinstance(k, bytes) and not isinstance(v, bytes):
            # skip this iteration if we have no keys or values to update
            continue
        # d.pop(k) # !!!!!!!! comment this to avoid error
        if isinstance(k, bytes):
            k = k.decode('utf-8')
        if isinstance(v, bytes):
            v = v.decode('utf-8')
        result[k] = v # !!!! and this
    return result

CALLBACK_URL="http://192.168.18.96/api/v1/iot/garmin/verifier"
class OAuth1Service():
    def __init__ (self,
        # consumer_key,
        # consumer_secret,
        # request_token_url,
        # authorize_url,
        # access_token_url,
        # callback_url
    ):

        CONSUMER_KEY = "7b3725fa-c7e1-4f6f-a6e4-164466c0201a"
        CONSUMER_SECRET = "gbnUbL6ks3VnfEW0VJEki26YXbH8ToaR5AG"
        REQUEST_TOKEN_URL="https://connectapi.garmin.com/oauth-service/oauth/request_token"
        AUTHORIZE_URL="https://connect.garmin.com/oauthConfirm"
        ACCESS_TOKEN_URL="https://connectapi.garmin.com/oauth-service/oauth/access_token"
        # CALLBACK_URL="https://ec2-108-136-227-7.ap-southeast-3.compute.amazonaws.com/api/v1/iot/garmin/verifier"
        # CALLBACK_URL="http://192.168.18.96/api/v1/iot/garmin/verifier"

        # define oauth_consumer_key
        self.oauth_consumer_key = CONSUMER_KEY

        # define oauth_consumer_secret
        self.oauth_consumer_secret = CONSUMER_SECRET

        # define oauth_signature_method
        self.oauth_signature_method = 'HMAC-SHA1'
        
        # define oauth_nonce
        # following https://github.com/litl/rauth/blob/a6d887d7737cf21ec896a8104f25c2754c694011/rauth/session.py#L242
        self.oauth_nonce = sha1(str(random()).encode('ascii')).hexdigest() 
        
        # define oauth_timestamp
        # following https://github.com/litl/rauth/blob/a6d887d7737cf21ec896a8104f25c2754c694011/rauth/session.py#L245
        self.oauth_timestamp = int(time())
        
        # define oauth_version
        self.oauth_version = '1.0'

        # define request_token_url
        self.request_token_url = REQUEST_TOKEN_URL

        # define authorize_url
        self.authorize_url = AUTHORIZE_URL

        # # define callback_url
        # self.callback_url = CALLBACK_URL

        # define callback_url
        self.access_token_url = ACCESS_TOKEN_URL

    def get_request_token(self):

        # calculate signature
        self._calculate_signature()

        self.request_token_headers = {
            'Authorization': f'OAuth oauth_nonce={self.oauth_nonce}, oauth_signature={self._escape(self.signature).decode()}, oauth_consumer_key={self.oauth_consumer_key}, oauth_timestamp={self.oauth_timestamp}, oauth_signature_method={self.oauth_signature_method}, oauth_version={self.oauth_version}'
        }

        r = requests.post(self.request_token_url, headers=self.request_token_headers)

        if not(r.status_code == 200):
            print(r.text)
            raise Exception("Error in requesting request token")

        self.request_token, self.request_token_secret = \
            process_token_request(r, parse_utf8_qsl, 'oauth_token', 'oauth_token_secret')

        print(f'''
           -- Request token successful
           -- consumer secret= {self.oauth_consumer_secret}
           -- nonce= {self.oauth_nonce}
           -- timestamp= {self.oauth_timestamp}
           -- signature= {self.signature}
           -- request token= {self.request_token}
           -- request token secret= {self.request_token_secret} 
        ''')

        return r

    def get_authorization_url(self, callback_url=CALLBACK_URL):

        # get request token
        self.get_request_token()

        self.authorization_url = f"{self.authorize_url}?oauth_token={self.request_token}&oauth_callback={callback_url}"

        print(f'''
            -- authorization url= {self.authorization_url}
        ''')

        return self.authorization_url

    def get_user_access_token(self, request_token, request_token_secret, verifier):

        # we can't use the old nonce and timestamp
        self.oauth_nonce_access = sha1(str(random()).encode('ascii')).hexdigest()
        self.oauth_timestamp_access = int(time())

        # get normalized_parameters_access_token
        self.normalized_parameters_access_token = f"oauth_consumer_key={self.oauth_consumer_key}&oauth_nonce={self.oauth_nonce_access}&oauth_signature_method={self.oauth_signature_method}&oauth_timestamp={self.oauth_timestamp_access}&oauth_token={request_token}&oauth_verifier={verifier}&oauth_version={self.oauth_version}" 

        # POST&http%3A%2F%2Fconnectapi.garmin.com%2Foauthservice%2Foauth%2Faccess_token&oauth_consumer_key%3Dcb60d7f5-4173-7bcd-ae02-e5a52a6940ac%26oauth_nonce%3D2lRbgVyTAgh%26oauth_signature_method%3DHMACSHA1%26oauth_timestamp%3D1484913680%26oauth_token%3D760d85bd-b86e-4da6-b58bba57a542b23b%26oauth_verifier%3DwvDJQmLSwY%26oauth_version%3D1.0

        # get percent-encoded signature_base_string
        self.percent_encoded_signature_base_string_access_token = b'POST&'+self._escape(self.access_token_url)+b'&'+self._escape(self.normalized_parameters_access_token)

        # get key
        # the key is Consumer Secret and Request Token Secret, separated with '&' character:
        key = self._escape(self.oauth_consumer_secret) + b'&' + self._escape(request_token_secret)

        # get signature
        hashed = hmac.new(key, self.percent_encoded_signature_base_string_access_token, sha1)
        self.signature_access_token = base64.b64encode(hashed.digest()).decode()

        self.access_token_headers = {
            'Authorization': f'OAuth oauth_verifier={verifier}, oauth_nonce={self.oauth_nonce_access}, oauth_signature={self._escape(self.signature_access_token).decode()}, oauth_consumer_key={self.oauth_consumer_key}, oauth_token={request_token}, oauth_timestamp={self.oauth_timestamp_access}, oauth_signature_method={self.oauth_signature_method}, oauth_version={self.oauth_version}'
        }

        r = requests.post(self.access_token_url, headers=self.access_token_headers)

        if not(r.status_code == 200):
            # print(r.text)
            # raise Exception("Error in requesting access token")
            print("Error in requesting access token")
            return r

        else:
            self.access_token, self.access_token_secret = \
                process_token_request(r, parse_utf8_qsl, 'oauth_token', 'oauth_token_secret')

            print(f'''
            -- Access token successful
            -- consumer secret= {self.oauth_consumer_secret}
            -- user access token= {self.access_token}
            -- user access token secret= {self.access_token_secret} 
            -- nonce= {self.oauth_nonce_access} 
            -- timestamp= {self.oauth_timestamp_access} 
            ''')

            return r

    def _calculate_signature(self):

        # get normalized_parameters_request_token
        self.normalized_parameters_request_token = f"oauth_consumer_key={self.oauth_consumer_key}&oauth_nonce={self.oauth_nonce}&oauth_signature_method={self.oauth_signature_method}&oauth_timestamp={self.oauth_timestamp}&oauth_version={self.oauth_version}" 


        # get percent-encoded signature_base_string
        self.percent_encoded_signature_base_string = b'POST&'+self._escape(self.request_token_url)+b'&'+self._escape(self.normalized_parameters_request_token)

        # get key
        #  the key is the Consumer Secret, followed by an '&' character (ASCII code 38). 
        key = self._escape(self.oauth_consumer_secret) + b'&'

        # get signature
        # following https://github.com/litl/rauth/blob/a6d887d7737cf21ec896a8104f25c2754c694011/rauth/oauth.py#L152
        hashed = hmac.new(key, self.percent_encoded_signature_base_string, sha1)
        self.signature = base64.b64encode(hashed.digest()).decode()

    def _ensure_unicode(self, s):
        if not isinstance(s, bytes):
            return s.encode('utf-8')
        return s.decode('utf-8')  # pragma: no cover

    def _escape(self, s):
        '''
        Escapes a string, ensuring it is encoded as a UTF-8 octet.
        :param s: A string to be encoded.
        :type s: str
        '''
        return quote(self._ensure_unicode(s), safe='~').encode('utf-8')

    

