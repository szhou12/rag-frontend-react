import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from demo import auth
from demo import user

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

if __name__ == "__main__":
    # uvicorn.run(app, host="0.0.0.0", port=8000)
    uvicorn.run("main:app", host="0.0.0.0", port=8001, log_level="debug", reload=True)