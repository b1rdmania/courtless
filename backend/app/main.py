"""Courtless — FastAPI backend entrypoint."""

from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from .config import CORS_ORIGINS
from .database import init_db
from .limiter import limiter
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

# Rate limiting — slowapi reads `request.app.state.limiter` from each request.
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)


@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please try again in a minute."},
    )


app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["X-Owner-Token"],
)

app.include_router(disputes.router)
app.include_router(demo.router)


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "courtless"}
