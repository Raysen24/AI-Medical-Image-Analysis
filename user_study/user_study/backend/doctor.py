import crud
import schemas
from fastapi import APIRouter, FastAPI, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List
from sqlalchemy.orm import Session
from database import SessionLocal, Base, engine
from settings import *


app = FastAPI()

router = APIRouter(
    prefix="/doctor",
    tags=["doctor"]
)


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create")
async def upload_file(doctor: schemas.DoctorCreate, db: Session = Depends(get_db)):
    db_doctor = crud.create_doctor(db=db, doctor=doctor)
    db_doctor.commit()
        
    return JSONResponse(content={'message': 'Entity successfully created'}, status_code=201)

@router.get("/list")
async def get_doctor_list(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    doctors = crud.get_doctors(db, skip=skip, limit=limit)
    if not doctors:
        raise HTTPException(status_code=404, detail="No doctors found")
    return doctors

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)