-- ============================================================================
-- CRAVCARDS DATABASE SCHEMA
-- Complete schema for card collection management platform
-- CR AudioViz AI, LLC
-- Created: December 18, 2025
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ============================================================================
-- SECTION A: USER & PROFILE TABLES
-- ============================================================================

-- User profiles with collector information
CREATE TABLE IF NOT EXISTS cv_user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,
    location VARCHAR(100),
    website VARCHAR(255),
    
    -- Collector stats
    collector_since DATE DEFAULT CURRENT_DATE,
    total_cards INTEGER DEFAULT 0,
    total_value DECIMAL(12, 2) DEFAULT 0,
    total_trades INTEGER DEFAULT 0,
    seller_rating DECIMAL(3, 2) DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    
    -- Social
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT TRUE,
    
    -- Preferences
    favorite_categories TEXT[] DEFAULT '{}',
    notification_preferences JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User follows (social connections)
CREATE TABLE IF NOT EXISTS cv_user_follows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(follower_id, following_id)
);

-- ============================================================================
-- SECTION B: CARD MASTER DATA
-- ============================================================================

-- Master card database (reference data)
CREATE TABLE IF NOT EXISTS cv_cards_master (
    card_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- pokemon, mtg, sports, yugioh, etc
    set_name VARCHAR(255),
    set_code VARCHAR(50),
    card_number VARCHAR(50),
    rarity VARCHAR(50),
    
    -- Card details
    description TEXT,
    artist VARCHAR(100),
    release_date DATE,
    
    -- Images
    image_url TEXT,
    image_url_hires TEXT,
    
    -- Pricing
    current_price DECIMAL(12, 2),
    price_updated_at TIMESTAMPTZ,
    market_price_low DECIMAL(12, 2),
    market_price_mid DECIMAL(12, 2),
    market_price_high DECIMAL(12, 2),
    
    -- Metadata
    tcgplayer_id VARCHAR(50),
    ebay_category_id VARCHAR(50),
    external_ids JSONB DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Price history for cards
CREATE TABLE IF NOT EXISTS cv_price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_id VARCHAR(100) REFERENCES cv_cards_master(card_id) ON DELETE CASCADE,
    price DECIMAL(12, 2) NOT NULL,
    condition VARCHAR(20) DEFAULT 'nm',
    source VARCHAR(50), -- tcgplayer, ebay, manual
    recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for price history queries
CREATE INDEX IF NOT EXISTS idx_price_history_card_date 
ON cv_price_history(card_id, recorded_at DESC);

-- ============================================================================
-- SECTION C: USER COLLECTION TABLES
-- ============================================================================

-- User's card collection
CREATE TABLE IF NOT EXISTS cv_user_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id VARCHAR(100) REFERENCES cv_cards_master(card_id),
    
    -- Card details (can override master)
    card_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    set_name VARCHAR(255),
    card_number VARCHAR(50),
    
    -- Condition & grading
    condition VARCHAR(20) DEFAULT 'nm',
    is_graded BOOLEAN DEFAULT FALSE,
    grade VARCHAR(10),
    grading_company VARCHAR(50),
    cert_number VARCHAR(50),
    
    -- Ownership
    quantity INTEGER DEFAULT 1,
    purchase_price DECIMAL(12, 2),
    purchase_date DATE,
    purchase_source VARCHAR(100),
    current_value DECIMAL(12, 2),
    
    -- Status
    for_trade BOOLEAN DEFAULT FALSE,
    for_sale BOOLEAN DEFAULT FALSE,
    asking_price DECIMAL(12, 2),
    
    -- Images
    image_url TEXT,
    custom_images TEXT[],
    
    -- Notes
    notes TEXT,
    tags TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for user cards
CREATE INDEX IF NOT EXISTS idx_user_cards_user ON cv_user_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cards_category ON cv_user_cards(category);
CREATE INDEX IF NOT EXISTS idx_user_cards_for_trade ON cv_user_cards(for_trade) WHERE for_trade = TRUE;

-- User wishlist
CREATE TABLE IF NOT EXISTS cv_wishlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id VARCHAR(100) REFERENCES cv_cards_master(card_id),
    card_name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    set_name VARCHAR(255),
    
    -- Preferences
    target_price DECIMAL(12, 2),
    max_price DECIMAL(12, 2),
    preferred_condition VARCHAR(20),
    priority INTEGER DEFAULT 5, -- 1-10 scale
    
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, card_id)
);

-- ============================================================================
-- SECTION D: PORTFOLIO & ANALYTICS
-- ============================================================================

-- Portfolio value history (daily snapshots)
CREATE TABLE IF NOT EXISTS cv_portfolio_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    
    total_value DECIMAL(12, 2) NOT NULL,
    total_invested DECIMAL(12, 2),
    card_count INTEGER,
    
    -- Breakdown by category
    value_by_category JSONB DEFAULT '{}',
    
    -- Change metrics
    daily_change DECIMAL(12, 2),
    daily_change_percent DECIMAL(8, 4),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, snapshot_date)
);

-- ============================================================================
-- SECTION E: SET COMPLETION TRACKING
-- ============================================================================

-- Available sets for tracking
CREATE TABLE IF NOT EXISTS cv_sets (
    set_id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    release_date DATE,
    total_cards INTEGER,
    card_list JSONB, -- List of all card IDs in set
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User's set completion progress
CREATE TABLE IF NOT EXISTS cv_set_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    set_id VARCHAR(100) REFERENCES cv_sets(set_id) ON DELETE CASCADE,
    
    owned_cards TEXT[] DEFAULT '{}',
    owned_count INTEGER DEFAULT 0,
    completion_percent DECIMAL(5, 2) DEFAULT 0,
    
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, set_id)
);

-- ============================================================================
-- SECTION F: NOTIFICATIONS & ALERTS
-- ============================================================================

-- Price alerts
CREATE TABLE IF NOT EXISTS cv_price_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id VARCHAR(100) REFERENCES cv_cards_master(card_id),
    card_name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    
    alert_type VARCHAR(20) NOT NULL, -- 'below', 'above', 'change_percent'
    target_value DECIMAL(12, 2) NOT NULL,
    current_price DECIMAL(12, 2),
    
    is_active BOOLEAN DEFAULT TRUE,
    notify_email BOOLEAN DEFAULT TRUE,
    notify_push BOOLEAN DEFAULT TRUE,
    notify_sms BOOLEAN DEFAULT FALSE,
    
    triggered_at TIMESTAMPTZ,
    trigger_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS cv_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- price_alert, trade_offer, wishlist_available, etc
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification settings
CREATE TABLE IF NOT EXISTS cv_notification_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email_enabled BOOLEAN DEFAULT TRUE,
    email_address VARCHAR(255),
    push_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    phone_number VARCHAR(20),
    
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    daily_digest BOOLEAN DEFAULT TRUE,
    instant_alerts BOOLEAN DEFAULT TRUE,
    alert_frequency VARCHAR(20) DEFAULT 'instant',
    
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION G: TRADING & MARKETPLACE
-- ============================================================================

-- Trade proposals
CREATE TABLE IF NOT EXISTS cv_trade_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    proposer_cards UUID[] DEFAULT '{}', -- Array of cv_user_cards IDs
    recipient_cards UUID[] DEFAULT '{}',
    cash_offer DECIMAL(12, 2) DEFAULT 0,
    
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, declined, countered, expired
    
    parent_proposal_id UUID REFERENCES cv_trade_proposals(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

-- Trade history log
CREATE TABLE IF NOT EXISTS cv_trade_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_id UUID REFERENCES cv_trade_proposals(id),
    proposer_id UUID REFERENCES auth.users(id),
    recipient_id UUID REFERENCES auth.users(id),
    
    cards_exchanged JSONB,
    total_value DECIMAL(12, 2),
    
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Featured listings (paid promotion)
CREATE TABLE IF NOT EXISTS cv_featured_listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    card_id VARCHAR(100),
    user_card_id UUID REFERENCES cv_user_cards(id),
    
    card_name VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    set_name VARCHAR(255),
    image_url TEXT,
    
    price DECIMAL(12, 2),
    condition VARCHAR(20),
    graded BOOLEAN DEFAULT FALSE,
    grade VARCHAR(10),
    description TEXT,
    
    feature_type VARCHAR(20) DEFAULT 'standard', -- standard, premium, spotlight
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Analytics
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    inquiries INTEGER DEFAULT 0,
    
    -- Seller info
    seller_name VARCHAR(100),
    seller_rating DECIMAL(3, 2),
    seller_sales INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    cancelled_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listing inquiries
CREATE TABLE IF NOT EXISTS cv_listing_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID REFERENCES cv_featured_listings(id) ON DELETE CASCADE,
    seller_id UUID REFERENCES auth.users(id),
    buyer_id UUID REFERENCES auth.users(id),
    message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION H: SHOWCASES
-- ============================================================================

-- Collection showcases
CREATE TABLE IF NOT EXISTS cv_showcases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    theme VARCHAR(50) DEFAULT 'default',
    is_public BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    card_ids UUID[] DEFAULT '{}', -- Array of cv_user_cards IDs
    layout_config JSONB DEFAULT '{}',
    
    -- Stats
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Showcase likes
CREATE TABLE IF NOT EXISTS cv_showcase_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    showcase_id UUID REFERENCES cv_showcases(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(showcase_id, user_id)
);

-- ============================================================================
-- SECTION I: SUBSCRIPTIONS & MONETIZATION
-- ============================================================================

-- User subscriptions
CREATE TABLE IF NOT EXISTS cv_subscriptions (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tier VARCHAR(20) DEFAULT 'free', -- free, collector, pro, enterprise
    status VARCHAR(20) DEFAULT 'active', -- active, cancelled, past_due, trialing
    
    stripe_subscription_id VARCHAR(100),
    stripe_customer_id VARCHAR(100),
    
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Usage tracking
CREATE TABLE IF NOT EXISTS cv_usage_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    feature VARCHAR(50) NOT NULL,
    amount INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promo codes
CREATE TABLE IF NOT EXISTS cv_promo_codes (
    code VARCHAR(50) PRIMARY KEY,
    discount_percent INTEGER NOT NULL,
    valid_from TIMESTAMPTZ DEFAULT NOW(),
    valid_until TIMESTAMPTZ,
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Promo code usage
CREATE TABLE IF NOT EXISTS cv_promo_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    promo_code VARCHAR(50) REFERENCES cv_promo_codes(code),
    discount_percent INTEGER,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, promo_code)
);

-- ============================================================================
-- SECTION J: AFFILIATE TRACKING
-- ============================================================================

-- Affiliate clicks
CREATE TABLE IF NOT EXISTS cv_affiliate_clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    card_id VARCHAR(100),
    marketplace VARCHAR(50),
    ip_hash VARCHAR(64),
    clicked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate conversions
CREATE TABLE IF NOT EXISTS cv_affiliate_conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(100),
    marketplace VARCHAR(50),
    user_id UUID REFERENCES auth.users(id),
    card_id VARCHAR(100),
    order_amount DECIMAL(12, 2),
    commission_amount DECIMAL(12, 2),
    status VARCHAR(20) DEFAULT 'pending',
    converted_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SECTION K: BULK IMPORT
-- ============================================================================

-- Import jobs
CREATE TABLE IF NOT EXISTS cv_import_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source VARCHAR(50) NOT NULL, -- csv, tcgplayer, ebay, etc
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, failed
    
    file_name VARCHAR(255),
    total_rows INTEGER DEFAULT 0,
    processed_rows INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    
    errors JSONB DEFAULT '[]',
    
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_cv_user_profiles_updated_at
    BEFORE UPDATE ON cv_user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cv_user_cards_updated_at
    BEFORE UPDATE ON cv_user_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cv_cards_master_updated_at
    BEFORE UPDATE ON cv_cards_master
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment listing views
CREATE OR REPLACE FUNCTION increment_listing_views(listing_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE cv_featured_listings SET views = views + 1 WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment listing clicks
CREATE OR REPLACE FUNCTION increment_listing_clicks(listing_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE cv_featured_listings SET clicks = clicks + 1 WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql;

-- Function to increment listing inquiries
CREATE OR REPLACE FUNCTION increment_listing_inquiries(listing_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE cv_featured_listings SET inquiries = inquiries + 1 WHERE id = listing_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE cv_user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_user_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_subscriptions ENABLE ROW LEVEL SECURITY;

-- User profiles: public read, own write
CREATE POLICY "Public profiles are viewable by everyone"
    ON cv_user_profiles FOR SELECT
    USING (is_public = true);

CREATE POLICY "Users can update own profile"
    ON cv_user_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- User cards: own read/write, public if for_trade/for_sale
CREATE POLICY "Users can view own cards"
    ON cv_user_cards FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view cards for trade/sale"
    ON cv_user_cards FOR SELECT
    USING (for_trade = true OR for_sale = true);

CREATE POLICY "Users can manage own cards"
    ON cv_user_cards FOR ALL
    USING (auth.uid() = user_id);

-- Wishlist: own only
CREATE POLICY "Users can manage own wishlist"
    ON cv_wishlist FOR ALL
    USING (auth.uid() = user_id);

-- Price alerts: own only
CREATE POLICY "Users can manage own alerts"
    ON cv_price_alerts FOR ALL
    USING (auth.uid() = user_id);

-- Notifications: own only
CREATE POLICY "Users can view own notifications"
    ON cv_notifications FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================================================

-- Insert sample sets
INSERT INTO cv_sets (set_id, name, category, release_date, total_cards) VALUES
    ('pokemon-champions-path', 'Champions Path', 'pokemon', '2020-09-25', 80),
    ('pokemon-evolving-skies', 'Evolving Skies', 'pokemon', '2021-08-27', 237),
    ('pokemon-vivid-voltage', 'Vivid Voltage', 'pokemon', '2020-11-13', 203),
    ('mtg-modern-horizons-2', 'Modern Horizons 2', 'mtg', '2021-06-18', 303),
    ('mtg-innistrad', 'Innistrad', 'mtg', '2011-09-30', 264)
ON CONFLICT (set_id) DO NOTHING;

-- Insert sample promo codes
INSERT INTO cv_promo_codes (code, discount_percent, valid_until) VALUES
    ('WELCOME20', 20, NOW() + INTERVAL '1 year'),
    ('COLLECTOR10', 10, NOW() + INTERVAL '6 months')
ON CONFLICT (code) DO NOTHING;

COMMENT ON TABLE cv_user_profiles IS 'User profile information and collector statistics';
COMMENT ON TABLE cv_cards_master IS 'Master card database with reference pricing';
COMMENT ON TABLE cv_user_cards IS 'User card collections';
COMMENT ON TABLE cv_price_history IS 'Historical price data for cards';
COMMENT ON TABLE cv_featured_listings IS 'Paid promotional listings';
COMMENT ON TABLE cv_subscriptions IS 'User subscription tiers';

-- ============================================================================
-- END OF MIGRATION
-- ============================================================================
