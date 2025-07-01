import os
import shutil
import pickle
from datetime import datetime
import aiofiles
from fastapi import FastAPI, File, UploadFile, HTTPException, Response, status
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

app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Directories for models and data
BINARY_MODEL_PATHS = [
    'Binary/test_codes/mobilenet_combination_model_fold_all_data_3.h5',
    'Binary/test_codes/mobilenet_combination_model_fold_4bp_2.h5',
    'Binary/test_codes/mobilenet_combination_model_fold_all_exc_4_1.h5'
]
BINARY_PATIENT_PATH = 'Binary/datasets/test_patient'
BINARY_RESULTS_PATH = 'Binary/results'

MULTICLASS_MODEL_PATHS = [
    'Multiclass/test_codes/densenet_multiclass_new_2.h5', 
    'Multiclass/test_codes/xception_multiclass_new_1.h5', 
    'Multiclass/test_codes/inception_multiclass_new_4.h5', 
    'Multiclass/test_codes/vgg_multiclass_new_1.h5', 
    'Multiclass/test_codes/resnet_multiclass_new_1.h5'
]
MULTICLASS_PATIENT_PATH = 'Multiclass/datasets/test_patient'
MULTICLASS_RESULTS_PATH = 'Multiclass/results'
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

# Update preprocess_image function to accept a model name and use the corresponding preprocessing function
def preprocess_image(img_path, model_name):
    img = load_img(img_path, color_mode='grayscale', target_size=(224, 224))
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

# Update create_image_pairs function to accept model_name
def create_image_pairs(folder_path, model_name):
    images = []
    for filename in os.listdir(folder_path):
        img_path = os.path.join(folder_path, filename)
        if os.path.isfile(img_path) and img_path.lower().endswith(('.png', '.jpg', '.jpeg')):
            processed_img = preprocess_image(img_path, model_name)
            images.append((filename, processed_img))
    return list(itertools.combinations(images, 2)) if len(images) > 1 else [(images[0], images[0])]

def save_results(result, image_paths, results_path, prediction_type):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    result_dir = os.path.join(results_path, f"{prediction_type}_result_{timestamp}")
    os.makedirs(result_dir, exist_ok=True)
    
    # Save result to a text file
    result_file = os.path.join(result_dir, "result.txt")
    with open(result_file, "w") as f:
        f.write(result)
    
    # Copy images to the result directory
    for img_path in image_paths:
        dest_path = os.path.join(result_dir, os.path.basename(img_path))
        shutil.copy2(img_path, dest_path)
    
    return result_dir

def patient_predict(patient_path, model_paths, results_path):
    # Load models
    general_model = load_model(model_paths[0])
    specialized_model = load_model(model_paths[1])
    not_specialized_model = load_model(model_paths[2])

    # Use a model name that matches the preprocessing required, for example 'densenet'
    image_pairs = create_image_pairs(patient_path, 'densenet')
    patient_results = []

    # Fixed weights
    weights = (0.4, 0.4, 0.2)

    for (filename1, img1), (filename2, img2) in image_pairs:
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

    average_confidence = np.mean(patient_results) * 100
    result = "Abnormal" if np.max(patient_results) else "Normal"
    image_paths = [os.path.join(patient_path, filename1), os.path.join(patient_path, filename2)]
    save_results(result, image_paths, results_path, "BINARY")
    return result, average_confidence

@app.get("/BINARY/predict")
async def predict():
    predicted_label, average_confidence = patient_predict(BINARY_PATIENT_PATH, BINARY_MODEL_PATHS, BINARY_RESULTS_PATH)
    return {"Predicted Label": predicted_label, "Confidence Rate": average_confidence}

@app.post("/BINARY/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_location = os.path.join(BINARY_PATIENT_PATH, file.filename)
        async with aiofiles.open(file_location, 'wb') as out_file:
            content = await file.read()  # read file content
            await out_file.write(content)  # write to file
        return {"info": f"file '{file.filename}' saved at '{file_location}'"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/BINARY/delete/{filename}")
async def delete_file(filename: str):
    file_location = os.path.join(BINARY_PATIENT_PATH, filename)
    if os.path.exists(file_location):
        os.remove(file_location)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    else:
        raise HTTPException(status_code=404, detail="File not found")

@app.get("/BINARY/files/")
async def list_files():
    try:
        files = os.listdir(BINARY_PATIENT_PATH)
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/BINARY/files/{filename}")
async def view_file(filename: str):
    file_path = os.path.join(BINARY_PATIENT_PATH, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        raise HTTPException(status_code=404, detail="File not found")

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

    average_confidence = np.mean(patient_predictions[predicted_multiclass_label]) * 100
    save_results(combined_result, [img_path], MULTICLASS_RESULTS_PATH, "MULTICLASS")
    return combined_result, average_confidence

@app.post("/MULTICLASS/predict")
def predict():
    try:
        final_prediction, average_confidence = body_part_detect(MULTICLASS_PATIENT_PATH, MULTICLASS_MODEL_PATHS, META_MODEL_FILE, TEMPLATE_PATHS, DF_TEST_FILE)
        return {"Predicted Label": final_prediction, "Confidence Rate": average_confidence}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/MULTICLASS/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_location = os.path.join(MULTICLASS_PATIENT_PATH, file.filename)
        async with aiofiles.open(file_location, 'wb') as out_file:
            content = await file.read()  # read file content
            await out_file.write(content)  # write to file
        return {"info": f"file '{file.filename}' saved at '{file_location}'"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/MULTICLASS/delete/{filename}")
async def delete_file(filename: str):
    file_location = os.path.join(MULTICLASS_PATIENT_PATH, filename)
    if os.path.exists(file_location):
        os.remove(file_location)
        return Response(status_code=status.HTTP_204_NO_CONTENT)
    else:
        raise HTTPException(status_code=404, detail="File not found")

@app.get("/MULTICLASS/files/")
async def list_files():
    try:
        files = os.listdir(MULTICLASS_PATIENT_PATH)
        return {"files": files}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/MULTICLASS/files/{filename}")
async def view_file(filename: str):
    file_path = os.path.join(MULTICLASS_PATIENT_PATH, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        raise HTTPException(status_code=404, detail="File not found")

from pathlib import Path


@app.get("/MULTICLASS/list_images_and_content")
async def MULlist_images_and_content():
    base_path = Path("Multiclass/results")
    response = []
    
    for folder in base_path.iterdir():
        if folder.is_dir():
            folder_content = {"folder_name": folder.name, "files": []}
            result_file_path = folder / "result.txt"
            rating_file_path = folder / "rating.txt"
            comment_file_path = folder / "comment.txt"
            
            result_content = ""
            rating_content = ""
            comment_content = ""
            
            if result_file_path.exists():
                with result_file_path.open('r') as result_file:
                    result_content = result_file.read()
                    
            if rating_file_path.exists():
                with rating_file_path.open('r') as rating_file:
                    rating_content = rating_file.read()
                    
            if comment_file_path.exists():
                with comment_file_path.open('r') as comment_file:
                    comment_content = comment_file.read()
                    
            image_files = [f.name for f in folder.iterdir() if f.is_file() and f.suffix in ['.png', '.jpg', '.jpeg', '.bmp', '.gif']]
                
            folder_content["files"].append({
                "images": image_files,
                "result_content": result_content,
                "rating_content": rating_content,
                "comment_content": comment_content
            })
            
            response.append(folder_content)
    
    return response

@app.get("/BINARY/list_images_and_content")
async def BINlist_images_and_content():
    base_path = Path("Binary/results")
    response = []
    
    for folder in base_path.iterdir():
        if folder.is_dir():
            folder_content = {"folder_name": folder.name, "files": []}
            result_file_path = folder / "result.txt"
            rating_file_path = folder / "rating.txt"
            comment_file_path = folder / "comment.txt"
            
            result_content = ""
            rating_content = ""
            comment_content = ""
            
            if result_file_path.exists():
                with result_file_path.open('r') as result_file:
                    result_content = result_file.read()
                    
            if rating_file_path.exists():
                with rating_file_path.open('r') as rating_file:
                    rating_content = rating_file.read()
                    
            if comment_file_path.exists():
                with comment_file_path.open('r') as comment_file:
                    comment_content = comment_file.read()
                    
            image_files = [f.name for f in folder.iterdir() if f.is_file() and f.suffix in ['.png', '.jpg', '.jpeg', '.bmp', '.gif']]
                
            folder_content["files"].append({
                "images": image_files,
                "result_content": result_content,
                "rating_content": rating_content,
                "comment_content": comment_content
            })
            
            response.append(folder_content)
    
    return response


binary_path = Path("Binary/results")
multiclass_path = Path("Multiclass/results")

@app.get("/BINARY/list-subfolders")
async def list_subfolders():
    try:
        subfolders = [f.name for f in binary_path.iterdir() if f.is_dir()]
        return JSONResponse(content={"subfolders": subfolders})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/BINARY/create-comment-file")
async def create_comment_file(subfolder: str = Form(...), content: str = Form(...)):
    try:
        subfolder_path = binary_path / subfolder
        if not subfolder_path.exists() or not subfolder_path.is_dir():
            raise HTTPException(status_code=404, detail="Subfolder not found")
        
        comment_file_path = subfolder_path / "comment.txt"
        with open(comment_file_path, "w") as file:
            file.write(content)
        
        return JSONResponse(content={"message": "comment.txt created successfully"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/BINARY/create-rating")
async def create_rating(subfolder: str = Form(...), content: str = Form(...)):
    try:
        # Validate that content is a number between 1 and 5
        if content not in ['1', '2', '3', '4', '5']:
            raise HTTPException(status_code=400, detail="Content must be a number between 1 and 5")

        subfolder_path = binary_path / subfolder
        if not subfolder_path.exists() or not subfolder_path.is_dir():
            raise HTTPException(status_code=404, detail="Subfolder not found")
        
        comment_file_path = subfolder_path / "rating.txt"
        with open(comment_file_path, "w") as file:
            file.write(content)
        
        return JSONResponse(content={"message": "rating.txt created successfully"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/BINARY/edit-comment-file")
async def edit_comment_file(subfolder: str = Form(...), content: str = Form(...)):
    try:
        subfolder_path = binary_path / subfolder
        if not subfolder_path.exists() or not subfolder_path.is_dir():
            raise HTTPException(status_code=404, detail="Subfolder not found")
        
        comment_file_path = subfolder_path / "comment.txt"
        if not comment_file_path.exists():
            raise HTTPException(status_code=404, detail="comment.txt file not found")
        
        with open(comment_file_path, "w") as file:
            file.write(content)
        
        return JSONResponse(content={"message": "comment.txt edited successfully"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

@app.get("/MULTICLASS/list-subfolders")
async def list_subfolders():
    try:
        subfolders = [f.name for f in multiclass_path.iterdir() if f.is_dir()]
        return JSONResponse(content={"subfolders": subfolders})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/MULTICLASS/create-comment-file")
async def create_comment_file(subfolder: str = Form(...), content: str = Form(...)):
    try:
        subfolder_path = multiclass_path / subfolder
        if not subfolder_path.exists() or not subfolder_path.is_dir():
            raise HTTPException(status_code=404, detail="Subfolder not found")
        
        comment_file_path = subfolder_path / "comment.txt"
        with open(comment_file_path, "w") as file:
            file.write(content)
        
        return JSONResponse(content={"message": "comment.txt created successfully"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/MULTICLASS/create-rating")
async def create_rating(subfolder: str = Form(...), content: str = Form(...)):
    try:
        # Validate that content is a number between 1 and 5
        if content not in ['1', '2', '3', '4', '5']:
            raise HTTPException(status_code=400, detail="Content must be a number between 1 and 5")

        subfolder_path = multiclass_path / subfolder
        if not subfolder_path.exists() or not subfolder_path.is_dir():
            raise HTTPException(status_code=404, detail="Subfolder not found")
        
        comment_file_path = subfolder_path / "rating.txt"
        with open(comment_file_path, "w") as file:
            file.write(content)
        
        return JSONResponse(content={"message": "rating.txt created successfully"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.post("/MULTICLASS/edit-comment-file")
async def edit_comment_file(subfolder: str = Form(...), content: str = Form(...)):
    try:
        subfolder_path = multiclass_path / subfolder
        if not subfolder_path.exists() or not subfolder_path.is_dir():
            raise HTTPException(status_code=404, detail="Subfolder not found")
        
        comment_file_path = subfolder_path / "comment.txt"
        if not comment_file_path.exists():
            raise HTTPException(status_code=404, detail="comment.txt file not found")
        
        with open(comment_file_path, "w") as file:
            file.write(content)
        
        return JSONResponse(content={"message": "comment.txt edited successfully"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
import uvicorn

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=9090)