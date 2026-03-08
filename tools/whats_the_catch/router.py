"""FastAPI router for What's the Catch endpoints."""
from fastapi import APIRouter, HTTPException

from tools.whats_the_catch.models import CatchRequest, CatchResponse
from tools.whats_the_catch.service import get_catches

router = APIRouter(prefix="/catch", tags=["What's the Catch"])


@router.post("/analyze", response_model=CatchResponse)
async def analyze_claim(payload: CatchRequest) -> CatchResponse:
    if not payload.claim.strip():
        raise HTTPException(status_code=400, detail="Claim cannot be empty.")
    return get_catches(payload)
