// ============================================================================
// CARD GAMES & ACTIVITIES API
// Interactive games for card collectors
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

// ==================== GAME: PRICE IS RIGHT ====================
interface PriceGuessGame {
  type: 'price_guess';
  card: {
    name: string;
    category: string;
    image: string;
    condition: string;
    graded?: string;
    hints: string[];
  };
  actualPrice: number;
  difficulty: string;
  xpReward: number;
}

const PRICE_GUESS_CARDS: PriceGuessGame[] = [
  {
    type: 'price_guess',
    card: { name: 'Charizard Base Set Holo', category: 'pokemon', image: 'https://images.pokemontcg.io/base1/4.png', condition: 'PSA 9', hints: ['Most iconic Pokemon card', '1999 release', 'Fire type'] },
    actualPrice: 2500,
    difficulty: 'medium',
    xpReward: 25,
  },
  {
    type: 'price_guess',
    card: { name: 'Black Lotus (Beta)', category: 'mtg', image: 'https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg', condition: 'BGS 8.5', hints: ['Most powerful MTG card', 'Provides 3 mana', 'Reserved List'] },
    actualPrice: 75000,
    difficulty: 'hard',
    xpReward: 50,
  },
  {
    type: 'price_guess',
    card: { name: 'Blue-Eyes White Dragon (LOB-001)', category: 'yugioh', image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg', condition: 'PSA 10', hints: ['Kaiba\'s signature card', '3000 ATK', 'First set'] },
    actualPrice: 5000,
    difficulty: 'medium',
    xpReward: 25,
  },
  {
    type: 'price_guess',
    card: { name: '1986 Fleer Michael Jordan Rookie', category: 'sports', image: 'https://thesportsdb.com/images/media/player/thumb/h9y6s31547838080.jpg', condition: 'PSA 10', hints: ['The GOAT\'s rookie card', 'Red jersey #23', 'Fleer\'s first basketball set'] },
    actualPrice: 738000,
    difficulty: 'hard',
    xpReward: 50,
  },
  {
    type: 'price_guess',
    card: { name: 'Pikachu Base Set 1st Edition', category: 'pokemon', image: 'https://images.pokemontcg.io/base1/58.png', condition: 'PSA 10', hints: ['Most popular Pokemon', 'Yellow mouse', 'Electric type'] },
    actualPrice: 5500,
    difficulty: 'medium',
    xpReward: 25,
  },
];

// ==================== GAME: CARD MATCH ====================
interface CardMatchGame {
  type: 'card_match';
  cards: Array<{
    id: string;
    name: string;
    image: string;
  }>;
  pairs: number;
  timeLimit: number;
  xpReward: number;
}

// ==================== GAME: GUESS THE CARD ====================
interface GuessCardGame {
  type: 'guess_card';
  category: string;
  hints: string[];
  answer: string;
  image: string;
  options: string[];
  xpReward: number;
}

const GUESS_CARD_GAMES: GuessCardGame[] = [
  {
    type: 'guess_card',
    category: 'pokemon',
    hints: ['Fire/Flying type', 'Evolves from Charmeleon', '006 in the Pokedex', 'Has Mega evolutions'],
    answer: 'Charizard',
    image: 'https://images.pokemontcg.io/base1/4.png',
    options: ['Charizard', 'Dragonite', 'Typhlosion', 'Blaziken'],
    xpReward: 15,
  },
  {
    type: 'guess_card',
    category: 'mtg',
    hints: ['0 mana artifact', 'Provides 3 mana of any color', 'On the Reserved List', 'Named after a flower'],
    answer: 'Black Lotus',
    image: 'https://cards.scryfall.io/normal/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7cdd.jpg',
    options: ['Black Lotus', 'Mox Diamond', 'Sol Ring', 'Mana Crypt'],
    xpReward: 20,
  },
  {
    type: 'guess_card',
    category: 'yugioh',
    hints: ['Level 7 DARK Spellcaster', '2500 ATK / 2100 DEF', 'Yugi\'s signature monster', 'The ultimate wizard'],
    answer: 'Dark Magician',
    image: 'https://images.ygoprodeck.com/images/cards/46986414.jpg',
    options: ['Dark Magician', 'Dark Magician Girl', 'Magician of Black Chaos', 'Sorcerer of Dark Magic'],
    xpReward: 15,
  },
  {
    type: 'guess_card',
    category: 'sports',
    hints: ['Hit king with 4,256 hits', 'Played for the Reds', 'Nicknamed "Charlie Hustle"', 'Banned from baseball'],
    answer: 'Pete Rose',
    image: 'https://www.thesportsdb.com/images/media/player/thumb/wlzhm01747758742.jpg',
    options: ['Pete Rose', 'Ty Cobb', 'Hank Aaron', 'Derek Jeter'],
    xpReward: 20,
  },
];

// ==================== GAME: COLLECTION BUILDER ====================
interface CollectionChallenge {
  type: 'collection_challenge';
  name: string;
  description: string;
  requirements: Array<{
    category: string;
    count: number;
    rarity?: string;
  }>;
  rewards: {
    xp: number;
    badge?: string;
    title?: string;
  };
}

const COLLECTION_CHALLENGES: CollectionChallenge[] = [
  {
    type: 'collection_challenge',
    name: 'Starter Collector',
    description: 'Add your first 10 cards to your collection',
    requirements: [{ category: 'any', count: 10 }],
    rewards: { xp: 100, badge: 'starter_collector' },
  },
  {
    type: 'collection_challenge',
    name: 'Pokemon Master',
    description: 'Collect 50 Pokemon cards',
    requirements: [{ category: 'pokemon', count: 50 }],
    rewards: { xp: 500, badge: 'pokemon_master', title: 'Pokemon Master' },
  },
  {
    type: 'collection_challenge',
    name: 'Planeswalker',
    description: 'Collect 25 Magic: The Gathering cards',
    requirements: [{ category: 'mtg', count: 25 }],
    rewards: { xp: 300, badge: 'planeswalker' },
  },
  {
    type: 'collection_challenge',
    name: 'Duelist',
    description: 'Collect 25 Yu-Gi-Oh! cards',
    requirements: [{ category: 'yugioh', count: 25 }],
    rewards: { xp: 300, badge: 'duelist' },
  },
  {
    type: 'collection_challenge',
    name: 'Sports Fanatic',
    description: 'Collect 30 sports cards',
    requirements: [{ category: 'sports', count: 30 }],
    rewards: { xp: 350, badge: 'sports_fanatic' },
  },
  {
    type: 'collection_challenge',
    name: 'Grade Hunter',
    description: 'Add 5 graded cards (PSA/BGS/CGC) to your collection',
    requirements: [{ category: 'any', count: 5, rarity: 'graded' }],
    rewards: { xp: 400, badge: 'grade_hunter', title: 'Grade Hunter' },
  },
];

// ==================== GAME: DAILY CHALLENGE ====================
function getDailyChallenge(): object {
  const today = new Date().toDateString();
  const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const index = seed % GUESS_CARD_GAMES.length;
  
  return {
    type: 'daily_challenge',
    date: today,
    game: GUESS_CARD_GAMES[index],
    bonusXp: 50,
    streak: true,
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameType = searchParams.get('type');
  const category = searchParams.get('category');

  // Daily challenge
  if (gameType === 'daily') {
    return NextResponse.json({
      success: true,
      game: getDailyChallenge(),
    });
  }

  // Price guessing game
  if (gameType === 'price_guess') {
    const games = category 
      ? PRICE_GUESS_CARDS.filter(g => g.card.category === category)
      : PRICE_GUESS_CARDS;
    const random = games[Math.floor(Math.random() * games.length)];
    return NextResponse.json({ success: true, game: random });
  }

  // Guess the card game
  if (gameType === 'guess_card') {
    const games = category
      ? GUESS_CARD_GAMES.filter(g => g.category === category)
      : GUESS_CARD_GAMES;
    const random = games[Math.floor(Math.random() * games.length)];
    return NextResponse.json({ success: true, game: random });
  }

  // Collection challenges
  if (gameType === 'challenges') {
    return NextResponse.json({
      success: true,
      challenges: COLLECTION_CHALLENGES,
    });
  }

  // Return all game types
  return NextResponse.json({
    success: true,
    gameTypes: [
      { id: 'price_guess', name: 'Price is Right', description: 'Guess the value of rare cards' },
      { id: 'guess_card', name: 'Guess the Card', description: 'Identify cards from hints' },
      { id: 'daily', name: 'Daily Challenge', description: 'New challenge every day' },
      { id: 'challenges', name: 'Collection Challenges', description: 'Complete collecting goals' },
    ],
    categories: ['pokemon', 'mtg', 'yugioh', 'sports'],
    dailyChallenge: getDailyChallenge(),
  });
}
