from sqlmodel import SQLModel


class TaskUpdate(SQLModel):
    title: str | None = None
    description: str | None = None