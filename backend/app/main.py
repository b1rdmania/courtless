"""Courtless — FastAPI backend entrypoint."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routers import demo, disputes
from .services.seed import seed_demos


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    seed_demos()
    yield


app = FastAPI(
    title="Courtless API",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(disputes.router)
app.include_router(demo.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "courtless"}
