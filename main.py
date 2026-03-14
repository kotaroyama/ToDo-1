from typing import Annotated

from fastapi import FastAPI, HTTPException, Depends
from sqlmodel import Session, select

from database import create_db_and_tables, get_session
from models import Task
from schemas import TaskUpdate

app = FastAPI()
@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.post("/tasks")
async def create_task(
    task: Task, 
    session: Annotated[Session, Depends(get_session)],
):
    db_task = Task.model_validate(task)
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task

@app.get("/tasks")
async def get_tasks(
    session: Annotated[Session, Depends(get_session)],
) -> list[Task]:
    tasks = session.exec(select(Task)).all()
    return tasks

@app.get("/tasks/{task_id}")
async def get_task(
    task_id: int,
    session: Annotated[Session, Depends(get_session)],
) -> Task:
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@app.patch("/tasks/{task_id}")
async def update_task(
    task_id: int, 
    updated_task: TaskUpdate,
    session: Annotated[Session, Depends(get_session)],
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
):
    task = session.get(Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    session.delete(task)
    session.commit()
    return {"ok": True}