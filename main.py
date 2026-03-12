"""
What's the Catch — standalone entry point.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from tools.whats_the_catch.router import router as catch_router

app = FastAPI(title="What's the Catch", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(catch_router, prefix="/api")
app.mount("/", StaticFiles(directory="frontend/out", html=True), name="frontend")
