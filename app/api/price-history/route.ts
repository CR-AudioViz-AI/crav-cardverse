// ============================================================================
// PRICE HISTORY API
// Store and retrieve historical price data for any card
// CravCards - CR AudioViz AI, LLC
// Created: December 17, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface PricePoint {
  date: string;
  price: number;
  source: string;
  condition?: string;
}

interface PriceStats {
  current: number;
  high_52w: number;
  low_52w: number;
  avg_30d: number;
  change_24h: number;
  change_7d: number;
  change_30d: number;
  change_percent_24h: number;
  change_percent_7d: number;
  change_percent_30d: number;
  volatility: number;
}

// GET - Retrieve price history for a card
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cardId = searchParams.get('card_id');
  const category = searchParams.get('category');
  const cardName = searchParams.get('name');
  const period = searchParams.get('period') || '30d';
  const condition = searchParams.get('condition') || 'nm';

  if (!cardId && !cardName) {
    return NextResponse.json({
      success: false,
      error: 'Card ID or name required',
    }, { status: 400 });
  }

  try {
    // Calculate date range
    const now = new Date();
    let startDate: Date;
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      case '5y':
        startDate = new Date(now.getTime() - 5 * 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Try to get from database
    let query = supabase
      .from('cv_price_history')
      .select('*')
      .gte('recorded_at', startDate.toISOString())
      .order('recorded_at', { ascending: true });

    if (cardId) {
      query = query.eq('card_id', cardId);
    }
    if (condition) {
      query = query.eq('condition', condition);
    }

    const { data: dbHistory, error } = await query;

    if (error && error.code !== 'PGRST116') throw error;

    // If we have database history, use it
    if (dbHistory && dbHistory.length > 0) {
      const stats = calculatePriceStats(dbHistory);
      return NextResponse.json({
        success: true,
        card_id: cardId,
        history: dbHistory.map(h => ({
          date: h.recorded_at,
          price: h.price,
          source: h.source,
          condition: h.condition,
        })),
        stats,
        period,
        source: 'database',
      });
    }

    // Generate synthetic history for demo
    const syntheticHistory = generateSyntheticHistory(cardId || cardName || 'unknown', startDate, category);
    const stats = calculatePriceStats(syntheticHistory.map(h => ({ 
      price: h.price, 
      recorded_at: h.date 
    })));

    return NextResponse.json({
      success: true,
      card_id: cardId,
      card_name: cardName,
      history: syntheticHistory,
      stats,
      period,
      source: 'generated',
      note: 'Simulated data - actual prices may vary',
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 });
  }
}

// POST - Record a price point
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { card_id, card_name, category, price, source, condition } = body;

    if (!card_id || !price) {
      return NextResponse.json({
        success: false,
        error: 'Card ID and price required',
      }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('cv_price_history')
      .insert({
        card_id,
        card_name,
        category,
        price,
        source: source || 'manual',
        condition: condition || 'nm',
        recorded_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      price_point: data,
      message: 'Price recorded successfully',
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 });
  }
}

// Helper: Generate synthetic price history
function generateSyntheticHistory(cardId: string, startDate: Date, category?: string | null): PricePoint[] {
  const history: PricePoint[] = [];
  const days = Math.ceil((Date.now() - startDate.getTime()) / (24 * 60 * 60 * 1000));
  
  // Base price varies by category
  let basePrice = 25;
  switch (category) {
    case 'pokemon':
      basePrice = 35;
      break;
    case 'mtg':
      basePrice = 45;
      break;
    case 'sports':
      basePrice = 50;
      break;
    case 'yugioh':
      basePrice = 20;
      break;
  }

  // Add some randomness based on card ID hash
  const hash = cardId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  basePrice = basePrice * (0.5 + (hash % 100) / 50);

  let price = basePrice * 0.9; // Start lower
  
  for (let i = 0; i <= days; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    
    // Daily variance with slight upward trend
    const variance = (Math.random() * 6 - 2.5) / 100;
    const trend = 0.001; // Slight upward trend
    price = price * (1 + variance + trend);
    
    // Add some market events (spikes and dips)
    if (Math.random() < 0.02) { // 2% chance of event
      price = price * (Math.random() > 0.5 ? 1.15 : 0.9);
    }

    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
      source: 'market_avg',
      condition: 'nm',
    });
  }

  return history;
}

// Helper: Calculate price statistics
function calculatePriceStats(history: { price: number; recorded_at: string }[]): PriceStats {
  if (!history || history.length === 0) {
    return {
      current: 0,
      high_52w: 0,
      low_52w: 0,
      avg_30d: 0,
      change_24h: 0,
      change_7d: 0,
      change_30d: 0,
      change_percent_24h: 0,
      change_percent_7d: 0,
      change_percent_30d: 0,
      volatility: 0,
    };
  }

  const prices = history.map(h => h.price);
  const current = prices[prices.length - 1];
  const high52w = Math.max(...prices);
  const low52w = Math.min(...prices);

  // Get specific time period prices
  const now = Date.now();
  const price24hAgo = history.find(h => 
    now - new Date(h.recorded_at).getTime() >= 23 * 60 * 60 * 1000
  )?.price || prices[Math.max(0, prices.length - 2)];
  
  const price7dAgo = history.find(h => 
    now - new Date(h.recorded_at).getTime() >= 6 * 24 * 60 * 60 * 1000
  )?.price || prices[Math.max(0, prices.length - 8)];
  
  const price30dAgo = prices[0];

  // Calculate 30-day average
  const last30 = prices.slice(-30);
  const avg30d = last30.reduce((a, b) => a + b, 0) / last30.length;

  // Calculate changes
  const change24h = current - price24hAgo;
  const change7d = current - price7dAgo;
  const change30d = current - price30dAgo;

  // Calculate volatility (standard deviation of daily returns)
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance) * 100;

  return {
    current: Math.round(current * 100) / 100,
    high_52w: Math.round(high52w * 100) / 100,
    low_52w: Math.round(low52w * 100) / 100,
    avg_30d: Math.round(avg30d * 100) / 100,
    change_24h: Math.round(change24h * 100) / 100,
    change_7d: Math.round(change7d * 100) / 100,
    change_30d: Math.round(change30d * 100) / 100,
    change_percent_24h: price24hAgo > 0 ? Math.round((change24h / price24hAgo) * 10000) / 100 : 0,
    change_percent_7d: price7dAgo > 0 ? Math.round((change7d / price7dAgo) * 10000) / 100 : 0,
    change_percent_30d: price30dAgo > 0 ? Math.round((change30d / price30dAgo) * 10000) / 100 : 0,
    volatility: Math.round(volatility * 100) / 100,
  };
}
