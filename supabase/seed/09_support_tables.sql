-- ============================================================================
-- CRAVCARDS SUPPORT TABLES SCHEMA
-- Additional tables for trivia scores, user progress, etc.
-- Created: December 11, 2025
-- ============================================================================

-- ============================================================================
-- TRIVIA SCORES (Track user game results)
-- ============================================================================
CREATE TABLE IF NOT EXISTS trivia_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Game Results
  score INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 10,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  
  -- Filters Used
  category TEXT DEFAULT 'all',
  difficulty TEXT DEFAULT 'all',
  
  -- Rewards
  xp_earned INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user queries
CREATE INDEX IF NOT EXISTS idx_trivia_scores_user ON trivia_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_trivia_scores_created ON trivia_scores(created_at DESC);

-- RLS
ALTER TABLE trivia_scores ENABLE ROW LEVEL SECURITY;

-- Users can read their own scores
CREATE POLICY "Users can view own trivia scores" ON trivia_scores
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own scores
CREATE POLICY "Users can insert own trivia scores" ON trivia_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- USER ACHIEVEMENTS (Track earned achievements)
-- ============================================================================
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL,
  
  -- Progress
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, achievement_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- RLS
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own achievements" ON user_achievements
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- COURSE PROGRESS (Track user course completion)
-- ============================================================================
CREATE TABLE IF NOT EXISTS course_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES card_courses(id) ON DELETE CASCADE,
  
  -- Progress
  current_module INTEGER DEFAULT 1,
  completed_modules JSONB DEFAULT '[]',
  quiz_scores JSONB DEFAULT '{}',
  
  -- Status
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, course_id)
);

-- Index
CREATE INDEX IF NOT EXISTS idx_course_progress_user ON course_progress(user_id);

-- RLS
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own course progress" ON course_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own course progress" ON course_progress
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- ADD catalog_card_id TO CARDS TABLE
-- Link user cards to master catalog
-- ============================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'cards' AND column_name = 'catalog_card_id'
  ) THEN
    ALTER TABLE cards ADD COLUMN catalog_card_id UUID REFERENCES card_catalog(id);
  END IF;
END $$;

-- Index for catalog lookups
CREATE INDEX IF NOT EXISTS idx_cards_catalog ON cards(catalog_card_id);
