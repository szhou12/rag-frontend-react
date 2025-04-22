import uuid
from typing import Any

from fastapi import APIRouter, HTTPException
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models import (
    Upload, 
    UploadCreate, 
    UploadUpdate, 
    UploadPublic, 
    UploadsPublic,
)


# prefix: if you defined a route @router.get("/"), the full path becomes /uploader/
# 	Adds a label in the OpenAPI docs to group these endpoints under a section called "uploader" — helps keep your API documentation clean and organized.
router = APIRouter(
    prefix="/uploader",
    tags=["uploader"],
)

@router.get("/", response_model=UploadsPublic)
def read_uploads(
    session: SessionDep,
    current_user: CurrentUser,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve uploads.
    """
    pass
    
