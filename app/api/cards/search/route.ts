// ============================================================================
// UNIFIED CARD SEARCH API - USES INTERNAL ROUTES
// Pokemon, MTG, Yu-Gi-Oh, Lorcana, Sports
// CravCards - CR AudioViz AI, LLC
// Fixed: December 16, 2025 - Calls internal APIs for reliability
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

interface SearchResult {
  id: string;
  name: string;
  category: string;
  set_name: string;
  card_number: string;
  rarity: string;
  image_url: string;
  market_price: number | null;
  source: string;
  type?: string;
  team?: string;
  sport?: string;
}

// Get the base URL for internal API calls
function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get('host') || 'cravcards.com';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

// Helper function with timeout
async function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  let timeoutId: NodeJS.Timeout;
  const timeoutPromise = new Promise<T>((resolve) => {
    timeoutId = setTimeout(() => resolve(fallback), ms);
  });
  
  return Promise.race([
    promise.then(result => {
      clearTimeout(timeoutId);
      return result;
    }),
    timeoutPromise
  ]);
}

// Search Pokemon via internal API
async function searchPokemon(query: string, baseUrl: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${baseUrl}/api/pokemon?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    if (!data.success) return [];
    
    return (data.cards || []).slice(0, 15).map((card: any) => ({
      id: `pokemon-${card.id}`,
      name: card.name,
      category: 'pokemon',
      set_name: card.set_name || 'Pokemon TCG',
      card_number: card.card_number || '',
      rarity: card.rarity || 'Common',
      image_url: card.image_url || '',
      market_price: card.price_market || card.price_mid || null,
      source: 'Pokemon TCG',
    }));
  } catch (err) {
    console.error('Pokemon search error:', err);
    return [];
  }
}

// Search MTG via internal API
async function searchMTG(query: string, baseUrl: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${baseUrl}/api/mtg?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    if (!data.success) return [];
    
    return (data.cards || []).slice(0, 15).map((card: any) => ({
      id: `mtg-${card.id}`,
      name: card.name,
      category: 'mtg',
      set_name: card.set_name || 'Magic: The Gathering',
      card_number: card.card_number || '',
      rarity: card.rarity || 'common',
      image_url: card.image_normal || card.image_small || '',
      market_price: card.market_price || null,
      source: 'Scryfall',
    }));
  } catch (err) {
    console.error('MTG search error:', err);
    return [];
  }
}

// Search Yu-Gi-Oh via internal API
async function searchYuGiOh(query: string, baseUrl: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${baseUrl}/api/yugioh?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    if (!data.success) return [];
    
    return (data.cards || []).slice(0, 15).map((card: any) => ({
      id: `yugioh-${card.id}`,
      name: card.name,
      category: 'yugioh',
      set_name: card.set_name || 'Yu-Gi-Oh',
      card_number: card.set_code || '',
      rarity: card.rarity || 'Common',
      image_url: card.image_url || '',
      market_price: card.market_price || card.price_tcgplayer || null,
      source: 'YGOProDeck',
    }));
  } catch (err) {
    console.error('Yu-Gi-Oh search error:', err);
    return [];
  }
}

// Search Lorcana via internal API
async function searchLorcana(query: string, baseUrl: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${baseUrl}/api/lorcana?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    if (!data.success) return [];
    
    return (data.cards || []).slice(0, 15).map((card: any) => ({
      id: `lorcana-${card.id || card.name.replace(/\s+/g, '-')}`,
      name: card.name,
      category: 'lorcana',
      set_name: card.set_name || 'Disney Lorcana',
      card_number: card.card_number || '',
      rarity: card.rarity || 'Common',
      image_url: card.image_url || '',
      market_price: null,
      source: 'Lorcana',
    }));
  } catch (err) {
    console.error('Lorcana search error:', err);
    return [];
  }
}

// Search Sports via internal API
async function searchSports(query: string, baseUrl: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${baseUrl}/api/sports?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    
    const data = await response.json();
    if (!data.success) return [];
    
    return (data.cards || []).slice(0, 15).map((card: any) => ({
      id: card.id || `athlete-${card.name.replace(/\s+/g, '-')}`,
      name: card.name,
      category: card.category || 'sports',
      set_name: card.set_name || `${card.name} Trading Cards`,
      card_number: card.card_number || 'Various',
      rarity: card.rarity || 'Various',
      image_url: card.image_url || '',
      market_price: null,
      source: 'TheSportsDB',
      type: 'Athlete',
      team: card.team,
      sport: card.sport,
    }));
  } catch (err) {
    console.error('Sports search error:', err);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || searchParams.get('query');
  const category = searchParams.get('category')?.toLowerCase();
  const limit = Math.min(parseInt(searchParams.get('limit') || '30'), 50);

  if (!query || query.length < 2) {
    return NextResponse.json({
      success: false,
      error: 'Search query must be at least 2 characters',
    }, { status: 400 });
  }

  const baseUrl = getBaseUrl(request);
  const searchAll = !category || category === 'all';
  const TIMEOUT = 10000;
  
  // Run all 5 searches in parallel using internal APIs
  const [pokemonResults, mtgResults, yugiohResults, lorcanaResults, sportsResults] = await Promise.all([
    (searchAll || category === 'pokemon') 
      ? withTimeout(searchPokemon(query, baseUrl), TIMEOUT, []) 
      : Promise.resolve([]),
    (searchAll || category === 'mtg') 
      ? withTimeout(searchMTG(query, baseUrl), TIMEOUT, []) 
      : Promise.resolve([]),
    (searchAll || category === 'yugioh') 
      ? withTimeout(searchYuGiOh(query, baseUrl), TIMEOUT, []) 
      : Promise.resolve([]),
    (searchAll || category === 'lorcana') 
      ? withTimeout(searchLorcana(query, baseUrl), TIMEOUT, []) 
      : Promise.resolve([]),
    (searchAll || category === 'sports' || category?.startsWith('sports_')) 
      ? withTimeout(searchSports(query, baseUrl), TIMEOUT, []) 
      : Promise.resolve([]),
  ]);

  // Combine all results
  let allResults = [...pokemonResults, ...mtgResults, ...yugiohResults, ...lorcanaResults, ...sportsResults];

  // Sort: exact matches first
  const queryLower = query.toLowerCase();
  allResults.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    if (aName === queryLower && bName !== queryLower) return -1;
    if (bName === queryLower && aName !== queryLower) return 1;
    if (aName.startsWith(queryLower) && !bName.startsWith(queryLower)) return -1;
    if (bName.startsWith(queryLower) && !aName.startsWith(queryLower)) return 1;
    return aName.localeCompare(bName);
  });

  const finalResults = allResults.slice(0, limit);
  const responseTime = Date.now() - startTime;

  return NextResponse.json({
    success: true,
    query,
    results: finalResults,
    totalCount: allResults.length,
    returnedCount: finalResults.length,
    responseTimeMs: responseTime,
    sources: {
      pokemon: pokemonResults.length > 0,
      mtg: mtgResults.length > 0,
      yugioh: yugiohResults.length > 0,
      lorcana: lorcanaResults.length > 0,
      sports: sportsResults.length > 0,
    },
    coverage: {
      pokemon: '18,000+ cards from pokemontcg.io',
      mtg: '27,000+ cards from Scryfall',
      yugioh: '10,000+ cards from YGOProDeck',
      lorcana: '1,000+ cards from Lorcana API',
      sports: '100,000+ athletes from TheSportsDB',
    },
  });
}

export const maxDuration = 15;
