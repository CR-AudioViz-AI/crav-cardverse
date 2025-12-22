// ============================================================================
// IMAGE QUESTS API - Gamified Card Image Collection
// CravCards - CR AudioViz AI, LLC
// Created: December 22, 2025
// ============================================================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Quest {
  id: string;
  card_id: string;
  card_name: string;
  card_source: string;
  set_name: string | null;
  rarity: string;
  quest_type: string;
  reward_xp: number;
  reward_credits: number;
  bonus_multiplier: number;
  status: string;
  priority: number;
  expires_at: string | null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'list';
  const questId = searchParams.get('id');
  const cardSource = searchParams.get('source');
  const status = searchParams.get('status') || 'open';
  const limit = parseInt(searchParams.get('limit') || '20');
  const page = parseInt(searchParams.get('page') || '1');

  try {
    // Get specific quest
    if (action === 'get' && questId) {
      const { data, error } = await supabase
        .from('cv_image_quests')
        .select('*')
        .eq('id', questId)
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        quest: data,
      });
    }

    // List available quests
    if (action === 'list') {
      let query = supabase
        .from('cv_image_quests')
        .select('*', { count: 'exact' })
        .eq('status', status)
        .order('priority', { ascending: false })
        .order('reward_xp', { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (cardSource) {
        query = query.eq('card_source', cardSource);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      return NextResponse.json({
        success: true,
        quests: data,
        totalCount: count,
        page,
        pageSize: limit,
      });
    }

    // Get featured/high-priority quests
    if (action === 'featured') {
      const { data, error } = await supabase
        .from('cv_image_quests')
        .select('*')
        .eq('status', 'open')
        .gte('priority', 5)
        .order('priority', { ascending: false })
        .limit(10);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        quests: data,
      });
    }

    // Get quest stats
    if (action === 'stats') {
      const { data: openCount } = await supabase
        .from('cv_image_quests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'open');

      const { data: completedCount } = await supabase
        .from('cv_image_quests')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'verified');

      const { data: totalXp } = await supabase
        .from('cv_image_quests')
        .select('reward_xp')
        .eq('status', 'open');

      const availableXp = totalXp?.reduce((sum, q) => sum + (q.reward_xp || 0), 0) || 0;

      return NextResponse.json({
        success: true,
        stats: {
          openQuests: openCount || 0,
          completedQuests: completedCount || 0,
          availableXp,
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
    }, { status: 400 });

  } catch (error) {
    console.error('Quests API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch quests',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    const body = await request.json();

    // Claim a quest
    if (action === 'claim') {
      const { questId, userId } = body;

      if (!questId || !userId) {
        return NextResponse.json({
          success: false,
          error: 'Quest ID and User ID required',
        }, { status: 400 });
      }

      // Check if quest is available
      const { data: quest, error: fetchError } = await supabase
        .from('cv_image_quests')
        .select('*')
        .eq('id', questId)
        .eq('status', 'open')
        .single();

      if (fetchError || !quest) {
        return NextResponse.json({
          success: false,
          error: 'Quest not available',
        }, { status: 404 });
      }

      // Claim the quest
      const { data, error } = await supabase
        .from('cv_image_quests')
        .update({
          status: 'claimed',
          claimed_by: userId,
          claimed_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        })
        .eq('id', questId)
        .eq('status', 'open')
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        quest: data,
        message: 'Quest claimed! You have 24 hours to submit an image.',
      });
    }

    // Submit image for quest
    if (action === 'submit') {
      const { questId, userId, imageUrl } = body;

      if (!questId || !userId || !imageUrl) {
        return NextResponse.json({
          success: false,
          error: 'Quest ID, User ID, and Image URL required',
        }, { status: 400 });
      }

      // Verify user has claimed this quest
      const { data: quest, error: fetchError } = await supabase
        .from('cv_image_quests')
        .select('*')
        .eq('id', questId)
        .eq('claimed_by', userId)
        .eq('status', 'claimed')
        .single();

      if (fetchError || !quest) {
        return NextResponse.json({
          success: false,
          error: 'Quest not found or not claimed by you',
        }, { status: 404 });
      }

      // Create image record
      const { data: image, error: imageError } = await supabase
        .from('cv_card_images')
        .insert({
          card_id: quest.card_id,
          card_source: quest.card_source,
          card_name: quest.card_name,
          image_url: imageUrl,
          image_type: 'user_photo',
          source: 'user',
          license: 'user_submitted',
          uploaded_by: userId,
        })
        .select()
        .single();

      if (imageError) throw imageError;

      // Update quest status
      const { data, error } = await supabase
        .from('cv_image_quests')
        .update({
          status: 'submitted',
          submitted_image_id: image.id,
          submitted_at: new Date().toISOString(),
        })
        .eq('id', questId)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        quest: data,
        image,
        message: 'Image submitted! Awaiting verification.',
      });
    }

    // Create new quest (admin)
    if (action === 'create') {
      const { card_id, card_name, card_source, set_name, rarity, reward_xp, reward_credits, priority } = body;

      const { data, error } = await supabase
        .from('cv_image_quests')
        .insert({
          card_id,
          card_name,
          card_source,
          set_name,
          rarity: rarity || 'common',
          reward_xp: reward_xp || 10,
          reward_credits: reward_credits || 5,
          priority: priority || 0,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        quest: data,
      });
    }

    // Verify quest (admin)
    if (action === 'verify') {
      const { questId, verifierId, approved, rejectionReason } = body;

      if (!questId || !verifierId) {
        return NextResponse.json({
          success: false,
          error: 'Quest ID and Verifier ID required',
        }, { status: 400 });
      }

      const { data: quest, error: fetchError } = await supabase
        .from('cv_image_quests')
        .select('*, claimed_by')
        .eq('id', questId)
        .eq('status', 'submitted')
        .single();

      if (fetchError || !quest) {
        return NextResponse.json({
          success: false,
          error: 'Quest not found or not submitted',
        }, { status: 404 });
      }

      if (approved) {
        // Approve the quest
        const { data, error } = await supabase
          .from('cv_image_quests')
          .update({
            status: 'verified',
            verified_by: verifierId,
            verified_at: new Date().toISOString(),
          })
          .eq('id', questId)
          .select()
          .single();

        if (error) throw error;

        // Update user stats
        await supabase.rpc('increment_user_stats', {
          p_user_id: quest.claimed_by,
          p_xp: quest.reward_xp,
          p_quests: 1,
          p_images: 1,
        });

        // Mark image as verified
        if (quest.submitted_image_id) {
          await supabase
            .from('cv_card_images')
            .update({
              verified: true,
              verified_by: verifierId,
              verified_at: new Date().toISOString(),
            })
            .eq('id', quest.submitted_image_id);
        }

        return NextResponse.json({
          success: true,
          quest: data,
          message: 'Quest verified! User awarded XP and credits.',
        });
      } else {
        // Reject the quest
        const { data, error } = await supabase
          .from('cv_image_quests')
          .update({
            status: 'rejected',
            rejection_reason: rejectionReason || 'Image did not meet quality standards',
            verified_by: verifierId,
            verified_at: new Date().toISOString(),
          })
          .eq('id', questId)
          .select()
          .single();

        if (error) throw error;

        return NextResponse.json({
          success: true,
          quest: data,
          message: 'Quest rejected.',
        });
      }
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action',
    }, { status: 400 });

  } catch (error) {
    console.error('Quests API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process quest action',
    }, { status: 500 });
  }
}
