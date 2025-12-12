'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useAuth } from '@/components/AuthProvider'
import {
  ArrowLeft,
  Save,
  DollarSign,
  Loader2,
  AlertCircle,
  Check,
  Search,
  X,
  ChevronDown,
  ImageIcon,
  Sparkles,
} from 'lucide-react'

// Types for the card catalog
interface CatalogCard {
  id: string
  name: string
  slug: string
  set_code: string
  card_number: string
  category: string
  rarity: string
  year_released: number
  description: string
  image_url: string
  price_raw: number
  price_psa_10: number
  metadata: {
    hp?: string
    type?: string
    attacks?: Array<{ name: string; damage: string }>
    [key: string]: any
  }
  card_sets?: {
    name: string
    code: string
  }
}

interface CardSet {
  id: string
  name: string
  code: string
  category: string
  total_cards: number
  release_year: number
}

const CATEGORIES = [
  { id: 'all', name: 'All Categories', emoji: '📚' },
  { id: 'pokemon', name: 'Pokémon', emoji: '⚡' },
  { id: 'sports_baseball', name: 'Baseball', emoji: '⚾' },
  { id: 'sports_basketball', name: 'Basketball', emoji: '🏀' },
  { id: 'sports_football', name: 'Football', emoji: '🏈' },
  { id: 'mtg', name: 'Magic: The Gathering', emoji: '⚔️' },
  { id: 'yugioh', name: 'Yu-Gi-Oh!', emoji: '🎴' },
  { id: 'disney', name: 'Disney', emoji: '🏰' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
]

const CONDITIONS = [
  { id: 'mint', name: 'Mint', description: 'Perfect condition' },
  { id: 'near_mint', name: 'Near Mint', description: 'Almost perfect' },
  { id: 'excellent', name: 'Excellent', description: 'Minor wear' },
  { id: 'good', name: 'Good', description: 'Visible wear' },
  { id: 'fair', name: 'Fair', description: 'Significant wear' },
  { id: 'poor', name: 'Poor', description: 'Heavy wear/damage' },
]

const GRADING_COMPANIES = ['PSA', 'BGS', 'CGC', 'SGC']

export default function AddCardPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { user, loading: authLoading } = useAuth()
  
  // Search state
  const [searchMode, setSearchMode] = useState<'search' | 'manual'>('search')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchCategory, setSearchCategory] = useState('all')
  const [searchResults, setSearchResults] = useState<CatalogCard[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedCard, setSelectedCard] = useState<CatalogCard | null>(null)
  const [recentSets, setRecentSets] = useState<CardSet[]>([])
  
  // Form state
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  // Card details (user fills in)
  const [condition, setCondition] = useState('near_mint')
  const [isGraded, setIsGraded] = useState(false)
  const [gradingCompany, setGradingCompany] = useState('PSA')
  const [grade, setGrade] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [currentValue, setCurrentValue] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [notes, setNotes] = useState('')
  
  // Manual entry fields (only used in manual mode)
  const [manualName, setManualName] = useState('')
  const [manualCategory, setManualCategory] = useState('pokemon')
  const [manualSetName, setManualSetName] = useState('')
  const [manualCardNumber, setManualCardNumber] = useState('')
  const [manualYear, setManualYear] = useState('')
  const [manualRarity, setManualRarity] = useState('common')
  const [manualImageUrl, setManualImageUrl] = useState('')

  // Load recent/popular sets on mount
  useEffect(() => {
    loadRecentSets()
  }, [])

  const loadRecentSets = async () => {
    const { data } = await supabase
      .from('card_sets')
      .select('*')
      .eq('is_featured', true)
      .order('release_year', { ascending: false })
      .limit(8)
    
    if (data) setRecentSets(data)
  }

  // Debounced search
  const searchCards = useCallback(async (query: string, category: string) => {
    if (!query || query.length < 2) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      let queryBuilder = supabase
        .from('card_catalog')
        .select(`
          *,
          card_sets (name, code)
        `)
        .ilike('name', `%${query}%`)
        .limit(20)

      if (category !== 'all') {
        queryBuilder = queryBuilder.eq('category', category)
      }

      const { data, error } = await queryBuilder

      if (error) throw error
      setSearchResults(data || [])
    } catch (err) {
      console.error('Search error:', err)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }, [supabase])

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      searchCards(searchQuery, searchCategory)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, searchCategory, searchCards])

  // Select card from catalog
  const handleSelectCard = (card: CatalogCard) => {
    setSelectedCard(card)
    setSearchQuery('')
    setSearchResults([])
    
    // Pre-fill current value from catalog
    if (card.price_raw) {
      setCurrentValue(card.price_raw.toString())
    }
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    // Validation
    if (searchMode === 'search' && !selectedCard) {
      setError('Please select a card from the search results')
      return
    }
    if (searchMode === 'manual' && !manualName) {
      setError('Please enter a card name')
      return
    }
    
    setError('')
    setSaving(true)

    try {
      // Ensure profile exists
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!existingProfile) {
        await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name,
          avatar_url: user.user_metadata?.avatar_url,
        })
      }

      // Build card data
      const cardData = searchMode === 'search' && selectedCard ? {
        user_id: user.id,
        catalog_card_id: selectedCard.id, // Link to catalog
        name: selectedCard.name,
        category: selectedCard.category,
        set_name: selectedCard.card_sets?.name || selectedCard.set_code,
        card_number: selectedCard.card_number,
        year: selectedCard.year_released,
        rarity: selectedCard.rarity,
        condition,
        is_graded: isGraded,
        grading_company: isGraded ? gradingCompany : null,
        grade: isGraded && grade ? parseFloat(grade) : null,
        purchase_price: purchasePrice ? parseFloat(purchasePrice) : null,
        current_value: currentValue ? parseFloat(currentValue) : null,
        quantity: parseInt(quantity) || 1,
        notes: notes || null,
        image_url: selectedCard.image_url || null,
      } : {
        user_id: user.id,
        name: manualName,
        category: manualCategory,
        set_name: manualSetName || null,
        card_number: manualCardNumber || null,
        year: manualYear ? parseInt(manualYear) : null,
        rarity: manualRarity,
        condition,
        is_graded: isGraded,
        grading_company: isGraded ? gradingCompany : null,
        grade: isGraded && grade ? parseFloat(grade) : null,
        purchase_price: purchasePrice ? parseFloat(purchasePrice) : null,
        current_value: currentValue ? parseFloat(currentValue) : null,
        quantity: parseInt(quantity) || 1,
        notes: notes || null,
        image_url: manualImageUrl || null,
      }

      const { error: insertError } = await supabase.from('cards').insert(cardData)

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => {
        router.push('/collection')
      }, 1500)
    } catch (err: any) {
      console.error('Error adding card:', err)
      setError(err.message || 'Failed to add card')
    } finally {
      setSaving(false)
    }
  }

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  // Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
        <div className="max-w-2xl mx-auto px-4 text-center pt-20">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-4">Sign In Required</h1>
          <p className="text-gray-400 mb-6">You need to be signed in to add cards to your collection.</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/auth/login?redirect=/collection/add"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              href="/collection"
              className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition"
            >
              Back to Collection
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Card Added!</h2>
          <p className="text-gray-400">Redirecting to your collection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/collection"
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Add Card</h1>
            <p className="text-gray-400">Search our database or add manually</p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSearchMode('search')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              searchMode === 'search'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Search className="w-5 h-5" />
            Search Database
          </button>
          <button
            onClick={() => setSearchMode('manual')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
              searchMode === 'manual'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            Manual Entry
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Search Mode */}
          {searchMode === 'search' && (
            <>
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for cards by name (e.g., Charizard, Michael Jordan)..."
                  className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 text-lg"
                />
                {searching && (
                  <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 animate-spin" />
                )}
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSearchCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                      searchCategory === cat.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
                  <div className="p-3 border-b border-gray-700">
                    <p className="text-sm text-gray-400">
                      Found {searchResults.length} cards
                    </p>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-gray-700">
                    {searchResults.map((card) => (
                      <button
                        key={card.id}
                        type="button"
                        onClick={() => handleSelectCard(card)}
                        className="w-full p-3 flex items-center gap-4 hover:bg-gray-700/50 transition text-left"
                      >
                        <div className="w-12 h-16 bg-gray-700 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                          {card.image_url ? (
                            <img
                              src={card.image_url}
                              alt={card.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{card.name}</p>
                          <p className="text-sm text-gray-400">
                            {card.card_sets?.name || card.set_code} #{card.card_number}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              card.rarity === 'holo_rare' || card.rarity === 'ultra_rare'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-gray-700 text-gray-400'
                            }`}>
                              {card.rarity.replace('_', ' ')}
                            </span>
                            {card.price_raw && (
                              <span className="text-xs text-green-400">
                                ${card.price_raw.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronDown className="w-5 h-5 text-gray-500 -rotate-90" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Card Display */}
              {selectedCard && (
                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30 p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-32 bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {selectedCard.image_url ? (
                        <img
                          src={selectedCard.image_url}
                          alt={selectedCard.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white">{selectedCard.name}</h3>
                          <p className="text-gray-400">
                            {selectedCard.card_sets?.name || selectedCard.set_code} #{selectedCard.card_number}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedCard(null)}
                          className="p-1 hover:bg-gray-700 rounded"
                        >
                          <X className="w-5 h-5 text-gray-400" />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                          {selectedCard.category}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                          {selectedCard.rarity.replace('_', ' ')}
                        </span>
                        {selectedCard.year_released && (
                          <span className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300">
                            {selectedCard.year_released}
                          </span>
                        )}
                      </div>
                      {selectedCard.price_raw && (
                        <div className="mt-3 flex items-center gap-4 text-sm">
                          <span className="text-gray-400">Market Value:</span>
                          <span className="text-green-400 font-medium">
                            ${selectedCard.price_raw.toFixed(2)} raw
                          </span>
                          {selectedCard.price_psa_10 && (
                            <span className="text-purple-400 font-medium">
                              ${selectedCard.price_psa_10.toLocaleString()} PSA 10
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Popular Sets (when no search) */}
              {!searchQuery && !selectedCard && recentSets.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Popular Sets</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {recentSets.map((set) => (
                      <button
                        key={set.id}
                        type="button"
                        onClick={() => setSearchQuery(set.name)}
                        className="p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-left transition"
                      >
                        <p className="font-medium text-white text-sm truncate">{set.name}</p>
                        <p className="text-xs text-gray-500">{set.total_cards} cards • {set.release_year}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Manual Entry Mode */}
          {searchMode === 'manual' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Card Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g., Charizard VMAX"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  required={searchMode === 'manual'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setManualCategory(cat.id)}
                      className={`p-3 rounded-lg border text-sm font-medium transition ${
                        manualCategory === cat.id
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-lg mr-1">{cat.emoji}</span>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Set Name</label>
                  <input
                    type="text"
                    value={manualSetName}
                    onChange={(e) => setManualSetName(e.target.value)}
                    placeholder="e.g., Base Set"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                  <input
                    type="text"
                    value={manualCardNumber}
                    onChange={(e) => setManualCardNumber(e.target.value)}
                    placeholder="e.g., 4/102"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
                  <input
                    type="number"
                    value={manualYear}
                    onChange={(e) => setManualYear(e.target.value)}
                    placeholder="e.g., 1999"
                    min="1900"
                    max="2030"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rarity</label>
                  <select
                    value={manualRarity}
                    onChange={(e) => setManualRarity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="holo_rare">Holo Rare</option>
                    <option value="ultra_rare">Ultra Rare</option>
                    <option value="secret_rare">Secret Rare</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Image URL (optional)</label>
                <input
                  type="url"
                  value={manualImageUrl}
                  onChange={(e) => setManualImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </>
          )}

          {/* Divider */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Your Card Details</h3>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Condition</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {CONDITIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCondition(c.id)}
                  className={`p-3 rounded-lg border text-center transition ${
                    condition === c.id
                      ? 'bg-purple-600 border-purple-500 text-white'
                      : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <span className="font-medium text-sm">{c.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Grading */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isGraded}
                onChange={(e) => setIsGraded(e.target.checked)}
                className="w-5 h-5 rounded bg-gray-700 border-gray-600 text-purple-600 focus:ring-purple-500"
              />
              <span className="text-white font-medium">This card is professionally graded</span>
            </label>

            {isGraded && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Grading Company</label>
                  <select
                    value={gradingCompany}
                    onChange={(e) => setGradingCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {GRADING_COMPANIES.map((company) => (
                      <option key={company} value={company}>{company}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Grade</label>
                  <input
                    type="number"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g., 9.5"
                    step="0.5"
                    min="1"
                    max="10"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Purchase Price</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="number"
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Value</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="number"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any additional notes about this card..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4 pt-4">
            <Link
              href="/collection"
              className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || (searchMode === 'search' && !selectedCard) || (searchMode === 'manual' && !manualName)}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium rounded-lg transition disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Add to Collection
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
