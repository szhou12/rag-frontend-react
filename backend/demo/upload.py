import uuid
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, Security

from sqlalchemy.orm import Session
from .temp import get_current_user_with_scopes
from .temp import (
    User,
    Upload, 
    UploadCreate, 
    UploadPublic, 
    CurrentUser,
    SessionDep,
)

router = APIRouter()

@router.post("/", response_model=UploadPublic)
def create_upload(
    *, 
    session: SessionDep, 
    current_user: User = Security(get_current_user_with_scopes, scopes=["dashboard"]), 
    upload_in: UploadCreate
) -> Any:
    """
    Create new item.
    """
    # item = Item.model_validate(upload_in, update={"owner_id": current_user.id})
    upload = Upload(
        filename=upload_in.filename,
        author=current_user.username,
        language=upload_in.language,
    )
    session.add(upload)
    session.commit()
    session.refresh(upload)
    return upload
