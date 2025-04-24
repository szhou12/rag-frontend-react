from sqlmodel import SQLModel

## Common Pydantic schemas used in multiple places

# Generic message
class Message(SQLModel):
    message: str