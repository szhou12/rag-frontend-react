from sqlmodel import Session

from app.models.upload import Upload
from app.schemas.upload import UploadCreate, UploadUpdate

def create_upload(*, session: Session, upload_create: UploadCreate) -> Upload:
    """
    Create a new upload in the database.

    Args:
        session: Database session
        upload_create: Pydantic schema
    """
    db_upload = Upload.model_validate(upload_create)
    session.add(db_upload)
    session.commit()
    session.refresh(db_upload)
    return db_upload



