from fastapi import APIRouter

from app.api.routes import users, login, uploads
# from app.api.routes import rag  # Temporarily disabled - requires additional .env vars

api_router = APIRouter()

api_router.include_router(users.router)
api_router.include_router(login.router)
api_router.include_router(uploads.router)
# api_router.include_router(rag.router)  # Temporarily disabled - requires additional .env vars