from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlmodel import Session, select

from auth import create_access_token, get_current_user, hash_password, verify_password
from database import create_db_and_tables, get_session
from models import Task, User
from schemas import TaskCreate, TaskRead, TaskUpdate, Token

app = FastAPI()
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

@app.post("/tasks", response_model=TaskRead)
async def create_task(
    task: TaskCreate, 
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    db_task = Task(
        title=task.title,
        description=task.description,
        completed=task.completed,
        owner_id=current_user.id,
    )
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@app.get("/tasks", response_model=list[TaskRead])
async def get_tasks(
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
    completed: bool | None = None,
) -> list[Task]:
    if completed is None:
        tasks = session.exec(select(Task).where(Task.owner_id == current_user.id))
    else:
        tasks = session.exec(select(Task).where(
            Task.owner_id == current_user.id,
            Task.completed == completed,
        ))
    return tasks

@app.get("/tasks/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> Task:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.patch("/tasks/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int, 
    updated_task: TaskUpdate,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    task_db = session.get(Task, task_id)
    if not task_db:
        raise HTTPException(status_code=404, detail="Task not found")
    task_data = updated_task.model_dump(exclude_unset=True)
    task_db.sqlmodel_update(task_data)
    session.add(task_db)
    session.commit()
    session.refresh(task_db)
    return task_db

@app.delete("/tasks/{task_id}")
async def delte_task(
    task_id: int,
    session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(get_current_user)],
):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    session.delete(task)
    session.commit()
    return {"ok": True}

@app.post("/register")
async def register(
    username: str,
    password: str,
    session: Annotated[Session, Depends(get_session)],
):
    user = User(
        username=username,
        hashed_password=hash_password(password),
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: Annotated[Session, Depends(get_session)],
):
    user = session.exec(
        select(User).where(User.username == form_data.username)
    ).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = create_access_token({"sub": user.username})
    return Token(access_token=access_token, token_type="bearer")