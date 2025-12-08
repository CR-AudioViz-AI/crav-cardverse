'use client';

import { useState } from 'react';
import { X, Zap, Crown, Check } from 'lucide-react';
import { TIER_CONFIGS, SubscriptionTier, getUpgradeConfig } from '@/lib/tier-limits';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  currentCount: number;
  maxAllowed: number;
}

export function UpgradeModal({
  isOpen,
  onClose,
  currentTier,
  currentCount,
  maxAllowed,
}: UpgradeModalProps) {
  const [loading, setLoading] = useState(false);
  const upgradeConfig = getUpgradeConfig(currentTier);

  if (!isOpen || !upgradeConfig) return null;

  const handleUpgrade = async (priceId: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-b from-purple-900 to-purple-950 border border-purple-500/30 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-purple-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-yellow-500/20 rounded-full">
            <Zap className="w-10 h-10 text-yellow-400" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Collection Limit Reached!
        </h2>

        {/* Current Status */}
        <p className="text-purple-300 text-center mb-6">
          You have <span className="text-white font-semibold">{currentCount}</span> of{' '}
          <span className="text-white font-semibold">{maxAllowed}</span> cards on the{' '}
          <span className="text-purple-400 font-semibold">{TIER_CONFIGS[currentTier].name}</span> plan.
        </p>

        {/* Upgrade Card */}
        <div className="bg-purple-800/30 border border-purple-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="font-semibold text-white">{upgradeConfig.name} Plan</h3>
              <p className="text-purple-300 text-sm">
                ${upgradeConfig.priceMonthly}/month
              </p>
            </div>
          </div>

          <ul className="space-y-2 mb-4">
            {upgradeConfig.features.slice(0, 4).map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-purple-200">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={() => upgradeConfig.priceId && handleUpgrade(upgradeConfig.priceId)}
            disabled={loading || !upgradeConfig.priceId}
            className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : `Upgrade to ${upgradeConfig.name}`}
          </button>
        </div>

        {/* View Pricing Link */}
        <p className="text-center text-purple-400 text-sm">
          <a href="/pricing" className="hover:text-purple-300 underline">
            View all plans
          </a>
        </p>
      </div>
    </div>
  );
}

export default UpgradeModal;
