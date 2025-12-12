// ============================================================================
// POKEMON TCG API - FREE ACCESS TO 18,000+ CARDS
// CravCards - CR AudioViz AI, LLC
// Created: December 12, 2025
// Fixed: December 12, 2025 - Query syntax correction
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';

const POKEMON_TCG_API = 'https://api.pokemontcg.io/v2';

interface PokemonCard {
  id: string;
  name: string;
  supertype: string;
  subtypes?: string[];
  hp?: string;
  types?: string[];
  set: {
    id: string;
    name: string;
    series: string;
    releaseDate: string;
    images: {
      symbol: string;
      logo: string;
    };
  };
  number: string;
  artist?: string;
  rarity?: string;
  images: {
    small: string;
    large: string;
  };
  tcgplayer?: {
    url: string;
    updatedAt: string;
    prices?: Record<string, { low?: number; mid?: number; high?: number; market?: number }>;
  };
  cardmarket?: {
    url: string;
    updatedAt: string;
    prices?: { averageSellPrice?: number; trendPrice?: number };
  };
}

interface TransformedCard {
  id: string;
  name: string;
  category: string;
  set_name: string;
  set_id: string;
  card_number: string;
  rarity: string;
  image_url: string;
  image_large: string;
  artist: string;
  types: string[];
  hp: string;
  price_low: number | null;
  price_mid: number | null;
  price_high: number | null;
  price_market: number | null;
  tcgplayer_url: string | null;
  cardmarket_url: string | null;
  release_date: string;
  source: string;
}

function transformCard(card: PokemonCard): TransformedCard {
  // Get best available price
  const prices = card.tcgplayer?.prices;
  let priceData = { low: null as number | null, mid: null as number | null, high: null as number | null, market: null as number | null };
  
  if (prices) {
    // Check price variants in order of preference
    const variants = ['holofoil', 'reverseHolofoil', 'normal', '1stEditionHolofoil', '1stEditionNormal'];
    for (const variant of variants) {
      if (prices[variant]) {
        priceData = {
          low: prices[variant].low ?? null,
          mid: prices[variant].mid ?? null,
          high: prices[variant].high ?? null,
          market: prices[variant].market ?? null,
        };
        break;
      }
    }
  }

  return {
    id: card.id,
    name: card.name,
    category: 'pokemon',
    set_name: card.set.name,
    set_id: card.set.id,
    card_number: card.number,
    rarity: card.rarity || 'Unknown',
    image_url: card.images.small,
    image_large: card.images.large,
    artist: card.artist || 'Unknown',
    types: card.types || [],
    hp: card.hp || 'N/A',
    price_low: priceData.low,
    price_mid: priceData.mid,
    price_high: priceData.high,
    price_market: priceData.market,
    tcgplayer_url: card.tcgplayer?.url || null,
    cardmarket_url: card.cardmarket?.url || null,
    release_date: card.set.releaseDate,
    source: 'pokemontcg.io',
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const cardId = searchParams.get('id');
  const setId = searchParams.get('set');
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || searchParams.get('pageSize') || '20';
  const type = searchParams.get('type');

  try {
    // Get specific card by ID
    if (cardId) {
      const response = await fetch(`${POKEMON_TCG_API}/cards/${cardId}`, {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 3600 },
      });

      if (!response.ok) {
        throw new Error(`Pokemon API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({
        success: true,
        card: transformCard(data.data),
      });
    }

    // List all sets
    if (type === 'sets') {
      const response = await fetch(`${POKEMON_TCG_API}/sets?orderBy=-releaseDate`, {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 86400 },
      });

      if (!response.ok) {
        throw new Error(`Pokemon API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json({
        success: true,
        sets: data.data,
        totalCount: data.totalCount,
      });
    }

    // Search cards - FIXED QUERY SYNTAX
    const queryParts: string[] = [];
    
    if (query) {
      // Pokemon TCG API uses simple name search without wildcards for partial match
      queryParts.push(`name:${query}`);
    }
    
    if (setId) {
      queryParts.push(`set.id:${setId}`);
    }

    const url = new URL(`${POKEMON_TCG_API}/cards`);
    if (queryParts.length > 0) {
      url.searchParams.set('q', queryParts.join(' '));
    }
    url.searchParams.set('page', page);
    url.searchParams.set('pageSize', limit);
    url.searchParams.set('orderBy', '-set.releaseDate');

    console.log('Pokemon API URL:', url.toString());

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pokemon API Error:', response.status, errorText);
      throw new Error(`Pokemon API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      cards: (data.data || []).map(transformCard),
      totalCount: data.totalCount || 0,
      page: parseInt(page),
      pageSize: parseInt(limit),
      source: 'pokemontcg.io',
    });

  } catch (error) {
    console.error('Pokemon API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch Pokemon cards',
        cards: []
      },
      { status: 500 }
    );
  }
}
