// ============================================================================
// CARD MUSEUM & HISTORY API
// Comprehensive educational content about trading card history
// CravCards - CR AudioViz AI, LLC
// Created: December 16, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const MUSEUM_EXHIBITS = {
  timeline: [
    {
      year: 1860,
      era: 'Origins',
      title: 'First Baseball Cards',
      description: 'The earliest known baseball cards were team photographs produced during the Civil War era.',
      image: '/museum/1860-baseball.jpg',
      significance: 'Birth of the sports card industry',
    },
    {
      year: 1886,
      era: 'Tobacco Era',
      title: 'Old Judge Cigarettes',
      description: 'Goodwin & Company produced the first widely distributed baseball cards as tobacco inserts.',
      image: '/museum/1886-old-judge.jpg',
      significance: 'First mass-produced trading cards',
    },
    {
      year: 1909,
      era: 'Tobacco Era',
      title: 'T206 Honus Wagner',
      description: 'The most famous baseball card ever made. Wagner requested removal due to his opposition to tobacco.',
      image: '/museum/1909-wagner.jpg',
      significance: 'The "Holy Grail" of card collecting',
      record_sale: '$6.6 million (2021)',
    },
    {
      year: 1933,
      era: 'Gum Era',
      title: 'Goudey Gum Company',
      description: 'Goudey revolutionized cards by packaging them with bubble gum instead of tobacco.',
      image: '/museum/1933-goudey.jpg',
      significance: 'Made cards accessible to children',
    },
    {
      year: 1952,
      era: 'Modern Era Begins',
      title: 'Topps Mickey Mantle',
      description: 'The 1952 Topps set established the modern baseball card format. Card #311 Mickey Mantle is the crown jewel.',
      image: '/museum/1952-mantle.jpg',
      significance: 'Most valuable post-war baseball card',
      record_sale: '$12.6 million (2022)',
    },
    {
      year: 1986,
      era: 'Basketball Boom',
      title: 'Fleer Michael Jordan RC',
      description: 'The 1986-87 Fleer #57 Michael Jordan rookie card defined basketball card collecting.',
      image: '/museum/1986-jordan.jpg',
      significance: 'Most iconic basketball card ever',
      record_sale: '$738,000 PSA 10 (2021)',
    },
    {
      year: 1993,
      era: 'TCG Revolution',
      title: 'Magic: The Gathering Released',
      description: 'Richard Garfield creates the first collectible trading card game, revolutionizing the hobby.',
      image: '/museum/1993-mtg.jpg',
      significance: 'Birth of the TCG genre',
    },
    {
      year: 1996,
      era: 'Pokémon Begins',
      title: 'Pokémon TCG Japan Release',
      description: 'Media Factory releases the Pokémon Trading Card Game in Japan, creating a global phenomenon.',
      image: '/museum/1996-pokemon.jpg',
      significance: 'Largest TCG in the world',
    },
    {
      year: 1999,
      era: 'Pokémon USA',
      title: 'Pokémon Base Set English',
      description: 'Wizards of the Coast releases the English Pokémon TCG. First Edition Charizard becomes legendary.',
      image: '/museum/1999-charizard.jpg',
      significance: 'Most recognized trading card',
      record_sale: '$420,000 PSA 10 (2022)',
    },
    {
      year: 2002,
      era: 'Anime TCGs',
      title: 'Yu-Gi-Oh! English Release',
      description: 'Upper Deck releases Yu-Gi-Oh! in English, bringing anime card games to Western audiences.',
      image: '/museum/2002-yugioh.jpg',
      significance: 'Second-largest TCG globally',
    },
    {
      year: 2020,
      era: 'Modern Boom',
      title: 'COVID Card Boom',
      description: 'The pandemic sparked unprecedented interest in trading cards, breaking all price records.',
      image: '/museum/2020-boom.jpg',
      significance: 'Card values increased 200-500%',
    },
    {
      year: 2023,
      era: 'Disney Era',
      title: 'Disney Lorcana Debuts',
      description: 'Ravensburger launches Disney Lorcana, the first major new TCG from Disney.',
      image: '/museum/2023-lorcana.jpg',
      significance: 'Fastest-selling TCG debut ever',
    },
  ],

  hallOfFame: [
    {
      id: 'hof-1',
      name: '1952 Topps Mickey Mantle #311',
      category: 'Sports',
      description: 'The cornerstone of post-war baseball card collecting. Topps\' first major set established the standard card format still used today.',
      estimated_value: '$5,000,000 - $12,600,000',
      population_psa10: 3,
      why_valuable: ['Iconic player', 'First major Topps set', 'High number (often damaged)', 'Beautiful design'],
      image: '/museum/hof-mantle.jpg',
    },
    {
      id: 'hof-2',
      name: 'T206 Honus Wagner',
      category: 'Sports',
      description: 'The "Mona Lisa" of baseball cards. Wagner requested the card be pulled, creating extreme scarcity.',
      estimated_value: '$3,000,000 - $7,250,000',
      known_examples: 60,
      why_valuable: ['Extreme rarity', 'Historical significance', 'Mystery of the pullback', 'Pre-war artifact'],
      image: '/museum/hof-wagner.jpg',
    },
    {
      id: 'hof-3',
      name: 'Alpha Black Lotus',
      category: 'MTG',
      description: 'The most powerful and valuable Magic card ever printed. Provides three mana of any color for zero cost.',
      estimated_value: '$100,000 - $540,000',
      print_run: 1100,
      why_valuable: ['Most powerful card ever', 'Reserved List', 'Alpha rarity', 'Game-defining'],
      image: '/museum/hof-lotus.jpg',
    },
    {
      id: 'hof-4',
      name: '1st Edition Shadowless Charizard',
      category: 'Pokemon',
      description: 'The holy grail of Pokémon cards. The Fire-type dragon captured hearts of a generation.',
      estimated_value: '$200,000 - $420,000',
      population_psa10: 121,
      why_valuable: ['Iconic Pokémon', '1st Edition', 'Shadowless variant', 'Nostalgic value'],
      image: '/museum/hof-charizard.jpg',
    },
    {
      id: 'hof-5',
      name: 'Pikachu Illustrator',
      category: 'Pokemon',
      description: 'The rarest Pokémon card in existence. Only 39 were ever produced as contest prizes.',
      estimated_value: '$900,000 - $5,275,000',
      known_examples: 39,
      why_valuable: ['Extreme rarity', 'Contest prize only', 'Unique artwork', 'PSA 10 = 1 exists'],
      image: '/museum/hof-illustrator.jpg',
    },
    {
      id: 'hof-6',
      name: '1986-87 Fleer Michael Jordan RC #57',
      category: 'Sports',
      description: 'The greatest basketball player\'s rookie card. Defines basketball card collecting.',
      estimated_value: '$50,000 - $738,000',
      population_psa10: 316,
      why_valuable: ['GOAT player', 'Beautiful design', 'First Fleer basketball', 'Cultural icon'],
      image: '/museum/hof-jordan.jpg',
    },
    {
      id: 'hof-7',
      name: 'Tournament Black Luster Soldier',
      category: 'Yu-Gi-Oh',
      description: 'Given to the winner of the first ever Yu-Gi-Oh tournament in 1999. Only one exists.',
      estimated_value: '$2,000,000+',
      known_examples: 1,
      why_valuable: ['One of one', 'Tournament prize', 'Historical significance', 'Stainless steel'],
      image: '/museum/hof-bls.jpg',
    },
    {
      id: 'hof-8',
      name: '2009 Bowman Chrome Mike Trout Superfractor',
      category: 'Sports',
      description: 'The defining modern baseball card. The 1/1 Superfractor set the standard for prospect cards.',
      estimated_value: '$3,900,000+',
      known_examples: 1,
      why_valuable: ['Best active player', '1/1 Superfractor', 'Modern era icon', 'Bowman Chrome prestige'],
      image: '/museum/hof-trout.jpg',
    },
  ],

  categories: {
    pokemon: {
      name: 'Pokémon TCG',
      founded: 1996,
      founder: 'Media Factory / Nintendo',
      headquarters: 'Tokyo, Japan',
      total_cards: '15,000+',
      notable_sets: ['Base Set', 'Neo Genesis', 'Skyridge', 'Gold Star Series', 'Scarlet & Violet'],
      interesting_facts: [
        'Largest TCG in the world by revenue',
        'Over 52 billion cards sold worldwide',
        'Available in 13 languages',
        'First TCG based on a video game',
      ],
    },
    mtg: {
      name: 'Magic: The Gathering',
      founded: 1993,
      founder: 'Richard Garfield / Wizards of the Coast',
      headquarters: 'Renton, Washington',
      total_cards: '27,000+',
      notable_sets: ['Alpha/Beta/Unlimited', 'Arabian Nights', 'Legends', 'Reserved List'],
      interesting_facts: [
        'First collectible trading card game ever',
        'Over 50 million players worldwide',
        'Inspired the entire TCG industry',
        'Has its own Pro Tour with $1M+ prizes',
      ],
    },
    yugioh: {
      name: 'Yu-Gi-Oh! TCG',
      founded: 1999,
      founder: 'Kazuki Takahashi / Konami',
      headquarters: 'Tokyo, Japan',
      total_cards: '12,000+',
      notable_sets: ['Legend of Blue Eyes', 'Metal Raiders', 'Pharaoh\'s Servant', 'Ghosts From the Past'],
      interesting_facts: [
        'Guinness World Record: Most players at a TCG tournament',
        'Based on a manga/anime series',
        'No rotation - all cards legal in some format',
        'Speed Duel format for faster games',
      ],
    },
    sports: {
      name: 'Sports Trading Cards',
      founded: 1860,
      major_producers: 'Topps, Panini, Upper Deck, Fanatics',
      headquarters: 'Various',
      notable_sets: ['1952 Topps', 'T206', '1986 Fleer', 'Bowman Chrome'],
      interesting_facts: [
        'Oldest form of trading cards',
        'Baseball cards originally came in tobacco products',
        'The "Junk Wax Era" (1987-1994) overproduced millions of cards',
        'Fanatics acquired Topps in 2022 for $500M',
      ],
    },
    lorcana: {
      name: 'Disney Lorcana',
      founded: 2023,
      founder: 'Ravensburger',
      headquarters: 'Ravensburg, Germany',
      total_cards: '1,000+',
      notable_sets: ['The First Chapter', 'Rise of the Floodborn', 'Into the Inklands', 'Ursula\'s Return'],
      interesting_facts: [
        'Fastest-selling new TCG in history',
        'Sold out globally within hours of release',
        'Uses Disney characters in unique art styles',
        'Designed to be accessible to new players',
      ],
    },
  },

  learningPaths: [
    {
      id: 'beginner-collecting',
      title: 'Getting Started with Card Collecting',
      description: 'Learn the basics of trading card collecting',
      modules: [
        { title: 'Types of Trading Cards', duration: '10 min' },
        { title: 'Understanding Card Conditions', duration: '15 min' },
        { title: 'Where to Buy Cards Safely', duration: '10 min' },
        { title: 'Protecting Your Collection', duration: '10 min' },
        { title: 'Your First Cards: What to Collect', duration: '15 min' },
      ],
    },
    {
      id: 'grading-101',
      title: 'Card Grading Fundamentals',
      description: 'Understand professional card grading',
      modules: [
        { title: 'Why Grade Cards?', duration: '10 min' },
        { title: 'PSA vs BGS vs CGC vs SGC', duration: '20 min' },
        { title: 'Understanding the Grading Scale', duration: '15 min' },
        { title: 'How to Submit Cards', duration: '15 min' },
        { title: 'Is Grading Worth It?', duration: '10 min' },
      ],
    },
    {
      id: 'investing-basics',
      title: 'Card Investment Strategies',
      description: 'Learn to invest wisely in trading cards',
      modules: [
        { title: 'Cards as Alternative Assets', duration: '15 min' },
        { title: 'Identifying Valuable Cards', duration: '20 min' },
        { title: 'Market Trends and Timing', duration: '15 min' },
        { title: 'Risk Management', duration: '15 min' },
        { title: 'Building a Portfolio', duration: '20 min' },
      ],
    },
  ],
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');
  const category = searchParams.get('category');

  if (section === 'timeline') {
    return NextResponse.json({
      success: true,
      data: MUSEUM_EXHIBITS.timeline,
      total: MUSEUM_EXHIBITS.timeline.length,
    });
  }

  if (section === 'hall-of-fame') {
    return NextResponse.json({
      success: true,
      data: MUSEUM_EXHIBITS.hallOfFame,
      total: MUSEUM_EXHIBITS.hallOfFame.length,
    });
  }

  if (section === 'categories' && category) {
    const catData = MUSEUM_EXHIBITS.categories[category as keyof typeof MUSEUM_EXHIBITS.categories];
    if (catData) {
      return NextResponse.json({ success: true, data: catData });
    }
    return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
  }

  if (section === 'learning') {
    return NextResponse.json({
      success: true,
      data: MUSEUM_EXHIBITS.learningPaths,
    });
  }

  // Return full museum data
  return NextResponse.json({
    success: true,
    data: MUSEUM_EXHIBITS,
    sections: ['timeline', 'hall-of-fame', 'categories', 'learning'],
    description: 'CravCards Museum - Complete Trading Card History',
  });
}
