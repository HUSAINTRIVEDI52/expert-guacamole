import uuid
from datetime import datetime
from typing import Any, List, Optional

from pydantic import BaseModel, EmailStr, Field

# --- Lead Search (Legacy/External API) ---


class LeadSearchRequest(BaseModel):
    """Request body for POST /api/lead-search."""

    networth_min: Optional[float] = Field(None, description="Minimum estimated wealth")
    networth_max: Optional[float] = Field(None, description="Maximum estimated wealth")
    age_min: Optional[int] = Field(None, ge=0, le=120, description="Minimum age")
    age_max: Optional[int] = Field(None, ge=0, le=120, description="Maximum age")
    recently_moved: Optional[bool] = Field(
        False, description="Filter to people/families who recently moved"
    )
    zip_codes: List[str] = Field(
        default_factory=list, description="Filter by zip codes"
    )
    county_fips_codes: List[str] = Field(
        default_factory=list, description="Filter by county FIPS codes"
    )
    suppress_person_ids: List[str] = Field(
        default_factory=list, description="Exclude these person_id from results"
    )
    limit: int = Field(default=10, ge=1, le=400, description="Max results")
    offset: int = Field(default=0, ge=0, le=4000, description="Pagination offset")


class LeadSearchResponse(BaseModel):
    """Response for POST /api/lead-search."""

    count: int
    documents: List[dict[str, Any]]


# --- Internal Database Schemas ---


class UserBase(BaseModel):
    email: EmailStr


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: uuid.UUID
    is_active: bool
    role: str
    created_at: datetime
    updated_at: datetime
    last_login_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SearchRequestBase(BaseModel):
    filter_hash: str
    normalized_filters: dict
    geography: dict
    estimated_count: Optional[int] = None
    estimated_price: Optional[float] = None


class SearchRequest(SearchRequestBase):
    id: uuid.UUID
    user_id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True


class PurchaseBase(BaseModel):
    lead_count: int
    price_per_lead: float
    total_amount: float
    currency: str = "USD"
    status: str


class Purchase(PurchaseBase):
    id: uuid.UUID
    user_id: uuid.UUID
    search_request_id: Optional[uuid.UUID] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FAQEntryBase(BaseModel):
    question: str
    answer: str
    keywords: List[str] = []
    is_active: bool = True


class FAQEntry(FAQEntryBase):
    id: uuid.UUID
    created_at: datetime

    class Config:
        from_attributes = True
