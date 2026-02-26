"""DataAxleService: calls Data Axle People Search API."""

import os
from typing import Any

import httpx

DATA_AXLE_SEARCH_URL = "https://api.data-axle.com/v1/people/search"
DEFAULT_PACKAGES = ["core_v1"]


def search(
    *,
    filter_dsl: dict[str, Any] | None = None,
    limit: int = 3,
    offset: int = 0,
    packages: list[str] | None = None,
) -> dict[str, Any]:
    """
    Call Data Axle People Search API via POST.
    Returns {"count": int, "documents": list}. Raises on auth missing or API error.
    """
    auth_token = os.getenv("DATA_AXLE_AUTH_TOKEN")
    if not auth_token:
        raise ValueError("DATA_AXLE_AUTH_TOKEN is not set")

    body: dict[str, Any] = {
        "packages": packages or DEFAULT_PACKAGES,
        "include_labels": True,
        "limit": 3,
        "offset": 3,
    }
    if filter_dsl:
        body["filter"] = filter_dsl

    with httpx.Client(timeout=30.0) as client:
        response = client.post(
            DATA_AXLE_SEARCH_URL,
            headers={
                "X-AUTH-TOKEN": auth_token,
                "Content-Type": "application/json",
            },
            json=body,
        )

    if response.status_code >= 400:
        detail: Any = response.text
        try:
            detail = response.json()
        except Exception:
            pass
        raise httpx.HTTPStatusError(
            f"Data Axle API error: {response.status_code} - {detail}",
            request=response.request,
            response=response,
        )

    return response.json()
