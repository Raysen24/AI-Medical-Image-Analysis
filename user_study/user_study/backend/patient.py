import crud
import schemas
from auth import get_current_user
from models import Doctor
from fastapi import APIRouter, FastAPI, HTTPException, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session
from database import SessionLocal, Base, engine
from settings import *
from datetime import datetime
from typing import Optional
import models


app = FastAPI()

router = APIRouter(
    prefix="/patient",
    dependencies=[Depends(get_current_user)],
    tags=["patient"]
)


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/patient/create")
async def create_patient(patient: schemas.PatientCreate, db: Session = Depends(get_db), user: Doctor = Depends(get_current_user)):
    db_patient = crud.create_patient(db=db, doctor_id=user.doctor_id, patient=patient)
    db_patient.commit()

    return JSONResponse(content={'message': 'Operation success.'}, status_code=200)

@router.put("/patient/update/{id}")
async def update_patient(id:int, update: schemas.PatientUpdate, db: Session = Depends(get_db)):
    db_patient = crud.update_patient(db=db, id=id, update=update)
    db.commit()

    return JSONResponse(content={'message': 'Operation success.'}, status_code=200)

@router.get("/get-patients", response_model=List[schemas.Patient])
async def get_patients(
    doctor_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    if doctor_id:
        patients = crud.get_patient(db=db, filter={'doctor_id': doctor_id}).all()
    else:
        patients = db.query(models.Patient).all()

    return patients

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
