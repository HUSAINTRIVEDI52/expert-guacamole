import os
import time
import uuid
from typing import List

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud
import models
import schemas
from auth import routes as auth_routes
from database import engine, get_db
from logger import setup_logging
from routers import lead_search, payments

# Load .env at the very top
# env_path = Path(__file__).resolve().parent / ".env"
# load_dotenv(env_path)

load_dotenv(".env")
load_dotenv(".env.local", override=True)

# Initialize enhanced logging
logger = setup_logging()

# In production, use migrations (Alembic).
# For now, we rely on sul2.sql, but this will ensure tables match models.
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SUL API", description="Enhanced Logging Integrated")

allowed_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").strip().split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in allowed_origins if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router, prefix="/api", tags=["auth"])
app.include_router(lead_search.router, prefix="/api", tags=["lead-search"])
app.include_router(payments.router, prefix="/api/payments", tags=["payments"])


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """
    Middleware to log every request and its processing time with colors.
    """
    start_time = time.time()
    path = request.url.path
    method = request.method

    # Log request details
    logger.info(f"📥 {method} {path}")

    try:
        response = await call_next(request)
        process_time = (time.time() - start_time) * 1000
        status_code = response.status_code

        # Colorize status code based on value
        if status_code < 400:
            color = "green"
        elif status_code < 500:
            color = "yellow"
        else:
            color = "red"

        log_message = (
            f"📤 {method} {path} | "
            f"<{color}>{status_code}</{color}> | "
            f"⏱️ {process_time:.2f}ms"
        )

        if status_code >= 400:
            logger.warning(log_message)
        else:
            logger.info(log_message)

        return response

    except Exception as e:
        process_time = (time.time() - start_time) * 1000
        logger.exception(
            f"❌ {method} {path} | <red>FAILED</red> | "
            f"Error: {str(e)} | ⏱️ {process_time:.2f}ms"
        )
        raise e


@app.get("/")
def read_root():
    return {"status": "ok", "message": "Database configuration is set up!"}


@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)


@app.get("/users/", response_model=List[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users


@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
