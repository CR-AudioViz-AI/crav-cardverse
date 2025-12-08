'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Grid, List, ChevronDown, Star, TrendingUp } from 'lucide-react';

interface Card {
  id: string;
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  price: number;
  seller: string;
  image: string;
  category: string;
}

const mockCards: Card[] = [
  { id: '1', name: 'Mickey Mouse Vintage 1928', rarity: 'Legendary', price: 450, seller: 'DisneyFan99', image: '🏰', category: 'Characters' },
  { id: '2', name: 'Cinderella Castle', rarity: 'Epic', price: 185, seller: 'ParkLover', image: '👸', category: 'Parks' },
  { id: '3', name: 'Space Mountain', rarity: 'Rare', price: 75, seller: 'TomorrowLand', image: '🚀', category: 'Attractions' },
  { id: '4', name: 'Pirates of Caribbean', rarity: 'Rare', price: 65, seller: 'Adventurer', image: '🏴‍☠️', category: 'Attractions' },
  { id: '5', name: 'Haunted Mansion', rarity: 'Epic', price: 120, seller: 'GhostHost', image: '👻', category: 'Attractions' },
  { id: '6', name: 'Donald Duck Classic', rarity: 'Rare', price: 55, seller: 'DuckTales', image: '🦆', category: 'Characters' },
  { id: '7', name: 'Walt Disney Portrait', rarity: 'Legendary', price: 750, seller: 'Imagineer', image: '🎨', category: 'Special' },
  { id: '8', name: 'Splash Mountain', rarity: 'Epic', price: 200, seller: 'Critter', image: '💦', category: 'Attractions' },
];

const rarityColors: Record<string, string> = {
  'Common': 'bg-gray-500/20 text-gray-300 border-gray-500/50',
  'Rare': 'bg-blue-500/20 text-blue-300 border-blue-500/50',
  'Epic': 'bg-purple-500/20 text-purple-300 border-purple-500/50',
  'Legendary': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
};

export default function MarketplacePage() {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filterRarity, setFilterRarity] = useState<string | null>(null);

  const filteredCards = mockCards.filter(card => {
    const matchesSearch = card.name.toLowerCase().includes(search.toLowerCase());
    const matchesRarity = !filterRarity || card.rarity === filterRarity;
    return matchesSearch && matchesRarity;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black">
      {/* Header */}
      <header className="border-b border-purple-900/30 bg-black/30 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-3xl">🎴</span>
              <span className="text-xl font-bold text-purple-400">CardVerse</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/collection" className="text-gray-300 hover:text-white transition">Collection</Link>
              <Link href="/marketplace" className="text-purple-400 font-medium">Marketplace</Link>
              <Link href="/trivia" className="text-gray-300 hover:text-white transition">Trivia</Link>
              <Link href="/museum" className="text-gray-300 hover:text-white transition">Museum</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-gray-300 hover:text-white transition">Sign In</Link>
              <Link href="/signup" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Marketplace</h1>
          <p className="text-gray-400">Buy, sell, and trade digital cards with collectors worldwide</p>
        </div>

        {/* Stats Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Cards Listed', value: '2,847', icon: '🎴' },
            { label: '24h Volume', value: '$12,450', icon: '📈' },
            { label: 'Active Sellers', value: '384', icon: '👥' },
            { label: 'Avg Price', value: '$45', icon: '💰' },
          ].map((stat) => (
            <div key={stat.label} className="bg-purple-900/20 border border-purple-700/30 rounded-xl p-4 text-center">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-sm text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search cards..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-purple-900/20 border border-purple-700/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterRarity || ''}
              onChange={(e) => setFilterRarity(e.target.value || null)}
              className="px-4 py-3 bg-purple-900/20 border border-purple-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">All Rarities</option>
              <option value="Common">Common</option>
              <option value="Rare">Rare</option>
              <option value="Epic">Epic</option>
              <option value="Legendary">Legendary</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-purple-900/20 border border-purple-700/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="recent">Recently Listed</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rarity">Rarity</option>
            </select>

            <div className="flex border border-purple-700/30 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-purple-900/20 text-gray-400'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-purple-900/20 text-gray-400'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4 text-gray-400">
          Showing {filteredCards.length} cards
        </div>

        {/* Card Grid */}
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredCards.map((card) => (
            <div
              key={card.id}
              className="bg-purple-900/20 border border-purple-700/30 rounded-xl overflow-hidden hover:border-purple-500/50 transition group cursor-pointer"
            >
              <div className="aspect-square bg-gradient-to-br from-purple-800/30 to-indigo-800/30 flex items-center justify-center">
                <span className="text-6xl group-hover:scale-110 transition">{card.image}</span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border ${rarityColors[card.rarity]}`}>
                    {card.rarity}
                  </span>
                  <span className="text-xs text-gray-500">{card.category}</span>
                </div>
                <h3 className="font-semibold text-white mb-1 truncate">{card.name}</h3>
                <p className="text-xs text-gray-500 mb-3">by {card.seller}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-green-400">${card.price}</span>
                  <button className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCards.length === 0 && (
          <div className="text-center py-16">
            <span className="text-6xl mb-4 block">🔍</span>
            <h3 className="text-xl font-semibold text-white mb-2">No cards found</h3>
            <p className="text-gray-400">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Load More */}
        {filteredCards.length > 0 && (
          <div className="text-center mt-8">
            <button className="px-8 py-3 bg-purple-900/30 border border-purple-700/30 text-purple-300 rounded-lg hover:bg-purple-900/50 transition">
              Load More Cards
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-900/30 mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2025 CR AudioViz AI, LLC. All rights reserved.</p>
          <p className="mt-2">A CR AudioViz AI Production | Powered by Javari AI</p>
        </div>
      </footer>
    </div>
  );
}
