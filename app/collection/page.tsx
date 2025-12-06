'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  Grid3X3,
  List,
  Filter,
  Search,
  Plus,
  SortAsc,
  SortDesc,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Tag,
  Calendar,
  DollarSign,
  Star,
  ChevronLeft,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

// Sample cards data
const SAMPLE_CARDS = [
  {
    id: '1',
    name: '1st Edition Charizard',
    set_name: 'Base Set',
    card_number: '4/102',
    year: 1999,
    category: 'pokemon',
    rarity: 'legendary',
    grading_company: 'PSA',
    grade: 9,
    purchase_price: 8500,
    current_value: 12500,
    image: '🔥',
  },
  {
    id: '2',
    name: 'Black Lotus',
    set_name: 'Alpha',
    card_number: null,
    year: 1993,
    category: 'mtg',
    rarity: 'mythic',
    grading_company: 'BGS',
    grade: 8.5,
    purchase_price: 6000,
    current_value: 8900,
    image: '🌸',
  },
  {
    id: '3',
    name: 'Mickey Mantle',
    set_name: '1952 Topps',
    card_number: '#311',
    year: 1952,
    category: 'sports',
    rarity: 'legendary',
    grading_company: 'PSA',
    grade: 6,
    purchase_price: 5500,
    current_value: 7200,
    image: '⚾',
  },
  {
    id: '4',
    name: 'Blue-Eyes White Dragon',
    set_name: 'LOB-001',
    card_number: 'LOB-001',
    year: 2002,
    category: 'yugioh',
    rarity: 'rare',
    grading_company: 'PSA',
    grade: 10,
    purchase_price: 2800,
    current_value: 4500,
    image: '🐉',
  },
  {
    id: '5',
    name: 'LeBron James RC',
    set_name: '2003 Topps Chrome',
    card_number: '#111',
    year: 2003,
    category: 'sports',
    rarity: 'epic',
    grading_company: 'PSA',
    grade: 10,
    purchase_price: 2200,
    current_value: 3800,
    image: '🏀',
  },
  {
    id: '6',
    name: 'Pikachu VMAX',
    set_name: 'Vivid Voltage',
    card_number: '188/185',
    year: 2020,
    category: 'pokemon',
    rarity: 'rare',
    grading_company: null,
    grade: null,
    purchase_price: 150,
    current_value: 280,
    image: '⚡',
  },
]

const CATEGORIES = [
  { id: 'all', name: 'All Cards', icon: '🎴' },
  { id: 'pokemon', name: 'Pokémon', icon: '⚡' },
  { id: 'mtg', name: 'Magic', icon: '✨' },
  { id: 'sports', name: 'Sports', icon: '🏆' },
  { id: 'yugioh', name: 'Yu-Gi-Oh!', icon: '🐉' },
]

export default function CollectionPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('value')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredCards = SAMPLE_CARDS
    .filter(card => 
      (selectedCategory === 'all' || card.category === selectedCategory) &&
      (card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       card.set_name.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      const multiplier = sortOrder === 'desc' ? -1 : 1
      if (sortBy === 'value') return (a.current_value - b.current_value) * multiplier
      if (sortBy === 'name') return a.name.localeCompare(b.name) * multiplier
      if (sortBy === 'grade') return ((a.grade || 0) - (b.grade || 0)) * multiplier
      return 0
    })

  const totalValue = SAMPLE_CARDS.reduce((sum, card) => sum + card.current_value, 0)
  const totalInvested = SAMPLE_CARDS.reduce((sum, card) => sum + card.purchase_price, 0)
  const totalProfit = totalValue - totalInvested
  const roi = ((totalProfit / totalInvested) * 100).toFixed(1)

  const getRarityClass = (rarity: string) => {
    const classes: Record<string, string> = {
      common: 'border-gray-500/30',
      uncommon: 'border-green-500/30',
      rare: 'border-blue-500/30',
      epic: 'border-purple-500/30',
      legendary: 'border-yellow-500/30 shadow-lg shadow-yellow-500/10',
      mythic: 'border-red-500/30 shadow-lg shadow-red-500/10',
    }
    return classes[rarity] || ''
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold">My Collection</h1>
            <p className="text-muted-foreground">{SAMPLE_CARDS.length} cards • ${totalValue.toLocaleString()} total value</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Card
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        {[
          { label: 'Total Value', value: `$${totalValue.toLocaleString()}`, icon: DollarSign, color: 'from-green-500 to-emerald-500' },
          { label: 'Total Invested', value: `$${totalInvested.toLocaleString()}`, icon: Tag, color: 'from-blue-500 to-cyan-500' },
          { label: 'Total Profit', value: `$${totalProfit.toLocaleString()}`, icon: TrendingUp, color: 'from-purple-500 to-pink-500' },
          { label: 'ROI', value: `${roi}%`, icon: Star, color: 'from-yellow-500 to-orange-500' },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.id)}
              className="gap-1"
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.name}</span>
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-muted' : ''}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-muted' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          >
            {sortOrder === 'desc' ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Cards Grid/List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredCards.map((card, index) => {
              const profit = card.current_value - card.purchase_price
              const cardRoi = ((profit / card.purchase_price) * 100).toFixed(1)
              
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`overflow-hidden hover:scale-[1.02] transition-all cursor-pointer ${getRarityClass(card.rarity)}`}>
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-6xl relative">
                      {card.image}
                      {card.grading_company && (
                        <div className="absolute top-2 right-2">
                          <Badge variant={card.grading_company === 'PSA' ? 'psa' : 'bgs'}>
                            {card.grading_company} {card.grade}
                          </Badge>
                        </div>
                      )}
                      <Badge variant={card.category as any} className="absolute top-2 left-2">
                        {card.category}
                      </Badge>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold truncate">{card.name}</h3>
                      <p className="text-sm text-muted-foreground">{card.set_name}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-lg font-bold">${card.current_value.toLocaleString()}</span>
                        <span className={`text-sm flex items-center gap-1 ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profit >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {cardRoi}%
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            {filteredCards.map((card, index) => {
              const profit = card.current_value - card.purchase_price
              const cardRoi = ((profit / card.purchase_price) * 100).toFixed(1)
              
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className={`hover:bg-muted/50 transition-colors cursor-pointer ${getRarityClass(card.rarity)}`}>
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="text-3xl">{card.image}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{card.name}</h3>
                          <Badge variant={card.category as any} className="text-xs">{card.category}</Badge>
                          {card.grading_company && (
                            <Badge variant={card.grading_company === 'PSA' ? 'psa' : 'bgs'} className="text-xs">
                              {card.grading_company} {card.grade}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{card.set_name} • {card.year}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${card.current_value.toLocaleString()}</p>
                        <p className={`text-sm ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profit >= 0 ? '+' : ''}{cardRoi}%
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
