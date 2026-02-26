"""SuppressionService: builds Filter DSL to exclude person_ids from search results."""

from typing import Any


def build_suppression_filter(suppress_person_ids: list[str]) -> dict[str, Any] | None:
    """
    Return a Filter DSL proposition that excludes documents whose person_id
    is in the list. Uses relation "in" with negated: true per Data Axle Filter DSL.
    """
    if not suppress_person_ids:
        return None
    return {
        "relation": "in",
        "attribute": "person_id",
        "value": suppress_person_ids,
        "negated": True,
    }
