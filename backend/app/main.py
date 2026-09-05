from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database.init_db import create_database
from app.core.config import settings
from app.api.payments import router as payment_router
from fastapi.middleware.cors import CORSMiddleware
from app.api import dashboard
from app.auth.auth import router as auth_router




@asynccontextmanager
async def lifespan(app: FastAPI):
    create_database()
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(payment_router)
app.include_router(dashboard.router)
app.include_router(auth_router)

@app.get("/")
def root():
    print("ROOT ENDPOINT HIT")
    return {
        "project": settings.PROJECT_NAME,
        "status": "Backend Running 🚀",
    }