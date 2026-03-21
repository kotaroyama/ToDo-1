from sqlmodel import Field, SQLModel


class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(max_length=100, index=True)
    description: str | None = None
    completed: bool = Field(default=False)
    owner_id: int = Field(foreign_key="users.id")


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int | None = Field(default=None, primary_key=True)
    username: str = Field(max_length=100, index=True)
    hashed_password: str