
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel, EmailStr, Field
from fastapi import HTTPException


from fastapi import Depends
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import ContactMessageRecord

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


import os

from fastapi import Header

from .models import AdminUser
from .schemas import AdminLogin, TokenResponse
from .security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)

Base.metadata.create_all(bind=engine)


from .database import SessionLocal


def initialize_admin():
    username = os.getenv("ADMIN_USERNAME")
    password = os.getenv("ADMIN_PASSWORD")

    if not username or not password:
        raise RuntimeError(
            "ADMIN_USERNAME and ADMIN_PASSWORD must be set in backend/.env"
        )

    db = SessionLocal()
    try:
        existing_admin = (
            db.query(AdminUser)
            .filter(AdminUser.username == username)
            .first()
        )

        if existing_admin is None:
            admin = AdminUser(
                username=username,
                hashed_password=hash_password(password),
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()


initialize_admin()

app = FastAPI(
    title="DevPortfolio API",
    description="Backend API for my developer portfolio",
    version="1.0.0",
)

bearer_scheme = HTTPBearer()

# Allow the frontend to communicate with the backend


app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:3000",
    "https://pranab-dev-portfolio.onrender.com",
],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to DevPortfolio API",
        "status": "running",
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "application": "DevPortfolio API",
    }


class ContactMessage(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(min_length=1, max_length=150)
    message: str = Field(min_length=1, max_length=3000)


# Temporary storage for testing.
# Messages disappear when the backend restarts.
contact_messages = []



@app.post("/api/contact", status_code=201)
def submit_contact_message(
    contact: ContactMessage,
    db: Session = Depends(get_db),
):
    name = contact.name.strip()
    subject = contact.subject.strip()
    message = contact.message.strip()

    if not name or not subject or not message:
        raise HTTPException(
            status_code=422,
            detail="Name, subject, and message cannot be empty.",
        )

    saved_message = ContactMessageRecord(
        name=name,
        email=str(contact.email),
        subject=subject,
        message=message,
    )

    try:
        db.add(saved_message)
        db.commit()
        db.refresh(saved_message)
    except Exception:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail="Unable to save your message.",
        )

    return {
        "success": True,
        "message": "Your message was saved successfully!",
        "id": saved_message.id,
    }


@app.post("/api/admin/login", response_model=TokenResponse)
def admin_login(
    credentials: AdminLogin,
    db: Session = Depends(get_db),
):
    admin = (
        db.query(AdminUser)
        .filter(AdminUser.username == credentials.username)
        .first()
    )

    if not admin or not verify_password(
        credentials.password,
        admin.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid username or password",
        )

    token = create_access_token(admin.username)

    return {
        "access_token": token,
        "token_type": "bearer",
    }



def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload or not payload.get("sub"):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )

    admin = (
        db.query(AdminUser)
        .filter(AdminUser.username == payload["sub"])
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=401,
            detail="Admin account not found",
        )

    return admin


@app.get("/api/admin/me")
def admin_profile(
    admin: AdminUser = Depends(get_current_admin),
):
    return {
        "username": admin.username,
        "authenticated": True,
    }


@app.get("/api/admin/messages")
def get_contact_messages(
    admin: AdminUser = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    messages = (
        db.query(ContactMessageRecord)
        .order_by(ContactMessageRecord.id.desc())
        .all()
    )

    return {
        "total": len(messages),
        "messages": [
            {
                "id": item.id,
                "name": item.name,
                "email": item.email,
                "subject": item.subject,
                "message": item.message,
                "created_at": (
                    item.created_at.isoformat()
                    if item.created_at
                    else None
                ),
            }
            for item in messages
        ],
    }