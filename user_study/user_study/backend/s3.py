import datetime
import re
from PIL import Image, UnidentifiedImageError
import boto3
import crud
import zipfile
from botocore.exceptions import ClientError
from fastapi import APIRouter, FastAPI, HTTPException, Depends, UploadFile, Response, status, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from auth import get_current_user
import tempfile
import io
from sqlalchemy import Column, Integer, Float, LargeBinary, String
from sqlalchemy.orm import Session
from database import SessionLocal, Base, engine
from models import Binary, Multiclass, DoctorImage
from settings import *

MAX_IMAGE_UPLOAD = 5
image_file = ('png, jpeg, jpg')

app = FastAPI()

router = APIRouter(
    prefix="/s3",
    dependencies=[Depends(get_current_user)],
    tags=["s3"]
)

# Pydantic models
class DoctorImage(BaseModel):
    patient_id: int
    image: str  # If you are sending image data as binary

class PredictionRequest(BaseModel):
    patient_path: str
    model_paths: List[str]
    results_path: str

class PatientImageRequest(BaseModel):
    patient_id: int
    image: bytes

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_s3_client():
    s3 = boto3.client(
        's3',
        aws_access_key_id = AWS_ACCESS_KEY_ID,
        aws_secret_access_key = AWS_SECRET_ACCESS_KEY
    )

    return s3

@router.post("/doctor_image/upload/{patient_id}")
async def upload_file(patient_id: int, upload_file: UploadFile = File(...), db: Session = Depends(get_db), s3 = Depends(get_s3_client)):
    object_list = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=f'{patient_id}/', Delimiter='/')
    uploaded_file = object_list['KeyCount']
    if(uploaded_file >= MAX_IMAGE_UPLOAD):
        raise HTTPException(status_code=400, detail='Image capacity has reached.')
    
    mex = [False] * MAX_IMAGE_UPLOAD

    object_dict = object_list.get('Contents')
    
    if object_dict: 
        for object in object_dict:
            mex[int(re.findall(r'[0-9]+', object['Key'])[-1])] = True

    files = list()
    tempfile.TemporaryFile()

    temp = tempfile.TemporaryFile()
    try:
        temp.write(upload_file.file.read())
        temp.seek(0)

        is_zipfile = zipfile.is_zipfile(temp)

        if is_zipfile:
            #Zip file upload aborted if there is/are image(s) uploaded 
            if uploaded_file:
                raise HTTPException(status_code=400, detail='ZIP upload is unavailable.')

            with zipfile.ZipFile(temp) as zf:
                filenames = zf.namelist()
                for file in filenames:

                    archive = zf.read(file)
                    archive_byte = io.BytesIO(archive)
                    files.append((archive_byte, file.rsplit('.', 1)[1]))
        else:
            temp.seek(0)
            files.append((io.BytesIO(temp.read()), upload_file.filename.rsplit('.', 1)[1]))
    finally:
            temp.close()

    mexp = 0
    
    for file in files:
        while mex[mexp] == True: mexp += 1
        try:
            db = crud.create_doctorimage(db=db, doctor_image=DoctorImage(patient_id=patient_id, image=f'{patient_id}/{mexp}.{file[1]}'))
            with Image.open(file[0]) as img:
                img.verify()
        
            file[0].seek(0)
            db.commit()
            response = s3.upload_fileobj(Fileobj=file[0], Bucket=BUCKET_NAME, Key=f'{patient_id}/{mexp}.{file[1]}')
            mexp += 1

        except ClientError as e:
            raise e
        
        except UnidentifiedImageError as e:
            raise HTTPException(status_code=400, detail='Uploaded file(s) is/are corrupted or not valid image file(s)')
        
    return JSONResponse(content={'message': 'Image(s) successfully uploaded.'}, status_code=201)

@router.delete("/delete-image/{image_id}")
async def delete_image(image_id: int, db: Session = Depends(get_db), s3 = Depends(get_s3_client)):
    key = crud.get_doctorimage_path(db=db, id=image_id)    
    db_doctorimage = crud.delete_doctorimage(db=db, id=image_id)
    db.commit()
    s3.delete_object(Bucket=BUCKET_NAME, Key=key)
    return JSONResponse(content={'message': 'Operation successful.'}, status_code=200)


# @router.post("/upload-image")
# async def upload_image():
#     s3 = boto3.client(
#         's3',
#         aws_access_key_id = AWS_ACCESS_KEY_ID,
#         aws_secret_access_key = AWS_SECRET_ACCESS_KEY
#     )
#     print(s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix='3/', Delimiter='/')['Contents'])

@router.get("/fetch_images/{patient_id}")
async def fetch_images(patient_id: int, s3=Depends(get_s3_client), db: Session = Depends(get_db)):
    try:
        object_list = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=f'{patient_id}/', Delimiter='/')
        
        if 'Contents' not in object_list:
            return JSONResponse(content={'message': 'No images found for this patient.'}, status_code=404)

        db_images = crud.get_doctorimage_from_patient(db=db, id=patient_id)

        image_data = []
        for obj in object_list['Contents']:
            presigned_url = s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': BUCKET_NAME, 'Key': obj['Key']},
                ExpiresIn=3600  # URL expires in 1 hour
            )

            image_name = obj['Key'].split('/')[-1]

            matching_db_image = next((img for img in db_images if img.image == obj['Key']), None)
            image_id = matching_db_image.doctor_image_id if matching_db_image else None

            image_data.append({
                'url': presigned_url,
                'key': obj['Key'],
                'name': image_name,
                'id': image_id
            })

        return JSONResponse(content={'images': image_data}, status_code=200)

    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch images: {e}")

@router.get("/files") 
async def get_all_files(s3=Depends(get_s3_client)):
    try:
        object_list = s3.list_objects_v2(Bucket=BUCKET_NAME, Delimiter='/')
        if 'CommonPrefixes' not in object_list:
            return {"message": "No patient folders found."}

        all_files = {}
        for prefix in object_list['CommonPrefixes']:
            patient_id_folder = prefix['Prefix']
            files = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=patient_id_folder)
            
            if 'Contents' in files:
                file_list = [file['Key'] for file in files['Contents']]
                all_files[patient_id_folder] = file_list
            else:
                all_files[patient_id_folder] = []

        return {"files": all_files}
    except ClientError as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch images: {e}")

# @router.post("/upload-image")
# async def upload_image(request: PatientImageRequest, db: Session = Depends(get_db)):
#     try:
#         # Process the uploaded image
#         image_entry = DoctorImage(
#             patient_id=request.patient_id,
#             image=request.image
#         )
#         db.add(image_entry)
#         db.commit()
#         return {"message": "Image uploaded successfully"}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# Register the router
# app.include_router(router)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)