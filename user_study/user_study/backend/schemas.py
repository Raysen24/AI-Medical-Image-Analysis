from pydantic import BaseModel
from typing import Optional
from datetime import datetime, date

class DoctorBase(BaseModel):
    doctor_name: Optional[str] = None
    counter: Optional[int] = 0
    status: Optional[bool] = False

class DoctorCreate(DoctorBase):
    doctor_email: str
    doctor_birthdate: date
    doctor_gender: str

class Doctor(DoctorBase):
    doctor_id: int
    
    class Config:
        orm_mode = True

class BinaryBase(BaseModel):
    confidence_rate: Optional[str] = None
    result: Optional[str] = None
    comment: Optional[str] = None
    sesuai_tidaksesuai: Optional[str] = None

class BinaryCreate(BinaryBase):
    pass

class Binary(BinaryBase):
    binary_id: int
    
    class Config:
        orm_mode = True

class BinaryUpdate(BaseModel):
    comment: Optional[str] = None
    sesuai_tidaksesuai: Optional[str] = None

class MulticlassBase(BaseModel):
    confidence_rate: Optional[str] = None
    result: Optional[str] = None
    comment: Optional[str] = None
    sesuai_tidaksesuai: Optional[str] = None

class MulticlassCreate(MulticlassBase):
    pass

class Multiclass(MulticlassBase):
    multiclass_id: int
    
    class Config:
        orm_mode = True

class MulticlassUpdate(BaseModel):
    comment: Optional[str] = None
    sesuai_tidaksesuai: Optional[str] = None
    
class PatientBase(BaseModel):
    doctor_id: Optional[int] = None
    updated_datetime: Optional[datetime] = None
    multiclass_id: Optional[int] = None
    binary_id: Optional[int] = None

class PatientCreate(BaseModel):
    updated_datetime: Optional[datetime] = None
    multiclass_id: Optional[int] = None
    binary_id: Optional[int] = None

class Patient(PatientBase):
    patient_id: int
    
    class Config:
        orm_mode = True

class PatientUpdate(BaseModel):
    updated_datetime: Optional[datetime] = None
    multiclass_id: Optional[int] = None
    binary_id: Optional[int] = None

class PreTestBase(BaseModel):
    pre_test_created_datetime: datetime

class PreTestCreate(PreTestBase):
    pass

class PreTest(PreTestBase):
    pre_test_id: int
    
    class Config:
        orm_mode = True

class PreTestImageBase(BaseModel):
    pre_test_id: int
    pre_test_answer: str

class PreTestImageCreate(PreTestImageBase):
    pass

class PreTestImage(PreTestImageBase):
    pre_test_image_id: int
    
    class Config:
        orm_mode = True

class DoctorImageBase(BaseModel):
    patient_id: int
    image: str

class DoctorImageCreate(DoctorImageBase):
    pass

class DoctorImage(DoctorImageBase):
    doctor_image_id: int
    
    class Config:
        orm_mode = True

class LogbookBase(BaseModel):
    doctor_id: int
    date: datetime
    last_patient: Optional[int] = None
    patient_count: Optional[int] = 0
    completed: Optional[bool] = False

class LogbookCreate(BaseModel):
    date: datetime
    last_patient: Optional[int] = None
    patient_count: Optional[int] = 0
    completed: Optional[bool] = False

class Logbook(LogbookBase):
    logbook_id: int
    
    class Config:
        orm_mode = True
