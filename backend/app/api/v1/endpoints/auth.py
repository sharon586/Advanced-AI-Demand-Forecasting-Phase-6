from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter(prefix="/auth", tags=["Authentication"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "SECRET123"
ALGORITHM = "HS256"

# In-memory store (replace with DB in production)
fake_users_db = []


class RegisterSchema(BaseModel):
    name: str
    email: str
    password: str
    role: str = "Analyst"


class LoginSchema(BaseModel):
    email: str
    password: str


def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    plain_password = plain_password[:72]
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=12)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


@router.post("/register")
def register(user: RegisterSchema):
    existing_user = next((u for u in fake_users_db if u["email"] == user.email), None)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    new_user = {
        "id": len(fake_users_db) + 1,
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
        "role": user.role,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat()
    }
    fake_users_db.append(new_user)
    return {"message": "User Registered Successfully", "user_id": new_user["id"]}


@router.post("/login")
def login(user: LoginSchema):
    db_user = next((u for u in fake_users_db if u["email"] == user.email), None)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid Email")
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid Password")

    token = create_access_token({
        "sub": db_user["email"],
        "role": db_user["role"],
        "name": db_user["name"]
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user["role"],
        "name": db_user["name"]
    }


@router.get("/me")
def get_me(token: str = None):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        user = next((u for u in fake_users_db if u["email"] == email), None)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
