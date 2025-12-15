'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowLeft, Loader2, Star, Upload, CheckCircle2 } from 'lucide-react';

interface Card {
  id: string;
  name: string;
  category: string;
  set_name: string;
  card_number: string;
  rarity: string;
  image_url: string;
  market_price: number | null;
  source: string;
  team?: string;
  sport?: string;
}

export default function AddCardPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [condition, setCondition] = useState('near_mint');
  const [isGraded, setIsGraded] = useState(false);
  const [grade, setGrade] = useState('');
  const [gradingCompany, setGradingCompany] = useState('PSA');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Direct search function - called on button click or enter
  const doSearch = async () => {
    if (query.length < 2) {
      setError('Please enter at least 2 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    setResults([]);
    
    try {
      const response = await fetch(`/api/cards/search?q=${encodeURIComponent(query)}&limit=30`);
      const data = await response.json();
      
      if (data.success && data.results?.length > 0) {
        setResults(data.results);
      } else {
        setError(`No results found for "${query}"`);
      }
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Save card to collection
  const saveCard = async () => {
    if (!selectedCard) return;
    setSaving(true);
    
    try {
      const response = await fetch('/api/collection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          card_id: selectedCard.id,
          card_name: selectedCard.name,
          category: selectedCard.category,
          set_name: selectedCard.set_name,
          card_number: selectedCard.card_number,
          rarity: selectedCard.rarity,
          image_url: selectedCard.image_url,
          condition,
          is_graded: isGraded,
          grade: isGraded ? grade : null,
          grading_company: isGraded ? gradingCompany : null,
          purchase_price: purchasePrice ? parseFloat(purchasePrice) : null,
          notes,
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => {
          setSelectedCard(null);
          setQuery('');
          setResults([]);
          setSaved(false);
        }, 2000);
      } else {
        alert(data.error || 'Failed to save');
      }
    } catch (err) {
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getCategoryColor = (cat: string) => {
    if (cat.includes('pokemon')) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    if (cat.includes('mtg')) return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    if (cat.includes('yugioh')) return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    if (cat.includes('lorcana')) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (cat.includes('sports')) return 'bg-green-500/20 text-green-300 border-green-500/30';
    return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  };

  // Show card detail/save form
  if (selectedCard) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-4">
        <button onClick={() => setSelectedCard(null)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {saved ? (
          <div className="text-center py-20">
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Card Added!</h2>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6">
            <div>
              <div className="aspect-[3/4] bg-black/30 rounded-xl overflow-hidden">
                <img src={selectedCard.image_url || ''} alt={selectedCard.name} className="w-full h-full object-contain" 
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">{selectedCard.name}</h2>
              <p className="text-gray-400">{selectedCard.team || selectedCard.set_name}</p>
              <span className={`inline-block px-3 py-1 rounded-full border text-sm ${getCategoryColor(selectedCard.category)}`}>
                {selectedCard.category.replace('sports_', '')}
              </span>

              <div>
                <label className="block text-sm mb-1">Condition</label>
                <select value={condition} onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg">
                  <option value="mint">Mint</option>
                  <option value="near_mint">Near Mint</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label>Graded?</label>
                <button onClick={() => setIsGraded(!isGraded)}
                  className={`w-12 h-6 rounded-full ${isGraded ? 'bg-blue-600' : 'bg-gray-600'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${isGraded ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>

              {isGraded && (
                <div className="grid grid-cols-2 gap-3">
                  <select value={gradingCompany} onChange={(e) => setGradingCompany(e.target.value)}
                    className="p-3 bg-white/5 border border-white/10 rounded-lg">
                    <option>PSA</option><option>BGS</option><option>CGC</option><option>SGC</option>
                  </select>
                  <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)}
                    placeholder="Grade (e.g. 10)" className="p-3 bg-white/5 border border-white/10 rounded-lg" />
                </div>
              )}

              <div>
                <label className="block text-sm mb-1">Purchase Price</label>
                <input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder="$0.00" className="w-full p-3 bg-white/5 border border-white/10 rounded-lg" />
              </div>

              <div>
                <label className="block text-sm mb-1">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes..." className="w-full p-3 bg-white/5 border border-white/10 rounded-lg h-20" />
              </div>

              <button onClick={saveCard} disabled={saving}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold text-lg flex items-center justify-center gap-2">
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
                {saving ? 'Saving...' : 'Add to Collection'}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main search view
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto p-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Add Card</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        {/* Search Box */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && doSearch()}
              placeholder="Pete Rose, Johnny Bench, Charizard..."
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={doSearch}
            disabled={loading}
            className="px-6 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
            {error}
          </div>
        )}

        {/* Results */}
        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {results.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-blue-500/50 hover:bg-white/10 transition-all text-left"
              >
                <div className="aspect-[3/4] bg-black/50 flex items-center justify-center">
                  {card.image_url ? (
                    <img src={card.image_url} alt={card.name} className="w-full h-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🎴</text></svg>'; }} />
                  ) : (
                    <span className="text-5xl">🎴</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate">{card.name}</h3>
                  <p className="text-xs text-gray-400 truncate">{card.team || card.set_name}</p>
                  <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full border ${getCategoryColor(card.category)}`}>
                    {card.category.replace('sports_', '')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : !loading && !error && (
          <div className="text-center py-20 text-gray-400">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl mb-2">Search 156,000+ Cards</p>
            <p className="text-sm">Pokemon • Magic • Yu-Gi-Oh • Lorcana • Sports</p>
            <p className="text-xs mt-4">Try: Pete Rose, Johnny Bench, Charizard, Black Lotus</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" />
            <p>Searching...</p>
          </div>
        )}
      </main>
    </div>
  );
}
