import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from demo import auth
from demo import user
from demo import upload
from demo import rag_response  # Temporarily disabled - requires additional .env vars
from app.api.main import api_router
from app.core.config import settings
from app.core.db import create_db_and_tables

app = FastAPI(debug=True)

origins = [
    "http://localhost:5173", # allow frontend URL
    # Add more origins here
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router) # Adds all user-related endpoints (e.g., /users/me, /users/{id})
app.include_router(auth.router, prefix="/auth") # Adds all auth endpoints under /auth prefix. e.g. /login will be accessible at /auth/login
app.include_router(upload.router, prefix="/demo/uploads") # Adds all upload endpoints under /uploads prefix. e.g. /uploads will be accessible at /uploads
app.include_router(rag_response.router, prefix="/rag") # Temporarily disabled - requires additional .env vars

# Create database tables on startup
create_db_and_tables()

# Create admin user if it doesn't exist
from sqlmodel import Session
from app.core.db import engine, init_db

with Session(engine) as session:
    init_db(session)

# Formal API endpoints
#   /api/v1/users/me
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8000)
    uvicorn.run("main:app", host="0.0.0.0", port=8001, log_level="debug", reload=True)