-- ============================================================================
-- CRAVCARDS DATABASE SCHEMA
-- Complete schema for card collection, marketplace, clubs, and trivia
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  
  -- Subscription
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'elite')),
  subscription_status TEXT DEFAULT 'active',
  stripe_customer_id TEXT,
  
  -- Stats
  total_cards INTEGER DEFAULT 0,
  collection_value DECIMAL(12,2) DEFAULT 0,
  total_trades INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  trivia_wins INTEGER DEFAULT 0,
  
  -- Settings
  is_public BOOLEAN DEFAULT true,
  show_collection BOOLEAN DEFAULT true,
  show_value BOOLEAN DEFAULT false,
  email_notifications BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CARDS TABLE (User's card collection)
-- ============================================================================
CREATE TABLE IF NOT EXISTS cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  -- Card Identity
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('pokemon', 'mtg', 'yugioh', 'sports', 'disney', 'entertainment', 'other')),
  set_name TEXT,
  card_number TEXT,
  year INTEGER,
  
  -- Images
  image_url TEXT,
  image_back_url TEXT,
  
  -- Rarity & Condition
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic')),
  condition TEXT DEFAULT 'near_mint' CHECK (condition IN ('mint', 'near_mint', 'excellent', 'good', 'fair', 'poor')),
  
  -- Grading
  is_graded BOOLEAN DEFAULT false,
  grading_company TEXT,
  grade DECIMAL(3,1),
  cert_number TEXT,
  
  -- Value
  purchase_price DECIMAL(10,2),
  purchase_date DATE,
  current_value DECIMAL(10,2),
  
  -- Inventory
  quantity INTEGER DEFAULT 1,
  location TEXT,
  notes TEXT,
  
  -- Additional metadata as JSON
  metadata JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COLLECTIONS TABLE (User-created groupings)
-- ============================================================================
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  cover_image TEXT,
  card_count INTEGER DEFAULT 0,
  total_value DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- COLLECTION_CARDS TABLE (Cards in collections - many-to-many)
-- ============================================================================
CREATE TABLE IF NOT EXISTS collection_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(collection_id, card_id)
);

-- ============================================================================
-- MARKETPLACE_LISTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS marketplace_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  card_id UUID REFERENCES cards(id) ON DELETE SET NULL,
  
  -- Listing Details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  condition TEXT,
  
  -- Images (can be different from card images)
  images TEXT[] DEFAULT '{}',
  
  -- Pricing
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  accepts_offers BOOLEAN DEFAULT false,
  minimum_offer DECIMAL(10,2),
  
  -- Listing Type
  listing_type TEXT DEFAULT 'sell' CHECK (listing_type IN ('sell', 'trade', 'auction')),
  
  -- Auction fields
  auction_end_time TIMESTAMPTZ,
  starting_bid DECIMAL(10,2),
  current_bid DECIMAL(10,2),
  bid_count INTEGER DEFAULT 0,
  
  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'sold', 'cancelled', 'expired', 'pending')),
  
  -- Stats
  views INTEGER DEFAULT 0,
  favorites INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  sold_at TIMESTAMPTZ,
  buyer_id UUID REFERENCES profiles(id)
);

-- ============================================================================
-- CLUBS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  
  -- Type & Settings
  club_type TEXT NOT NULL CHECK (club_type IN ('braggers', 'regional', 'team', 'tcg', 'grading', 'investment', 'general')),
  is_private BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  
  -- Requirements
  requirement TEXT,
  min_collection_value DECIMAL(12,2),
  
  -- Appearance
  banner_emoji TEXT DEFAULT '🎴',
  banner_color TEXT DEFAULT 'from-purple-600 to-pink-600',
  banner_image TEXT,
  
  -- Stats
  member_count INTEGER DEFAULT 1,
  post_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CLUB_MEMBERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS club_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(club_id, user_id)
);

-- ============================================================================
-- TRIVIA_QUESTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS trivia_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN ('pokemon', 'mtg', 'sports', 'general', 'disney', 'history')),
  difficulty TEXT DEFAULT 'medium' CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
  question TEXT NOT NULL,
  correct_answer TEXT NOT NULL,
  wrong_answers TEXT[] NOT NULL,
  explanation TEXT,
  image_url TEXT,
  points INTEGER DEFAULT 10,
  time_limit INTEGER DEFAULT 20,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TRIVIA_GAMES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS trivia_games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  category TEXT,
  difficulty TEXT,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  time_taken INTEGER,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- ============================================================================
-- ACHIEVEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('collection', 'trading', 'trivia', 'social', 'milestone')),
  xp INTEGER DEFAULT 50,
  requirement_type TEXT NOT NULL,
  requirement_value INTEGER NOT NULL,
  is_secret BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- USER_ACHIEVEMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  UNIQUE(user_id, achievement_id)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON cards(user_id);
CREATE INDEX IF NOT EXISTS idx_cards_category ON cards(category);
CREATE INDEX IF NOT EXISTS idx_listings_seller ON marketplace_listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON marketplace_listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON marketplace_listings(category);
CREATE INDEX IF NOT EXISTS idx_clubs_type ON clubs(club_type);
CREATE INDEX IF NOT EXISTS idx_club_members_user ON club_members(user_id);
CREATE INDEX IF NOT EXISTS idx_trivia_category ON trivia_questions(category);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketplace_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE trivia_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read public profiles, update own
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (is_public = true);
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Cards: Users can CRUD own cards
CREATE POLICY "Users can view own cards" ON cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cards" ON cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cards" ON cards FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cards" ON cards FOR DELETE USING (auth.uid() = user_id);

-- Marketplace: Active listings viewable by all, sellers manage own
CREATE POLICY "Active listings are public" ON marketplace_listings FOR SELECT USING (status = 'active');
CREATE POLICY "Sellers can view own listings" ON marketplace_listings FOR SELECT USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can create listings" ON marketplace_listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Sellers can update own listings" ON marketplace_listings FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Sellers can delete own listings" ON marketplace_listings FOR DELETE USING (auth.uid() = seller_id);

-- Clubs: Public clubs viewable by all
CREATE POLICY "Public clubs are viewable" ON clubs FOR SELECT USING (is_private = false);
CREATE POLICY "Members can view private clubs" ON clubs FOR SELECT USING (
  EXISTS (SELECT 1 FROM club_members WHERE club_id = id AND user_id = auth.uid())
);
CREATE POLICY "Users can create clubs" ON clubs FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update clubs" ON clubs FOR UPDATE USING (auth.uid() = owner_id);

-- Trivia questions: Public read
CREATE POLICY "Trivia questions are public" ON trivia_questions FOR SELECT TO authenticated USING (true);

-- Achievements: Public read
CREATE POLICY "Achievements are public" ON achievements FOR SELECT USING (true);

-- User achievements: Users see own
CREATE POLICY "Users view own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS FOR AUTO-UPDATING
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_cards_updated_at BEFORE UPDATE ON cards FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_collections_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON marketplace_listings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON clubs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- SEED DATA: TRIVIA QUESTIONS
-- ============================================================================
INSERT INTO trivia_questions (category, difficulty, question, correct_answer, wrong_answers, explanation, points) VALUES
-- Pokemon Questions
('pokemon', 'easy', 'What is the first Pokémon in the National Pokédex?', 'Bulbasaur', ARRAY['Pikachu', 'Charmander', 'Squirtle'], 'Bulbasaur is #001 in the National Pokédex.', 10),
('pokemon', 'easy', 'What type is Pikachu?', 'Electric', ARRAY['Fire', 'Water', 'Normal'], 'Pikachu is the iconic Electric-type mouse Pokémon.', 10),
('pokemon', 'medium', 'Which Pokémon card set was released first?', 'Base Set', ARRAY['Jungle', 'Fossil', 'Team Rocket'], 'Base Set was released in January 1999 in North America.', 15),
('pokemon', 'medium', 'What is the most expensive Pokémon card ever sold?', 'Pikachu Illustrator', ARRAY['1st Edition Charizard', 'Shadowless Charizard', 'Trophy Pikachu'], 'A PSA 10 Pikachu Illustrator sold for over $5 million.', 15),
('pokemon', 'hard', 'How many cards are in the original Base Set?', '102', ARRAY['100', '99', '151'], 'The Base Set contains 102 cards including secret rares.', 20),
('pokemon', 'hard', 'What year was the first Pokémon card released in Japan?', '1996', ARRAY['1995', '1997', '1998'], 'The first Pokémon cards were released in Japan in October 1996.', 20),

-- Sports Questions
('sports', 'easy', 'Which company produces the most popular baseball cards?', 'Topps', ARRAY['Panini', 'Upper Deck', 'Donruss'], 'Topps has been the leading baseball card manufacturer since 1951.', 10),
('sports', 'easy', 'What does PSA stand for in card grading?', 'Professional Sports Authenticator', ARRAY['Premium Sports Authority', 'Professional Sports Association', 'Premium Sports Authenticator'], 'PSA is the most popular grading service for sports cards.', 10),
('sports', 'medium', 'What is the most valuable baseball card ever sold?', '1952 Topps Mickey Mantle', ARRAY['1909 T206 Honus Wagner', '1951 Bowman Mickey Mantle', '1989 Upper Deck Ken Griffey Jr'], 'A PSA 10 1952 Topps Mickey Mantle sold for $12.6 million in 2022.', 15),
('sports', 'medium', 'What year did Upper Deck enter the sports card market?', '1989', ARRAY['1985', '1990', '1987'], 'Upper Deck revolutionized the industry with their 1989 baseball set.', 15),
('sports', 'hard', 'What is a "short print" in card collecting?', 'A card printed in smaller quantities', ARRAY['A smaller sized card', 'A card with printing errors', 'A card from a short set'], 'Short prints are intentionally produced in lower quantities to increase rarity.', 20),

-- MTG Questions
('mtg', 'easy', 'What is the most powerful card in Magic: The Gathering history?', 'Black Lotus', ARRAY['Ancestral Recall', 'Time Walk', 'Mox Sapphire'], 'Black Lotus provides 3 mana of any color for free.', 10),
('mtg', 'medium', 'What year was Magic: The Gathering first released?', '1993', ARRAY['1991', '1995', '1990'], 'MTG was created by Richard Garfield and released by Wizards of the Coast in 1993.', 15),
('mtg', 'medium', 'How many cards are in the Power Nine?', '9', ARRAY['10', '8', '7'], 'The Power Nine are the 9 most powerful cards from early Magic sets.', 15),
('mtg', 'hard', 'What was the first Magic expansion set?', 'Arabian Nights', ARRAY['Antiquities', 'Legends', 'The Dark'], 'Arabian Nights was released in December 1993.', 20),

-- General Questions
('general', 'easy', 'What does "NM" mean in card condition?', 'Near Mint', ARRAY['New Mint', 'Not Marked', 'Nearly Modern'], 'Near Mint indicates a card in excellent condition with minimal wear.', 10),
('general', 'easy', 'What is a "rookie card"?', 'A player''s first officially licensed card', ARRAY['A card from a player''s rookie season only', 'Any card of a first-year player', 'A card with the "RC" logo'], 'A rookie card is the first card of a player in a major release.', 10),
('general', 'medium', 'What does "BGS" stand for?', 'Beckett Grading Services', ARRAY['Best Grading System', 'Baseball Grading Services', 'Basic Grading Scale'], 'BGS is a major grading company known for their subgrades.', 15),
('general', 'hard', 'What is "centering" in card grading?', 'How well the image is centered on the card', ARRAY['The card''s position in the pack', 'The focus of the card''s image', 'The card''s placement in a set'], 'Centering measures the borders around the card image, affecting grade.', 20);

-- ============================================================================
-- SEED DATA: ACHIEVEMENTS
-- ============================================================================
INSERT INTO achievements (id, name, description, icon, category, xp, requirement_type, requirement_value) VALUES
('first-card', 'First Card', 'Add your first card to your collection', 'Star', 'collection', 50, 'cards_owned', 1),
('collector-10', 'Collector', 'Own 10 cards in your collection', 'Trophy', 'collection', 100, 'cards_owned', 10),
('collector-50', 'Serious Collector', 'Own 50 cards in your collection', 'Target', 'collection', 250, 'cards_owned', 50),
('collector-100', 'Master Collector', 'Own 100 cards in your collection', 'Crown', 'collection', 500, 'cards_owned', 100),
('first-sale', 'First Sale', 'Sell your first card on the marketplace', 'DollarSign', 'trading', 100, 'sales_count', 1),
('first-trade', 'Trader', 'Complete your first trade', 'Repeat', 'trading', 100, 'trades_count', 1),
('trivia-win', 'Trivia Winner', 'Win your first trivia game', 'Zap', 'trivia', 75, 'trivia_wins', 1),
('trivia-streak-5', 'Hot Streak', 'Win 5 trivia games in a row', 'Flame', 'trivia', 200, 'trivia_streak', 5),
('trivia-master', 'Trivia Master', 'Win 25 trivia games', 'Brain', 'trivia', 500, 'trivia_wins', 25),
('club-member', 'Club Member', 'Join your first club', 'Users', 'social', 50, 'clubs_joined', 1),
('club-creator', 'Club Founder', 'Create your own club', 'Flag', 'social', 150, 'clubs_created', 1),
('value-1000', 'Rising Value', 'Collection worth $1,000+', 'TrendingUp', 'milestone', 300, 'collection_value', 1000),
('value-10000', 'High Roller', 'Collection worth $10,000+', 'Gem', 'milestone', 750, 'collection_value', 10000);

