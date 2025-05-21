"""
"""

from fastapi import APIRouter
from app.api.endpoints import payment

api_router = APIRouter()

api_router.include_router(payment.router, prefix="/payment", tags=["payment"])
