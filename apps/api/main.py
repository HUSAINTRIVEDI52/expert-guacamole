import time
from typing import List

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import engine, get_db
from .logger import setup_logging

# Load environment variables from .env file
load_dotenv()

# Initialize enhanced logging
logger = setup_logging()

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SUL API", description="Enhanced Logging Integrated")


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
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@app.post("/users/{user_id}/tasks/", response_model=schemas.Task)
def create_task_for_user(
    user_id: int, task: schemas.TaskCreate, db: Session = Depends(get_db)
):
    return crud.create_user_task(db=db, task=task, user_id=user_id)


@app.get("/tasks/", response_model=List[schemas.Task])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tasks = crud.get_tasks(db, skip=skip, limit=limit)
    return tasks
