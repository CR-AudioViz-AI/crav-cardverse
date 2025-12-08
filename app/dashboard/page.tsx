'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  CreditCard,
  Trophy,
  Gamepad2,
  Store,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  Star,
  Clock,
  Zap,
} from 'lucide-react';
import { CrossSellBanner } from '@/components/cross-sell-banner';
import { UpgradeModal } from '@/components/upgrade-modal';
import { TIER_CONFIGS, SubscriptionTier, getRemainingCards } from '@/lib/tier-limits';

// Mock data - replace with real Supabase queries
const mockUserData = {
  name: 'Collector',
  tier: 'free' as SubscriptionTier,
  cardCount: 12,
  collectionValue: 450,
  achievements: 3,
  triviaPlayed: 15,
};

const mockRecentCards = [
  { id: 1, name: 'Rare Dragon', rarity: 'Rare', image: '🐉', value: 120 },
  { id: 2, name: 'Golden Phoenix', rarity: 'Epic', image: '🦅', value: 280 },
  { id: 3, name: 'Crystal Unicorn', rarity: 'Legendary', image: '🦄', value: 500 },
];

const mockActivity = [
  { id: 1, action: 'Added new card', item: 'Rare Dragon', time: '2 hours ago' },
  { id: 2, action: 'Won trivia', item: '+50 points', time: '5 hours ago' },
  { id: 3, action: 'Traded card', item: 'Common Wolf', time: '1 day ago' },
];

export default function DashboardPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userData, setUserData] = useState(mockUserData);

  const tierConfig = TIER_CONFIGS[userData.tier];
  const remainingCards = getRemainingCards(userData.cardCount, userData.tier);
  const usagePercent = tierConfig.maxCards === Infinity 
    ? 0 
    : Math.round((userData.cardCount / tierConfig.maxCards) * 100);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-black/30 border-r border-purple-900/30 p-4">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-3xl">🎴</span>
            <span className="text-xl font-bold text-purple-400">CravCards</span>
          </div>

          <nav className="space-y-2">
            {[
              { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
              { icon: CreditCard, label: 'My Collection', href: '/collection' },
              { icon: Store, label: 'Marketplace', href: '/marketplace' },
              { icon: Gamepad2, label: 'Trivia', href: '/trivia' },
              { icon: Trophy, label: 'Achievements', href: '/achievements' },
              { icon: Settings, label: 'Settings', href: '/settings' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  item.active
                    ? 'bg-purple-600/30 text-purple-300'
                    : 'text-gray-400 hover:bg-purple-900/20 hover:text-purple-300'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Link
              href="/login"
              className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-red-400 transition"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Welcome back!</h1>
              <p className="text-purple-300">Here's your collection overview</p>
            </div>
            <Link
              href="/collection"
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              Add Cards
            </Link>
          </div>

          {/* Cross-Sell Banner */}
          <CrossSellBanner variant="spirits" />

          {/* Tier Status Bar */}
          <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <span className="text-white font-medium">{tierConfig.name} Plan</span>
                {userData.tier !== 'premium' && (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="text-xs px-2 py-1 bg-purple-600/50 text-purple-200 rounded hover:bg-purple-600 transition"
                  >
                    Upgrade
                  </button>
                )}
              </div>
              <span className="text-purple-300 text-sm">
                {userData.cardCount} / {tierConfig.maxCards === Infinity ? '∞' : tierConfig.maxCards} cards
              </span>
            </div>
            {tierConfig.maxCards !== Infinity && (
              <div className="w-full bg-purple-900/50 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    usagePercent >= 90 ? 'bg-red-500' : usagePercent >= 70 ? 'bg-yellow-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
            )}
            {remainingCards !== Infinity && remainingCards <= 10 && (
              <p className="text-yellow-400 text-xs mt-2">
                ⚠️ Only {remainingCards} cards remaining on your plan
              </p>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Cards', value: userData.cardCount, icon: CreditCard, color: 'purple' },
              { label: 'Collection Value', value: `$${userData.collectionValue}`, icon: TrendingUp, color: 'green' },
              { label: 'Achievements', value: userData.achievements, icon: Trophy, color: 'yellow' },
              { label: 'Trivia Played', value: userData.triviaPlayed, icon: Gamepad2, color: 'blue' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-8 h-8 text-${stat.color}-400`} />
                </div>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-purple-300 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Cards */}
            <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                Recent Cards
              </h2>
              <div className="space-y-3">
                {mockRecentCards.map((card) => (
                  <div
                    key={card.id}
                    className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{card.image}</span>
                      <div>
                        <p className="text-white font-medium">{card.name}</p>
                        <p className={`text-sm ${getRarityColor(card.rarity)}`}>{card.rarity}</p>
                      </div>
                    </div>
                    <span className="text-green-400">${card.value}</span>
                  </div>
                ))}
              </div>
              <Link
                href="/collection"
                className="block text-center text-purple-400 hover:text-purple-300 mt-4 text-sm"
              >
                View all cards →
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-purple-900/20 border border-purple-700/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-400" />
                Recent Activity
              </h2>
              <div className="space-y-3">
                {mockActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-purple-900/30 rounded-lg"
                  >
                    <div>
                      <p className="text-white">{activity.action}</p>
                      <p className="text-purple-400 text-sm">{activity.item}</p>
                    </div>
                    <span className="text-gray-500 text-sm">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>© 2025 CR AudioViz AI, LLC. Part of the CRAV ecosystem.</p>
          </div>
        </main>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentTier={userData.tier}
        currentCount={userData.cardCount}
        maxAllowed={tierConfig.maxCards}
      />
    </div>
  );
}
