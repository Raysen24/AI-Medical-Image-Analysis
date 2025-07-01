from app.utils.oauth import OAuth1Service

garmin = OAuth1Service()
# garmin.get_authorization_url()
garmin.get_authorization_url("https://ec2-108-136-227-7.ap-southeast-3.compute.amazonaws.com/api/v1/iot/garmin/verifier")

request_token = input("Enter request_token:")
request_token_secret = input("Enter request_token_secret:")
verifier = input("Enter verifier:")

garmin.get_user_access_token(request_token=request_token,request_token_secret=request_token_secret,verifier=verifier)

# POST&https://connectapi.garmin.com/oauth-service/oauth/request_token&oauth_consumer_key=7b3725fa-c7e1-4f6f-a6e4-164466c0201a&oauth_nonce=c607b159c48e72060dc31622591dcf1c0d34dd9b&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1659234638&oauth_version=1.0

# POST&https://connectapi.garmin.com/oauth-service/oauth/request_token&oauth_consumer_key=7b3725fa-c7e1-4f6f-a6e4-164466c0201a&oauth_nonce=c607b159c48e72060dc31622591dcf1c0d34dd9b&oauth_signature_method=HMAC-SHA1&oauth_timestamp=1659234638&oauth_version=1.0

# POST&https%3A%2F%2Fconnectapi.garmin.com%2Foauth-service%2Foauth%2Frequest_token&oauth_consumer_key%3D7b3725fa-c7e1-4f6f-a6e4-164466c0201a%26oauth_nonce%3Dc607b159c48e72060dc31622591dcf1c0d34dd9b%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1659234638%26oauth_version%3D1.0

# POST&https%3A%2F%2Fconnectapi.garmin.com%2Foauth-service%2Foauth%2Frequest_token%26oauth_consumer_key%3D7b3725fa-c7e1-4f6f-a6e4-164466c0201a%26oauth_nonce%3Dc607b159c48e72060dc31622591dcf1c0d34dd9b%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1659234638%26oauth_version%3D1.0

# POST&https%3A%2F%2Fconnectapi.garmin.com%2Foauth-service%2Foauth%2Frequest_token%26oauth_consumer_key%3D7b3725fa-c7e1-4f6f-a6e4-164466c0201a%26oauth_nonce%3D594ca29b1a28ae2c3685faf703ba34c3dc6aa0ed%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1659235690%26oauth_version%3D1.0

# POST&https%3A%2F%2Fconnectapi.garmin.com%2Foauth-service%2Foauth%2Frequest_token&oauth_consumer_key%3D7b3725fa-c7e1-4f6f-a6e4-164466c0201a%26oauth_nonce%3D594ca29b1a28ae2c3685faf703ba34c3dc6aa0ed%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1659235690%26oauth_version%3D1.0

# b'POST&https%3A%2F%2Fconnectapi.garmin.com%2Foauth-service%2Foauth%2Faccess_token&oauth_consumer_key%3D7b3725fa-c7e1-4f6f-a6e4-164466c0201a%26oauth_nonce%3D694fa409ddb7105aaf874c78d5b9aae022af3e7b%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1659259891%26oauth_token%3De550d8b9-154e-475e-9753-b0b902df15ee%26oauth_verifier%3DMqRVyR4nkS%26oauth_version%3D1.0'

# POST&https%3A%2F%2Fconnectapi.garmin.com%2Foauth-service%2Foauth%2Faccess_token&oauth_consumer_key%3D7b3725fa-c7e1-4f6f-a6e4-164466c0201a%26oauth_nonce%3D5111292648%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1659181524%26oauth_token%3D4f0d06a2-3a34-4cbf-985a-ec265289b25a%26oauth_verifier%3DHREnLSkbCB%26oauth_version%3D1.0

# {'Authorization': 'OAuth oauth_verifier=MqRVyR4nkS, oauth_nonce=694fa409ddb7105aaf874c78d5b9aae022af3e7b, oauth_signature=RUanxddgs2bJTGpnS%2B8jHcgOfp8%3D, oauth_consumer_key=7b3725fa-c7e1-4f6f-a6e4-164466c0201a, oauth_token=e550d8b9-154e-475e-9753-b0b902df15ee, oauth_timestamp=1659259891, oauth_signature_method=HMAC-SHA1, oauth_version=1.0'}

# Authorization: OAuth oauth_nonce="5111292648", oauth_signature="4Y7%2B9hGyGD5JAklC88GfZsQhvWI%3D", oauth_consumer_key="7b3725fa-c7e1-4f6f-a6e4-164466c0201a", oauth_token="4f0d06a2-3a34-4cbf-985a-ec265289b25a", oauth_timestamp="1659181524", oauth_verifier="HREnLSkbCB", oauth_signature_method="HMAC-SHA1", oauth_version="1.0"