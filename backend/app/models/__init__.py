from sqlmodel import SQLModel

# Import all model files so they register with metadata
from .user import User
from .upload import Upload

__all__ = ["SQLModel", "User", "Upload"]
