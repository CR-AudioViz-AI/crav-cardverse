/**
 * CravCards Tier Limits System
 * ============================
 * Enforces collection limits based on subscription tier
 * 
 * Free: 50 cards max
 * Collector ($9/mo): 500 cards
 * Premium ($29/mo): Unlimited
 * 
 * CR AudioViz AI, LLC - 2025
 */

export type SubscriptionTier = 'free' | 'collector' | 'premium';

export interface TierConfig {
  name: string;
  maxCards: number;
  priceMonthly: number;
  priceId: string | null;
  features: string[];
}

export const TIER_CONFIGS: Record<SubscriptionTier, TierConfig> = {
  free: {
    name: 'Free',
    maxCards: 50,
    priceMonthly: 0,
    priceId: null,
    features: [
      '50 cards maximum',
      'Basic collection management',
      'Daily trivia games',
      'Community access',
    ],
  },
  collector: {
    name: 'Collector',
    maxCards: 500,
    priceMonthly: 9,
    priceId: 'price_1SVgPr7YeQ1dZTUvOvs6XnxE',
    features: [
      '500 cards maximum',
      'Advanced collection tools',
      'Trading marketplace access',
      'Exclusive card drops',
      'Priority support',
      'Collection analytics',
    ],
  },
  premium: {
    name: 'Premium',
    maxCards: Infinity,
    priceMonthly: 29,
    priceId: 'price_1SVgPf7YeQ1dZTUvMqqmj8x4',
    features: [
      'Unlimited cards',
      'Everything in Collector',
      'First access to new cards',
      'VIP events & giveaways',
      'Custom card requests',
      'White glove support',
      'API access',
    ],
  },
};

export interface TierCheckResult {
  allowed: boolean;
  currentCount: number;
  maxAllowed: number;
  tier: SubscriptionTier;
  upgradeNeeded: boolean;
  upgradeMessage?: string;
}

/**
 * Check if user can add more cards to their collection
 */
export function checkCardLimit(
  currentCardCount: number,
  userTier: SubscriptionTier
): TierCheckResult {
  const config = TIER_CONFIGS[userTier];
  const allowed = currentCardCount < config.maxCards;
  
  let upgradeMessage: string | undefined;
  if (!allowed) {
    if (userTier === 'free') {
      upgradeMessage = `You've reached the ${config.maxCards} card limit on the Free plan. Upgrade to Collector for up to 500 cards!`;
    } else if (userTier === 'collector') {
      upgradeMessage = `You've reached the ${config.maxCards} card limit on Collector. Upgrade to Premium for unlimited cards!`;
    }
  }

  return {
    allowed,
    currentCount: currentCardCount,
    maxAllowed: config.maxCards,
    tier: userTier,
    upgradeNeeded: !allowed,
    upgradeMessage,
  };
}

/**
 * Get upgrade path for a given tier
 */
export function getUpgradePath(currentTier: SubscriptionTier): SubscriptionTier | null {
  switch (currentTier) {
    case 'free':
      return 'collector';
    case 'collector':
      return 'premium';
    case 'premium':
      return null;
  }
}

/**
 * Get the next tier's config
 */
export function getUpgradeConfig(currentTier: SubscriptionTier): TierConfig | null {
  const nextTier = getUpgradePath(currentTier);
  return nextTier ? TIER_CONFIGS[nextTier] : null;
}

/**
 * Calculate how many cards remaining
 */
export function getRemainingCards(
  currentCardCount: number,
  userTier: SubscriptionTier
): number {
  const config = TIER_CONFIGS[userTier];
  if (config.maxCards === Infinity) return Infinity;
  return Math.max(0, config.maxCards - currentCardCount);
}

/**
 * Get tier from Stripe price ID
 */
export function getTierFromPriceId(priceId: string | null): SubscriptionTier {
  if (!priceId) return 'free';
  
  for (const [tier, config] of Object.entries(TIER_CONFIGS)) {
    if (config.priceId === priceId) {
      return tier as SubscriptionTier;
    }
  }
  
  return 'free';
}
