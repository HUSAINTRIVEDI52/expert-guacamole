from typing import Any, List, Optional

from pydantic import BaseModel, Field


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


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class Task(TaskBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    email: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: int
    is_active: bool
    tasks: List[Task] = []

    class Config:
        from_attributes = True
