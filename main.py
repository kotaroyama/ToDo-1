from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel


class Task(BaseModel):
    title: str
    description: str | None = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


app = FastAPI()

tasks = [
    {"title": "Hello world", "description": ""},
    {"title": "Second task", "description": "some random shit"},
]

@app.post("/tasks")
async def create_task(task: Task):
    tasks.append(
        {"title": task.title, "description": task.description}
    )
    return tasks

@app.get("/tasks")
async def get_tasks():
    return tasks

@app.get("/tasks/{task_id}")
async def get_task(task_id: int):
    if not tasks[task_id]:
        raise HTTPException(status_code=404, detail="Task not found")
    return tasks[task_id]

@app.put("/tasks/{task_id}")
async def update_task(new_task: Task, task_id: int):
    if not tasks[task_id]:
        raise HTTPException(status_code=404, detail="Task not found")
    updated_task = jsonable_encoder(new_task)
    tasks[task_id] = updated_task
    return tasks[task_id]

@app.patch("/tasks/{task_id}")
async def update_task(task_id: int, new_task: TaskUpdate):
    if not tasks[task_id]:
        raise HTTPException(status_code=404, detail="Task not found")
    stored_task = tasks[task_id]
    update_data = new_task.model_dump(exclude_unset=True)
    stored_task.update(update_data)
    return stored_task

@app.delete("/tasks/{task_id}")
async def delte_task(task_id: int):
    if not tasks[task_id]:
        raise HTTPException(status_code=404, detail="Task not found")
    del tasks[task_id]
    return tasks