from typing import Optional

from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel

from fastapi.openapi.docs import (
    get_redoc_html,
    get_swagger_ui_html,
)
from fastapi.staticfiles import StaticFiles

import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np

def covid_detect(model,X):
    model2 = tf.keras.models.load_model(model,custom_objects={'LeakyReLU': tf.keras.layers.LeakyReLU})
    probapredict=model2.predict(X)
    classpredict=(probapredict > 0.5).astype('int32')
    return probapredict,classpredict

class Data(BaseModel):
    data: dict
    
    class Config:
        schema_extra = {
                "example": {
                            "data": {
                                "BASOFIL_RESULT_VALUE":0.5,
                                "CL_RESULT_VALUE":0.5,
                                "CREAT_RESULT_VALUE":0.5,
                                "EOS_RESULT_VALUE":0.5,
                                "ERI_RESULT_VALUE":0.5,
                                "GDSFULL_RESULT_VALUE":0.5,
                                "HB_RESULT_VALUE":0.5,
                                "HCT_RESULT_VALUE":0.5,
                                "K_RESULT_VALUE":0.5,
                                "LEKO_RESULT_VALUE":0.5,
                                "LIMFOSIT_RESULT_VALUE":0.5,
                                "MCH_RESULT_VALUE":0.5,
                                "MCHC_RESULT_VALUE":0.5,
                                "MCV_RESULT_VALUE":0.5,
                                "MONOSIT_RESULT_VALUE":0.5,
                                "NA_RESULT_VALUE":0.5,
                                "NEUTB_RESULT_VALUE":0.5,
                                "NLR1_RESULT_VALUE":0.5,
                                "PLT_RESULT_VALUE":0.5,
                                "RDW_RESULT_VALUE":0.5,
                                "SEGMEN_RESULT_VALUE":0.5,
                                "SGOT_RESULT_VALUE":0.5,
                                "SGPT_RESULT_VALUE":0.5,
                                "UREUM_RESULT_VALUE":0.5,
                                "LED_RESULT_VALUE":0.5,
                                "BILDIREK_RESULT_VALUE":0.5,
                                "BILINDIR_RESULT_VALUE":0.5,
                                "BILTOT_RESULT_VALUE":0.5,
                                "HCO3_N_RESULT_VALUE":0.5,
                                "O2S_N_RESULT_VALUE":0.5,
                                "PCO2_N_RESULT_VALUE":0.5,
                                "PH_NU_RESULT_VALUE":0.5,
                                "PO2_N_RESULT_VALUE":0.5,
                                "TCO2_N_RESULT_VALUE":0.5,
                                "PTINR_RESULT_VALUE":0.5,
                                "BJURIN_RESULT_VALUE":0.5,
                                "PHURIN_RESULT_VALUE":0.5,
                                "CHOLES_RESULT_VALUE":0.5,
                                "GDPFULL_RESULT_VALUE":0.5,
                                "GDPPFULL_RESULT_VALUE":0.5,
                                "HDLCHO_RESULT_VALUE":0.5,
                                "LDLCHO_RESULT_VALUE":0.5,
                                "TRIGL_RESULT_VALUE":0.5,
                                "UA_RESULT_VALUE":0.5,
                                "TSHSNEW_RESULT_VALUE":0.5,
                                "ALBCP_RESULT_VALUE":0.5,
                                "TP_RESULT_VALUE":0.5,
                                "T4 TOTAL_RESULT_VALUE":0.5,
                                "CALTOT_RESULT_VALUE":0.5,
                                "MG_RESULT_VALUE":0.5,
                                "GLURAPID_RESULT_VALUE":0.5,
                                "HDLD_RESULT_VALUE":0.5,
                                "ALP_RESULT_VALUE":0.5,
                                "GGT_RESULT_VALUE":0.5,
                                "GLOB_RESULT_VALUE":0.5,
                                "LDH_RESULT_VALUE":0.5,
                                "FT4_RESULT_VALUE":0.5,
                                "LAKT_DR_RESULT_VALUE":0.5,
                                "ACP001_RESULT_VALUE":0.5,
                                "ACP002_RESULT_VALUE":0.5,
                                "ACP009_RESULT_VALUE":0.5,
                                "CGLU_RESULT_VALUE":0.5,
                                "CLDH_RESULT_VALUE":0.5,
                                "CPROT_RESULT_VALUE":0.5,
                                "SGLU_RESULT_VALUE":0.5,
                                "SLDH_RESULT_VALUE":0.5,
                                "SPROT_RESULT_VALUE":0.5,
                                "ACA001_RESULT_VALUE":0.5,
                                "ACA002_RESULT_VALUE":0.5,
                                "ACA009_RESULT_VALUE":0.5,
                                "CGLUA_RESULT_VALUE":0.5,
                                "CLDHA_RESULT_VALUE":0.5,
                                "CPROTA_RESULT_VALUE":0.5,
                                "SGLUA_RESULT_VALUE":0.5,
                                "SLDHA_RESULT_VALUE":0.5,
                                "SPROTA_RESULT_VALUE":0.5,
                                "TGL_LAHIR":70
                            }
                    }
                }

app = FastAPI(
        title="NuMed",
        description="NuMed-blood: Documentation",
        version="0.2.0",
        docs_url=None,
        redoc_url=None,
        root_path="/api/v1/blood-app"
        )


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/static", StaticFiles(directory="/app/app/static"), name="static")

@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url="/api/v1/blood-app/openapi.json",
        title=app.title,
        swagger_favicon_url="/static/logo.png",
    )

@app.get("/redoc", include_in_schema=False)
async def redoc_html():
    return get_redoc_html(
        openapi_url="/api/v1/blood-app/openapi.json",
        title=app.title + " - ReDoc",
        redoc_favicon_url="/static/logo.png",
    )

@app.get("/", include_in_schema=False)
async def root():
    response = RedirectResponse(url='/api/v1/blood-app/docs')
    return response


# @app.get("/items/{item_id}")
# def read_item(item_id: int, q: Optional[str] = None):
#     return {"item_id": item_id, "q": q}

@app.post("/data")
async def insert_data(data: Data):  
    try:

        # if (data.data['HCT'] > 100 or data.data['HCT'] < 0):
        #     raise Exception('HCT error')

        # if (data.data['EO'] > 100 or data.data['EO'] < 0):
        #     raise Exception('EO error')

        for key, value in data.data.items():
            if value < 0:
                raise Exception(f'{key} error')

        df = pd.DataFrame(data=data.data,index=[0])
        a = covid_detect('/app/app/Pasar_Minggu.h5',df)
        probapredict=np.asarray(a)[0][0][0]
        classpredict=np.asarray(a)[1][0][0]

        # if(probapredict<0.5):
        #     probapredict = 1-probapredict
        #     classpredict = (classpredict+1)%2

        return {"status":"success","probapredict":probapredict,'classpredict':classpredict}
    except Exception as e:
        return {"status":"error", "probapredict":0,'classpredict':0,"err_message": str(e)}
