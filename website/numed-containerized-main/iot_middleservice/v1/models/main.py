from pydantic import BaseModel
from typing import List

class RequestData(BaseModel):
    consumer_secret: str
    user_access_token: str
    user_access_token_secret: str
    api_endpoint_url: str
    uploadStartTimeInSeconds: int
    uploadEndTimeInSeconds: int

class MeasurementData(BaseModel):
    type_measurement: str
    measurement_id: str
    data: List[float]
    time: List[float]
    unit: str

class BulkDownload(BaseModel):
    oxy_measurement_id: str
    breath_measurement_id: str
    # blood_measurement_id: str
    temperature_measurement_id: str
    # heart_measurement_id: str

bulk_download_examples = {
    "example": {
        "summary": "example",
        "value": {
            "oxy_measurement_id": "7ea0d18e5e9768a50b9e84c7b29dd7716ba4b2a509acb14d3b60c5eb8482e0f5",
            "breath_measurement_id": "c685bf483bafd2a1f8da6948ed5fe136e9a32aae2fb2b04c1fc283d765932c28",
            # "blood_measurement_id": "a54c99029e36d4fbf139db7e2be24de650ab98612eafbf81d8bee5e8b6024da6",
            "temperature_measurement_id": "9cf763651a28a04cdeeeea41b6e10782d0f2cdc2f25734ce6e7c9f27a221b0cc",
            # "heart_measurement_id": "aa026f977ae77ce17136c2ed848350d5e7948e4448d70857770a6ba1eee3bfbe",
        }
    },
}


upload_data_examples = {
    "example": {
        "summary": "example",
        "value": {
            "type_measurement": "str",
            "measurement_id": "str",
            "data": ["float"],
            "time": ["float"],
            "unit": "str",
        }
    },
}

upload_data_responses = {
    200: {
        "description": "Success",
        "content": {
            "application/json": {
                "examples": {
                    "example": {
                        "summary": "example",
                        "value": {
                            "status": True, 
                            }
                    },
                }
            }
        }
    },
}