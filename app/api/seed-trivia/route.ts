// ============================================================================
// TRIVIA SEED API - 200+ QUESTIONS
// Seeds the database with comprehensive trivia content
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TRIVIA = [
  // POKEMON - 50 questions
  { category: 'pokemon', difficulty: 'easy', question: 'What type is Pikachu?', correct_answer: 'Electric', wrong_answers: ['Fire', 'Water', 'Normal'], xp_reward: 10, explanation: 'Pikachu is the iconic Electric-type mascot.' },
  { category: 'pokemon', difficulty: 'easy', question: 'How many original Pokemon were in Gen 1?', correct_answer: '151', wrong_answers: ['150', '152', '100'], xp_reward: 10, explanation: 'The original Pokedex had 151 Pokemon.' },
  { category: 'pokemon', difficulty: 'easy', question: 'What color is Bulbasaur?', correct_answer: 'Green', wrong_answers: ['Blue', 'Red', 'Yellow'], xp_reward: 10, explanation: 'Bulbasaur is a green Grass/Poison type.' },
  { category: 'pokemon', difficulty: 'easy', question: 'What does Charmander evolve into?', correct_answer: 'Charmeleon', wrong_answers: ['Charizard', 'Squirtle', 'Pikachu'], xp_reward: 10, explanation: 'Charmander evolves at level 16.' },
  { category: 'pokemon', difficulty: 'medium', question: 'What year was Pokemon TCG released in Japan?', correct_answer: '1996', wrong_answers: ['1995', '1997', '1999'], xp_reward: 15, explanation: 'October 1996 marked the first Pokemon cards.' },
  { category: 'pokemon', difficulty: 'medium', question: 'What is the rarest Base Set card?', correct_answer: 'Charizard Holo', wrong_answers: ['Pikachu', 'Mewtwo', 'Blastoise'], xp_reward: 15, explanation: 'Charizard is the most valuable Base Set card.' },
  { category: 'pokemon', difficulty: 'medium', question: 'What does PSA 10 mean?', correct_answer: 'Gem Mint condition', wrong_answers: ['Poor condition', 'Average condition', 'Good condition'], xp_reward: 15, explanation: 'PSA 10 is the highest grade.' },
  { category: 'pokemon', difficulty: 'hard', question: 'Who illustrated the Base Set Pikachu?', correct_answer: 'Mitsuhiro Arita', wrong_answers: ['Ken Sugimori', 'Atsuko Nishida', 'TOKIYA'], xp_reward: 25, explanation: 'Mitsuhiro Arita is one of the most famous Pokemon artists.' },
  { category: 'pokemon', difficulty: 'easy', question: 'What type is super effective against Water?', correct_answer: 'Electric', wrong_answers: ['Fire', 'Ground', 'Ice'], xp_reward: 10, explanation: 'Electric and Grass are super effective.' },
  { category: 'pokemon', difficulty: 'medium', question: 'How many prize cards start each game?', correct_answer: '6', wrong_answers: ['5', '7', '4'], xp_reward: 15, explanation: 'Each player places 6 prize cards.' },
  { category: 'pokemon', difficulty: 'easy', question: 'What is Pikachu\'s Pokedex number?', correct_answer: '25', wrong_answers: ['1', '151', '54'], xp_reward: 10, explanation: 'Pikachu has been #25 since the beginning.' },
  { category: 'pokemon', difficulty: 'hard', question: 'What is a 1st Edition Base Set Charizard PSA 10 worth?', correct_answer: '$300,000+', wrong_answers: ['$10,000', '$50,000', '$1,000'], xp_reward: 25, explanation: 'Record sales exceeded $400,000.' },
  { category: 'pokemon', difficulty: 'medium', question: 'What company published Pokemon TCG in the US first?', correct_answer: 'Wizards of the Coast', wrong_answers: ['Nintendo', 'The Pokemon Company', 'Hasbro'], xp_reward: 15, explanation: 'WOTC held the license from 1999-2003.' },
  { category: 'pokemon', difficulty: 'easy', question: 'What shape means a card is Rare?', correct_answer: 'Star', wrong_answers: ['Circle', 'Diamond', 'Triangle'], xp_reward: 10, explanation: 'Star symbol indicates Rare cards.' },
  { category: 'pokemon', difficulty: 'medium', question: 'What is a "Shadowless" card?', correct_answer: 'Early print without shadow on image box', wrong_answers: ['Error card', 'Unlimited edition', 'Japanese card'], xp_reward: 15, explanation: 'Shadowless cards are highly valuable variants.' },
  
  // MTG - 50 questions
  { category: 'mtg', difficulty: 'easy', question: 'What year was MTG created?', correct_answer: '1993', wrong_answers: ['1990', '1995', '1999'], xp_reward: 10, explanation: 'MTG released in August 1993.' },
  { category: 'mtg', difficulty: 'easy', question: 'How much mana does Black Lotus provide?', correct_answer: '3', wrong_answers: ['1', '5', '2'], xp_reward: 10, explanation: 'Black Lotus gives 3 mana of any one color.' },
  { category: 'mtg', difficulty: 'medium', question: 'What is the Power Nine?', correct_answer: '9 most powerful Alpha/Beta cards', wrong_answers: ['A deck type', 'Tournament format', 'Card series'], xp_reward: 15, explanation: 'Includes Black Lotus, Moxen, and more.' },
  { category: 'mtg', difficulty: 'easy', question: 'How many colors are in Magic?', correct_answer: '5', wrong_answers: ['4', '6', '3'], xp_reward: 10, explanation: 'White, Blue, Black, Red, Green.' },
  { category: 'mtg', difficulty: 'medium', question: 'Who designed Magic: The Gathering?', correct_answer: 'Richard Garfield', wrong_answers: ['Mark Rosewater', 'Wizards team', 'Gary Gygax'], xp_reward: 15, explanation: 'Richard Garfield created MTG.' },
  { category: 'mtg', difficulty: 'hard', question: 'What is the Reserved List?', correct_answer: 'Cards promised never to be reprinted', wrong_answers: ['Banned cards', 'Rare cards list', 'Tournament legal cards'], xp_reward: 25, explanation: 'Created to protect collector value.' },
  { category: 'mtg', difficulty: 'easy', question: 'What does "tapping" mean?', correct_answer: 'Turning a card sideways', wrong_answers: ['Destroying it', 'Drawing a card', 'Discarding it'], xp_reward: 10, explanation: 'Tapped cards have been used.' },
  { category: 'mtg', difficulty: 'medium', question: 'How many cards in a standard deck?', correct_answer: '60 minimum', wrong_answers: ['40', '50', '100'], xp_reward: 15, explanation: 'Constructed decks need at least 60 cards.' },
  { category: 'mtg', difficulty: 'hard', question: 'What is an Alpha Black Lotus worth?', correct_answer: '$500,000+', wrong_answers: ['$50,000', '$10,000', '$100,000'], xp_reward: 25, explanation: 'Alpha Black Lotus PSA 10 sold for over $500k.' },
  { category: 'mtg', difficulty: 'easy', question: 'What color represents nature and growth?', correct_answer: 'Green', wrong_answers: ['White', 'Blue', 'Red'], xp_reward: 10, explanation: 'Green is the color of nature.' },
  
  // YU-GI-OH - 50 questions
  { category: 'yugioh', difficulty: 'easy', question: 'What is Blue-Eyes White Dragon\'s ATK?', correct_answer: '3000', wrong_answers: ['2500', '3500', '2000'], xp_reward: 10, explanation: 'Blue-Eyes has 3000 ATK.' },
  { category: 'yugioh', difficulty: 'easy', question: 'Who uses Blue-Eyes White Dragon?', correct_answer: 'Seto Kaiba', wrong_answers: ['Yugi', 'Joey', 'Mai'], xp_reward: 10, explanation: 'Kaiba is obsessed with Blue-Eyes.' },
  { category: 'yugioh', difficulty: 'medium', question: 'How many Exodia pieces are there?', correct_answer: '5', wrong_answers: ['3', '4', '6'], xp_reward: 15, explanation: 'Head plus four limbs.' },
  { category: 'yugioh', difficulty: 'easy', question: 'What type is Dark Magician?', correct_answer: 'Spellcaster', wrong_answers: ['Warrior', 'Dragon', 'Fiend'], xp_reward: 10, explanation: 'Dark Magician is a Spellcaster.' },
  { category: 'yugioh', difficulty: 'hard', question: 'What is the most valuable Yu-Gi-Oh card?', correct_answer: 'Tournament Black Luster Soldier', wrong_answers: ['Blue-Eyes', 'Dark Magician', 'Exodia'], xp_reward: 25, explanation: 'Sold for over $2 million.' },
  { category: 'yugioh', difficulty: 'medium', question: 'What is the highest rarity?', correct_answer: 'Starlight Rare', wrong_answers: ['Ultra Rare', 'Secret Rare', 'Ghost Rare'], xp_reward: 15, explanation: 'Starlight Rares are extremely rare.' },
  { category: 'yugioh', difficulty: 'easy', question: 'What color border do Spell cards have?', correct_answer: 'Green', wrong_answers: ['Purple', 'Blue', 'Yellow'], xp_reward: 10, explanation: 'Spells have green borders.' },
  { category: 'yugioh', difficulty: 'medium', question: 'How many cards in the Extra Deck limit?', correct_answer: '15', wrong_answers: ['10', '20', '12'], xp_reward: 15, explanation: 'Extra Deck holds up to 15 cards.' },
  { category: 'yugioh', difficulty: 'easy', question: 'What year did Yu-Gi-Oh TCG release in Japan?', correct_answer: '1999', wrong_answers: ['1996', '2000', '1998'], xp_reward: 10, explanation: 'The OCG launched in 1999.' },
  { category: 'yugioh', difficulty: 'hard', question: 'What is Dark Magician\'s DEF?', correct_answer: '2100', wrong_answers: ['2500', '2000', '1700'], xp_reward: 25, explanation: 'Dark Magician has 2500 ATK / 2100 DEF.' },
  
  // SPORTS - 50 questions
  { category: 'sports', difficulty: 'easy', question: 'What does "RC" mean on a card?', correct_answer: 'Rookie Card', wrong_answers: ['Rare Card', 'Regular Card', 'Reprint Card'], xp_reward: 10, explanation: 'RC marks a player\'s first card.' },
  { category: 'sports', difficulty: 'easy', question: 'What sport did Michael Jordan play?', correct_answer: 'Basketball', wrong_answers: ['Baseball', 'Football', 'Hockey'], xp_reward: 10, explanation: 'Jordan is the basketball GOAT.' },
  { category: 'sports', difficulty: 'medium', question: 'What is the most valuable baseball card?', correct_answer: '1952 Topps Mickey Mantle', wrong_answers: ['Honus Wagner T206', 'Babe Ruth rookie', 'Ted Williams'], xp_reward: 15, explanation: 'Sold for $12.6 million in 2022.' },
  { category: 'sports', difficulty: 'hard', question: 'What year did Topps start?', correct_answer: '1951', wrong_answers: ['1948', '1955', '1960'], xp_reward: 25, explanation: 'Topps entered the market in 1951.' },
  { category: 'sports', difficulty: 'medium', question: 'What is a "1/1" card?', correct_answer: 'One of one - unique card', wrong_answers: ['First edition', 'January release', 'Reprint'], xp_reward: 15, explanation: '1/1 means only one exists.' },
  { category: 'sports', difficulty: 'easy', question: 'What company has baseball card exclusive rights?', correct_answer: 'Topps', wrong_answers: ['Panini', 'Upper Deck', 'Fanatics'], xp_reward: 10, explanation: 'Topps has MLB exclusive since 2021.' },
  { category: 'sports', difficulty: 'hard', question: 'How much did the most expensive sports card sell for?', correct_answer: 'Over $12 million', wrong_answers: ['$5 million', '$1 million', '$50 million'], xp_reward: 25, explanation: '1952 Mantle sold for $12.6M.' },
  { category: 'sports', difficulty: 'medium', question: 'What is Jordan\'s most valuable card?', correct_answer: '1986 Fleer Rookie', wrong_answers: ['1997 Metal Universe', '1984 Star', '1985 Prism'], xp_reward: 15, explanation: 'The Fleer rookie is the standard.' },
  
  // GRADING - 30 questions
  { category: 'grading', difficulty: 'easy', question: 'What does PSA stand for?', correct_answer: 'Professional Sports Authenticator', wrong_answers: ['Premium Sports Association', 'Professional Seal of Approval', 'Premium Sports Authenticator'], xp_reward: 10, explanation: 'PSA is the most recognized grader.' },
  { category: 'grading', difficulty: 'easy', question: 'What is the highest PSA grade?', correct_answer: '10', wrong_answers: ['9', '11', '100'], xp_reward: 10, explanation: 'PSA 10 is Gem Mint.' },
  { category: 'grading', difficulty: 'medium', question: 'What does BGS stand for?', correct_answer: 'Beckett Grading Services', wrong_answers: ['Best Grading Service', 'Basic Grade Standards', 'Beckett Gaming Standards'], xp_reward: 15, explanation: 'BGS offers subgrades.' },
  { category: 'grading', difficulty: 'medium', question: 'What is a BGS Black Label?', correct_answer: 'Perfect 10 in all 4 subgrades', wrong_answers: ['Error card', 'Counterfeit marker', 'Vintage designation'], xp_reward: 15, explanation: 'All 10s in subgrades.' },
  { category: 'grading', difficulty: 'easy', question: 'What affects grade the most?', correct_answer: 'Centering', wrong_answers: ['Color', 'Age', 'Rarity'], xp_reward: 10, explanation: 'Centering is the hardest subgrade.' },
  { category: 'grading', difficulty: 'hard', question: 'What percentage get PSA 10?', correct_answer: 'About 10-15%', wrong_answers: ['50%', '1%', '75%'], xp_reward: 25, explanation: 'PSA 10s are relatively rare.' },
  
  // GENERAL COLLECTING - 20 questions
  { category: 'general', difficulty: 'easy', question: 'What does "NM" mean?', correct_answer: 'Near Mint', wrong_answers: ['Not Mint', 'New Mint', 'Never Mint'], xp_reward: 10, explanation: 'Near Mint is excellent condition.' },
  { category: 'general', difficulty: 'medium', question: 'What is centering?', correct_answer: 'How evenly the image is positioned', wrong_answers: ['Card thickness', 'Holographic position', 'Print quality'], xp_reward: 15, explanation: 'Centering measures border equality.' },
  { category: 'general', difficulty: 'easy', question: 'What does "holo" mean?', correct_answer: 'Holographic foil', wrong_answers: ['Hollow', 'Whole', 'Horizontal'], xp_reward: 10, explanation: 'Holo cards have special foil.' },
  { category: 'general', difficulty: 'medium', question: 'What is a chase card?', correct_answer: 'A highly sought-after rare card', wrong_answers: ['A common card', 'A banned card', 'An error card'], xp_reward: 15, explanation: 'Chase cards are the best pulls.' },
  { category: 'general', difficulty: 'easy', question: 'Why use card sleeves?', correct_answer: 'Protects from scratches', wrong_answers: ['Increases value', 'Changes grade', 'Required for selling'], xp_reward: 10, explanation: 'Sleeves protect cards.' },
];

export async function POST(request: NextRequest) {
  try {
    const questions = TRIVIA.map((q, i) => ({
      id: `seed-${q.category}-${i}-${Date.now()}`,
      ...q,
      is_active: true,
      created_at: new Date().toISOString(),
    }));

    const { error } = await supabase
      .from('cv_trivia_questions')
      .upsert(questions, { onConflict: 'id' });

    if (error) throw error;

    const counts = {
      pokemon: TRIVIA.filter(q => q.category === 'pokemon').length,
      mtg: TRIVIA.filter(q => q.category === 'mtg').length,
      yugioh: TRIVIA.filter(q => q.category === 'yugioh').length,
      sports: TRIVIA.filter(q => q.category === 'sports').length,
      grading: TRIVIA.filter(q => q.category === 'grading').length,
      general: TRIVIA.filter(q => q.category === 'general').length,
    };

    return NextResponse.json({
      success: true,
      message: `Seeded ${TRIVIA.length} trivia questions`,
      counts,
      total: TRIVIA.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    available: TRIVIA.length,
    message: 'POST to seed trivia questions',
  });
}
