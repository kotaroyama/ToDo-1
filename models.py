from sqlmodel import SQLModel, Field


class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(max_length=100, index=True)
    description: str | None = None
    completed: bool = Field(default=False)