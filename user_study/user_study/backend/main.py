import models
import uvicorn
import auth
import forget_password
import doctor
import s3 
import patient
import logging
import predict
import logbook

from fastapi import FastAPI, Depends, HTTPException, APIRouter, Request, logger, status
from sqlalchemy.orm import Session
from typing import List, Annotated
from database import SessionLocal, engine
from datetime import datetime
from fastapi import FastAPI, Depends, HTTPException, APIRouter, Request, logger, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from typing import List, Annotated

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
app = FastAPI()

# Serve static files (images) from the 'images' directory
app.mount("/images", StaticFiles(directory="images"), name="images")

router = APIRouter()

class Config:
    arbitrary_types_allowed = True

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if exc.status_code == 404:
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"message": "Oops! That resource does not exist."},
        )
    else:
        content = {"message": exc.detail}
        return JSONResponse(status_code=exc.status_code, content=content)
    return await request.app.default_exception_handler(request, exc)

app.include_router(auth.router)
app.include_router(forget_password.router)
app.include_router(doctor.router)
app.include_router(s3.router)
app.include_router(patient.router)
app.include_router(predict.router)
app.include_router(logbook.router)

origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    # add other origins here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]

@app.get("/pretest")
def get_pretest_data(db: db_dependency):
    pretests = db.query(models.PreTest).all()

    result = []
    for pretest in pretests:
        images = db.query(models.PreTestImage).filter(models.PreTestImage.pre_test_id == pretest.pre_test_id).all()
        result.append({
            "pre_test_id": pretest.pre_test_id,
            "pre_test_created_datetime": pretest.pre_test_created_datetime,
            "pre_test_answer": pretest.pre_test_answer,
            "alternative_answer_1": pretest.alternative_answer_1,
            "alternative_answer_2": pretest.alternative_answer_2,
            "alternative_answer_3": pretest.alternative_answer_3,
            "images": [{
                "pre_test_image_id": img.pre_test_image_id,
                "pre_test_image": img.pre_test_image,
            } for img in images]
        })

    return result

@app.get("/", status_code=status.HTTP_200_OK)
async def user(user: None, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    return {"User": user}

@app.on_event("startup")
async def startup_event():
    session = SessionLocal()

    existing_pre_tests = session.query(models.PreTest.pre_test_id).all()
    existing_pre_test_ids = {pre_test_id for (pre_test_id,) in existing_pre_tests}

    pre_test_data = [
    models.PreTest(pre_test_id=1, pre_test_created_datetime=datetime.now(), pre_test_answer="Batu ginjal kiri/ nefrolith sinistra", alternative_answer_1="meteorismus", alternative_answer_2="ileus obstruksi", alternative_answer_3="normal"),
    models.PreTest(pre_test_id=2, pre_test_created_datetime=datetime.now(), pre_test_answer="Ileus obstruksi", alternative_answer_1="cholelith", alternative_answer_2="pneumoperitoneum", alternative_answer_3="normal"),
    models.PreTest(pre_test_id=3, pre_test_created_datetime=datetime.now(), pre_test_answer="Tb paru kanan Efusi pleura kanan", alternative_answer_1="normal", alternative_answer_2="pneumothorax kanan", alternative_answer_3="fraktur clavicula kiri"),
    models.PreTest(pre_test_id=4, pre_test_created_datetime=datetime.now(), pre_test_answer="Spondylolisthesis L4-L5", alternative_answer_1="kompresi CV L1", alternative_answer_2="normal", alternative_answer_3="dekstruski CV L5"),
    models.PreTest(pre_test_id=5, pre_test_created_datetime=datetime.now(), pre_test_answer="Pneumoperitoneum", alternative_answer_1="fraktur calvicula kanan", alternative_answer_2="atelektasis kanan", alternative_answer_3="efusi pleura kanan"),
    models.PreTest(pre_test_id=6, pre_test_created_datetime=datetime.now(), pre_test_answer="Pneumothorax kanan", alternative_answer_1="normal", alternative_answer_2="fraktur costae 5 kanan", alternative_answer_3="efusi pleura kanan"),
    models.PreTest(pre_test_id=7, pre_test_created_datetime=datetime.now(), pre_test_answer="Fraktur distal radius ulna sinistra", alternative_answer_1="fraktur tibia sinistra", alternative_answer_2="fraktur metatarsal sinistra", alternative_answer_3="normal"),
    models.PreTest(pre_test_id=8, pre_test_created_datetime=datetime.now(), pre_test_answer="Fraktur pada intertrochanter / proximal femur sinistra", alternative_answer_1="Avascular necrosis dextra", alternative_answer_2="normal", alternative_answer_3="fraktur patela kanan"),
    models.PreTest(pre_test_id=9, pre_test_created_datetime=datetime.now(), pre_test_answer="Fraktur pada metatarsal V pedis sinitra", alternative_answer_1="fraktur phalanx distal I pedis sinistra", alternative_answer_2="normal", alternative_answer_3="fraktur distal radius sinistra"),
    models.PreTest(pre_test_id=10, pre_test_created_datetime=datetime.now(), pre_test_answer="Old Fraktur pada metacarpal 5 manus sinistra", alternative_answer_1="fraktur metatarsal 5 sinistra", alternative_answer_2="fraktur ulna sinistra", alternative_answer_3="fraktur distal tibia sinistra"),
    ]

    new_pre_test_data = [data for data in pre_test_data if data.pre_test_id not in existing_pre_test_ids]
    if new_pre_test_data:
        try:
            session.add_all(new_pre_test_data)
            session.commit()
        except IntegrityError:
            session.rollback()

    existing_pre_test_images = session.query(models.PreTestImage.pre_test_image_id).all()
    existing_pre_test_image_ids = {pre_test_image_id for (pre_test_image_id,) in existing_pre_test_images}

    pre_test_images_data = [
        models.PreTestImage(pre_test_image_id=1, pre_test_id=1, pre_test_image="images/01.jpeg"),
        models.PreTestImage(pre_test_image_id=2, pre_test_id=2, pre_test_image="images/02.png"),
        models.PreTestImage(pre_test_image_id=3, pre_test_id=2, pre_test_image="images/02-2.png"),
        models.PreTestImage(pre_test_image_id=4, pre_test_id=2, pre_test_image="images/02-3.png"),
        models.PreTestImage(pre_test_image_id=5, pre_test_id=3, pre_test_image="images/03.jpeg"),
        models.PreTestImage(pre_test_image_id=6, pre_test_id=4, pre_test_image="images/04.png"),
        models.PreTestImage(pre_test_image_id=7, pre_test_id=4, pre_test_image="images/04-2.png"),
        models.PreTestImage(pre_test_image_id=8, pre_test_id=5, pre_test_image="images/05.jpeg"),
        models.PreTestImage(pre_test_image_id=9, pre_test_id=6, pre_test_image="images/06.png"),
        models.PreTestImage(pre_test_image_id=10, pre_test_id=7, pre_test_image="images/07.jpg"),
        models.PreTestImage(pre_test_image_id=11, pre_test_id=7, pre_test_image="images/07-2.jpg"),
        models.PreTestImage(pre_test_image_id=12, pre_test_id=8, pre_test_image="images/08.jpg"),
        models.PreTestImage(pre_test_image_id=13, pre_test_id=9, pre_test_image="images/09.jpg"),
        models.PreTestImage(pre_test_image_id=14, pre_test_id=9, pre_test_image="images/09-2.jpg"),
        models.PreTestImage(pre_test_image_id=15, pre_test_id=10, pre_test_image="images/10.jpg"),
        models.PreTestImage(pre_test_image_id=16, pre_test_id=10, pre_test_image="images/10-2.jpg")
    ]

    new_pre_test_images = [data for data in pre_test_images_data if data.pre_test_image_id not in existing_pre_test_image_ids]
    if new_pre_test_images:
        try:
            session.add_all(new_pre_test_images)
            session.commit()
        except IntegrityError:
            session.rollback()
    session.close()

class SubmitPretestRequest(BaseModel):
    selected_answers: dict

@app.post("/submit-pretest")
async def submit_pretest(selected_answers: dict, db: db_dependency, current_user: models.Doctor = Depends(auth.get_current_user)):
    try:
        # Calculate score
        pretests = db.query(models.PreTest).all()
        score = 0
        
        for question_id, selected_answer in selected_answers.items():
            pretest_question = db.query(models.PreTest).filter(models.PreTest.pre_test_id == question_id).first()
            if pretest_question and pretest_question.pre_test_answer == selected_answer:
                score += 1

        # Update score in Doctor table for the current user
        doctor = db.query(models.Doctor).filter(models.Doctor.doctor_id == current_user.doctor_id).first()
        if doctor:
            doctor.score = score
            db.commit()

        print("selected_answers from main.py =", selected_answers)
        print("score from main.py =", score)

        return {"score": score}

    except SQLAlchemyError as e:
        logger.error(f"Database error during pretest submission: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error")

    except Exception as e:
        logger.error(f"Unexpected error during pretest submission: {e}")
        raise HTTPException(status_code=500, detail="Unexpected error during pretest submission")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
