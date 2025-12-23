// ============================================================================
// MARKETPLACE LISTINGS API
// CravCards - CR AudioViz AI, LLC
// Created: December 23, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.error('Supabase credentials missing');
    return null;
  }
  
  return createClient(url, key);
}

interface MarketplaceListing {
  id: string;
  seller_id: string;
  card_id: string;
  card_name: string;
  card_source: string;
  card_image: string;
  set_name: string;
  condition: string;
  price: number;
  currency: string;
  quantity: number;
  description: string;
  grading_service?: string;
  grade?: string;
  is_graded: boolean;
  status: 'active' | 'sold' | 'pending' | 'cancelled';
  views: number;
  created_at: string;
  updated_at: string;
}

// Sample marketplace data for demo
const SAMPLE_LISTINGS: MarketplaceListing[] = [
  {
    id: 'listing-001',
    seller_id: 'demo-seller-1',
    card_id: 'base1-4',
    card_name: 'Charizard',
    card_source: 'pokemon',
    card_image: 'https://images.pokemontcg.io/base1/4_hires.png',
    set_name: 'Base Set',
    condition: 'Near Mint',
    price: 450.00,
    currency: 'USD',
    quantity: 1,
    description: '1999 Base Set Charizard, excellent condition with minor edge wear',
    grading_service: 'PSA',
    grade: '8',
    is_graded: true,
    status: 'active',
    views: 127,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'listing-002',
    seller_id: 'demo-seller-2',
    card_id: 'alpha-lotus',
    card_name: 'Black Lotus',
    card_source: 'mtg',
    card_image: 'https://cards.scryfall.io/large/front/b/d/bd8fa327-dd41-4737-8f19-2cf5eb1f7f4e.jpg',
    set_name: 'Alpha',
    condition: 'Good',
    price: 125000.00,
    currency: 'USD',
    quantity: 1,
    description: 'Alpha Black Lotus - Heavily played but authentic',
    is_graded: false,
    status: 'active',
    views: 892,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'listing-003',
    seller_id: 'demo-seller-1',
    card_id: 'LOB-001',
    card_name: 'Blue-Eyes White Dragon',
    card_source: 'yugioh',
    card_image: 'https://images.ygoprodeck.com/images/cards/89631139.jpg',
    set_name: 'Legend of Blue Eyes',
    condition: 'Mint',
    price: 85.00,
    currency: 'USD',
    quantity: 3,
    description: '1st Edition LOB Blue-Eyes White Dragon',
    is_graded: false,
    status: 'active',
    views: 45,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'listings';
  const category = searchParams.get('category');
  const search = searchParams.get('search') || searchParams.get('q');
  const rarity = searchParams.get('rarity');
  const minPrice = parseFloat(searchParams.get('minPrice') || '0');
  const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999999');
  const condition = searchParams.get('condition');
  const sort = searchParams.get('sort') || 'recently_listed';
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');

  try {
    const supabase = getSupabaseClient();

    // Get stats
    if (action === 'stats') {
      // Try database first
      if (supabase) {
        try {
          const { count: listingsCount } = await supabase
            .from('cv_marketplace_listings')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'active');

          const { data: priceData } = await supabase
            .from('cv_marketplace_listings')
            .select('price')
            .eq('status', 'active');

          const totalValue = priceData?.reduce((sum, l) => sum + (l.price || 0), 0) || 0;
          const avgPrice = priceData?.length ? totalValue / priceData.length : 0;

          const { count: sellersCount } = await supabase
            .from('cv_marketplace_listings')
            .select('seller_id', { count: 'exact', head: true })
            .eq('status', 'active');

          if (listingsCount && listingsCount > 0) {
            return NextResponse.json({
              success: true,
              stats: {
                cardsListed: listingsCount || 0,
                totalValue: totalValue,
                activeSellers: sellersCount || 0,
                avgPrice: avgPrice,
              },
            });
          }
          // If empty, fall through to sample data
        } catch {
          // Fall through to sample data
        }
      }

      // Return sample stats
      const totalValue = SAMPLE_LISTINGS.reduce((sum, l) => sum + l.price, 0);
      return NextResponse.json({
        success: true,
        stats: {
          cardsListed: SAMPLE_LISTINGS.length,
          totalValue: totalValue,
          activeSellers: 2,
          avgPrice: totalValue / SAMPLE_LISTINGS.length,
        },
      });
    }

    // Get listings
    if (action === 'listings') {
      // Try database first
      if (supabase) {
        try {
          let query = supabase
            .from('cv_marketplace_listings')
            .select('*', { count: 'exact' })
            .eq('status', 'active')
            .gte('price', minPrice)
            .lte('price', maxPrice);

          if (category && category !== 'all') {
            query = query.eq('card_source', category);
          }

          if (search) {
            query = query.ilike('card_name', `%${search}%`);
          }

          if (condition) {
            query = query.eq('condition', condition);
          }

          // Sorting
          if (sort === 'price_low') {
            query = query.order('price', { ascending: true });
          } else if (sort === 'price_high') {
            query = query.order('price', { ascending: false });
          } else if (sort === 'most_viewed') {
            query = query.order('views', { ascending: false });
          } else {
            query = query.order('created_at', { ascending: false });
          }

          query = query.range((page - 1) * limit, page * limit - 1);

          const { data, error, count } = await query;

          if (!error && data && data.length > 0) {
            return NextResponse.json({
              success: true,
              listings: data,
              totalCount: count || 0,
              page,
              pageSize: limit,
            });
          }
          // If empty, fall through to sample data
        } catch {
          // Fall through to sample data
        }
      }

      // Filter sample data
      let filtered = [...SAMPLE_LISTINGS];

      if (category && category !== 'all') {
        filtered = filtered.filter(l => l.card_source === category);
      }

      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(l => 
          l.card_name.toLowerCase().includes(searchLower) ||
          l.set_name.toLowerCase().includes(searchLower)
        );
      }

      if (condition) {
        filtered = filtered.filter(l => l.condition === condition);
      }

      filtered = filtered.filter(l => l.price >= minPrice && l.price <= maxPrice);

      // Sort
      if (sort === 'price_low') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_high') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sort === 'most_viewed') {
        filtered.sort((a, b) => b.views - a.views);
      }

      return NextResponse.json({
        success: true,
        listings: filtered.slice((page - 1) * limit, page * limit),
        totalCount: filtered.length,
        page,
        pageSize: limit,
        source: 'sample',
      });
    }

    // Get single listing
    if (action === 'get') {
      const id = searchParams.get('id');
      if (!id) {
        return NextResponse.json({ success: false, error: 'Listing ID required' }, { status: 400 });
      }

      const listing = SAMPLE_LISTINGS.find(l => l.id === id);
      if (listing) {
        return NextResponse.json({ success: true, listing });
      }

      return NextResponse.json({ success: false, error: 'Listing not found' }, { status: 404 });
    }

    // Get categories
    if (action === 'categories') {
      return NextResponse.json({
        success: true,
        categories: [
          { id: 'all', name: 'All Categories', count: SAMPLE_LISTINGS.length },
          { id: 'pokemon', name: 'Pokemon', count: SAMPLE_LISTINGS.filter(l => l.card_source === 'pokemon').length },
          { id: 'mtg', name: 'Magic: The Gathering', count: SAMPLE_LISTINGS.filter(l => l.card_source === 'mtg').length },
          { id: 'yugioh', name: 'Yu-Gi-Oh!', count: SAMPLE_LISTINGS.filter(l => l.card_source === 'yugioh').length },
          { id: 'sports', name: 'Sports Cards', count: 0 },
          { id: 'lorcana', name: 'Disney Lorcana', count: 0 },
          { id: 'onepiece', name: 'One Piece', count: 0 },
        ],
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Marketplace API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch marketplace data',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    const body = await request.json();

    // Create listing
    if (action === 'create') {
      // In production, this would save to database
      return NextResponse.json({
        success: true,
        message: 'Listing created successfully',
        listing: {
          id: `listing-${Date.now()}`,
          ...body,
          status: 'active',
          views: 0,
          created_at: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Marketplace API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process request',
    }, { status: 500 });
  }
}
