from sqlalchemy.orm import Session, Query
from sqlalchemy.sql import extract
import models
import schemas
from datetime import date, datetime, timedelta
from fastapi import HTTPException
from typing import Optional, Union

def create_doctor(db: Session, doctor: schemas.DoctorCreate) -> Session:
    db_doctor = models.Doctor(**doctor.dict()) # pydantic v1
    # db_doctor = models.Doctor(**doctor.model_dump()) -> pydantic v2
    db.add(db_doctor)
    return db

def create_doctorimage(db: Session, doctor_image: schemas.DoctorImageCreate) -> Session:
    db_doctor_images = models.DoctorImage(**doctor_image.dict())  # pydantic v1
    # db_doctor_images = models.DoctorImage(**doctor_image.model_dump()) -> pydantic v2
    db_doctor_images.folder = doctor_image.patient_id
    db.add(db_doctor_images)
    return db

def create_binary(db: Session, binary: schemas.BinaryCreate) -> Session:
    db_binary = models.Binary(**binary) # pydantic v1
    # db_binary = models.Binary(binary.model_dump())  -> pydantic v2
    db.add(db_binary)
    db.commit()
    db.refresh(db_binary)
    return db_binary

def create_multiclass(db: Session, multiclass: schemas.MulticlassCreate) -> Session:
    db_multiclass = models.Multiclass(**multiclass) # pydantic v1
    # db_multiclass = models.Multiclass(multiclass.model_dump()) -> pydantic v2
    db.add(db_multiclass)
    db.commit()
    db.refresh(db_multiclass)
    return db_multiclass

def create_patient(db: Session, doctor_id: int, patient: schemas.PatientCreate=schemas.PatientCreate()) -> tuple[Session, models.Patient]:
    db_patient = models.Patient(**patient.dict(), doctor_id=doctor_id) # pydantic v1 
    # db_patient = models.Patient(**patient.model_dump()) -> pydantic v2 
    db.add(db_patient)
    return (db, db_patient)

def create_pretest(db: Session, pretest: schemas.PreTestCreate) -> Session:
    db_pretest = models.PreTest(pretest.dict()) # pydantic v1
    # db_pretest = models.PreTest(pretest.model_dump()) -> pydantic v2
    db.add(db_pretest)
    return db

def create_pretestimage(db: Session, pretestimage: schemas.PreTestImageCreate) -> Session:
    db_pretestimage = models.PreTestImage(pretestimage.dict()) # pydantic v1
    # db_pretestimage = models.PreTestImage(pretestimage.model_dump()) -> pydantic v2
    db.add(db_pretestimage)
    return db

def create_logbook(db: Session, doctor_id: int, logbook: schemas.LogbookCreate) -> Session:
    db_logbook = models.Logbook(**logbook.dict(), doctor_id = doctor_id) # pydantic v1
    # db_logbook = models.Logbook(**logbook.model_dump()) -> pydantic v2
    db.add(db_logbook)
    return db

def get_logbook_by_id(db: Session, id: int) -> models.Logbook | None:
    return db.query(models.Logbook).filter(models.Logbook.logbook_id == id).first()

def get_logbook_by_doctor_id(db: Session, doctor_id: int) -> Query[models.Logbook]:
    db_logbook = db.query(models.Logbook).filter(models.Logbook.doctor_id == doctor_id).order_by(models.Logbook.date.desc(), models.Logbook.logbook_id.desc())
    return db_logbook

def add_counter_logbook_by_id(db: Session, id: int) -> models.Logbook | None:
    db_logbook = get_logbook_by_id(db, id)
    db_logbook.patient_count += 1
    return db_logbook

def set_counter_logbook_by_id(db: Session, id: int, count: int) -> models.Logbook | None:
    db_logbook = get_logbook_by_id(db, id)
    db_logbook.patient_count = count
    return db_logbook

def update_last_patient_by_id(db: Session, logbook_id: int, patient_id: int|None) -> models.Logbook:
    db_logbook = get_logbook_by_id(db, logbook_id)
    db_logbook.last_patient = patient_id
    return db_logbook

def get_doctors(db: Session, skip: Optional[int] = 0, limit: Optional[int] = 10):
    return db.query(models.Doctor).offset(skip).limit(limit).all()

def get_patient(db: Session, filter) -> Query:
    db_patient = db.query(models.Patient).filter_by(**filter)
    return db_patient

def update_doctor_patient_counter(db: Session, doctor_id: int) -> models.Doctor:
    patient_count = db.query(models.Patient).filter(models.Patient.doctor_id == doctor_id).count()
    
    db_doctor = db.query(models.Doctor).filter(models.Doctor.doctor_id == doctor_id).first()
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    db_doctor.counter = patient_count
    db.add(db_doctor)
    
    return db_doctor

def update_patient(db: Session, id: int, update: schemas.PatientUpdate) -> Session:
    db_patient = get_patient(db, {'patient_id': id}).first()
    update_data = update.dict(exclude_unset=True)
    for k, v in update_data.items():
        setattr(db_patient, k, v)

    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)

    return db_patient

def get_binary(db: Session, filter) -> Query:
    db_binary = db.query(models.Binary).filter_by(**filter)
    return db_binary

def update_binary(db: Session, id: int, update: schemas.BinaryUpdate) -> Session:
    db_binary = get_binary(db, {'binary_id': id}).first()
    for k, v in update:
        setattr(db_binary, k, v)
    return db_binary

def get_multiclass(db: Session, filter) -> Query:
    db_multiclass = db.query(models.Multiclass).filter_by(**filter)
    return db_multiclass

def update_multiclass(db: Session, id: int, update: schemas.MulticlassUpdate) -> Session:
    db_multiclass = get_multiclass(db, {'multiclass_id': id}).first()
    for k, v in update:
        setattr(db_multiclass, k, v)
    return db_multiclass

def get_doctorimage_from_patient(db: Session, id: int) -> str:
    db_doctorimage = db.query(models.DoctorImage).filter(models.DoctorImage.patient_id == id).all()
    return db_doctorimage

def get_doctorimage_path(db: Session, id: int) -> str:
    db_doctorimage = db.query(models.DoctorImage).filter(models.DoctorImage.doctor_image_id == id).first()
    return db_doctorimage.image

def delete_doctorimage(db: Session, id: int) -> Session:
    db_docterimage = db.query(models.DoctorImage).filter(models.DoctorImage.doctor_image_id == id).first()
    db.delete(db_docterimage)
    return db

def get_patients_profile(db: Session, patient_id: Optional[int] = None) -> Session: 
    query = db.query(models.Patient, models.Binary, models.Multiclass).join(
        models.Binary, models.Patient.binary_id == models.Binary.binary_id
    ).join(
        models.Multiclass, models.Patient.multiclass_id == models.Multiclass.multiclass_id
    )
    
    if patient_id:
        query = query.filter(models.Patient.patient_id == patient_id)

    return query