import os
import uuid
from typing import Any
from pathlib import Path
import aiofiles

from fastapi import APIRouter, HTTPException, UploadFile
from sqlmodel import func, select

from app.api.deps import CurrentUser, SessionDep
from app.models.upload import Upload
from app.schemas.upload import (
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
    skip: int = 0, # start index
    limit: int = 100, # length of uploads to include
) -> Any:
    """
    Retrieve uploads from [skip : skip + limit - 1]
    """
    count_statement = select(func.count()).select_from(Upload)
    count = session.exec(count_statement).one()
    statement = select(Upload).offset(skip).limit(limit)
    uploads = session.exec(statement).all()

    return UploadsPublic(data=uploads, count=count)
    

@router.get("/{id}", response_model=UploadPublic)
def read_upload(
    session: SessionDep,
    current_user: CurrentUser,
    id: uuid.UUID,
) -> Any:
    """
    Get upload by ID
    """
    upload = session.get(Upload, id)
    if not upload:
        raise HTTPException(status_code=404, detail="Uploaded File Not Found")
    
    return upload




# TODO: create_upload()
'''
# Sample workflow for uploading a document
@router.post("/documents/upload", response_model=DocumentOut)
async def upload_document(
    upload_in: UploadCreate, # UploadCreate includes File?
    session: Session = Depends(get_db)
):
    # 1. Save file to disk/cloud
    file_path = save_file(file)
    
    # 2. Write metadata to MySQL
    doc = Document(filename=filename, author=author, language=language, file_path=file_path)
    doc = Upload.model_validate(upload_in, update={"filepath": file_path})
    session.add(doc)
    session.commit()
    session.refresh(doc)

    # 3. Parse and embed using LangChain (ideally async/background)
    try:
        document_chunks = parse_file_with_langchain(file_path)
        vectors = embed_chunks(document_chunks)
        # Save vectors to vector DB, referencing doc.id
        store_vectors_in_vector_db(vectors, doc.id)
    except Exception as e:
        # Optionally delete doc/file on failure
        session.delete(doc)
        session.commit()
        raise HTTPException(status_code=500, detail="Failed to process document")

    # 4. Return success (include doc.id, etc.)
    return doc
'''


async def save_file(upload_file: UploadFile) -> str:
    """
    Efficiently save uploaded file to temp_uploads directory
    Returns: file path of saved file
    """
    
    # TODO: change to S3 when move to Cloud
    # Ensure temp_uploads directory exists
    # Go up: routes -> api -> app -> backend -> project_root
    project_root = Path(__file__).parent.parent.parent.parent.parent
    # Create temp_unloads at project root
    temp_dir = project_root / "temp_unloads"
    temp_dir.mkdir(exist_ok=True)
    
    # Generate unique filename to prevent conflicts
    file_extension = Path(upload_file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = temp_dir / unique_filename

    try:
        async with aiofiles.open(file_path, "wb") as f:
            while chunk := await upload_file.read(8192): # 8KB chunks
                await f.write(chunk)
        
        return str(file_path)
    
    except Exception as e:
        # Cleanup on error
        if file_path.exists():
            os.unlink(file_path)
        raise HTTPException(500, f"Failed to save file: {str(e)}")



@router.post("/", response_model=UploadPublic)
async def create_upload(
    *,
    session: SessionDep,
    current_user: CurrentUser,
    upload_in: UploadCreate,
) -> Any:
    """
    Add a new upload to DB

    When frontend sends a file (UploadCreate.file), 
    FastAPI automatically saves it to a temporary location. 
    Under the hood, FastAPI/Starlette stores (IO write) the upload in a temporary file on disk (often in /tmp or your OS temp directory) if the file is large, or keeps it in memory if small (< 1MB).
    The file remains a temporary file as an UploadFile object.
    After this API request is finished, FastAPI/Starlette will delete the temporary file.
    Thus, my job of step 1 is to save the file to a permanent place: local dir or S3.
    """
    # 1. Save file to disk/cloud
    file_path = await save_file(upload_in.file)

    # 2. Write metadata to MySQL
    upload = Upload.model_validate(upload_in.model_dump(exclude="file"), update={
        "filepath": file_path,
        "size": upload_in.file.size,
    })
    session.add(upload)
    session.commit()
    session.refresh(upload)

    # TODO
    # 3. Parse and embed using LangChain (ideally async/background)
    # try:
    #     document_chunks = parse_file_with_langchain(file_path)
    #     vectors = embed_chunks(document_chunks)
    #     # Save vectors to vector DB, referencing doc.id
    #     store_vectors_in_vector_db(vectors, upload.id)
    # except Exception as e:
    #     # Optionally delete doc/file on failure
    #     session.delete(upload)
    #     session.commit()
    #     raise HTTPException(status_code=500, detail="Failed to process document")


    return upload


    


# TODO: update_upload()
# TODO: delete_upload()
