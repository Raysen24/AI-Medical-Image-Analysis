import os
import shutil
import pickle
from datetime import datetime
import aiofiles
from fastapi import FastAPI, APIRouter, File, UploadFile, HTTPException, Response, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import numpy as np
from collections import defaultdict
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.xception import preprocess_input as preprocess_xception
from tensorflow.keras.applications.densenet import preprocess_input as preprocess_densenet
from tensorflow.keras.applications.inception_v3 import preprocess_input as preprocess_inception
from tensorflow.keras.applications.vgg16 import preprocess_input as preprocess_vgg
from tensorflow.keras.applications.resnet50 import preprocess_input as preprocess_resnet
import itertools
import cv2
from pathlib import Path
from fastapi import FastAPI, HTTPException, Form
from fastapi.responses import JSONResponse
import pandas as pd
from sklearn.preprocessing import LabelEncoder
import boto3
import crud
import datetime
import re
import schemas
from PIL import Image, UnidentifiedImageError
import boto3
import crud
import zipfile
from botocore.exceptions import ClientError
from fastapi import APIRouter, FastAPI, HTTPException, Depends, UploadFile, Response, status, File
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
import tempfile
import io
from sqlalchemy import Column, Integer, Float, LargeBinary, String
from sqlalchemy.orm import Session
from database import SessionLocal, Base, engine
from models import Binary, Multiclass, DoctorImage, Patient
from settings import *
from datetime import datetime
from auth import get_current_user
import models

PAGE_SIZE = 5

app = FastAPI()

router = APIRouter(
    prefix="/predict",
    tags=["predict"]
)

class BinaryCommentSesuai(BaseModel):
    comment: str
    sesuaiTidak: str

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

# Directories for models and data
BINARY_MODEL_PATHS = [
    'Binary/test_codes/mobilenet_combination_model_fold_all_data_3.h5',
    'Binary/test_codes/mobilenet_combination_model_fold_4bp_2.h5',
    'Binary/test_codes/mobilenet_combination_model_fold_all_exc_4_1.h5'
]

MULTICLASS_MODEL_PATHS = [
    'Multiclass/test_codes/densenet_multiclass_new_2.h5', 
    'Multiclass/test_codes/xception_multiclass_new_1.h5', 
    'Multiclass/test_codes/inception_multiclass_new_4.h5', 
    'Multiclass/test_codes/vgg_multiclass_new_1.h5', 
    'Multiclass/test_codes/resnet_multiclass_new_1.h5'
]
TEMPLATE_PATHS = [
    'Multiclass/datasets/ocr_mask/mask_L.jpg', 'Multiclass/datasets/ocr_mask/mask_L_2.jpg', 
    'Multiclass/datasets/ocr_mask/mask_L_3.jpg', 'Multiclass/datasets/ocr_mask/mask_L_4.jpg', 
    'Multiclass/datasets/ocr_mask/mask_L_white.jpg', 'Multiclass/datasets/ocr_mask/mask_R.jpg', 
    'Multiclass/datasets/ocr_mask/mask_R_2.jpg', 'Multiclass/datasets/ocr_mask/mask_R_3.jpg', 
    'Multiclass/datasets/ocr_mask/mask_R_4.jpg', 'Multiclass/datasets/ocr_mask/mask_R_5.jpg', 
    'Multiclass/datasets/ocr_mask/mask_R_6.jpg', 'Multiclass/datasets/ocr_mask/mask_R_7.jpg', 
    'Multiclass/datasets/ocr_mask/mask_R_white.jpg'
]
META_MODEL_FILE = 'Multiclass/test_codes/meta_model.pkl'
DF_TEST_FILE = 'Multiclass/test_codes/df_test_multiclass_1.csv'

# Fetch images from S3 and process them
def fetch_s3_images(patient_id: int, s3):
    object_list = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=f'{patient_id}/', Delimiter='/')
    
    if 'Contents' not in object_list:
        raise HTTPException(status_code=404, detail="No images found for this patient.")
    
    image_urls = [obj['Key'] for obj in object_list['Contents'] if obj['Key'].lower().endswith(('.png', '.jpg', '.jpeg'))]
    return image_urls

# Preprocess image (updated to take image from S3)
def preprocess_image_s3(image_key, s3, model_name):
    # Fetch image data from S3
    s3_response = s3.get_object(Bucket=BUCKET_NAME, Key=image_key)
    image_data = s3_response['Body'].read()
    
    img = load_img(io.BytesIO(image_data), color_mode='grayscale', target_size=(224, 224))
    img_array = img_to_array(img)
    pseudo_rgb_img = np.repeat(img_array, 3, axis=2)

    if model_name == 'xception':
        return preprocess_xception(pseudo_rgb_img)
    elif model_name == 'densenet':
        return preprocess_densenet(pseudo_rgb_img)
    elif model_name == 'inception':
        return preprocess_inception(pseudo_rgb_img)
    elif model_name == 'vgg':
        return preprocess_vgg(pseudo_rgb_img)
    elif model_name == 'resnet':
        return preprocess_resnet(pseudo_rgb_img)
    else:
        raise ValueError(f"Unsupported model name: {model_name}")

# Create image pairs from S3
def create_image_pairs_s3(patient_id, s3, model_name):
    image_keys = fetch_s3_images(patient_id, s3)
    images = []
    
    for image_key in image_keys:
        processed_img = preprocess_image_s3(image_key, s3, model_name)
        images.append((image_key, processed_img))
    
    return list(itertools.combinations(images, 2)) if len(images) > 1 else [(images[0], images[0])]

# Save results to the database
def save_binary_results_to_db(patient_id, result, average_confidence, db: Session):
    binary_data = {
        "result": result,
        "confidence_rate": round(average_confidence, 2)
    }
    db_binary = crud.create_binary(db=db, binary=binary_data)
  
    binary_id = db_binary.binary_id

    update_data = schemas.PatientUpdate(binary_id=binary_id, updated_datetime=datetime.utcnow())
    crud.update_patient(db=db, id=patient_id, update=update_data)
    db.commit()

    return binary_id


# Patient prediction updated to fetch images from S3
def patient_predict_s3(patient_id, s3, model_paths, db: Session):
    general_model = load_model(model_paths[0])
    specialized_model = load_model(model_paths[1])
    not_specialized_model = load_model(model_paths[2])

    image_pairs = create_image_pairs_s3(patient_id, s3, 'densenet')
    patient_results = []

    # Fixed weights
    weights = (0.4, 0.4, 0.2)

    for (image_key1, img1), (image_key2, img2) in image_pairs:
        img1 = np.expand_dims(img1, axis=0)
        img2 = np.expand_dims(img2, axis=0)
        combined_img = [img1, img2]

        general_pred = general_model.predict(combined_img)
        specialized_pred = specialized_model.predict(combined_img)
        not_specialized_pred = not_specialized_model.predict(combined_img)

        vote_sum = (general_pred * weights[0] +
                    specialized_pred * weights[1] +
                    not_specialized_pred * weights[2])
        weighted_vote = vote_sum >= sum(weights) / 2
        patient_results.append(int(weighted_vote))

    average_confidence = round(np.mean(patient_results) * 100, 2)
    result = "Abnormal" if np.max(patient_results) else "Normal"

    # Save result to database
    binary_id = save_binary_results_to_db(patient_id, result, average_confidence, db)
    
    return result, average_confidence, binary_id

@router.get("/BINARY/predict")
async def predict(patient_id: int, db: Session = Depends(get_db), s3=Depends(get_s3_client)):
    predicted_label, confidence, binary_id = patient_predict_s3(patient_id, s3, BINARY_MODEL_PATHS, db)
    return JSONResponse(content={"Predicted Label": predicted_label, "Confidence": confidence, "Binary ID": binary_id}, status_code=200)

@router.post("/BINARY/comment-rating")
async def create_comment_rating(binary_id: int, update: schemas.BinaryUpdate, db: Session = Depends(get_db)):
    crud.update_binary(db=db, id=binary_id, update=update)
    db.commit()
    return JSONResponse(content={'message': 'Operation successful.'}, status_code=200) 

def save_multiclass_result_to_db(patient_id, predicted_label, confidence_rate, db: Session):
    multiclass_data = {
        "result": predicted_label,
        "confidence_rate": round(confidence_rate, 2)
    }
    db_multiclass = crud.create_multiclass(db=db, multiclass=multiclass_data)
  
    multiclass_id = db_multiclass.multiclass_id

    update_data = schemas.PatientUpdate(multiclass_id=multiclass_id, updated_datetime=datetime.utcnow())
    crud.update_patient(db=db, id=patient_id, update=update_data)
    db.commit()

    return multiclass_id

def body_part_detect(patient_id, s3, model_paths, meta_model_file, template_paths, df_test, db:Session):
    # Load models
    densenet_model = load_model(model_paths[0])
    xception_model = load_model(model_paths[1])
    inception_model = load_model(model_paths[2])
    vgg_model = load_model(model_paths[3])
    resnet_model = load_model(model_paths[4])

    with open(meta_model_file, 'rb') as file:
        meta_model = pickle.load(file)
    
    template_images = [cv2.imread(path) for path in template_paths]

    # Helper functions
    def preprocess_image_s3(image_key, s3, model_name):
        # Fetch image data from S3
        s3_response = s3.get_object(Bucket=BUCKET_NAME, Key=image_key)
        image_data = s3_response['Body'].read()
        
        img = load_img(io.BytesIO(image_data), color_mode='grayscale', target_size=(224, 224))
        img_array = img_to_array(img)
        pseudo_rgb_img = np.repeat(img_array, 3, axis=2)

        if model_name == 'xception':
            return preprocess_xception(pseudo_rgb_img)
        elif model_name == 'densenet':
            return preprocess_densenet(pseudo_rgb_img)
        elif model_name == 'inception':
            return preprocess_inception(pseudo_rgb_img)
        elif model_name == 'vgg':
            return preprocess_vgg(pseudo_rgb_img)
        elif model_name == 'resnet':
            return preprocess_resnet(pseudo_rgb_img)
        else:
            raise ValueError(f"Unsupported model name: {model_name}")

    def generate_predictions(model, dataset):
        predictions = model.predict(dataset)
        return predictions.reshape(predictions.shape[0], -1)

    def detect_position(image, template_images):
        idx_pos = []
        for idx, template in enumerate(template_images):
            template_gray = cv2.cvtColor(template, cv2.COLOR_BGR2GRAY)
            template_gray_flip = cv2.flip(template_gray, 1) 
    
            match_result = cv2.matchTemplate(image, template_gray, cv2.TM_CCOEFF_NORMED)      
            _, max_val, _, _ = cv2.minMaxLoc(match_result)
    
            match_result_flip = cv2.matchTemplate(image, template_gray_flip, cv2.TM_CCOEFF_NORMED)      
            _, max_val_flip, _, _ = cv2.minMaxLoc(match_result_flip)
    
            if max_val >= 0.85:
                idx_pos.append(idx)
            elif max_val_flip >= 0.85:
                idx_pos.append(idx)
        return idx_pos

    patient_predictions = defaultdict(list)

    image_list = fetch_s3_images(patient_id, s3)
    
    for img_path in image_list:
        # Assuming img_data is a file-like object or a URL
        # img_path = img_data['path']

        model_predictions = []
        model_names = ['xception', 'densenet', 'inception', 'vgg', 'resnet']
        models = [xception_model, densenet_model, inception_model, vgg_model, resnet_model]
        
        for idx, m in enumerate(model_names):
            img = preprocess_image_s3(img_path, s3, m)

            if img is None or img.size == 0:
                raise ValueError("Image not loaded correctly or is empty.")

            img = np.expand_dims(img, axis=0)
            model_predictions.append(generate_predictions(models[idx], img))
        
        aggregated_preds = np.hstack(model_predictions)
        
        predicted_multiclass_label = meta_model.predict(aggregated_preds)
        confidence_score = np.max(meta_model.predict_proba(aggregated_preds))

        # Store predictions and confidence scores
        patient_predictions[predicted_multiclass_label[0]].append(confidence_score)

    predicted_multiclass_label = max(patient_predictions, key=lambda x: sum(patient_predictions[x]))
    
    df_test = pd.read_csv(df_test)

    label_encoder = LabelEncoder()
    label_encoder.fit_transform(df_test['body_part'])
    predicted_body_part = label_encoder.inverse_transform([predicted_multiclass_label])[0]
    
    combined_result = predicted_body_part

    skip_body_part = ['abdomen', 'kepala', 'os_sacro_coccygeus', 'pelvis', 'thorax', 'vertebra_cervical', 'vertebra_lumbosakral', 'vertebra_thoracolumbal']

    if predicted_body_part not in skip_body_part:
        position_list = []

        for image_key in image_list:
            # Fetch the image from S3 and process
            s3_response = s3.get_object(Bucket=BUCKET_NAME, Key=image_key)
            image_data = s3_response['Body'].read()
            image = np.array(Image.open(io.BytesIO(image_data)))
            image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY).astype(np.uint8)
            
            # Detect position in the image
            idx_pos = detect_position(image_gray, template_images)
            
            # If specific templates are detected
            if any(i in idx_pos for i in range(5)) and any(i in idx_pos for i in range(5, 13)):
                position_list.append('right')
                position_list.append('left')
            elif any(i in idx_pos for i in range(5)):
                position_list.append('left')
            elif any(i in idx_pos for i in range(5, 13)):
                position_list.append('right')

        # for filename in os.listdir(folder_path):
        #     img_path = os.path.join(folder_path, filename)
        #     if os.path.isfile(img_path) and img_path.lower().endswith(('.png', '.jpg', '.jpeg')):
        #         image = cv2.imread(img_path)
        #         image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY).astype(np.uint8)
        #         idx_pos = detect_position(image_gray, template_images)
                
        #         if any(i in idx_pos for i in range(5)) and any(i in idx_pos for i in range(5, 13)):
        #             position_list.append('right')
        #             position_list.append('left')
        #         elif any(i in idx_pos for i in range(5)):
        #             position_list.append('left')
        #         elif any(i in idx_pos for i in range(5, 13)):
        #             position_list.append('right')
                
        if len(position_list) > 0:            
            if 'right' in position_list and 'left' in position_list:
                position = 'bilateral'
            elif 'right' in position_list:
                position = 'dextra'
            elif 'left' in position_list:
                position = 'sinistra'
            combined_result += ' ' + position
    else:
        combined_result += 'None'

    average_confidence = round(np.mean(patient_predictions[predicted_multiclass_label]) * 100, 2)
    
    # Instead of saving to the file system, store in the database
    multiclass_id = save_multiclass_result_to_db(patient_id, combined_result, average_confidence, db)

    return combined_result, average_confidence, multiclass_id

@router.get("/MULTICLASS/predict")
async def predict(patient_id: int, db: Session = Depends(get_db), s3=Depends(get_s3_client)):
    predicted_label, confidence, multiclass_id = body_part_detect(patient_id, s3, MULTICLASS_MODEL_PATHS, META_MODEL_FILE, TEMPLATE_PATHS, DF_TEST_FILE, db)
    return JSONResponse(content={"Predicted Label": predicted_label, "Confidence": confidence, "Multiclass ID": multiclass_id}, status_code=200)

@router.post("/MULTICLASS/comment-rating")
async def create_comment_rating(multiclass_id: int, update: schemas.MulticlassUpdate, db: Session = Depends(get_db)):
    crud.update_multiclass(db=db, id=multiclass_id, update=update)
    db.commit()
    return JSONResponse(content={'message': 'Operation successful.'}, status_code=200) 

# API to get patient data along with binary, multiclass, and images
@router.get("/patients/data/{page}", response_model=List[dict])
async def get_patient_data(page: int = 0, db: Session = Depends(get_db), s3=Depends(get_s3_client), user=Depends(get_current_user)):
    results = crud.get_patients_profile(db=db).filter(models.Patient.doctor_id == user.doctor_id).all()

    print(f"Number of results: {len(results)}")  

    patient_data_list = []
    for patient, binary, multiclass in results:
        image_keys = fetch_s3_images(patient.patient_id, s3)
        images = []
        
        for image_key in image_keys:
            s3_response = s3.get_object(Bucket=BUCKET_NAME, Key=image_key)
            image_data = s3_response['Body'].read()
            images.append(image_key)
        
        # Add the patient's data to the list
        patient_data_list.append({
            "patient_id": patient.patient_id,
            "binary_result": binary.result,
            "binary_confidence_rate": binary.confidence_rate,
            "binary_comment": binary.comment,
            "multiclass_result": multiclass.result,
            "multiclass_confidence_rate": multiclass.confidence_rate,
            "multiclass_comment": multiclass.comment,
            "updated_datetime": patient.updated_datetime.isoformat() if patient.updated_datetime else None,
            "images": images
        })
    
    # if page: patient_data_list = patient_data_list[(page-1)*PAGE_SIZE : page*PAGE_SIZE]
    return JSONResponse(content=patient_data_list, status_code=200)

@router.get("/patient/data/{patient_id}", response_model=List[dict])
async def get_patient_data(patient_id: int, db: Session = Depends(get_db), s3=Depends(get_s3_client)):
    results = crud.get_patients_profile(db=db, patient_id=patient_id).all()

    print(f"Number of results: {len(results)}")  

    
    for patient, binary, multiclass in results:
        image_keys = fetch_s3_images(patient.patient_id, s3)
        images = [] 
        
        for image_key in image_keys:
            presigned_url = s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': BUCKET_NAME, 'Key': image_key},
                ExpiresIn=3600  # URL expires in 1 hour
            )
            
            image_name = image_key.split('/')[-1]
            
            images.append({
                'url': presigned_url,
                'key': image_key,
                'name': image_name,
            })
        
        # Add the patient's data to the list
        patient_data = {
            "patient_id": patient.patient_id,
            "binary_result": binary.result,
            "binary_confidence_rate": binary.confidence_rate,
            "binary_comment": binary.comment,
            "multiclass_result": multiclass.result,
            "multiclass_confidence_rate": multiclass.confidence_rate,
            "multiclass_comment": multiclass.comment,
            "updated_datetime": patient.updated_datetime.isoformat() if patient.updated_datetime else None,
            "images": images
        }
    
    print(patient_data)  
    return JSONResponse(content=patient_data, status_code=200)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)