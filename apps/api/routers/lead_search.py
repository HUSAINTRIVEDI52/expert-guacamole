"""Lead Search router: POST /api/lead-search with Data Axle filters and suppression."""

from datetime import datetime, timedelta
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from auth.dependencies import get_current_user
from database import get_db
from models import User
from schemas import LeadSearchRequest, LeadSearchResponse
from services.data_axle_service import search as data_axle_search
from services.suppression import build_suppression_filter

router = APIRouter()


def _build_filter_dsl(req: LeadSearchRequest) -> dict[str, Any] | None:
    """Build Data Axle Filter DSL from request. Returns None if no criteria."""
    propositions: list[dict[str, Any]] = []

    if req.networth_min is not None and req.networth_max is not None:
        propositions.append(
            {
                "relation": "range",
                "attribute": "family.estimated_wealth",
                "value": {
                    "start": req.networth_min,
                    "end": req.networth_max,
                    "relation": "intersects",
                },
            }
        )

    if req.age_min is not None and req.age_max is not None:
        propositions.append(
            {
                "relation": "between",
                "attribute": "age",
                "value": [req.age_min, req.age_max],
            }
        )

    if req.recently_moved:
        since = (datetime.utcnow() - timedelta(days=365)).date()
        propositions.append(
            {
                "relation": "greater_than",
                "attribute": "family.appeared_on",
                "value": since.isoformat(),
            }
        )

    zip_list = [z.strip() for z in req.zip_codes if z and z.strip()]
    if zip_list:
        propositions.append({"relation": "in", "attribute": "zip", "value": zip_list})

    county_list = [c.strip() for c in req.county_fips_codes if c and c.strip()]
    if county_list:
        propositions.append(
            {"relation": "in", "attribute": "fips_code", "value": county_list}
        )

    suppression = build_suppression_filter(req.suppress_person_ids)
    if suppression:
        propositions.append(suppression)

    if not propositions:
        return None
    return {"connective": "and", "propositions": propositions}


@router.post("/lead-search", response_model=LeadSearchResponse)
def lead_search(
    req: LeadSearchRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> LeadSearchResponse:
    """
    Search Data Axle People with filters: net worth range, age range,
    recently moved, zip codes, county (FIPS). Optionally exclude person_ids.
    """
    try:
        filter_dsl = _build_filter_dsl(req)
        result = data_axle_search(
            filter_dsl=filter_dsl,
            limit=req.limit,
            offset=req.offset,
        )
        return LeadSearchResponse(count=result["count"], documents=result["documents"])
    except ValueError as e:
        if "DATA_AXLE_AUTH_TOKEN" in str(e):
            raise HTTPException(status_code=503, detail=str(e)) from e
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        status = 502
        detail = str(e)
        resp = getattr(e, "response", None)
        if resp is not None:
            status = resp.status_code
            try:
                detail = resp.json()
            except Exception:
                detail = resp.text
        raise HTTPException(status_code=status, detail=detail) from e
