from sqlalchemy import Column, Integer, Date, String, Float, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Doctor(Base):
    __tablename__ = 'doctor'
    
    doctor_id = Column(Integer, primary_key=True, index=True)
    doctor_name = Column(String(length=500))
    
    doctor_email = Column(String(length=500), unique=True)
    doctor_birthdate = Column(Date)
    doctor_gender = Column(String(length=500))
    hashed_password = Column(String(length=500))

    counter = Column(Integer, default=0)
    status = Column(Boolean, default=False)
    
    score = Column(Integer, default=0)
    
    # Relationships
    patients = relationship("Patient", back_populates="doctor")
    logbooks = relationship("Logbook", back_populates="doctor")
    refresh_tokens = relationship(
        "RefreshToken", back_populates="doctors", cascade="all, delete")

class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(Integer, primary_key=True, index=True)
    token = Column(String(length=512), index=True, unique=True)
    user_id = Column(Integer, ForeignKey('doctor.doctor_id'))
    expires_at = Column(DateTime)

    doctors = relationship("Doctor", back_populates="refresh_tokens")

class Binary(Base):
    __tablename__ = 'binary'
    
    binary_id = Column(Integer, primary_key=True, index=True)
    confidence_rate = Column(String(length=500))
    result = Column(String(length=500))
    comment = Column(String(length=500))
    sesuai_tidaksesuai = Column(String(length=500))
    
    # Relationship
    patient = relationship("Patient", back_populates="binary")

class Multiclass(Base):
    __tablename__ = 'multiclass'
    
    multiclass_id = Column(Integer, primary_key=True, index=True)
    confidence_rate = Column(String(length=500))
    result = Column(String(length=500))
    comment = Column(String(length=500))
    sesuai_tidaksesuai = Column(String(length=500))
    
    # Relationship
    patient = relationship("Patient", back_populates="multiclass")

class Patient(Base):
    __tablename__ = 'patient'
    
    patient_id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey('doctor.doctor_id'))
    updated_datetime = Column(DateTime)
    multiclass_id = Column(Integer, ForeignKey('multiclass.multiclass_id'))
    binary_id = Column(Integer, ForeignKey('binary.binary_id'))
    
    # Relationships
    doctor = relationship("Doctor", back_populates="patients")
    binary = relationship("Binary", back_populates="patient")
    multiclass = relationship("Multiclass", back_populates="patient")
    images = relationship("DoctorImage", back_populates="patient")

class PreTest(Base):
    __tablename__ = 'pre_test'
    
    pre_test_id = Column(Integer, primary_key=True, index=True)
    pre_test_created_datetime = Column(DateTime)
    pre_test_answer = Column(String(length=500))
    alternative_answer_1 = Column(String(length=500))
    alternative_answer_2 = Column(String(length=500))
    alternative_answer_3 = Column(String(length=500))
    
    # Relationships
    images = relationship("PreTestImage", back_populates="pre_test")

class PreTestImage(Base):
    __tablename__ = 'pre_test_images'
    
    pre_test_image_id = Column(Integer, primary_key=True, index=True)
    pre_test_id = Column(Integer, ForeignKey('pre_test.pre_test_id'))
    pre_test_image = Column(String(length=500))
    
    
    # Relationships
    pre_test = relationship("PreTest", back_populates="images")

class DoctorImage(Base):
    __tablename__ = 'doctor_images'
    
    doctor_image_id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey('patient.patient_id'))
    image = Column(String(length=500))
    
    # Relationships
    patient = relationship("Patient", back_populates="images")

class Logbook(Base):
    __tablename__ = 'logbook'
    
    logbook_id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey('doctor.doctor_id'))
    last_patient = Column(Integer, ForeignKey('patient.patient_id'), nullable=True)
    date = Column(DateTime)
    patient_count = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    
    # Relationships
    doctor = relationship("Doctor", back_populates="logbooks")