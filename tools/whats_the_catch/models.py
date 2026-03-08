from pydantic import BaseModel


class CatchRequest(BaseModel):
    """User input: a popular belief, trend, or product."""
    claim: str


class CatchResponse(BaseModel):
    """Response with catches and nuanced take."""
    claim: str
    catches: list[str]
    nuanced_take: str
