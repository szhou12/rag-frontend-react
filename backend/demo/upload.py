import uuid
import os
import shutil
from typing import Any
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, Security, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel

from .temp import get_current_user_with_scopes
from .temp import (
    User,
    Upload, 
    UploadCreate,
    UploadPublic,
    UploadsPublic,
    CurrentUser,
    SessionDep,
)

def calculate_file_size(filepath: str) -> float:
    """Calculate file size in MB"""
    size_bytes = os.path.getsize(filepath)
    return round(size_bytes / (1024 * 1024), 2)  # Convert to MB

def calculate_pages(filepath: str) -> int:
    """Calculate number of pages in the file"""
    # This is a placeholder - implement based on your file type
    # For example, for PDFs:
    # import PyPDF2
    # with open(filepath, 'rb') as file:
    #     pdf = PyPDF2.PdfReader(file)
    #     return len(pdf.pages)
    return 10  # Placeholder



router = APIRouter()

@router.post("/", response_model=UploadPublic)
def create_upload(
    *, 
    session: SessionDep, # dep injected by FastAPI
    current_user: User = Security(get_current_user_with_scopes, scopes=["dashboard"]), # dep injected by FastAPI
    upload_in: UploadCreate # actual data sent from frontend
) -> Any:
    """
    Create new upload
    """

    # Calculate file metrics
    size_mb = calculate_file_size(upload_in.filepath)
    pages = calculate_pages(upload_in.filepath)

    # item = Item.model_validate(upload_in, update={"owner_id": current_user.id})
    upload = Upload(
        filename=upload_in.filename,
        author=upload_in.author,
        language=upload_in.language,
        filepath=upload_in.filepath,
        size_mb=size_mb,
        pages=pages
    )
    session.add(upload)
    session.commit()
    session.refresh(upload)
    return upload


# Configure temporary upload directory
UPLOAD_DIR = Path("temp_uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/temp")
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Security(get_current_user_with_scopes, scopes=["dashboard"])
) -> dict:
    """Handle file upload and store in temporary location"""
    # Create unique filename
    temp_filename = f"{uuid.uuid4()}_{file.filename}"
    filepath = UPLOAD_DIR / temp_filename

    # Save file
    with filepath.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"filepath": str(filepath)}

@router.get("/", response_model=UploadsPublic)
async def read_uploads(
    *, 
    session: SessionDep, 
    current_user: User = Security(get_current_user_with_scopes, scopes=["dashboard"]),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve all uploads
    """
    uploads = session.query(Upload).offset(skip).limit(limit).all()
    count = session.query(Upload).count()

    upload_list = [
        UploadPublic(
            filename=upload.filename,
            author=upload.author,
            language=upload.language,
            date=upload.date,
            filepath=upload.filepath,
            size_mb=upload.size_mb,
            pages=upload.pages
        ) for upload in uploads
    ]

    return UploadsPublic(data=upload_list, count=count)

@router.get("/{id}", response_model=UploadPublic)
async def read_upload(
    *,
    session: SessionDep,
    current_user: User = Security(get_current_user_with_scopes, scopes=["dashboard"]),
    id: uuid.UUID
) -> Any:
    
    upload = session.query(Upload).filter(Upload.id == id).first()
    if not upload:
        raise HTTPException(status_code=404, detail="Upload not found")
    return upload


