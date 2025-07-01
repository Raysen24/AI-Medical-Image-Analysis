import os
import itertools
import numpy as np
from fastapi import FastAPI
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from tensorflow.keras.models import load_model
from fastapi import FastAPI, File, UploadFile, HTTPException, Response, status
from fastapi.responses import FileResponse
import os
import shutil
import aiofiles

app = FastAPI()

# Hardcoded model paths and patient path
MODEL_PATHS = [
    'mobilenet_combination_model_fold_all_data_3.h5',
    'mobilenet_combination_model_fold_4bp_2.h5',
    'mobilenet_combination_model_fold_all_exc_4_1.h5'
]
PATIENT_PATH = '../datasets/test_patient'

def preprocess_image(img_path):
    img = load_img(img_path, color_mode='grayscale', target_size=(224, 224))
    img_array = img_to_array(img)
    pseudo_rgb_img = np.repeat(img_array, 3, axis=2)
    return preprocess_input(pseudo_rgb_img)

def create_image_pairs(folder_path):
    images = []
    for filename in os.listdir(folder_path):
        img_path = os.path.join(folder_path, filename)
        if os.path.isfile(img_path) and img_path.lower().endswith(('.png', '.jpg', '.jpeg')):
            processed_img = preprocess_image(img_path)
            images.append(processed_img)
    return list(itertools.combinations(images, 2)) if len(images) > 1 else [(images[0], images[0])]

def patient_predict(patient_path, model_paths):
    # Load models
    general_model = load_model(model_paths[0])
    specialized_model = load_model(model_paths[1])
    not_specialized_model = load_model(model_paths[2])

    image_pairs = create_image_pairs(patient_path)
    patient_results = []

    # Fixed weights
    weights = (0.4, 0.4, 0.2)

    for img1, img2 in image_pairs:
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

    return "Abnormal" if np.max(patient_results) else "Normal"

@app.get("/BINARY/predict")
async def predict():
    predicted_label = patient_predict(PATIENT_PATH, MODEL_PATHS)
    return {"Predicted Label": predicted_label}

    
    
    
@app.post("/BINARY/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_location = os.path.join(PATIENT_PATH, file.filename)
        async with aiofiles.open(file_location, 'wb') as out_file:
            content = await file.read()  # read file content
            await out_file.write(content)  # write to file
        return {"info": f"file '{file.filename}' saved at '{file_location}'"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/BINARY/delete/{filename}")
async def delete_file(filename: str):
    file_location = os.path.join(PATIENT_PATH, filename)
    if os.path.exists(file_location):
        os.remove(file_location)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    else:
        raise HTTPException(status_code=404, detail="File not found")

@app.get("/BINARY/files/")
async def list_files():
    try:
        files = os.listdir(PATIENT_PATH)
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/BINARY/files/{filename}")
async def view_file(filename: str):
    file_path = os.path.join(PATIENT_PATH, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        raise HTTPException(status_code=404, detail="File not found")