import crud, json
from datetime import datetime
import schemas
from models import Doctor, Logbook
from fastapi import APIRouter, FastAPI, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List
from sqlalchemy.orm import Session
from database import SessionLocal, Base, engine
from settings import *
from auth import get_current_user
from datetime import date

PAGE_SIZE = 5
QUOTA = 30

app = FastAPI()

router = APIRouter(
    prefix="/logbooks",
    dependencies=[Depends(get_current_user)],
    tags=["logbook"]
)


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/get/{page}")
async def get_logbook_by_doctor(page: int = 0, db: Session = Depends(get_db), user: Doctor = Depends(get_current_user)):
    db_logbook = crud.get_logbook_by_doctor_id(db=db, doctor_id=user.doctor_id)

    output = db_logbook.all()
    # if page: output = output[(page-1)*PAGE_SIZE : page*PAGE_SIZE]
    return output

@router.get("/get/id/{id}")
async def get_logbook_by_id(id: int, db: Session = Depends(get_db), user: Doctor = Depends(get_current_user)):
    db_logbook = crud.get_logbook_by_doctor_id(db=db, doctor_id=user.doctor_id)

    model_logbook = db_logbook.filter(Logbook.logbook_id == id).first()
    if model_logbook == None:
        return JSONResponse(content={'messsage': "Logbook not found"}, status_code=404)

    if model_logbook.last_patient == None:
        try:
            db_patient, model_patient = crud.create_patient(db=db, doctor_id=user.doctor_id)
            db_patient.commit()

            model_logbook.last_patient = model_patient.patient_id
            db.commit()

        except Exception as e:
            db.rollback()
            print(e)

    return model_logbook

@router.post("/create")
async def create_logbook(logbook: schemas.LogbookCreate, db: Session = Depends(get_db), user: Doctor = Depends(get_current_user)):
    model_logbook = crud.get_logbook_by_doctor_id(db, user.doctor_id).first()
    if logbook.last_patient == None:
        db_patient, model_patient = crud.create_patient(db=db, doctor_id=user.doctor_id)
        db_patient.commit()
        logbook.last_patient = model_patient.patient_id

    if model_logbook == None or model_logbook.date.date() != date.today():
        db_logbook = crud.create_logbook(db=db, doctor_id=user.doctor_id, logbook=logbook)
        db_logbook.commit()
        return JSONResponse(content={'message': 'Entity successfully created'}, status_code=201)
        
    return JSONResponse(content={'message': 'Today\'s logbook has already been created'}, status_code=202)

@router.post("/next/{id}")
async def logbook_next(id: int, db: Session = Depends(get_db), user: Doctor = Depends(get_current_user)):
    model_logbook = crud.get_logbook_by_id(db, id=id)
    if model_logbook == None or model_logbook.doctor_id != user.doctor_id:
        return JSONResponse(content={'message': "Logbook not found"}, status_code=404)
    
    crud.add_counter_logbook_by_id(db=db, id=id)
    
    
    if model_logbook.patient_count == 30:
        try:
            model_logbook.completed = True
            model_logbook.last_patient = None
            db.commit()
        
        except Exception as e:
            db.rollback
    
    else:
        try:
            db_patient, model_patient = crud.create_patient(db=db, doctor_id=user.doctor_id)
            db_patient.commit()

            model_logbook.last_patient = model_patient.patient_id
            db.commit()

        except Exception as e:
            db.rollback()
            print(e)
    
    model_logbook = crud.get_logbook_by_id(db, id=id)

    return model_logbook


@router.post("/next/{id}")
async def logbook_next(id: int, db: Session = Depends(get_db), user: Doctor = Depends(get_current_user)):
    model_logbook = crud.get_logbook_by_id(db, id=id)
    if model_logbook == None or model_logbook.doctor_id != user.doctor_id:
        return JSONResponse(content={'message': "Logbook not found"}, status_code=404)
    
    crud.add_counter_logbook_by_id(db=db, id=id)
    
    
    if model_logbook.patient_count == 30:
        try:
            model_logbook.completed = True
            model_logbook.last_patient = None
            db.commit()
        
        except Exception as e:
            db.rollback
    
    else:
        try:
            db_patient, model_patient = crud.create_patient(db=db, doctor_id=user.doctor_id)
            db_patient.commit()

            model_logbook.last_patient = model_patient.patient_id
            db.commit()
            
            db_doctor = crud.update_doctor_patient_counter(db=db, doctor_id=user.doctor_id)
            db_doctor.commit()

        except Exception as e:
            db.rollback()
            print(e)
    
    model_logbook = crud.get_logbook_by_id(db, id=id)

    return model_logbook


@router.post("/add/{id}")
async def add_counter_logbook(id: int, db: Session = Depends(get_db)):
    crud.add_counter_logbook_by_id(db=db, id=id)
    db.commit()

    return JSONResponse(content={'message': 'Operation is successful'}, status_code=200)

@router.post("/create/{id}")
async def create_logbook_with_id(id: int, db: Session = Depends(get_db)):
    logbook = crud.get_logbook_by_id(db=db, id=id)
    if not logbook or logbook.patient_count <= QUOTA:
        return JSONResponse(status_code=400)
    
    excess_quota = logbook.patient_count - QUOTA
    new_logbook = schemas.LogbookCreate(
        doctor_id=logbook.doctor_id,
        date=datetime.now(),
        patient_count=excess_quota
        )

    db_original_logbook = crud.set_counter_logbook_by_id(db=db, id=id, count=QUOTA)
    db_new_logbook = crud.create_logbook(db=db, logbook=new_logbook)

    db.commit()
    db_new_logbook.commit()

    return JSONResponse(content={'message': 'Operation is successful'}, status_code=200)

@router.put("/set_patient/{id}")
async def set_last_patient(id: int, patient_id: int, db: Session = Depends(get_db)):
    logbook = crud.get_logbook_by_id(db=db, id=id)
    if not logbook:
        return JSONResponse(status_code=400)

    db_original_logbook = crud.get_logbook_by_id(db=db, id=id)
    
    db_original_logbook.last_patient = patient_id
    db.commit()

    return JSONResponse(content={'message': 'Operation is successful'}, status_code=200)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)