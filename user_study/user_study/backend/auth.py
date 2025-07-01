from fastapi.responses import JSONResponse
from jose import jwt, JWTError
from typing import Annotated, Optional
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Doctor, RefreshToken
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from datetime import datetime, timedelta
import logging
from sqlalchemy.exc import SQLAlchemyError
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import date

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

SECRET_KEY = 'e1e665879c2743c039ce5d40068ad2ac3ef855b8905635c2d82962f03726ca55'
ALGORITHM = 'HS256'

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
auth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')

class VerificationEmailRequest(BaseModel):
    email: str
    verification_link: str

class CreateUserRequest(BaseModel):
    username: str
    email: str
    birthdate: date
    gender: str
    password: str

    class Config:
        json_encoders = {
            date: lambda v: v.isoformat()  # Ensure birthdate is serialized as a string
        }

class Token(BaseModel):
    access_token: str
    token_type: str
    username: str

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally: 
        db.close()

def decode_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

db_dependency = Annotated[Session, Depends(get_db)]
logger = logging.getLogger(__name__)


def authenticate_user(email: str, password: str, db):
    user = db.query(Doctor).filter(Doctor.doctor_email == email).first()
    if user and bcrypt_context.verify(password, user.hashed_password):
        return user
    return None

def create_user_token(username: str, email:str, doctor_id: int, gender: str, birthdate:date, expires_delta:Optional[timedelta]=None): 
    to_encode = {
        'sub': username,
        'email': email,
        'id': doctor_id,
        'gender': gender,
        'birthdate': birthdate.isoformat()  # Convert date to ISO format string
    }
    if expires_delta:
        expires = datetime.utcnow() + expires_delta
        to_encode.update({'exp': expires})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(doctor_id: int, expires_delta: Optional[timedelta] = None):
    encode = {'id': doctor_id}
    if expires_delta:
        expires = datetime.utcnow() + expires_delta
        encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(auth2_bearer), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        user = db.query(Doctor).filter(Doctor.doctor_id == user_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )
        return user
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


# Register endpoint
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(create_user_request: CreateUserRequest, db: Session = Depends(get_db)):
    try:
        create_user_model = Doctor(
            doctor_name = create_user_request.username,
            doctor_email = create_user_request.email,
            hashed_password = bcrypt_context.hash(create_user_request.password),
            doctor_gender = create_user_request.gender, 
            doctor_birthdate = create_user_request.birthdate
        )
        db.add(create_user_model)
        db.commit()

        access_token = create_user_token(
            username=create_user_request.username,
            email=create_user_request.email,
            doctor_id=create_user_model.doctor_id,
            gender=create_user_request.gender,
            birthdate=create_user_request.birthdate, 
            expires_delta=timedelta(hours=24)
        )

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "username": create_user_model.doctor_name
        }

    except SQLAlchemyError as e:
        logger.error(f"Error creating user: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create user")
    except Exception as e:
        logger.error(f"Unexpected error creating user: {e}")
        raise HTTPException(status_code=500, detail="Unexpected error")

@router.post("/refresh", response_model=Token)
async def refresh_access_token(refresh_token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("id")
        if user_id is None:
            raise HTTPException(
                status_code=401, detail="Invalid refresh token")

        db_token = db.query(RefreshToken).filter(
            RefreshToken.token == refresh_token, RefreshToken.user_id == user_id).first()
        if not db_token or db_token.expires_at < datetime.utcnow():
            raise HTTPException(
                status_code=401, detail="Refresh token expired")
        
        user = db.query(Doctor).filter(Doctor.doctor_id == user_id).first()
        new_access_token = create_user_token(
            user.doctor_name, user.doctor_email, user.doctor_id, user.doctor_gender, user.doctor_birthdate,timedelta(hours=24))

        return {"access_token": new_access_token, "token_type": "bearer", "username": user.doctor_name}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        user = authenticate_user(form_data.username, form_data.password, db)
        if not user:
            logger.error("Authentication failed for user: %s",
                         form_data.username)
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Incorrect email or password'
            )

        access_token = create_user_token(
            username=user.doctor_name,
            email=user.doctor_email,
            doctor_id=user.doctor_id,
            gender=user.doctor_gender,
            birthdate=user.doctor_birthdate, 
            expires_delta=timedelta(hours=24)
        )
        refresh_token = create_refresh_token(user.doctor_id, timedelta(days=7))
        new_refresh_token = RefreshToken(
            token=refresh_token, user_id=user.doctor_id, expires_at=datetime.utcnow() +
            timedelta(days=7)
        )
        db.add(new_refresh_token)
        db.commit()

        response = JSONResponse(content={
            'access_token': access_token,
            'token_type': 'bearer',
            'username': user.doctor_name,
        })
        response.set_cookie(key="token", value=access_token, httponly=True)
        return response

    except HTTPException as http_exc:
        logger.error(
            f"HTTP error during login for user {form_data.username}: {http_exc.detail}")
        raise http_exc  # Re-raise the same exception to propagate the correct status code and detail
    except SQLAlchemyError as e:
        logger.error(
            f"Database error during login for user {form_data.username}: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error"
        )
    except JWTError as e:
        logger.error(
            f"JWT error during login for user {form_data.username}: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    except Exception as e:
        logger.error(
            f"Unexpected error during login for user {form_data.username}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unexpected error during login"
        )

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout_user(db: Session = Depends(get_db), current_user: Doctor = Depends(get_current_user)):
    try:
        db.query(RefreshToken).filter(
            RefreshToken.user_id == current_user.doctor_id).delete()
        db.commit()
        response = JSONResponse(content={"detail": "Successfully logged out"})
        response.delete_cookie(key="token")
        return response
    except SQLAlchemyError as e:
        logger.error(f"Error logging out user: {e}")
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to log out")
    except Exception as e:
        logger.error(f"Unexpected error during logout: {e}")
        raise HTTPException(
            status_code=500, detail="Unexpected error during logout")