from fastapi import FastAPI
import dill
import pandas as pd
import numpy as np
import cv2
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
from tensorflow.keras.applications.xception import preprocess_input as preprocess_xception
from tensorflow.keras.applications.densenet import preprocess_input as preprocess_densenet
from tensorflow.keras.applications.inception_v3 import preprocess_input as preprocess_inception
from tensorflow.keras.applications.vgg16 import preprocess_input as preprocess_vgg
from tensorflow.keras.applications.resnet50 import preprocess_input as preprocess_resnet
from sklearn.preprocessing import LabelEncoder
from collections import defaultdict
import pickle
import os
from fastapi import FastAPI, File, UploadFile, HTTPException, Response, status
from fastapi.responses import FileResponse
import os
import shutil
import aiofiles


app = FastAPI()

model_paths = [
        'densenet_multiclass_new_2.h5', 'xception_multiclass_new_1.h5', 
        'inception_multiclass_new_4.h5', 'vgg_multiclass_new_1.h5', 
        'resnet_multiclass_new_1.h5'
    ]
patient_path = '../datasets/test_patient'
template_paths = [
        '../datasets/ocr_mask/mask_L.jpg', '../datasets/ocr_mask/mask_L_2.jpg', 
        '../datasets/ocr_mask/mask_L_3.jpg', '../datasets/ocr_mask/mask_L_4.jpg', 
        '../datasets/ocr_mask/mask_L_white.jpg', '../datasets/ocr_mask/mask_R.jpg', 
        '../datasets/ocr_mask/mask_R_2.jpg', '../datasets/ocr_mask/mask_R_3.jpg', 
        '../datasets/ocr_mask/mask_R_4.jpg', '../datasets/ocr_mask/mask_R_5.jpg', 
        '../datasets/ocr_mask/mask_R_6.jpg', '../datasets/ocr_mask/mask_R_7.jpg', 
        '../datasets/ocr_mask/mask_R_white.jpg'
    ]
    
def body_part_detect(folder_path, model_paths, meta_model_file, template_paths, df_test):
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
    def preprocess_image(img_path, model_name):
        img = load_img(img_path, color_mode='grayscale', target_size=(224, 224))
        img_array = img_to_array(img)
        pseudo_rgb_img = np.repeat(img_array, 3, axis=2)
    
        if model_name == 'xception':
            processed_img = preprocess_xception(pseudo_rgb_img)
        elif model_name == 'densenet':
            processed_img = preprocess_densenet(pseudo_rgb_img)
        elif model_name == 'inception':
            processed_img = preprocess_inception(pseudo_rgb_img)
        elif model_name == 'vgg':
            processed_img = preprocess_vgg(pseudo_rgb_img)
        elif model_name == 'resnet':
            processed_img = preprocess_resnet(pseudo_rgb_img)
            
        return processed_img
 
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
    
    for filename in os.listdir(folder_path):
        img_path = os.path.join(folder_path, filename)
        if os.path.isfile(img_path) and img_path.lower().endswith(('.png', '.jpg', '.jpeg')):
            model_predictions = []
            model_names = ['xception', 'densenet', 'inception', 'vgg', 'resnet']
            models = [xception_model, densenet_model, inception_model, vgg_model, resnet_model]
            
            for idx, m in enumerate(model_names):
                img = preprocess_image(img_path, m)
                img = np.expand_dims(img, axis=0)
                model_predictions.append(generate_predictions(models[idx], img))
            
            aggregated_preds = np.hstack(model_predictions)
            
            predicted_multiclass_label = meta_model.predict(aggregated_preds)
            confidence_score = np.max(meta_model.predict_proba(aggregated_preds))
    
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

        for filename in os.listdir(folder_path):
            img_path = os.path.join(folder_path, filename)
            if os.path.isfile(img_path) and img_path.lower().endswith(('.png', '.jpg', '.jpeg')):
                image = cv2.imread(img_path)
                image_gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY).astype(np.uint8)
                idx_pos = detect_position(image_gray, template_images)
                
                if any(i in idx_pos for i in range(5)) and any(i in idx_pos for i in range(5, 13)):
                    position_list.append('right')
                    position_list.append('left')
                elif any(i in idx_pos for i in range(5)):
                    position_list.append('left')
                elif any(i in idx_pos for i in range(5, 13)):
                    position_list.append('right')
                
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

    return combined_result

@app.post("/predict")
def predict():
    meta_model_file = 'meta_model.pkl'
    df_test = './df_test_multiclass_1.csv'

    final_prediction = body_part_detect(patient_path, model_paths, meta_model_file, template_paths, df_test)
    return {"final_prediction": final_prediction}



    
@app.post("/MULTICLASS/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_location = os.path.join(patient_path, file.filename)
        async with aiofiles.open(file_location, 'wb') as out_file:
            content = await file.read()  # read file content
            await out_file.write(content)  # write to file
        return {"info": f"file '{file.filename}' saved at '{file_location}'"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/MULTICLASS/delete/{filename}")
async def delete_file(filename: str):
    file_location = os.path.join(patient_path, filename)
    if os.path.exists(file_location):
        os.remove(file_location)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    else:
        raise HTTPException(status_code=404, detail="File not found")

@app.get("/MULTICLASS/files/")
async def list_files():
    try:
        files = os.listdir(patient_path)
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/MULTICLASS/files/{filename}")
async def view_file(filename: str):
    file_path = os.path.join(patient_path, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        raise HTTPException(status_code=404, detail="File not found")