'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Image as ImageIcon,
  DollarSign,
  Calendar,
  Tag,
  Star,
} from 'lucide-react'

const CARD_CATEGORIES = [
  { id: 'sports', name: 'Sports Cards', emoji: '⚾' },
  { id: 'pokemon', name: 'Pokémon', emoji: '⚡' },
  { id: 'mtg', name: 'Magic: The Gathering', emoji: '⚔️' },
  { id: 'yugioh', name: 'Yu-Gi-Oh!', emoji: '🎴' },
  { id: 'entertainment', name: 'Entertainment', emoji: '🎬' },
  { id: 'gaming', name: 'Gaming', emoji: '🎮' },
  { id: 'other', name: 'Other', emoji: '📦' },
]

const RARITIES = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary']
const CONDITIONS = ['Mint', 'Near Mint', 'Excellent', 'Good', 'Fair', 'Poor']

export default function AddCardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    set_name: '',
    card_number: '',
    year: '',
    rarity: '',
    condition: '',
    graded: false,
    grading_company: '',
    grade: '',
    purchase_price: '',
    current_value: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    router.push('/collection?added=true')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-black py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link 
          href="/collection"
          className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collection
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Add New Card</h1>
        <p className="text-gray-400 mb-8">Enter the details of your card</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-900/30">
            <label className="block text-sm font-medium text-gray-300 mb-3">Category *</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {CARD_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.id })}
                  className={`p-3 rounded-lg border text-center transition ${
                    formData.category === cat.id
                      ? 'border-purple-500 bg-purple-900/30 text-white'
                      : 'border-gray-700 hover:border-gray-600 text-gray-400'
                  }`}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <div className="text-xs mt-1">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Basic Info */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-900/30 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Card Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Charizard Holo"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Set Name</label>
                <input
                  type="text"
                  value={formData.set_name}
                  onChange={(e) => setFormData({ ...formData, set_name: e.target.value })}
                  placeholder="e.g., Base Set"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                <input
                  type="text"
                  value={formData.card_number}
                  onChange={(e) => setFormData({ ...formData, card_number: e.target.value })}
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
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="e.g., 1999"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rarity</label>
                <select
                  value={formData.rarity}
                  onChange={(e) => setFormData({ ...formData, rarity: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select rarity</option>
                  {RARITIES.map((r) => (
                    <option key={r} value={r.toLowerCase()}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Condition & Grading */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-900/30 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
              >
                <option value="">Select condition</option>
                {CONDITIONS.map((c) => (
                  <option key={c} value={c.toLowerCase()}>{c}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, graded: !formData.graded })}
                className={`w-12 h-6 rounded-full transition ${formData.graded ? 'bg-purple-600' : 'bg-gray-700'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition transform ${formData.graded ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-gray-300">Professionally graded</span>
            </div>

            {formData.graded && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Grading Company</label>
                  <select
                    value={formData.grading_company}
                    onChange={(e) => setFormData({ ...formData, grading_company: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="">Select company</option>
                    <option value="PSA">PSA</option>
                    <option value="BGS">BGS</option>
                    <option value="CGC">CGC</option>
                    <option value="SGC">SGC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Grade</label>
                  <input
                    type="text"
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    placeholder="e.g., 10, 9.5"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Value */}
          <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-900/30">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Purchase Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.purchase_price}
                    onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Value</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="number"
                    value={formData.current_value}
                    onChange={(e) => setFormData({ ...formData, current_value: e.target.value })}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !formData.name || !formData.category}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold rounded-xl transition"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Add to Collection'}
          </button>
        </form>
      </div>
    </div>
  )
}
