'use client'

import { useState } from 'react'
import {
  TrendingUp, TrendingDown, DollarSign, BarChart3, Star,
  Search, Filter, Grid, List, Plus, Eye, Heart, Share2,
  ArrowUpRight, ArrowDownRight, Sparkles, Crown, Shield, Zap
} from 'lucide-react'

interface TradingCard {
  id: string
  name: string
  set: string
  number: string
  rarity: 'common' | 'uncommon' | 'rare' | 'ultra-rare' | 'secret-rare' | 'chase'
  condition: 'raw' | 'PSA 10' | 'PSA 9' | 'BGS 9.5' | 'CGC 9.5'
  game: 'pokemon' | 'mtg' | 'yugioh' | 'sports' | 'onepiece' | 'lorcana'
  purchasePrice: number
  currentValue: number
  change: number
  changePercent: number
  image: string
  isGraded: boolean
  quantity: number
}

interface SetCompletion {
  name: string
  game: string
  owned: number
  total: number
  value: number
}

const PORTFOLIO: TradingCard[] = [
  {
    id: '1', name: 'Charizard VMAX', set: 'Shining Fates', number: 'SV107', rarity: 'secret-rare',
    condition: 'PSA 10', game: 'pokemon', purchasePrice: 350, currentValue: 425, change: 75,
    changePercent: 21.4, image: '🔥', isGraded: true, quantity: 1
  },
  {
    id: '2', name: 'Black Lotus', set: 'Unlimited', number: '-', rarity: 'chase',
    condition: 'BGS 9.5', game: 'mtg', purchasePrice: 45000, currentValue: 52000, change: 7000,
    changePercent: 15.6, image: '🪷', isGraded: true, quantity: 1
  },
  {
    id: '3', name: 'Pikachu Illustrator', set: 'Promo', number: '-', rarity: 'chase',
    condition: 'PSA 9', game: 'pokemon', purchasePrice: 180000, currentValue: 225000, change: 45000,
    changePercent: 25.0, image: '⚡', isGraded: true, quantity: 1
  },
  {
    id: '4', name: 'Mickey Mouse - Brave Little Tailor', set: 'The First Chapter', number: '1/204',
    rarity: 'ultra-rare', condition: 'raw', game: 'lorcana', purchasePrice: 45, currentValue: 38,
    change: -7, changePercent: -15.6, image: '🐭', isGraded: false, quantity: 4
  },
  {
    id: '5', name: 'Luffy - Gear 5', set: 'Romance Dawn', number: 'OP01-121',
    rarity: 'secret-rare', condition: 'PSA 10', game: 'onepiece', purchasePrice: 800, currentValue: 1200,
    change: 400, changePercent: 50.0, image: '👒', isGraded: true, quantity: 1
  },
  {
    id: '6', name: 'Michael Jordan Rookie', set: 'Fleer 1986', number: '57',
    rarity: 'chase', condition: 'PSA 10', game: 'sports', purchasePrice: 95000, currentValue: 110000,
    change: 15000, changePercent: 15.8, image: '🏀', isGraded: true, quantity: 1
  },
]

const SET_COMPLETIONS: SetCompletion[] = [
  { name: '151', game: 'pokemon', owned: 142, total: 165, value: 2450 },
  { name: 'The First Chapter', game: 'lorcana', owned: 189, total: 204, value: 890 },
  { name: 'Romance Dawn', game: 'onepiece', owned: 98, total: 121, value: 1650 },
  { name: 'Dominaria United', game: 'mtg', owned: 234, total: 281, value: 320 },
]

export default function CardPortfolioTracker() {
  const [view, setView] = useState<'cards' | 'sets' | 'analytics' | 'watchlist'>('cards')
  const [gameFilter, setGameFilter] = useState<string>('all')
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('list')

  const totalValue = PORTFOLIO.reduce((sum, c) => sum + (c.currentValue * c.quantity), 0)
  const totalCost = PORTFOLIO.reduce((sum, c) => sum + (c.purchasePrice * c.quantity), 0)
  const totalGain = totalValue - totalCost
  const totalGainPercent = (totalGain / totalCost) * 100

  const games = ['all', 'pokemon', 'mtg', 'lorcana', 'onepiece', 'sports', 'yugioh']
  const filteredCards = PORTFOLIO.filter(c => gameFilter === 'all' || c.game === gameFilter)

  const getGameIcon = (game: string) => {
    switch (game) {
      case 'pokemon': return '⚡'
      case 'mtg': return '🎴'
      case 'yugioh': return '👁️'
      case 'sports': return '🏆'
      case 'onepiece': return '🏴‍☠️'
      case 'lorcana': return '✨'
      default: return '🃏'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500/20 text-gray-400'
      case 'uncommon': return 'bg-green-500/20 text-green-400'
      case 'rare': return 'bg-blue-500/20 text-blue-400'
      case 'ultra-rare': return 'bg-purple-500/20 text-purple-400'
      case 'secret-rare': return 'bg-yellow-500/20 text-yellow-400'
      case 'chase': return 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
              🃏
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Card Portfolio</h1>
              <p className="text-indigo-200">Track your collection value</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg">
            <Plus className="w-4 h-4" /> Add Card
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-200 text-sm mb-1">Portfolio Value</p>
            <p className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-200 text-sm mb-1">Total Gain</p>
            <p className={`text-2xl font-bold ${totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGain >= 0 ? '+' : ''}${totalGain.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-200 text-sm mb-1">ROI</p>
            <p className={`text-2xl font-bold ${totalGainPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(1)}%
            </p>
          </div>
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-indigo-200 text-sm mb-1">Cards</p>
            <p className="text-2xl font-bold text-white">{PORTFOLIO.reduce((sum, c) => sum + c.quantity, 0)}</p>
          </div>
        </div>
      </div>

      {/* Tabs & Filters */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {[
            { id: 'cards', label: 'Cards', icon: Grid },
            { id: 'sets', label: 'Set Completion', icon: Shield },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'watchlist', label: 'Watchlist', icon: Eye },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                view === tab.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {view === 'cards' && (
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-gray-800 rounded-lg p-1">
              {games.map(game => (
                <button
                  key={game}
                  onClick={() => setGameFilter(game)}
                  className={`px-3 py-1 rounded text-sm capitalize ${
                    gameFilter === game ? 'bg-indigo-600 text-white' : 'text-gray-400'
                  }`}
                >
                  {game === 'all' ? 'All' : getGameIcon(game)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cards View */}
      {view === 'cards' && (
        <div className="space-y-3">
          {filteredCards.map(card => (
            <div key={card.id} className="bg-gray-900 rounded-xl border border-gray-700 p-4 hover:border-indigo-500/50 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-20 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-3xl">
                  {card.image}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{getGameIcon(card.game)}</span>
                    <h3 className="font-semibold">{card.name}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded capitalize ${getRarityColor(card.rarity)}`}>
                      {card.rarity.replace('-', ' ')}
                    </span>
                    {card.isGraded && (
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded flex items-center gap-1">
                        <Shield className="w-3 h-3" /> {card.condition}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">{card.set} #{card.number}</p>
                  {card.quantity > 1 && <p className="text-xs text-gray-500">Qty: {card.quantity}</p>}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">${(card.currentValue * card.quantity).toLocaleString()}</p>
                  <p className={`text-sm flex items-center justify-end gap-1 ${card.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {card.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                    {card.changePercent >= 0 ? '+' : ''}{card.changePercent.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Set Completion View */}
      {view === 'sets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SET_COMPLETIONS.map(set => (
            <div key={set.name} className="bg-gray-900 rounded-xl border border-gray-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getGameIcon(set.game)}</span>
                  <div>
                    <h3 className="font-semibold">{set.name}</h3>
                    <p className="text-xs text-gray-400 capitalize">{set.game}</p>
                  </div>
                </div>
                <p className="font-bold text-indigo-400">${set.value.toLocaleString()}</p>
              </div>
              <div className="mb-2">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-400">Progress</span>
                  <span>{set.owned}/{set.total} ({Math.round((set.owned / set.total) * 100)}%)</span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    style={{ width: `${(set.owned / set.total) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Missing: {set.total - set.owned} cards</span>
                <button className="text-indigo-400 hover:text-indigo-300">View Missing →</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics View */}
      {view === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-4">
            <h3 className="font-semibold mb-4">Value by Game</h3>
            <div className="space-y-3">
              {['pokemon', 'mtg', 'sports', 'onepiece', 'lorcana'].map(game => {
                const gameCards = PORTFOLIO.filter(c => c.game === game)
                const value = gameCards.reduce((sum, c) => sum + (c.currentValue * c.quantity), 0)
                const percent = (value / totalValue) * 100
                return (
                  <div key={game}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center gap-2 capitalize">
                        {getGameIcon(game)} {game}
                      </span>
                      <span>${value.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl border border-gray-700 p-4">
            <h3 className="font-semibold mb-4">Top Performers</h3>
            <div className="space-y-3">
              {[...PORTFOLIO].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5).map((card, i) => (
                <div key={card.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{i + 1}</span>
                    <span>{card.image}</span>
                    <span className="text-sm">{card.name}</span>
                  </div>
                  <span className={card.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {card.changePercent >= 0 ? '+' : ''}{card.changePercent.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
