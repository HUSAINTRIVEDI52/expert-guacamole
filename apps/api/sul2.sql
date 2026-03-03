-- =====================================================
-- SUL LOCAL LEAD PURCHASE PLATFORM
-- COMPLETE POSTGRESQL SCHEMA
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS & AUTH
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    role VARCHAR(50) DEFAULT 'buyer',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMP
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);

-- =====================================================
-- ZIP CODES & COUNTIES (INTERNAL GEO MANAGEMENT)
-- =====================================================

CREATE TABLE counties (
    county_code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state_code VARCHAR(10),
    geojson JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE zip_codes (
    zip_code VARCHAR(10) PRIMARY KEY,
    state_code VARCHAR(10),
    county_code VARCHAR(50) REFERENCES counties(county_code),
    latitude NUMERIC,
    longitude NUMERIC,
    geojson JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE county_clusters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE county_cluster_members (
    cluster_id UUID REFERENCES county_clusters(id) ON DELETE CASCADE,
    county_code VARCHAR(50) REFERENCES counties(county_code),
    PRIMARY KEY (cluster_id, county_code)
);

-- =====================================================
-- SEARCH REQUESTS (PREVIEW METADATA)
-- =====================================================

CREATE TABLE search_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filter_hash TEXT NOT NULL,
    normalized_filters JSONB NOT NULL,
    geography JSONB NOT NULL,
    estimated_count INTEGER,
    estimated_price NUMERIC(12,2),
    cache_hit BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_search_user_id ON search_requests(user_id);
CREATE INDEX idx_search_filter_hash ON search_requests(filter_hash);

-- =====================================================
-- PURCHASES (STRIPE ONE-TIME CHECKOUT)
-- =====================================================

CREATE TABLE purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    search_request_id UUID REFERENCES search_requests(id),

    -- Stripe Identifiers
    stripe_session_id VARCHAR(255) UNIQUE,
    stripe_payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),

    status VARCHAR(50) NOT NULL CHECK (
        status IN ('pending','paid','failed','refunded','canceled')
    ),

    lead_count INTEGER NOT NULL CHECK (lead_count >= 0),

    price_per_lead NUMERIC(10,4),
    one_time_fee NUMERIC(10,2) DEFAULT 0,

    total_amount NUMERIC(12,2) NOT NULL CHECK (total_amount >= 0),
    amount_received NUMERIC(12,2),
    refund_amount NUMERIC(12,2) DEFAULT 0,

    currency VARCHAR(10) DEFAULT 'USD',

    suppression_applied BOOLEAN DEFAULT TRUE,
    snapshot_locked BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_purchases_user ON purchases(user_id);
CREATE INDEX idx_purchases_status ON purchases(status);

-- =====================================================
-- PURCHASED LEADS (SUPPRESSION CORE)
-- =====================================================

CREATE TABLE purchased_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    external_lead_id VARCHAR(255) NOT NULL,
    fallback_hash VARCHAR(255),

    snapshot_data JSONB NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT unique_user_external UNIQUE (user_id, external_lead_id),
    CONSTRAINT unique_user_fallback UNIQUE (user_id, fallback_hash)
);

CREATE INDEX idx_suppression_purchase ON purchased_leads(purchase_id);

-- =====================================================
-- PURCHASE FILE STORAGE (S3 / GCS)
-- =====================================================

CREATE TABLE purchase_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
    storage_provider VARCHAR(20) NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT,
    checksum VARCHAR(255),
    signed_url_expires_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_purchase_files_purchase ON purchase_files(purchase_id);

-- =====================================================
-- STRIPE WEBHOOK EVENT LOG (IDEMPOTENCY)
-- =====================================================

CREATE TABLE stripe_webhook_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stripe_event_id VARCHAR(255) UNIQUE NOT NULL,
    event_type VARCHAR(100),
    payload JSONB,
    processed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMP
);

-- =====================================================
-- PRICING CONFIGURATION
-- =====================================================

CREATE TABLE pricing_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profession VARCHAR(100),
    net_worth_bucket VARCHAR(100),
    age_bucket VARCHAR(100),
    recently_moved BOOLEAN,
    base_price_per_lead NUMERIC(10,4) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pricing_active ON pricing_config(is_active);

-- =====================================================
-- FAQ & SUPPORT MODULE
-- =====================================================

CREATE TABLE faq_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    keywords TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    question TEXT NOT NULL,
    matched_faq BOOLEAN DEFAULT FALSE,
    escalated BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMP
);

CREATE INDEX idx_support_user ON support_tickets(user_id);

-- =====================================================
-- API USAGE & COST TRACKING
-- =====================================================

CREATE TABLE api_usage_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    endpoint VARCHAR(255),
    filter_hash TEXT,
    response_time_ms INTEGER,
    data_axle_cost_estimate NUMERIC(10,4),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_usage_user ON api_usage_logs(user_id);

-- =====================================================
-- AUDIT LOGS
-- =====================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100),
    entity_id UUID,
    action VARCHAR(100),
    performed_by UUID REFERENCES users(id),
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);

-- =====================================================
-- END OF SCHEMA
-- =====================================================

