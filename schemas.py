from pydantic import BaseModel
from sqlmodel import SQLModel


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class TaskCreate(BaseModel):
    title: str
    description: str | None = None
    completed: bool | None = False

class TaskRead(BaseModel):
    id: int
    title: str
    description: str
    completed: bool


class TaskUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None