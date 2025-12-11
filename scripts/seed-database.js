#!/usr/bin/env node
/**
 * CRAVCARDS DATABASE SEED RUNNER
 * Run this locally to populate your Supabase database
 * 
 * Usage: node seed-database.js
 * 
 * Prerequisites:
 * - Node.js 18+
 * - npm install @supabase/supabase-js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase credentials
const SUPABASE_URL = 'https://mivigvjlxsqwvqevlybo.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1pdmlndmpseHNxd3ZxZXZseWJvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzM0Nzc5NSwiZXhwIjoyMDQ4OTIzNzk1fQ.WY-cLRZqF0dX4HEfBdJpUAkx9kGKZgq9mhv4CIRVmyc';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// ============================================================================
// SEED DATA
// ============================================================================

const pokemonSets = [
  // WOTC ERA
  { name: 'Base Set', slug: 'pokemon-base-set', code: 'BS', category: 'pokemon', subcategory: 'expansion', release_date: '1999-01-09', release_year: 1999, total_cards: 102, description: 'The original Pokemon TCG set that started it all.', is_featured: true },
  { name: 'Jungle', slug: 'pokemon-jungle', code: 'JU', category: 'pokemon', subcategory: 'expansion', release_date: '1999-06-16', release_year: 1999, total_cards: 64, description: 'First expansion set featuring jungle-themed Pokemon.' },
  { name: 'Fossil', slug: 'pokemon-fossil', code: 'FO', category: 'pokemon', subcategory: 'expansion', release_date: '1999-10-10', release_year: 1999, total_cards: 62, description: 'Features prehistoric and fossil Pokemon.' },
  { name: 'Team Rocket', slug: 'pokemon-team-rocket', code: 'TR', category: 'pokemon', subcategory: 'expansion', release_date: '2000-04-24', release_year: 2000, total_cards: 83, description: 'First set featuring Dark Pokemon owned by Team Rocket.', is_featured: true },
  { name: 'Neo Genesis', slug: 'pokemon-neo-genesis', code: 'N1', category: 'pokemon', subcategory: 'expansion', release_date: '2000-12-16', release_year: 2000, total_cards: 111, description: 'First set with Generation 2 Pokemon.', is_featured: true },
  // Modern Era
  { name: 'Hidden Fates', slug: 'pokemon-hidden-fates', code: 'HIF', category: 'pokemon', subcategory: 'expansion', release_date: '2019-08-23', release_year: 2019, total_cards: 163, description: 'Shiny Vault subset, highly collectible.', is_featured: true },
  { name: 'Shining Fates', slug: 'pokemon-shining-fates', code: 'SHF', category: 'pokemon', subcategory: 'expansion', release_date: '2021-02-19', release_year: 2021, total_cards: 195, description: 'Shiny Charizard VMAX chase card.', is_featured: true },
  { name: 'Evolving Skies', slug: 'pokemon-evolving-skies', code: 'EVS', category: 'pokemon', subcategory: 'expansion', release_date: '2021-08-27', release_year: 2021, total_cards: 237, description: 'Eeveelution VMAX set.', is_featured: true },
  { name: 'Celebrations', slug: 'pokemon-celebrations', code: 'CEL', category: 'pokemon', subcategory: 'expansion', release_date: '2021-10-08', release_year: 2021, total_cards: 50, description: '25th anniversary with classic reprints.', is_featured: true },
  { name: 'Scarlet & Violet', slug: 'pokemon-scarlet-violet', code: 'SVI', category: 'pokemon', subcategory: 'expansion', release_date: '2023-03-31', release_year: 2023, total_cards: 258, description: 'Generation 9 with ex cards.', is_featured: true },
  { name: 'Pokemon 151', slug: 'pokemon-151', code: 'MEW', category: 'pokemon', subcategory: 'expansion', release_date: '2023-09-22', release_year: 2023, total_cards: 207, description: 'Original 151 celebration.', is_featured: true },
];

const triviaQuestions = [
  // Pokemon Easy
  { category: 'pokemon', difficulty: 'easy', question: 'What is the first Pokemon in the National Pokedex?', correct_answer: 'Bulbasaur', wrong_answers: ['Pikachu', 'Charmander', 'Squirtle'], explanation: 'Bulbasaur is #001 in the National Pokedex.', points: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'What type is Pikachu?', correct_answer: 'Electric', wrong_answers: ['Fire', 'Water', 'Normal'], explanation: 'Pikachu is the iconic Electric-type mouse Pokemon.', points: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'Which Pokemon card set was released first?', correct_answer: 'Base Set', wrong_answers: ['Jungle', 'Fossil', 'Team Rocket'], explanation: 'Base Set was released in January 1999 in North America.', points: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'How many cards are in the original Base Set?', correct_answer: '102', wrong_answers: ['100', '99', '151'], explanation: 'The Base Set contains 102 cards including secret rares.', points: 10 },
  { category: 'pokemon', difficulty: 'easy', question: 'What year was the Pokemon TCG first released?', correct_answer: '1999', wrong_answers: ['1997', '1998', '2000'], explanation: 'The Pokemon TCG launched in the US in January 1999.', points: 10 },
  // Pokemon Medium
  { category: 'pokemon', difficulty: 'medium', question: 'Which Pokemon card is the most valuable ever sold?', correct_answer: 'Pikachu Illustrator', wrong_answers: ['1st Edition Charizard', 'Shadowless Charizard', 'Trophy Pikachu'], explanation: 'The Pikachu Illustrator sold for over $5 million.', points: 15 },
  { category: 'pokemon', difficulty: 'medium', question: 'What is a "shadowless" card?', correct_answer: 'Cards without shadow on artwork frame', wrong_answers: ['Cards printed at night', 'Error cards', 'Japanese cards'], explanation: 'Shadowless cards were early prints without shadow effects.', points: 15 },
  { category: 'pokemon', difficulty: 'medium', question: 'What does PSA stand for?', correct_answer: 'Professional Sports Authenticator', wrong_answers: ['Pokemon Standard Assessment', 'Premium Service Authentication', 'Perfect Slab Authority'], explanation: 'PSA is the largest third-party grading company.', points: 15 },
  // Sports
  { category: 'sports', difficulty: 'easy', question: 'What does RC stand for on sports cards?', correct_answer: 'Rookie Card', wrong_answers: ['Rare Card', 'Regular Card', 'Rated Card'], explanation: 'RC designates a players first officially licensed card.', points: 10 },
  { category: 'sports', difficulty: 'easy', question: 'What is a parallel card?', correct_answer: 'A variation of the base card', wrong_answers: ['A fake card', 'A damaged card', 'An autographed card'], explanation: 'Parallels are alternate versions with different colors/patterns.', points: 10 },
  { category: 'sports', difficulty: 'medium', question: 'What year is Michael Jordans most valuable rookie from?', correct_answer: '1986', wrong_answers: ['1984', '1985', '1987'], explanation: 'The 1986 Fleer Michael Jordan RC is his most iconic card.', points: 15 },
  // General/Grading
  { category: 'general', difficulty: 'easy', question: 'What is the highest grade a PSA card can receive?', correct_answer: 'PSA 10', wrong_answers: ['PSA 9', 'PSA 11', 'PSA 100'], explanation: 'PSA 10 Gem Mint is the highest grade.', points: 10 },
  { category: 'general', difficulty: 'easy', question: 'What is a graded card encased in?', correct_answer: 'A slab (hard plastic case)', wrong_answers: ['A binder', 'Soft sleeve only', 'Paper envelope'], explanation: 'Graded cards are sealed in tamper-evident plastic slabs.', points: 10 },
  { category: 'general', difficulty: 'medium', question: 'What does BGS stand for?', correct_answer: 'Beckett Grading Services', wrong_answers: ['Best Grading Service', 'Basic Grade Score', 'Baseball Grading Standard'], explanation: 'BGS is known for subgrades and half-point increments.', points: 15 },
  { category: 'general', difficulty: 'medium', question: 'What are the four BGS subgrades?', correct_answer: 'Centering, Corners, Edges, Surface', wrong_answers: ['Front, Back, Edges, Corners', 'Color, Print, Centering, Corners', 'Size, Shape, Color, Print'], explanation: 'BGS evaluates these four aspects separately.', points: 15 },
];

const achievements = [
  // Collection
  { id: 'collect-001', name: 'First Card', description: 'Add your first card to your collection', icon: '🎴', category: 'collection', xp: 10, requirement_type: 'cards_added', requirement_value: 1, is_secret: false },
  { id: 'collect-002', name: 'Getting Started', description: 'Add 10 cards to your collection', icon: '📦', category: 'collection', xp: 25, requirement_type: 'cards_added', requirement_value: 10, is_secret: false },
  { id: 'collect-003', name: 'Growing Collection', description: 'Add 50 cards to your collection', icon: '📚', category: 'collection', xp: 100, requirement_type: 'cards_added', requirement_value: 50, is_secret: false },
  { id: 'collect-004', name: 'Serious Collector', description: 'Add 100 cards to your collection', icon: '🏆', category: 'collection', xp: 250, requirement_type: 'cards_added', requirement_value: 100, is_secret: false },
  { id: 'collect-005', name: 'Pokemon Starter', description: 'Add your first Pokemon card', icon: '⚡', category: 'collection', xp: 15, requirement_type: 'pokemon_cards', requirement_value: 1, is_secret: false },
  { id: 'collect-006', name: 'First Holo', description: 'Add your first holographic card', icon: '✨', category: 'collection', xp: 50, requirement_type: 'holo_cards', requirement_value: 1, is_secret: false },
  // Trivia
  { id: 'trivia-001', name: 'First Quiz', description: 'Complete your first trivia game', icon: '❓', category: 'trivia', xp: 10, requirement_type: 'trivia_games', requirement_value: 1, is_secret: false },
  { id: 'trivia-002', name: 'First Perfect', description: 'Get a perfect score in trivia', icon: '💯', category: 'trivia', xp: 100, requirement_type: 'perfect_scores', requirement_value: 1, is_secret: false },
  { id: 'trivia-003', name: 'Knowledge Seeker', description: 'Answer 100 questions correctly', icon: '📚', category: 'trivia', xp: 150, requirement_type: 'correct_answers', requirement_value: 100, is_secret: false },
  // Social
  { id: 'social-001', name: 'Club Member', description: 'Join your first club', icon: '👥', category: 'social', xp: 25, requirement_type: 'clubs_joined', requirement_value: 1, is_secret: false },
  { id: 'social-002', name: 'Club Founder', description: 'Create your own club', icon: '⭐', category: 'social', xp: 150, requirement_type: 'clubs_created', requirement_value: 1, is_secret: false },
  // Trading
  { id: 'trade-001', name: 'First Trade', description: 'Complete your first trade', icon: '🤝', category: 'trading', xp: 50, requirement_type: 'trades_completed', requirement_value: 1, is_secret: false },
  { id: 'trade-002', name: 'First Sale', description: 'Sell your first card', icon: '💰', category: 'trading', xp: 50, requirement_type: 'cards_sold', requirement_value: 1, is_secret: false },
  // Milestone
  { id: 'mile-001', name: 'Welcome', description: 'Create your account', icon: '🎉', category: 'milestone', xp: 10, requirement_type: 'account_created', requirement_value: 1, is_secret: false },
  { id: 'mile-002', name: 'First Course', description: 'Complete your first course', icon: '🎓', category: 'milestone', xp: 50, requirement_type: 'courses_completed', requirement_value: 1, is_secret: false },
  // Secret
  { id: 'secret-001', name: 'Night Owl', description: 'Use the app between 2-4 AM', icon: '🦉', category: 'milestone', xp: 50, requirement_type: 'night_login', requirement_value: 1, is_secret: true },
  { id: 'secret-002', name: 'Charizard Fan', description: 'Add any Charizard card to collection', icon: '🔥', category: 'collection', xp: 100, requirement_type: 'charizard_owned', requirement_value: 1, is_secret: true },
];

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedPokemonSets() {
  console.log('📦 Seeding Pokemon sets...');
  
  for (const set of pokemonSets) {
    const { data, error } = await supabase
      .from('card_sets')
      .upsert(set, { onConflict: 'slug' });
    
    if (error) {
      console.log(`  ⚠️ ${set.name}: ${error.message}`);
    } else {
      console.log(`  ✓ ${set.name}`);
    }
  }
  
  console.log(`  Total: ${pokemonSets.length} sets\n`);
}

async function seedTriviaQuestions() {
  console.log('❓ Seeding trivia questions...');
  
  let success = 0;
  for (const q of triviaQuestions) {
    const { error } = await supabase
      .from('trivia_questions')
      .insert(q);
    
    if (!error) success++;
  }
  
  console.log(`  ✓ Added ${success}/${triviaQuestions.length} questions\n`);
}

async function seedAchievements() {
  console.log('🏆 Seeding achievements...');
  
  for (const ach of achievements) {
    const { error } = await supabase
      .from('achievements')
      .upsert(ach, { onConflict: 'id' });
    
    if (error) {
      console.log(`  ⚠️ ${ach.name}: ${error.message}`);
    } else {
      console.log(`  ✓ ${ach.name}`);
    }
  }
  
  console.log(`  Total: ${achievements.length} achievements\n`);
}

async function checkCounts() {
  console.log('📊 Checking database counts...\n');
  
  const tables = ['card_sets', 'trivia_questions', 'achievements', 'profiles', 'clubs'];
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`  ${table}: ⚠️ ${error.message}`);
    } else {
      console.log(`  ${table}: ${count} records`);
    }
  }
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
  console.log('='.repeat(60));
  console.log('CRAVCARDS DATABASE SEEDER');
  console.log('='.repeat(60));
  console.log('');
  
  try {
    await seedPokemonSets();
    await seedTriviaQuestions();
    await seedAchievements();
    await checkCounts();
    
    console.log('\n✅ Seeding complete!');
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

main();
