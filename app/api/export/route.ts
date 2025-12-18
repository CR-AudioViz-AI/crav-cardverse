// ============================================================================
// COLLECTION EXPORT API
// Export collections to CSV, JSON, PDF for insurance/selling/backup
// CravCards - CR AudioViz AI, LLC
// Created: December 17, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ExportCard {
  card_id: string;
  name: string;
  category: string;
  set_name: string;
  card_number: string;
  rarity: string;
  condition: string;
  graded: boolean;
  grade: string | null;
  grading_company: string | null;
  purchase_price: number;
  current_value: number;
  profit_loss: number;
  purchase_date: string;
  notes: string;
  image_url: string | null;
}

// GET - Export collection
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('user_id');
  const format = searchParams.get('format') || 'json'; // json, csv, summary
  const category = searchParams.get('category');
  const includeImages = searchParams.get('images') === 'true';

  if (!userId) {
    return NextResponse.json({
      success: false,
      error: 'User ID required',
    }, { status: 400 });
  }

  try {
    // Fetch user's collection
    let query = supabase
      .from('cv_user_cards')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (category) {
      query = query.eq('category', category);
    }

    const { data: cards, error } = await query;

    if (error) throw error;

    if (!cards || cards.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No cards found in collection',
      }, { status: 404 });
    }

    // Transform to export format
    const exportCards: ExportCard[] = cards.map(card => ({
      card_id: card.card_id,
      name: card.card_name,
      category: card.category || 'other',
      set_name: card.set_name || '',
      card_number: card.card_number || '',
      rarity: card.rarity || '',
      condition: card.condition || 'nm',
      graded: card.is_graded || false,
      grade: card.grade || null,
      grading_company: card.grading_company || null,
      purchase_price: card.purchase_price || 0,
      current_value: card.current_value || 0,
      profit_loss: (card.current_value || 0) - (card.purchase_price || 0),
      purchase_date: card.purchase_date || card.created_at,
      notes: card.notes || '',
      image_url: includeImages ? (card.image_url || null) : null,
    }));

    // Calculate summary stats
    const summary = {
      total_cards: exportCards.length,
      total_value: exportCards.reduce((sum, c) => sum + c.current_value, 0),
      total_invested: exportCards.reduce((sum, c) => sum + c.purchase_price, 0),
      total_profit: exportCards.reduce((sum, c) => sum + c.profit_loss, 0),
      categories: {} as Record<string, { count: number; value: number }>,
      graded_cards: exportCards.filter(c => c.graded).length,
      export_date: new Date().toISOString(),
      export_by: 'CravCards - CR AudioViz AI',
    };

    // Category breakdown
    exportCards.forEach(card => {
      if (!summary.categories[card.category]) {
        summary.categories[card.category] = { count: 0, value: 0 };
      }
      summary.categories[card.category].count++;
      summary.categories[card.category].value += card.current_value;
    });

    switch (format) {
      case 'csv':
        return generateCSV(exportCards, summary);
      case 'summary':
        return NextResponse.json({
          success: true,
          summary,
          top_cards: exportCards.slice(0, 10).map(c => ({
            name: c.name,
            value: c.current_value,
            profit: c.profit_loss,
          })),
        });
      case 'json':
      default:
        return NextResponse.json({
          success: true,
          export: {
            summary,
            cards: exportCards,
          },
          format: 'json',
        });
    }

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 });
  }
}

// POST - Generate export file and store for download
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, format, options } = body;

    if (!user_id) {
      return NextResponse.json({
        success: false,
        error: 'User ID required',
      }, { status: 400 });
    }

    // Create export record
    const { data: exportRecord, error } = await supabase
      .from('cv_exports')
      .insert({
        user_id,
        format: format || 'json',
        status: 'processing',
        options: options || {},
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // In production, this would trigger a background job
    // For now, mark as ready immediately
    await supabase
      .from('cv_exports')
      .update({ status: 'ready', completed_at: new Date().toISOString() })
      .eq('id', exportRecord.id);

    return NextResponse.json({
      success: true,
      export_id: exportRecord.id,
      status: 'ready',
      download_url: `/api/export?user_id=${user_id}&format=${format || 'json'}`,
      message: 'Export ready for download',
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      success: false,
      error: message,
    }, { status: 500 });
  }
}

// Generate CSV export
function generateCSV(cards: ExportCard[], summary: Record<string, unknown>): NextResponse {
  const headers = [
    'Card ID',
    'Name',
    'Category',
    'Set',
    'Card Number',
    'Rarity',
    'Condition',
    'Graded',
    'Grade',
    'Grading Company',
    'Purchase Price',
    'Current Value',
    'Profit/Loss',
    'Purchase Date',
    'Notes',
  ];

  const rows = cards.map(card => [
    card.card_id,
    `"${card.name.replace(/"/g, '""')}"`,
    card.category,
    `"${card.set_name.replace(/"/g, '""')}"`,
    card.card_number,
    card.rarity,
    card.condition,
    card.graded ? 'Yes' : 'No',
    card.grade || '',
    card.grading_company || '',
    card.purchase_price.toFixed(2),
    card.current_value.toFixed(2),
    card.profit_loss.toFixed(2),
    card.purchase_date,
    `"${card.notes.replace(/"/g, '""')}"`,
  ]);

  // Add summary section
  const summaryRows = [
    [],
    ['COLLECTION SUMMARY'],
    ['Total Cards', String(summary.total_cards)],
    ['Total Value', `$${(summary.total_value as number).toFixed(2)}`],
    ['Total Invested', `$${(summary.total_invested as number).toFixed(2)}`],
    ['Total Profit/Loss', `$${(summary.total_profit as number).toFixed(2)}`],
    ['Graded Cards', String(summary.graded_cards)],
    ['Export Date', String(summary.export_date)],
    ['Generated By', String(summary.export_by)],
  ];

  const csv = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
    ...summaryRows.map(row => row.join(',')),
  ].join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="cravcards-collection-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
}
