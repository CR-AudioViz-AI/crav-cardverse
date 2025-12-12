// ============================================================================
// JAVARI AI KNOWLEDGE BASE - CravCards Card Expert
// Complete knowledge base with all required exports
// ============================================================================

export const JAVARI_SYSTEM_PROMPT = `You are Javari, the world's most knowledgeable AI trading card expert. You are part of CravCards, the premium trading card collection platform by CR AudioViz AI.

## Your Expertise Areas:

### POKÉMON TRADING CARD GAME
- Complete knowledge of all sets from Base Set (1999) to present
- Understanding of Japanese vs English releases and pricing differences
- Expertise in identifying 1st Edition, Shadowless, and Unlimited printings
- Knowledge of every Charizard variant and their market values
- Understanding of modern chase cards: Alt Arts, Special Art Rares, Illustration Rares
- Grading nuances specific to Pokémon cards (centering issues, print lines, etc.)

### MAGIC: THE GATHERING
- Complete set knowledge from Alpha (1993) to present
- Reserved List cards and their investment implications
- Format-specific card values (Commander, Modern, Legacy, Vintage, Standard)
- Understanding of card conditions and their impact on value
- Knowledge of famous cards: Black Lotus, Moxen, dual lands, etc.
- Print variations: Alpha vs Beta, 7th Edition foils, Judge promos, etc.

### SPORTS CARDS
- Baseball: T206, Goudey, Bowman, Topps, Upper Deck, Panini
- Basketball: Fleer, Topps Chrome, Prizm, National Treasures
- Football: Topps, Panini, National Treasures, Contenders
- Hockey: O-Pee-Chee, Upper Deck, SP Authentic
- Soccer: Topps, Panini Prizm, Topps Chrome
- Understanding of rookie cards, autos, patches, and serial numbered cards
- Historical sales data and market trends

### YU-GI-OH!
- Knowledge from LOB to present sets
- 1st Edition vs Unlimited pricing
- Ghost Rares, Starlight Rares, and other premium variants
- Understanding of OCG vs TCG differences

### GRADING KNOWLEDGE
- PSA: Population reports, turnaround times, grading standards
- BGS: Subgrades importance, black label 10s, pristine vs gem mint
- CGC: Their grading scale and how it compares
- SGC: Historical significance and modern resurgence
- When to grade vs keep raw
- Cost-benefit analysis of grading submissions

### MARKET INTELLIGENCE
- Price trends and market cycles
- Investment strategies for different budgets
- When to buy and sell for maximum profit
- Red flags for counterfeits and reprints
- Authentication tips

## Your Personality:
- Enthusiastic but professional
- Patient with beginners, deep with experts
- Honest about market risks and uncertainties
- Protective of collectors from scams and bad deals
- Encouraging of all collectors regardless of budget

## Important Notes:
- You're part of CravCards by CR AudioViz AI
- You can help with collection management, pricing, and education
- You support the clubs, trivia, academy, and museum features
- CravCards is part of the CRAV ecosystem alongside CravBarrels
`;

export const CARD_HISTORY = {
  pokemon: {
    baseSet: {
      releaseYear: 1996,
      releaseYearUSA: 1999,
      description: 'The original Pokemon TCG set that started it all',
      notableCards: ['Charizard', 'Blastoise', 'Venusaur', 'Pikachu'],
    },
    topCards: [
      { name: 'Pikachu Illustrator', value: '$5,275,000', year: 1998 },
      { name: '1st Edition Charizard PSA 10', value: '$420,000', year: 1999 },
      { name: 'Trophy Pikachu Gold', value: '$300,000', year: 1998 },
    ],
  },
  mtg: {
    alpha: {
      releaseYear: 1993,
      description: 'The first Magic: The Gathering set',
      notableCards: ['Black Lotus', 'Ancestral Recall', 'Time Walk', 'Mox Sapphire'],
    },
    powerNine: [
      { name: 'Black Lotus', description: 'The most valuable MTG card' },
      { name: 'Ancestral Recall', description: 'Draw 3 cards for 1 blue mana' },
      { name: 'Time Walk', description: 'Take an extra turn for 2 mana' },
      { name: 'Mox Sapphire', description: 'Free blue mana artifact' },
      { name: 'Mox Jet', description: 'Free black mana artifact' },
      { name: 'Mox Pearl', description: 'Free white mana artifact' },
      { name: 'Mox Ruby', description: 'Free red mana artifact' },
      { name: 'Mox Emerald', description: 'Free green mana artifact' },
      { name: 'Timetwister', description: 'Shuffle and draw 7 new cards' },
    ],
  },
  sports: {
    t206: {
      years: '1909-1911',
      description: 'The most famous vintage baseball card set',
      topCard: 'Honus Wagner - sold for over $7 million',
    },
    topps1952: {
      year: 1952,
      description: 'The set that defined modern sports cards',
      topCard: 'Mickey Mantle #311 - sold for $12.6 million',
    },
    junkWaxEra: {
      years: '1986-1994',
      description: 'Era of massive overproduction',
      lesson: 'Most cards from this era are worth very little due to print runs in the billions',
    },
  },
};

export const GRADING_KNOWLEDGE = {
  PSA: {
    name: 'Professional Sports Authenticator',
    founded: 1991,
    scale: '1-10',
    topGrade: 'PSA 10 Gem Mint',
    turnaround: '30 days to 1 year depending on service level',
    strengths: ['Largest market share', 'Best population reports', 'Most liquid market'],
    cost: '$20-$600 depending on value and turnaround',
  },
  BGS: {
    name: 'Beckett Grading Services',
    founded: 1999,
    scale: '1-10 with subgrades',
    topGrade: 'BGS 10 Black Label (all 10 subgrades)',
    subgrades: ['Centering', 'Corners', 'Edges', 'Surface'],
    strengths: ['Detailed subgrades', 'Pristine 10 harder to achieve', 'Premium for Black Labels'],
    cost: '$20-$500 depending on service level',
  },
  CGC: {
    name: 'Certified Guaranty Company',
    founded: '2020 for cards',
    scale: '1-10',
    topGrade: 'CGC 10 Perfect',
    strengths: ['Durable cases', 'Growing acceptance', 'Good for Pokemon'],
    cost: '$15-$300 depending on service level',
  },
  SGC: {
    name: 'Sportscard Guaranty',
    founded: 1998,
    scale: '1-10',
    topGrade: 'SGC 10 Pristine',
    strengths: ['Respected for vintage', 'Tuxedo cases', 'Growing market share'],
    cost: '$15-$200 depending on service level',
  },
};

export const INVESTMENT_STRATEGIES = {
  beginner: {
    budget: '$100-$1,000',
    advice: [
      'Focus on raw cards in NM condition',
      'Target modern chase cards with upside',
      'Avoid PSA 10s until you understand the market',
      'Consider sealed product for long-term holds',
    ],
  },
  intermediate: {
    budget: '$1,000-$10,000',
    advice: [
      'Start buying graded cards strategically',
      'Target low-pop PSA 9s of desirable cards',
      'Diversify across categories',
      'Track market trends on eBay sold listings',
    ],
  },
  advanced: {
    budget: '$10,000+',
    advice: [
      'Target key vintage cards',
      'Consider PSA 10s of iconic cards',
      'Watch population reports for opportunities',
      'Network with other serious collectors',
    ],
  },
  generalTips: [
    'Buy what you love - passion protects against market downturns',
    'Condition is everything - always buy the best you can afford',
    'Research before buying - know the population and recent sales',
    'Be patient - the right card at the right price will come',
    'Store properly - proper storage prevents value loss',
  ],
};

export const FAMOUS_CARDS = [
  {
    name: 'T206 Honus Wagner',
    category: 'sports',
    value: '$7,250,000+',
    year: 1909,
    significance: 'The most valuable sports card ever, pulled from production early',
  },
  {
    name: '1952 Topps Mickey Mantle',
    category: 'sports',
    value: '$12,600,000',
    year: 1952,
    significance: 'The most iconic post-war baseball card',
  },
  {
    name: 'Alpha Black Lotus',
    category: 'mtg',
    value: '$500,000+',
    year: 1993,
    significance: 'The most powerful and valuable MTG card',
  },
  {
    name: 'Pikachu Illustrator',
    category: 'pokemon',
    value: '$5,275,000',
    year: 1998,
    significance: 'Only 39 copies known - rarest Pokemon card',
  },
  {
    name: '1st Edition Charizard',
    category: 'pokemon',
    value: '$420,000 (PSA 10)',
    year: 1999,
    significance: 'The face of Pokemon card collecting',
  },
  {
    name: '1986 Fleer Michael Jordan RC',
    category: 'sports',
    value: '$738,000 (PSA 10)',
    year: 1986,
    significance: 'The most valuable modern sports card',
  },
];

export const CARD_CATEGORIES = {
  pokemon: {
    name: 'Pokémon',
    description: 'Pokémon Trading Card Game',
    icon: '⚡',
  },
  mtg: {
    name: 'Magic: The Gathering',
    description: 'Magic: The Gathering TCG',
    icon: '🔮',
  },
  sports: {
    name: 'Sports Cards',
    description: 'Baseball, Basketball, Football, Hockey, Soccer',
    icon: '⚾',
  },
  yugioh: {
    name: 'Yu-Gi-Oh!',
    description: 'Yu-Gi-Oh! Trading Card Game',
    icon: '🎴',
  },
  other: {
    name: 'Other',
    description: 'Other collectible cards',
    icon: '📇',
  },
};

export const GRADING_COMPANIES = {
  PSA: {
    name: 'Professional Sports Authenticator',
    scale: '1-10',
    topGrade: 'PSA 10 Gem Mint',
  },
  BGS: {
    name: 'Beckett Grading Services',
    scale: '1-10 with subgrades',
    topGrade: 'BGS 10 Black Label',
  },
  CGC: {
    name: 'Certified Guaranty Company',
    scale: '1-10',
    topGrade: 'CGC 10 Perfect',
  },
  SGC: {
    name: 'Sportscard Guaranty',
    scale: '1-10',
    topGrade: 'SGC 10 Pristine',
  },
};
