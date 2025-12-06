'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiddenCardCollectionGrid, 
  useCardDiscovery, 
  useKonamiCode,
  CardDiscoveryProvider 
} from '@/components/hidden-card-components';

// Tab definitions
const TABS = [
  { id: 'all', label: 'All Cards', icon: '🃏' },
  { id: 'discovered', label: 'Discovered', icon: '✅' },
  { id: 'undiscovered', label: 'Undiscovered', icon: '❓' },
  { id: 'explorer', label: 'Explorer', icon: '🧭' },
  { id: 'collector', label: 'Collector', icon: '📦' },
  { id: 'scholar', label: 'Scholar', icon: '📚' },
  { id: 'social', label: 'Social', icon: '👥' },
  { id: 'achievement', label: 'Achievements', icon: '🏆' },
  { id: 'founder', label: 'Founder', icon: '⭐' },
];

function HiddenCardsPageContent() {
  const [activeTab, setActiveTab] = useState('all');
  const [cards, setCards] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { userProgress, discoverCard } = useCardDiscovery();

  // Konami code easter egg
  useKonamiCode(() => {
    discoverCard('sec-001', 'Konami Code');
  });

  // Fetch cards
  useEffect(() => {
    async function fetchCards() {
      try {
        const response = await fetch('/api/hidden-cards');
        const data = await response.json();
        setCards(data.cards || []);
        setStats(data.stats || null);
      } catch (error) {
        console.error('Failed to fetch cards:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCards();
  }, []);

  // Filter cards based on active tab
  const filteredCards = cards.filter(card => {
    const isDiscovered = userProgress.discoveredCards.includes(card.id);
    
    switch (activeTab) {
      case 'discovered':
        return isDiscovered;
      case 'undiscovered':
        return !isDiscovered;
      case 'explorer':
      case 'collector':
      case 'scholar':
      case 'social':
      case 'achievement':
      case 'founder':
        return card.category === activeTab;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🃏</div>
          <p className="text-gray-400">Loading secret cards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-pink-900/30" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-500 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 1, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 mb-4">
              CardVerse Exclusives
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
              Hidden digital collectibles scattered throughout CardVerse. 
              Explore, discover, and collect them all!
            </p>

            {/* Progress Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
                <div className="text-3xl font-bold text-white">
                  {userProgress.discoveredCards.length}
                </div>
                <div className="text-gray-400 text-sm">Cards Found</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
                <div className="text-3xl font-bold text-purple-400">
                  {stats ? Math.round((userProgress.discoveredCards.length / stats.total) * 100) : 0}%
                </div>
                <div className="text-gray-400 text-sm">Completion</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
                <div className="text-3xl font-bold text-yellow-400">
                  {userProgress.totalXP.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">XP Earned</div>
              </div>
              <div className="bg-gray-800/50 backdrop-blur rounded-xl p-4 border border-gray-700">
                <div className="text-3xl font-bold text-green-400">
                  {userProgress.totalCredits.toLocaleString()}
                </div>
                <div className="text-gray-400 text-sm">Credits</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 min-w-max pb-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  px-4 py-2 rounded-xl font-medium transition-all duration-300
                  flex items-center gap-2 whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.id !== 'all' && (
                  <span className="text-xs opacity-60">
                    ({cards.filter(c => 
                      tab.id === 'discovered' ? userProgress.discoveredCards.includes(c.id) :
                      tab.id === 'undiscovered' ? !userProgress.discoveredCards.includes(c.id) :
                      c.category === tab.id
                    ).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Rarity Legend */}
        <div className="mb-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Rarity Guide</h3>
          <div className="flex flex-wrap gap-4">
            {[
              { rarity: 'common', color: 'gray', pct: '40%' },
              { rarity: 'uncommon', color: 'green', pct: '25%' },
              { rarity: 'rare', color: 'blue', pct: '20%' },
              { rarity: 'epic', color: 'purple', pct: '10%' },
              { rarity: 'legendary', color: 'amber', pct: '4%' },
              { rarity: 'mythic', color: 'red', pct: '1%' },
            ].map(({ rarity, color, pct }) => (
              <div key={rarity} className="flex items-center gap-2 text-sm">
                <div className={`w-3 h-3 rounded-full bg-${color}-500`} />
                <span className={`text-${color}-400 capitalize`}>{rarity}</span>
                <span className="text-gray-600">({pct})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <HiddenCardCollectionGrid
          cards={filteredCards}
          discoveredIds={userProgress.discoveredCards}
          showSecrets={userProgress.discoveredCards.some(id => id.startsWith('sec-'))}
          onCardClick={(card) => console.log('Card clicked:', card)}
        />

        {/* Tips Section */}
        <div className="mt-12 p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl border border-purple-500/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>💡</span> Discovery Tips
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-300">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🧭</span>
              <div>
                <strong className="text-white">Explore Everything</strong>
                <p className="text-sm text-gray-400">Visit every page, scroll to the bottom, click on interesting elements</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🌙</span>
              <div>
                <strong className="text-white">Time Matters</strong>
                <p className="text-sm text-gray-400">Some cards only appear at certain times of day</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <strong className="text-white">Learn & Play</strong>
                <p className="text-sm text-gray-400">Trivia, Academy courses, and Javari conversations unlock cards</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-2xl">🎮</span>
              <div>
                <strong className="text-white">Easter Eggs</strong>
                <p className="text-sm text-gray-400">Classic gaming codes and hidden elements await...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HiddenCardsPage() {
  return (
    <CardDiscoveryProvider>
      <HiddenCardsPageContent />
    </CardDiscoveryProvider>
  );
}
