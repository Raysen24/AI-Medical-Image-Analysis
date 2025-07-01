from fastapi import FastAPI, Body, Depends, HTTPException, status, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from fastapi.openapi.docs import (
    get_redoc_html,
    get_swagger_ui_html,
)
from fastapi.staticfiles import StaticFiles


from pymongo import MongoClient

from app.models.main import MeasurementData, BulkDownload, bulk_download_examples, upload_data_examples, upload_data_responses, RequestData
from app.utils.oauth import OAuth1Service

import numpy as np
from iteround import saferound

from time import time

import base64
import hmac
from hashlib import sha1
import requests
import os

mongo_client = MongoClient('mongo', 27017)

app = FastAPI(
    title="NuMed",
    description="NuMed-IoT: Documentation",
    version="0.2.0",
    docs_url=None, 
    redoc_url=None,
    root_path="/api/v1/iot"
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="/app/app/static"), name="static")

tags_metadata = [
    {
        "name":"Measurement Data",
        "description": "endpoints for measurement data"
        },
    {
        "name":"Authentication",
        "description": "endpoints for authentication"
        },
    {
        "name":"Garming",
        "description": "endpoints for Garmin Connect"
        },
]

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url="/api/v1/iot/openapi.json",
        title=app.title,
        swagger_favicon_url="/static/index.ico",
    )

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url="/api/v1/iot/openapi.json",
        title=app.title + " - ReDoc",
        redoc_favicon_url="/static/index.ico",
    )

@app.get("/", include_in_schema=False)
async def root():
    response = RedirectResponse(url='/docs')
    return response


# from fastapi.security import HTTPBasic, HTTPBasicCredentials
# from fastapi.security import HTTPBearer, HTTPBasicCredentials
from fastapi.security import HTTPBasic, HTTPBearer, HTTPBasicCredentials, HTTPAuthorizationCredentials
import requests
import urllib.parse
security_basic = HTTPBasic()
security_bearer = HTTPBearer()

def get_token(credentials: HTTPBasicCredentials = Depends(security_basic)):
    
    url = "http://maleobe/auth-numed/token/login/"
    data = {"password":credentials.password, "email":credentials.username}
    x = requests.post(url,data=data)

    if not (x.status_code == 200):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return x.json()['auth_token']

def get_profile(credentials: HTTPAuthorizationCredentials = Depends(security_bearer)):
    
    url = "http://maleobe/auth-numed/users/me/"
    headers = {'Authorization': f"Token {credentials.credentials}"}
    x = requests.get(url,headers=headers)

    if not (x.status_code == 200):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return x.json()


@app.get("/token",tags=['Authentication'])
async def login(token = Depends(get_token)):

    return {"auth_token": token}
    
@app.get("/profile",tags=['Authentication'])
async def profile(profile = Depends(get_profile)):

    return profile


@app.get("/data/type",tags=['Measurement Data'])
async def get_type_data(profile = Depends(get_profile)):
    try:

        # print(urllib.parse.quote(profile['email']))
        db = mongo_client[f"{urllib.parse.quote(profile['email']).replace('.','%2E')}"]
        list_collection_names = db.list_collection_names()
        return {"status" :True, 'data':list_collection_names}
    
    except Exception as e:
        # return {"status":False, "message": str(e)}
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            # detail= str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )


@app.get("/data/type/{type}/id",tags=['Measurement Data'])
async def get_measurement_id(type: str, profile = Depends(get_profile)):
    try:

        db = mongo_client[f"{urllib.parse.quote(profile['email']).replace('.','%2E')}"]
        list_id = [d['measurement_id'] for d in db[type].find({},{'measurement_id':1,'_id':0})]
        return {"status" :True, 'data': list_id}
        
    except Exception as e:
        # return {"status":False, "message": str(e)}
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            # detail= str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/data/type/{type}/id/{measurement_id}",tags=['Measurement Data'])
async def get_data(type: str, measurement_id: str, profile = Depends(get_profile)):
    try:

        db = mongo_client[f"{urllib.parse.quote(profile['email']).replace('.','%2E')}"]
        myquery = { "measurement_id": measurement_id }
        data = db[type].find(myquery,{'_id':0})
        return {"status" :True, 'data': data[0]}
        
    except Exception as e:
        # return {"status":False, "message": str(e)}
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            # detail= str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )



#@app.post("/data/bulkdownload", tags=["Measurement Data"])
@app.get("/data/bulkdownload/{measurement_id}", tags=["Measurement Data"])
async def bulk_download(
    #parameters: BulkDownload = Body(..., examples=bulk_download_examples),
    measurement_id: str,
    profile = Depends(get_profile)
    ):
    try:

        db = mongo_client[f"{urllib.parse.quote(profile['email']).replace('.','%2E')}"]

        data_response = {}

        #blood
        #myquery = { "measurement_id": parameters.blood_measurement_id }
        #data = db['blood'].find(myquery,{'_id':0})
        #data_response['blood_pressure'] = data[0]

        #breath
        myquery = { "measurement_id": measurement_id }
        data = db['breath'].find(myquery,{'_id':0})
        data_response['respiratory_rate'] = data[0]

        #heart
        #myquery = { "measurement_id": parameters.heart_measurement_id }
        #data = db['hearth'].find(myquery,{'_id':0})
        #data_response['heart_rate'] = data[0]

        #oxy
        myquery = { "measurement_id": measurement_id }
        data = db['oxy'].find(myquery,{'_id':0})
        data_response['O2_saturation'] = data[0]
        
        #temperature
        myquery = { "measurement_id": measurement_id }
        data = db['temp'].find(myquery,{'_id':0})
        data_response['temp'] = data[0]

        return {"status" :True, 'data': data_response}
        

    except Exception as e:
        # return {"status":False, "message": str(e)}
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            # detail= str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

# data = {'measurement_id':hashlib.sha256(str(measured_time[0]).encode()).hexdigest(),'data':measured_data,'time':measured_time,'unit':'bps'}
# db['breath'].insert_one(data)


@app.post("/data/upload",tags=['Measurement Data'],responses=upload_data_responses)
async def upload_data(
    measurement_data: MeasurementData= Body(..., examples=upload_data_examples),
    profile = Depends(get_profile)
    ):
    try:

        db = mongo_client[f"{urllib.parse.quote(profile['email']).replace('.','%2E')}"]
        data = {'measurement_id':measurement_data.measurement_id,'data':measurement_data.data,'time':measurement_data.time,'unit':measurement_data.unit}
        
        db[measurement_data.type_measurement].insert_one(data)
        return {"status" :True}
        
        
    except Exception as e:
        # return {"status":False, "message": str(e)}
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail= str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/data/real",tags=["Measurement Data"])
async def get_realtime_data(profile = Depends(get_profile)):
    try:
        
        red = np.abs(np.random.normal(10,2,1))
        yellow = np.abs(np.random.normal(20,3,1))
        green = 100-red-yellow
        data_room = saferound([red[0],yellow[0],green[0]],places=2)
        
        red = np.abs(np.random.normal(5,2,1))
        yellow = np.abs(np.random.normal(10,3,1))
        green = 100-red-yellow
        data_ews = saferound([red[0],yellow[0],green[0]],places=2)
        
        red = [int(np.random.randint(100,size=(1,))+1),int(np.random.randint(10,size=(1,))+1)]
        yellow = [int(np.random.randint(100,size=(1,))+1),int(np.random.randint(10,size=(1,))+1)]
        green = [int(np.random.randint(100,size=(1,))+1),int(np.random.randint(10,size=(1,))+1)]
        data_alert = [red, yellow, green]

        return {
                'room': data_room,
                'ews': data_ews,
                'alert': data_alert
                }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"}
                )

#CALLBACK_URL="http://192.168.18.96/api/v1/iot/garmin/verifier"
CALLBACK_URL=f"{os.getenv('SCHEMA')}://{os.getenv('SERVER_ADDRESS')}/api/v1/iot/garmin/verifier"
@app.get("/garmin/connect",tags=["Garmin"],include_in_schema=False)
async def garmin_connect(request: Request, callback: str = CALLBACK_URL):
    
    try:

        garmin = OAuth1Service()
        url = garmin.get_authorization_url(callback)

        db = mongo_client["garmin"]
        data = {
            'request_token':garmin.request_token,
            'request_token_secret':garmin.request_token_secret,
            'consumer_secret':garmin.oauth_consumer_secret,
            'request_path':request.url.path,
            'request_scheme':request.url.scheme,
            'request_url':request.url._url,
            # 'request_url':dict(request.scope["headers"]).get(b"referer", b"").decode(),
            'client_host':request.client.host,
            'client_port':request.client.port,
            'valid':False,
            }
        
        db['token'].insert_one(data)

        response = RedirectResponse(url=url)
        return response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail= str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/garmin/verifier",tags=["Garmin"],include_in_schema=False)
async def get_verifier(oauth_token: str='',oauth_verifier: str=''):
    
    try:
        db = mongo_client["garmin"]

        query_result = db['token'].find({'request_token':oauth_token},{'_id':False}) 
        result = list(query_result)
        result = result[0]
        request_token_secret = result['request_token_secret']

        garmin = OAuth1Service()
        garmin.get_user_access_token(request_token=oauth_token,request_token_secret=request_token_secret,verifier=oauth_verifier)

        myquery = { 'request_token': oauth_token }

        to_be_modified = {}
        to_be_modified["valid"] = True
        to_be_modified["verifier"] = oauth_verifier
        to_be_modified["access_token"] = garmin.access_token
        to_be_modified["access_token_secret"] = garmin.access_token_secret
        to_be_modified['request_nonce'] = garmin.oauth_nonce_access
        to_be_modified['request_timestamp'] = garmin.oauth_timestamp_access
        newvalues = { "$set": to_be_modified }

        db['token'].update_one(myquery, newvalues)

        # return {
        #         "status": True,
        #         "request_token": oauth_token,
        #         "verifier": oauth_verifier,
        #         "access_token": garmin.access_token,
        #         "access_token_secret": garmin.access_token_secret,
        #         }

        # url = f"{result['request_scheme']}://{os.getenv('SERVER_ADDRESS')}/api/v1/iot/docs"
        url = f"{result['request_scheme']}://{os.getenv('SERVER_ADDRESS')}/patient/garmin/index"
        response = RedirectResponse(url=url)
        return response

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail= str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.get("/garmin/access-token/{request_token}",tags=["Garmin"])
async def get_access_token(request_token: str):
    
    db = mongo_client["garmin"]

    query_result = db['token'].find({'request_token':request_token},{'_id':False}) 
    result = list(query_result)
    try:
        result = result[0]
    except:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail= 'request token is not valid',
            headers={"WWW-Authenticate": "Bearer"},
        ) 

    if result['valid'] == False:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail= 'request token is not valid',
            headers={"WWW-Authenticate": "Bearer"},
        )

    if int(time())-result['request_timestamp'] >= 600:
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail= 'access token is already expired',
            headers={"WWW-Authenticate": "Bearer"},
        )

    return {
        'consumer_secret': result["consumer_secret"],
        'user_access_token': result["access_token"],
        'user_access_token_secret': result["access_token_secret"],
    }

@app.get("/garmin/active-request-tokens",tags=["Garmin"])
async def get_active_request_tokens():

    try:
        db = mongo_client["garmin"]

        query_result = db['token'].find({'valid':True},{'_id':False})
        results = list(query_result)

        active_list = []

        for result in results:
            if int(time())-result['request_timestamp'] < 600:
                active_list.append(result['request_token'])

        return {
            'active_request_tokens': active_list
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail= str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/garmin/request-data",tags=["Garmin"])
async def request_data(request_data: RequestData):

    try:
        
        garmin = OAuth1Service()

        normalized_parameters = f"oauth_consumer_key={garmin.oauth_consumer_key}&oauth_nonce={garmin.oauth_nonce}&oauth_signature_method={garmin.oauth_signature_method}&oauth_timestamp={garmin.oauth_timestamp}&oauth_token={request_data.user_access_token}&oauth_version={garmin.oauth_version}&uploadEndTimeInSeconds={request_data.uploadEndTimeInSeconds}&uploadStartTimeInSeconds={request_data.uploadStartTimeInSeconds}" 

        percent_encoded_normalized_parameters = b'GET&'+garmin._escape(request_data.api_endpoint_url)+b'&'+garmin._escape(normalized_parameters)

        key = garmin._escape(request_data.consumer_secret) + b'&' + garmin._escape(request_data.user_access_token_secret)
        hashed = hmac.new(key, percent_encoded_normalized_parameters, sha1)
        signature = base64.b64encode(hashed.digest()).decode()

        # Authorization: OAuth oauth_nonce="5808561545", oauth_signature="A5fx2KmZE%2BQcu2lxrhqZo08yLjQ%3D", oauth_token="a9cea8ee-3b7a-4c74-ba29-b59b0c3d12f3", oauth_consumer_key="7b3725fa-c7e1-4f6f-a6e4-164466c0201a", oauth_timestamp="1659264585", oauth_signature_method="HMAC-SHA1", oauth_version="1.0"

        headers = {
            'Authorization': f'OAuth oauth_nonce={garmin.oauth_nonce}, oauth_signature={garmin._escape(signature).decode()}, oauth_token={request_data.user_access_token}, oauth_consumer_key={garmin.oauth_consumer_key}, oauth_timestamp={garmin.oauth_timestamp}, oauth_signature_method={garmin.oauth_signature_method}, oauth_version={garmin.oauth_version}'
        }

        # headers_quote = {
        #     'Authorization': f'OAuth oauth_nonce="{garmin.oauth_nonce}", oauth_signature="{garmin._escape(signature).decode()}", oauth_token="{request_data.user_access_token}", oauth_consumer_key="{garmin.oauth_consumer_key}", oauth_timestamp="{garmin.oauth_timestamp}", oauth_signature_method="{garmin.oauth_signature_method}", oauth_version="{garmin.oauth_version}"'
        # }

        url = request_data.api_endpoint_url+f'?uploadStartTimeInSeconds={request_data.uploadStartTimeInSeconds}&uploadEndTimeInSeconds={request_data.uploadEndTimeInSeconds}'

        r = requests.get(url, headers=headers)
        dir(r)
        return {
            "status": r.status_code,
            "url": url,
            "headers": headers,
            "response": r.text
        }


    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail= str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
