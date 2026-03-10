import uuid

from sqlalchemy import (
    ARRAY,
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    email_verified = Column(Boolean, default=False)
    role = Column(String(50), default="buyer")
    is_active = Column(Boolean, default=True)
    provider = Column(String(20), default="local")
    google_sub = Column(String(255), unique=True, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )
    last_login_at = Column(DateTime)
    reset_password_token = Column(String(255), unique=True, nullable=True)
    reset_password_expires_at = Column(DateTime, nullable=True)

    sessions = relationship(
        "UserSession", back_populates="user", cascade="all, delete-orphan"
    )
    search_requests = relationship(
        "SearchRequest", back_populates="user", cascade="all, delete-orphan"
    )
    purchases = relationship(
        "Purchase", back_populates="user", cascade="all, delete-orphan"
    )
    purchased_leads = relationship(
        "PurchasedLead", back_populates="user", cascade="all, delete-orphan"
    )
    support_tickets = relationship("SupportTicket", back_populates="user")
    api_usage_logs = relationship("APIUsageLog", back_populates="user")


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    refresh_token_hash = Column(Text, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    user = relationship("User", back_populates="sessions")


class County(Base):
    __tablename__ = "counties"

    county_code = Column(String(50), primary_key=True)
    name = Column(String(255), nullable=False)
    state_code = Column(String(10))
    geojson = Column(JSONB)
    created_at = Column(DateTime, server_default=func.now())

    zip_codes = relationship("ZipCode", back_populates="county")
    clusters = relationship("CountyClusterMember", back_populates="county")


class ZipCode(Base):
    __tablename__ = "zip_codes"

    zip_code = Column(String(10), primary_key=True)
    state_code = Column(String(10))
    county_code = Column(String(50), ForeignKey("counties.county_code"))
    latitude = Column(Numeric)
    longitude = Column(Numeric)
    geojson = Column(JSONB)
    created_at = Column(DateTime, server_default=func.now())

    county = relationship("County", back_populates="zip_codes")


class CountyCluster(Base):
    __tablename__ = "county_clusters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime, server_default=func.now())

    members = relationship(
        "CountyClusterMember",
        back_populates="cluster",
        cascade="all, delete-orphan",
    )


class CountyClusterMember(Base):
    __tablename__ = "county_cluster_members"

    cluster_id = Column(
        UUID(as_uuid=True),
        ForeignKey("county_clusters.id", ondelete="CASCADE"),
        primary_key=True,
    )
    county_code = Column(
        String(50), ForeignKey("counties.county_code"), primary_key=True
    )

    cluster = relationship("CountyCluster", back_populates="members")
    county = relationship("County", back_populates="clusters")


class SearchRequest(Base):
    __tablename__ = "search_requests"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    filter_hash = Column(Text, nullable=False)
    normalized_filters = Column(JSONB, nullable=False)
    geography = Column(JSONB, nullable=False)
    estimated_count = Column(Integer)
    estimated_price = Column(Numeric(12, 2))
    cache_hit = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    user = relationship("User", back_populates="search_requests")
    purchases = relationship("Purchase", back_populates="search_request")


class Purchase(Base):
    __tablename__ = "purchases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    search_request_id = Column(UUID(as_uuid=True), ForeignKey("search_requests.id"))

    stripe_session_id = Column(String(255), unique=True)
    stripe_payment_intent_id = Column(String(255), unique=True)
    stripe_charge_id = Column(String(255))
    stripe_customer_id = Column(String(255))

    status = Column(String(50), nullable=False)
    lead_count = Column(Integer, nullable=False)
    price_per_lead = Column(Numeric(10, 4))
    one_time_fee = Column(Numeric(10, 2), default=0)
    total_amount = Column(Numeric(12, 2), nullable=False)
    amount_received = Column(Numeric(12, 2))
    refund_amount = Column(Numeric(12, 2), default=0)
    currency = Column(String(10), default="USD")
    suppression_applied = Column(Boolean, default=True)
    snapshot_locked = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    paid_at = Column(DateTime)
    updated_at = Column(
        DateTime, nullable=False, server_default=func.now(), onupdate=func.now()
    )

    user = relationship("User", back_populates="purchases")
    search_request = relationship("SearchRequest", back_populates="purchases")
    leads = relationship(
        "PurchasedLead", back_populates="purchase", cascade="all, delete-orphan"
    )
    files = relationship(
        "PurchaseFile", back_populates="purchase", cascade="all, delete-orphan"
    )


class PurchasedLead(Base):
    __tablename__ = "purchased_leads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    purchase_id = Column(
        UUID(as_uuid=True),
        ForeignKey("purchases.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    external_lead_id = Column(String(255), nullable=False)
    fallback_hash = Column(String(255))
    snapshot_data = Column(JSONB, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    purchase = relationship("Purchase", back_populates="leads")
    user = relationship("User", back_populates="purchased_leads")


class PurchaseFile(Base):
    __tablename__ = "purchase_files"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    purchase_id = Column(
        UUID(as_uuid=True),
        ForeignKey("purchases.id", ondelete="CASCADE"),
        nullable=False,
    )
    storage_provider = Column(String(20), nullable=False)
    file_path = Column(Text, nullable=False)
    file_size_bytes = Column(Integer)
    checksum = Column(String(255))
    signed_url_expires_at = Column(DateTime)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    purchase = relationship("Purchase", back_populates="files")


class StripeWebhookEvent(Base):
    __tablename__ = "stripe_webhook_events"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    stripe_event_id = Column(String(255), unique=True, nullable=False)
    event_type = Column(String(100))
    payload = Column(JSONB)
    processed = Column(Boolean, default=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    processed_at = Column(DateTime)


class PricingConfig(Base):
    __tablename__ = "pricing_config"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    profession = Column(String(100))
    net_worth_bucket = Column(String(100))
    age_bucket = Column(String(100))
    recently_moved = Column(Boolean)
    base_price_per_lead = Column(Numeric(10, 4), nullable=False)
    effective_from = Column(Date, nullable=False)
    effective_to = Column(Date)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class FAQEntry(Base):
    __tablename__ = "faq_entries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    keywords = Column(ARRAY(Text))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    question = Column(Text, nullable=False)
    matched_faq = Column(Boolean, default=False)
    escalated = Column(Boolean, default=False)
    status = Column(String(50), default="open")
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    resolved_at = Column(DateTime)

    user = relationship("User", back_populates="support_tickets")


class APIUsageLog(Base):
    __tablename__ = "api_usage_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    endpoint = Column(String(255))
    filter_hash = Column(Text)
    response_time_ms = Column(Integer)
    data_axle_cost_estimate = Column(Numeric(10, 4))
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    user = relationship("User", back_populates="api_usage_logs")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    entity_type = Column(String(100))
    entity_id = Column(UUID(as_uuid=True))
    action = Column(String(100))
    performed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    old_value = Column(JSONB)
    new_value = Column(JSONB)
    created_at = Column(DateTime, nullable=False, server_default=func.now())


class EmailVerification(Base):
    __tablename__ = "email_verifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    code = Column(String(6), nullable=True)
    token = Column(String(255), nullable=True, unique=True)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())

    user = relationship("User")
