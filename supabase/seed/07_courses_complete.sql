-- ============================================================================
-- CRAVCARDS SEED DATA: COURSES (20+ Complete Courses)
-- Academy content for card collecting education
-- Created: December 11, 2025
-- ============================================================================

-- ============================================================================
-- COURSES
-- ============================================================================
INSERT INTO card_courses (title, slug, description, category, difficulty, thumbnail_url, estimated_time, module_count, is_free, is_featured, status) VALUES

-- POKEMON COURSES
('Pokemon Collecting 101', 'pokemon-collecting-101', 'Start your Pokemon card collecting journey with this comprehensive beginner guide covering sets, rarities, and building your first collection.', 'pokemon', 'beginner', '/images/courses/pokemon-101.jpg', 45, 6, true, true, 'published'),
('Pokemon Vintage Era Guide', 'pokemon-vintage-era', 'Deep dive into WOTC-era Pokemon cards from 1999-2003. Learn about Base Set, Neo Series, and why these cards are so valuable.', 'pokemon', 'intermediate', '/images/courses/pokemon-vintage.jpg', 60, 8, false, true, 'published'),
('Pokemon Modern Sets Mastery', 'pokemon-modern-sets', 'Navigate the modern Pokemon TCG landscape from Sun & Moon to Scarlet & Violet. Understand chase cards, pull rates, and investment potential.', 'pokemon', 'intermediate', '/images/courses/pokemon-modern.jpg', 50, 7, false, false, 'published'),
('Pokemon Investment Strategy', 'pokemon-investment', 'Advanced strategies for Pokemon card investing. Learn market cycles, sealed product strategy, and long-term portfolio building.', 'pokemon', 'advanced', '/images/courses/pokemon-invest.jpg', 90, 10, false, true, 'published'),

-- MTG COURSES
('Magic: The Gathering Introduction', 'mtg-introduction', 'Enter the world of Magic: The Gathering collecting. Learn about sets, formats, and what makes MTG cards valuable.', 'mtg', 'beginner', '/images/courses/mtg-intro.jpg', 40, 5, true, true, 'published'),
('MTG Reserved List Deep Dive', 'mtg-reserved-list', 'Everything about the Reserved List - what it is, which cards are on it, and why these cards will never be reprinted.', 'mtg', 'advanced', '/images/courses/mtg-reserved.jpg', 75, 8, false, true, 'published'),
('MTG Format Guide', 'mtg-formats', 'Understand Standard, Modern, Legacy, Vintage, and Commander formats. Learn how format legality affects card values.', 'mtg', 'intermediate', '/images/courses/mtg-formats.jpg', 55, 6, false, false, 'published'),

-- SPORTS COURSES
('Sports Card Fundamentals', 'sports-fundamentals', 'Your entry point into sports card collecting. Covers baseball, basketball, football, and hockey card basics.', 'sports', 'beginner', '/images/courses/sports-101.jpg', 50, 6, true, true, 'published'),
('Rookie Cards Masterclass', 'rookie-cards-masterclass', 'The definitive guide to rookie cards - what counts as a true rookie, key cards to watch, and investment strategies.', 'sports', 'intermediate', '/images/courses/rookie-cards.jpg', 65, 7, false, true, 'published'),
('Baseball Card History', 'baseball-card-history', 'From T206 to modern Topps - explore 150+ years of baseball card history and the hobby evolution.', 'sports', 'intermediate', '/images/courses/baseball-history.jpg', 70, 8, false, false, 'published'),
('Basketball Card Investing', 'basketball-card-investing', 'Focus on basketball cards from Jordan to current stars. Learn what drives value and how to build a basketball portfolio.', 'sports', 'advanced', '/images/courses/basketball-invest.jpg', 80, 9, false, true, 'published'),
('Football Card Essentials', 'football-card-essentials', 'Navigate the football card market from vintage to modern. Understand key sets, players, and market trends.', 'sports', 'intermediate', '/images/courses/football-cards.jpg', 55, 6, false, false, 'published'),

-- GRADING COURSES
('Card Grading Complete Guide', 'grading-complete-guide', 'Master the art of card grading. Learn to assess condition, choose grading companies, and maximize your submissions.', 'grading', 'beginner', '/images/courses/grading-guide.jpg', 60, 8, true, true, 'published'),
('PSA Grading Mastery', 'psa-grading-mastery', 'Deep dive into PSA grading standards, submission tips, and strategies to get the best grades possible.', 'grading', 'intermediate', '/images/courses/psa-mastery.jpg', 45, 5, false, false, 'published'),
('BGS and Subgrades Explained', 'bgs-subgrades', 'Understand BGS unique subgrade system, Black Labels, and when to choose BGS over other grading companies.', 'grading', 'intermediate', '/images/courses/bgs-guide.jpg', 40, 5, false, false, 'published'),
('Pre-Submission Assessment', 'pre-submission-assessment', 'Learn to assess your cards before submission. Save money by only submitting cards that will grade well.', 'grading', 'advanced', '/images/courses/pre-assessment.jpg', 50, 6, false, true, 'published'),

-- INVESTMENT COURSES
('Card Investment Fundamentals', 'investment-fundamentals', 'Build your foundation in card investing. Learn valuation, market cycles, and portfolio diversification.', 'investment', 'beginner', '/images/courses/invest-101.jpg', 55, 7, true, true, 'published'),
('Market Analysis Techniques', 'market-analysis', 'Advanced techniques for analyzing the card market. Use data, trends, and tools to make informed decisions.', 'investment', 'advanced', '/images/courses/market-analysis.jpg', 85, 10, false, false, 'published'),
('Sealed Product Strategy', 'sealed-product-strategy', 'The complete guide to sealed product investing. Learn what to hold, when to sell, and storage best practices.', 'investment', 'intermediate', '/images/courses/sealed-strategy.jpg', 60, 7, false, true, 'published'),

-- GENERAL COURSES
('Collection Management', 'collection-management', 'Organize, track, and protect your collection. Learn storage, insurance, and database management.', 'general', 'beginner', '/images/courses/collection-mgmt.jpg', 35, 5, true, false, 'published'),
('Detecting Fakes and Counterfeits', 'detecting-fakes', 'Protect yourself from fakes. Learn authentication techniques, red flags, and how to verify authenticity.', 'general', 'intermediate', '/images/courses/detecting-fakes.jpg', 50, 6, false, true, 'published'),
('Storage and Preservation', 'storage-preservation', 'Keep your collection in pristine condition. Learn proper storage, handling, and environmental control.', 'general', 'beginner', '/images/courses/storage.jpg', 30, 4, true, false, 'published')

ON CONFLICT (slug) DO UPDATE SET
  description = EXCLUDED.description,
  module_count = EXCLUDED.module_count,
  is_featured = EXCLUDED.is_featured;
