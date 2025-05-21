"""
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psycopg
import os
from dotenv import load_dotenv

from app.api.api import api_router

load_dotenv()

app = FastAPI(
    title="Payment Integration Tutorial",
    description="A tutorial API for integrating Stripe payments",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins - in production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

app.include_router(api_router, prefix="/api")

@app.get("/healthz")
async def healthz():
    """
    Health check endpoint to verify the API is running.
    Returns a simple JSON response with status "ok".
    """
    return {"status": "ok"}
