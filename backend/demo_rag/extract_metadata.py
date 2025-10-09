from datetime import datetime
from typing import Optional, List
from sqlmodel import SQLModel, Field, Session, select, create_engine, update

# from .config import settings
from app.core.config import settings

class Upload(SQLModel, table=True):
    id: str = Field(primary_key=True)
    filename: str
    author: str
    language: str
    date_added: datetime = Field(default_factory=lambda: datetime.now())
    size: int  # in bytes
    file_type: str
    source_filename: str
    pages: int
    status: int
    s3_key: str

# Step 1: Get metadata from MySQL

def get_file_metadata(language: str):
    """Extract file metadata from database"""
    engine = create_engine(
        settings.mysql_uri,
        pool_size=5,
        max_overflow=0,
        pool_pre_ping=True,
        pool_recycle=1800,
    )

    with Session(engine) as session:
        statement = select(Upload).where(Upload.status == 0).where(Upload.language == language)
        uploads = session.exec(statement)

        file_metadata = [{
            "id": u.id,
            "filename": u.filename,
            "author": u.author,
            "language": u.language,
            "date_added": u.date_added.isoformat(),
            "size": round(u.size / 1024, 2), # in KB
            "file_type": u.file_type,
            "source_filename": u.source_filename,
            "pages": u.pages,
            "status": u.status,
            "s3_key": u.s3_key,
        } for u in uploads]
    
    print(f"Found {len(file_metadata)} files to process")
    return file_metadata


def increment_status_by_ids(ids: List[str]):
    engine = create_engine(
        settings.mysql_uri,
        pool_size=5,
        max_overflow=0,
        pool_pre_ping=True,
        pool_recycle=1800,
    )
    with Session(engine) as session:
        # Use SQL expression to increment current value by 1
        session.exec(
            update(Upload)
            .where(Upload.id.in_(ids))
            .values(status=Upload.status + 1)
        )
        session.commit()
        print(f"Incremented status of {len(ids)} files by 1")

def check_status(language: str):
    engine = create_engine(
        settings.mysql_uri,
        pool_size=5,
        max_overflow=0,
        pool_pre_ping=True,
        pool_recycle=1800,
    )

    with Session(engine) as session:
        statement = select(Upload).where(Upload.language == language)
        uploads = session.exec(statement)
        return [{
            "id": u.id,
            "filename": u.filename,
            "author": u.author,
            "status": u.status,
        } for u in uploads]
